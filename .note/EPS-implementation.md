# EPS Gateway Node.js SDK ইমপ্লিমেন্টেশন গাইড

Source README: https://github.com/EPS-PG/EPS_Nodejs/blob/main/README.md

এই গাইডটি EPS Gateway Node.js SDK ব্যবহার করে Node.js বা Express.js অ্যাপে EPS Payment Gateway যুক্ত করার জন্য তৈরি করা হয়েছে। SDK-টি একটি unofficial community SDK; EPS-এর official Node.js SDK নয়। Production-এ যাওয়ার আগে sandbox credential দিয়ে ভালোভাবে test করা জরুরি।

## 1. কী লাগবে

- Node.js project
- EPS merchant credential:
  - `username`
  - `password`
  - `hashKey`
  - `merchantId`
  - `storeId`
- Public callback URL:
  - Success URL
  - Fail URL
  - Cancel URL
- Order/payment table বা database collection

## 2. Package install

```bash
npm install eps-gateway-nodejs
```

অথবা:

```bash
yarn add eps-gateway-nodejs
```

## 3. Environment variable সেটআপ

Credential কখনো code-এর মধ্যে hardcode করবেন না। `.env` ফাইলে রাখুন:

```bash
EPS_USERNAME=merchant@example.com
EPS_PASSWORD=your_password
EPS_HASH_KEY=your_hash_key_base64
EPS_MERCHANT_ID=094980ee-xxxx-xxxx-xxxx-xxxxxxxxxxxx
EPS_STORE_ID=35b518f6-xxxx-xxxx-xxxx-xxxxxxxxxxxx
EPS_SANDBOX=true
```

Production server-এ `EPS_SANDBOX=false` দিন এবং production credential ব্যবহার করুন।

## 4. EPS client initialize

CommonJS project হলে:

```javascript
const { EPS, generateTransactionId } = require('eps-gateway-nodejs');

const eps = new EPS({
  username: process.env.EPS_USERNAME,
  password: process.env.EPS_PASSWORD,
  hashKey: process.env.EPS_HASH_KEY,
  merchantId: process.env.EPS_MERCHANT_ID,
  storeId: process.env.EPS_STORE_ID,
  sandbox: process.env.EPS_SANDBOX === 'true',
  timeout: 30000
});
```

TypeScript বা ES module project হলে:

```typescript
import { EPS, generateTransactionId, TransactionType } from 'eps-gateway-nodejs';

const eps = new EPS({
  username: process.env.EPS_USERNAME!,
  password: process.env.EPS_PASSWORD!,
  hashKey: process.env.EPS_HASH_KEY!,
  merchantId: process.env.EPS_MERCHANT_ID!,
  storeId: process.env.EPS_STORE_ID!,
  sandbox: process.env.EPS_SANDBOX === 'true'
});
```

## 5. Payment flow

EPS integration-এর মূল flow:

1. আপনার app order তৈরি করবে।
2. unique `merchantTransactionId` generate করবে।
3. EPS-এ payment initialize করবে।
4. EPS response থেকে `RedirectURL` নিয়ে user-কে payment page-এ redirect করবে।
5. EPS user-কে success, fail, বা cancel URL-এ ফিরিয়ে দেবে।
6. Success callback পেলেও সরাসরি paid করবেন না।
7. `verifyPayment()` দিয়ে EPS থেকে transaction status verify করবেন।
8. শুধু `Status === 'Success'` হলে order paid করবেন।

## 6. Express.js উদাহরণ

নিচের example একটি practical implementation structure দেখায়।

```javascript
const express = require('express');
const { EPS, generateTransactionId, EPSError } = require('eps-gateway-nodejs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const eps = new EPS({
  username: process.env.EPS_USERNAME,
  password: process.env.EPS_PASSWORD,
  hashKey: process.env.EPS_HASH_KEY,
  merchantId: process.env.EPS_MERCHANT_ID,
  storeId: process.env.EPS_STORE_ID,
  sandbox: process.env.EPS_SANDBOX === 'true'
});

app.post('/payment/initiate', async (req, res) => {
  try {
    const {
      orderId,
      amount,
      productName,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerState,
      customerPostcode
    } = req.body;

    const merchantTransactionId = generateTransactionId();
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // এখানে আগে database-এ payment/order INITIATED status সহ save করুন।
    // await Payment.create({ orderId, merchantTransactionId, amount, status: 'INITIATED' });

    const payment = await eps.initializePayment({
      customerOrderId: orderId,
      merchantTransactionId,
      totalAmount: Number(amount),
      successUrl: `${baseUrl}/payment/success`,
      failUrl: `${baseUrl}/payment/fail`,
      cancelUrl: `${baseUrl}/payment/cancel`,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerState,
      customerPostcode,
      productName
    });

    // চাইলে EPS transaction id database-এ update করুন।
    // await Payment.updateOne({ merchantTransactionId }, { epsTransactionId: payment.TransactionId });

    return res.redirect(payment.RedirectURL);
  } catch (error) {
    if (error instanceof EPSError) {
      console.error('EPS Error:', error.message, error.code, error.response);
    } else {
      console.error('Unknown payment error:', error);
    }

    return res.status(500).json({
      message: 'Payment initiate করা যায়নি। পরে আবার চেষ্টা করুন।'
    });
  }
});
```

## 7. Success callback verify করা

Success URL hit হওয়া মানেই payment successful নয়। অবশ্যই EPS থেকে verify করতে হবে।

```javascript
app.get('/payment/success', async (req, res) => {
  try {
    const { merchantTransactionId } = req.query;

    if (!merchantTransactionId) {
      return res.status(400).send('Missing transaction id');
    }

    const verification = await eps.verifyPayment({
      merchantTransactionId: String(merchantTransactionId)
    });

    if (verification.Status === 'Success') {
      // Payment confirmed. এখন database update করুন।
      // await Order.updateOne(
      //   { merchantTransactionId },
      //   {
      //     status: 'PAID',
      //     epsTransactionId: verification.EpsTransactionId,
      //     paidAmount: verification.TotalAmount,
      //     paymentMethod: verification.FinancialEntity,
      //     paidAt: new Date()
      //   }
      // );

      return res.send('Payment successful');
    }

    // Success callback এলেও verification failed/pending হলে paid করবেন না।
    // await Order.updateOne({ merchantTransactionId }, { status: verification.Status });
    return res.redirect('/payment/fail');
  } catch (error) {
    console.error('Payment verification failed:', error);
    return res.status(500).send('Payment verification failed');
  }
});
```

## 8. Fail এবং cancel callback

```javascript
app.get('/payment/fail', async (req, res) => {
  const { merchantTransactionId } = req.query;

  // await Order.updateOne({ merchantTransactionId }, { status: 'FAILED' });
  return res.send('Payment failed');
});

app.get('/payment/cancel', async (req, res) => {
  const { merchantTransactionId } = req.query;

  // await Order.updateOne({ merchantTransactionId }, { status: 'CANCELLED' });
  return res.send('Payment cancelled');
});
```

## 9. Required payment parameters

`initializePayment()` call করার সময় সাধারণত এগুলো লাগবে:

| Field | কাজ |
| --- | --- |
| `customerOrderId` | আপনার system-এর unique order ID |
| `merchantTransactionId` | unique transaction ID; minimum 10 digit |
| `totalAmount` | amount in BDT |
| `successUrl` | successful payment callback URL |
| `failUrl` | failed payment callback URL |
| `cancelUrl` | cancelled payment callback URL |
| `customerName` | customer name |
| `customerEmail` | customer email |
| `customerPhone` | Bangladesh phone format, যেমন `01712345678` |
| `customerAddress` | customer address |
| `customerCity` | city |
| `customerState` | state/division |
| `customerPostcode` | postcode |
| `productName` | product/order name |

## 10. Optional parameter ব্যবহার

Multiple product থাকলে `productList` ব্যবহার করা যায়:

```javascript
productList: [
  {
    ProductName: 'Product 1',
    NoOfItem: 2,
    ProductPrice: 500,
    ProductProfile: 'Description',
    ProductCategory: 'Category'
  }
]
```

নিজের reference value রাখতে চাইলে:

```javascript
valueA: 'customer_id_123',
valueB: 'coupon_code',
valueC: 'campaign_id',
valueD: 'internal_note'
```

## 11. Payment status verify করার আলাদা route

Admin বা frontend থেকে status check করতে চাইলে:

```javascript
app.get('/payment/status/:transactionId', async (req, res) => {
  try {
    const verification = await eps.verifyPayment({
      merchantTransactionId: req.params.transactionId
    });

    return res.json({
      status: verification.Status,
      amount: verification.TotalAmount,
      epsTransactionId: verification.EpsTransactionId,
      paymentMethod: verification.FinancialEntity
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to verify payment' });
  }
});
```

## 12. Security best practices

- Callback URL trust করবেন না; সবসময় `verifyPayment()` call করুন।
- Payment initiate করার আগেই order/payment record database-এ save করুন।
- `merchantTransactionId` unique রাখুন।
- Credential `.env` বা server secret manager-এ রাখুন।
- Sandbox এবং production credential আলাদা রাখুন।
- Amount verification করুন: EPS থেকে পাওয়া amount আপনার order amount-এর সাথে match করছে কি না।
- Same transaction multiple times process না করার জন্য idempotency check রাখুন।
- Verification success হলে তবেই product delivery, invoice, email, subscription activation বা membership activation করুন।

## 13. Common error code

| Code | অর্থ |
| --- | --- |
| `INVALID_CONFIG` | EPS config ভুল বা missing |
| `INVALID_PARAMS` | payment parameter ভুল |
| `AUTH_ERROR` | credential/authentication সমস্যা |
| `INIT_ERROR` | payment initialize হয়নি |
| `VERIFY_ERROR` | transaction verify হয়নি |
| `NETWORK_ERROR` | network বা connection সমস্যা |

## 14. Testing checklist

- Sandbox credential দিয়ে EPS client initialize হচ্ছে।
- `/payment/initiate` route payment create করে EPS page-এ redirect করছে।
- Success callback hit হলে `verifyPayment()` call হচ্ছে।
- Failed transaction paid হিসেবে mark হচ্ছে না।
- Cancel transaction cancelled হিসেবে save হচ্ছে।
- Wrong বা missing `merchantTransactionId` handle হচ্ছে।
- Amount mismatch হলে order paid হচ্ছে না।
- Production deploy-এর আগে `EPS_SANDBOX=false` করা হয়েছে।
- Callback URLs public HTTPS URL।

## 15. Minimal implementation checklist

1. Package install করুন।
2. `.env` credential যোগ করুন।
3. `EPS` client initialize করুন।
4. Order create করার সময় `merchantTransactionId` generate করুন।
5. `initializePayment()` call করুন।
6. `payment.RedirectURL`-এ user redirect করুন।
7. `/payment/success` route-এ `verifyPayment()` call করুন।
8. `Status === 'Success'` হলে order/payment `PAID` করুন।
9. Fail/cancel route-এ order status update করুন।
10. Sandbox test শেষ হলে production credential দিয়ে deploy করুন।

