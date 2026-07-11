import { EPS, EPSError, generateTransactionId, type InitializePaymentResponse, type VerifyPaymentResponse } from 'eps-gateway-nodejs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { upsertPaidCheckoutCustomerAccount } from '@/app/api/customer-accounts/v1/controller';
import Orders from '@/app/api/orders/v1/model';
import { withDB } from '@/app/api/utils/db';
import connectDB from '@/app/api/utils/mongoose';
import { auth } from '@/lib/auth';

const CUSTOMER_ACCOUNT_COOKIE = 'customer_account_session';
const CUSTOMER_ACCOUNT_AUTO_PASSWORD_COOKIE = 'customer_account_auto_password';
const CUSTOMER_ACCOUNT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

type OrderDocument = {
  _id?: unknown;
  orderNo?: string;
  tranId?: string;
  valId?: string;
  cardType?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  totalAmount?: number;
  subtotal?: number;
  shippingCharge?: number;
  discount?: number;
  items?: Array<{
    productId?: string;
    title?: string;
    quantity?: number;
    price?: number;
  }>;
  paymentStatus?: string;
  paymentGatewayData?: Record<string, unknown>;
};

type InitiatePayload = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  subtotal?: number;
  shippingCharge?: number;
  discount?: number;
  totalAmount?: number;
  items?: Array<{
    productId?: string;
    title?: string;
    quantity?: number;
    price?: number;
  }>;
};

const requiredEnv = ['EPS_USERNAME', 'EPS_PASSWORD', 'EPS_HASH_KEY', 'EPS_MERCHANT_ID', 'EPS_STORE_ID'] as const;

const getBaseUrl = (req: Request) => {
  const configured = process.env.NEXT_PUBLIC_BASE_URL || process.env.APP_URL || process.env.NEXTAUTH_URL;
  if (configured) return configured.replace(/\/$/, '');

  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
};

const getCustomerAccountSecret = () => process.env.CUSTOMER_ACCOUNT_SECRET || process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'customer-account-local-secret';

const getAccountSessionPayload = (account: unknown) => {
  const value = account as { _id?: { toString?: () => string } | string; email?: string; mobileNumber?: string };
  return {
    sub: typeof value?._id === 'string' ? value._id : value?._id?.toString?.(),
    email: value?.email,
    mobileNumber: value?.mobileNumber,
  };
};

const setCustomerCookies = (response: NextResponse, account: unknown, customerLogin: { password?: string } | null) => {
  const sessionPayload = getAccountSessionPayload(account);
  if (sessionPayload.email) {
    const token = jwt.sign(sessionPayload, getCustomerAccountSecret(), { expiresIn: '30d' });
    response.cookies.set(CUSTOMER_ACCOUNT_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: CUSTOMER_ACCOUNT_COOKIE_MAX_AGE,
    });
  }

  if (customerLogin?.password) {
    response.cookies.set(CUSTOMER_ACCOUNT_AUTO_PASSWORD_COOKIE, customerLogin.password, {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: CUSTOMER_ACCOUNT_COOKIE_MAX_AGE,
    });
  }
};

const ensureBetterAuthUser = async (payload: { name?: string; email?: string; password?: string }) => {
  if (!payload.email || !payload.password) return;
  try {
    await auth.api.signUpEmail({
      body: {
        name: payload.name || payload.email,
        email: payload.email,
        password: payload.password,
      },
    });
  } catch {
    // Existing Better Auth users should still be able to complete checkout and sign in.
  }
};

const getEpsClient = () => {
  const missing = requiredEnv.filter(key => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing EPS environment variables: ${missing.join(', ')}`);
  }

  return new EPS({
    username: process.env.EPS_USERNAME || '',
    password: process.env.EPS_PASSWORD || '',
    hashKey: process.env.EPS_HASH_KEY || '',
    merchantId: process.env.EPS_MERCHANT_ID || '',
    storeId: process.env.EPS_STORE_ID || '',
    sandbox: process.env.EPS_SANDBOX !== 'false',
    timeout: 30000,
  });
};

const normalizeStatus = (status?: unknown) =>
  String(status || '')
    .trim()
    .toLowerCase();

const getStatusParam = (req: Request, keys: string[]) => {
  const url = new URL(req.url);
  for (const key of keys) {
    const value = url.searchParams.get(key);
    if (value) return value;
  }
  return '';
};

const getCallbackTransactionId = async (req: Request) => {
  const fromQuery = getStatusParam(req, ['merchantTransactionId', 'MerchantTransactionId', 'tran_id', 'tranId']);
  if (fromQuery) return fromQuery;

  try {
    const form = await req.clone().formData();
    for (const key of ['merchantTransactionId', 'MerchantTransactionId', 'tran_id', 'tranId']) {
      const value = form.get(key);
      if (value) return String(value);
    }
  } catch {
    // EPS may call back as GET or with an empty body.
  }

  return '';
};

const roundMoney = (value: unknown) => Math.round(Number(value || 0) * 100) / 100;

const serializeOrder = (order: OrderDocument | null) => {
  if (!order) return null;
  const source = typeof (order as { toObject?: () => OrderDocument }).toObject === 'function' ? (order as { toObject: () => OrderDocument }).toObject() : order;
  return JSON.parse(JSON.stringify(source));
};

const getProductName = (items: InitiatePayload['items']) => {
  const names = (items || []).map(item => String(item.title || '').trim()).filter(Boolean);
  if (!names.length) return 'Product checkout';
  if (names.length === 1) return names[0];
  return `${names[0]} and ${names.length - 1} more`;
};

export const createEpsPayment = async (req: Request, payload: InitiatePayload) =>
  withDB(async () => {
    const totalAmount = roundMoney(payload.totalAmount);
    const items = Array.isArray(payload.items) ? payload.items : [];

    if (!payload.customerName?.trim()) return { data: null, message: 'Customer name is required', status: 400 };
    if (!payload.customerEmail?.trim()) return { data: null, message: 'Customer email is required', status: 400 };
    if (!payload.customerPhone?.trim()) return { data: null, message: 'Customer phone is required', status: 400 };
    if (!items.length) return { data: null, message: 'Cart item is required', status: 400 };
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) return { data: null, message: 'Valid payment amount is required', status: 400 };

    const merchantTransactionId = generateTransactionId();
    const baseUrl = getBaseUrl(req);
    const productName = getProductName(items);
    const successUrl = new URL('/api/payment/eps/success', baseUrl);
    const failUrl = new URL('/api/payment/eps/fail', baseUrl);
    const cancelUrl = new URL('/api/payment/eps/cancel', baseUrl);
    successUrl.searchParams.set('merchantTransactionId', merchantTransactionId);
    failUrl.searchParams.set('merchantTransactionId', merchantTransactionId);
    cancelUrl.searchParams.set('merchantTransactionId', merchantTransactionId);

    const order = (await Orders.create({
      customerName: payload.customerName.trim(),
      customerEmail: payload.customerEmail.trim().toLowerCase(),
      customerPhone: payload.customerPhone.trim(),
      shippingAddress: payload.shippingAddress || '',
      items,
      subtotal: roundMoney(payload.subtotal),
      shippingCharge: roundMoney(payload.shippingCharge),
      discount: roundMoney(payload.discount),
      totalAmount,
      paymentMethod: 'eps',
      paymentStatus: 'pending',
      deliveryStatus: 'pending',
      orderStatus: 'pending',
      note: 'Created from asset cart EPS checkout.',
      tranId: merchantTransactionId,
      currency: 'BDT',
      paymentGatewayData: {
        gateway: 'eps',
        merchantTransactionId,
        initiatedAt: new Date().toISOString(),
      },
    })) as OrderDocument;

    let payment: InitializePaymentResponse;
    try {
      payment = await getEpsClient().initializePayment({
        customerOrderId: String(order.orderNo || merchantTransactionId),
        merchantTransactionId,
        totalAmount,
        successUrl: successUrl.toString(),
        failUrl: failUrl.toString(),
        cancelUrl: cancelUrl.toString(),
        customerName: payload.customerName.trim(),
        customerEmail: payload.customerEmail.trim().toLowerCase(),
        customerPhone: payload.customerPhone.trim(),
        customerAddress: payload.shippingAddress || 'Dhaka',
        customerCity: 'Dhaka',
        customerState: 'Dhaka',
        customerPostcode: '1200',
        productName,
        productCategory: 'digital-product',
        productProfile: 'general',
        noOfItem: items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0),
        productList: items.map(item => ({
          ProductName: item.title || 'Product',
          NoOfItem: Number(item.quantity) || 1,
          ProductPrice: Number(item.price) || 0,
          ProductProfile: 'general',
          ProductCategory: 'digital-product',
        })),
      });
    } catch (error) {
      await Orders.findOneAndUpdate(
        { tranId: merchantTransactionId },
        {
          paymentStatus: 'failed',
          orderStatus: 'cancelled',
          paymentGatewayData: {
            gateway: 'eps',
            merchantTransactionId,
            initiateError: error instanceof Error ? error.message : 'EPS payment initialization failed',
          },
        },
      );
      throw error;
    }

    await Orders.findOneAndUpdate(
      { tranId: merchantTransactionId },
      {
        valId: payment.TransactionId,
        paymentGatewayData: {
          gateway: 'eps',
          merchantTransactionId,
          epsTransactionId: payment.TransactionId,
          initiateResponse: payment,
          initiatedAt: new Date().toISOString(),
        },
      },
    );

    return {
      data: {
        order: serializeOrder(order),
        merchantTransactionId,
        epsTransactionId: payment.TransactionId,
        redirectUrl: payment.RedirectURL,
      },
      message: 'EPS payment initialized',
      status: 200,
    };
  });

type FinalizeEpsPaymentResult = {
  order: OrderDocument | null;
  merchantTransactionId: string;
  paymentStatus: 'paid' | 'failed' | 'cancelled';
  customerLogin: { email: string; password?: string } | null;
  account: unknown;
};

export const finalizeEpsPayment = async (req: Request, fallbackStatus: 'failed' | 'cancelled' = 'failed'): Promise<FinalizeEpsPaymentResult> => {
  await connectDB();
  const merchantTransactionId = await getCallbackTransactionId(req);
  if (!merchantTransactionId) return { order: null, merchantTransactionId: '', paymentStatus: fallbackStatus, customerLogin: null, account: null };

    const existingOrder = (await Orders.findOne({ tranId: merchantTransactionId })) as OrderDocument | null;
    if (!existingOrder) return { order: null, merchantTransactionId, paymentStatus: fallbackStatus, customerLogin: null, account: null };

    if (existingOrder.paymentStatus === 'paid') {
      return { order: existingOrder, merchantTransactionId, paymentStatus: 'paid', customerLogin: null, account: null };
    }

    let verification: VerifyPaymentResponse | null = null;
    let nextPaymentStatus: 'paid' | 'failed' | 'cancelled' = fallbackStatus;
    let nextOrderStatus: 'completed' | 'cancelled' | 'pending' = fallbackStatus === 'cancelled' ? 'cancelled' : 'pending';
    let nextDeliveryStatus: 'delivered' | 'pending' = 'pending';

    if (fallbackStatus !== 'cancelled') {
      try {
        verification = await getEpsClient().verifyPayment({ merchantTransactionId });
        const isSuccess = normalizeStatus(verification.Status) === 'success';
        const gatewayAmount = roundMoney(verification.TotalAmount);
        const expectedAmount = roundMoney(existingOrder.totalAmount);
        if (isSuccess && gatewayAmount === expectedAmount) {
          nextPaymentStatus = 'paid';
          nextOrderStatus = 'completed';
          nextDeliveryStatus = 'delivered';
        } else {
          nextPaymentStatus = 'failed';
          nextOrderStatus = 'cancelled';
        }
      } catch (error) {
        verification = {
          MerchantTransactionId: merchantTransactionId,
          EpsTransactionId: '',
          Status: 'VerificationFailed',
          TotalAmount: String(existingOrder.totalAmount || 0),
          TransactionDate: '',
          TransactionType: '',
          FinancialEntity: '',
          ErrorCode: error instanceof EPSError ? error.code || 'VERIFY_ERROR' : 'VERIFY_ERROR',
          ErrorMessage: error instanceof Error ? error.message : 'EPS verification failed',
          CustomerId: '',
          CustomerName: '',
          CustomerEmail: '',
          CustomerAddress: '',
          CustomerAddress2: '',
          CustomerCity: '',
          CustomerState: '',
          CustomerPostcode: '',
          CustomerCountry: '',
          CustomerPhone: '',
          ShipmentName: '',
          ShipmentAddress: '',
          ShipmentAddress2: '',
          ShipmentCity: '',
          ShipmentState: '',
          ShipmentPostcode: '',
          ShipmentCountry: '',
          ValueA: '',
          ValueB: '',
          ValueC: '',
          ValueD: '',
          ShippingMethod: '',
          NoOfItem: '',
          ProductName: '',
          ProductProfile: '',
          ProductCategory: '',
        };
        nextPaymentStatus = 'failed';
        nextOrderStatus = 'cancelled';
      }
    }

    const updatedOrder = (await Orders.findOneAndUpdate(
      { tranId: merchantTransactionId },
      {
        paymentStatus: nextPaymentStatus,
        orderStatus: nextOrderStatus,
        deliveryStatus: nextDeliveryStatus,
        valId: verification?.EpsTransactionId || existingOrder.valId,
        cardType: verification?.FinancialEntity || existingOrder.cardType,
        paymentGatewayData: {
          ...(existingOrder.paymentGatewayData || {}),
          gateway: 'eps',
          merchantTransactionId,
          verification,
          verifiedAt: new Date().toISOString(),
        },
      },
      { new: true },
    )) as OrderDocument | null;

    let customerLogin: { email: string; password?: string } | null = null;
    let account: unknown = null;

    if (nextPaymentStatus === 'paid' && updatedOrder?.customerEmail) {
      const accountResult = await upsertPaidCheckoutCustomerAccount({
        name: updatedOrder.customerName,
        email: updatedOrder.customerEmail,
        mobileNumber: updatedOrder.customerPhone,
      });
      account = accountResult?.account || null;
      customerLogin = accountResult ? { email: accountResult.email, password: accountResult.password } : null;
      await ensureBetterAuthUser({
        name: updatedOrder.customerName,
        email: customerLogin?.email || updatedOrder.customerEmail,
        password: customerLogin?.password,
      });
    }

  return { order: updatedOrder, merchantTransactionId, paymentStatus: nextPaymentStatus, customerLogin, account };
};

export const redirectToCart = (
  req: Request,
  result: Awaited<ReturnType<typeof finalizeEpsPayment>>,
  fallbackStatus: 'failed' | 'cancelled' = 'failed',
) => {
  const baseUrl = getBaseUrl(req);
  const status = result.paymentStatus || fallbackStatus;
  const url = new URL('/cart', baseUrl);
  url.searchParams.set('eps_payment', status);
  if (result.merchantTransactionId) url.searchParams.set('tran_id', result.merchantTransactionId);

  const response = NextResponse.redirect(url, { status: 303 });
  setCustomerCookies(response, result.account, result.customerLogin);
  return response;
};

export const getEpsOrderStatus = async (req: Request) =>
  withDB(async () => {
    const tranId = getStatusParam(req, ['tran_id', 'tranId', 'merchantTransactionId']);
    if (!tranId) return { data: null, message: 'Transaction ID is required', status: 400 };

    const order = (await Orders.findOne({ tranId }).lean()) as OrderDocument | null;
    if (!order) return { data: null, message: 'Order not found', status: 404 };

    return { data: serializeOrder(order), message: 'EPS order status fetched', status: 200 };
  });
