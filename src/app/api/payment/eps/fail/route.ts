import { finalizeEpsPayment, redirectToCart } from '../service';

const handleFail = async (req: Request) => {
  const result = await finalizeEpsPayment(req, 'failed');
  return redirectToCart(req, result, 'failed');
};

export const GET = handleFail;
export const POST = handleFail;
