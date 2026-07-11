import { finalizeEpsPayment, redirectToCart } from '../service';

const handleCancel = async (req: Request) => {
  const result = await finalizeEpsPayment(req, 'cancelled');
  return redirectToCart(req, result, 'cancelled');
};

export const GET = handleCancel;
export const POST = handleCancel;
