'use client';

import { Eye, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { addAssetToCart } from '@/lib/asset-cart';
import { IAssetData, TemplateItem, templateImagePlaceholder } from './data';
import { fireAsset1AddToCartGtmEvent } from './gtm-event-fire';

interface RenderItemProps {
  item: TemplateItem;
  settings: IAssetData;
}

const RenderItem = ({ item, settings }: RenderItemProps) => {
  const router = useRouter();
  const titleUrl = `/template?id=${item?.sourceProductId}`;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    fireAsset1AddToCartGtmEvent(item, settings);
    addAssetToCart({
      productId: item.id,
      assetUid: settings.assetUid,
      assetName: settings.assetName,
      title: item.title,
      price: item.price,
      image: item.image || templateImagePlaceholder,
    });
    toast.success('Redirecting...');
    router.push('/cart');
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-100/60 hover:border-blue-200">
      {/* Shimmer accent line */}
      <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-600 transition-transform duration-500 group-hover:scale-x-100" />

      {/* Image block */}
      <Link href={titleUrl} className="relative block aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Image
          src={item.image || templateImagePlaceholder}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark overlay with preview icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-blue-950/0 transition-all duration-300 group-hover:bg-blue-950/30" />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-2.5">
        <h3 className="line-clamp-2 text-xs font-medium text-gray-700 transition-colors duration-200 group-hover:text-blue-700 md:text-sm">{item.title}</h3>

        <div className="mt-1 flex text-[10px] text-yellow-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < item.rating ? '★' : '☆'}</span>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-blue-600 transition-colors duration-200 group-hover:text-blue-700 md:text-lg">{item.price}</span>
          <span className="flex items-center gap-0.5 text-[10px] font-medium text-gray-400">
            <Eye size={12} /> {item.views}
          </span>
        </div>

        {/* Buttons — slide up on hover */}
        <div className="mt-3 flex translate-y-1 gap-1 opacity-80 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={handleBuyNow}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded bg-blue-600 py-1.5 text-[11px] font-bold text-white transition-all duration-200 hover:bg-blue-700 active:scale-[0.98] md:text-sm"
          >
            <ShoppingCart size={13} />
            Buy Now
          </button>
          <Link
            href={item.url || ''}
            className="flex items-center justify-center rounded border border-gray-200 px-2 text-gray-500 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <Eye size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RenderItem;
