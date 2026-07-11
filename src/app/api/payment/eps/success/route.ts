import { finalizeEpsPayment, redirectToCart } from '../service';

const handleSuccess = async (req: Request) => {
  const result = await finalizeEpsPayment(req, 'failed');
  return redirectToCart(req, result, 'failed');
};

export const GET = handleSuccess;
export const POST = handleSuccess;
