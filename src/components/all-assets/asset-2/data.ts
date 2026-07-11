export type AssetSortMode = 'ascending' | 'descending' | 'custom';
export type AssetGridLayout = '1x1' | '1x2' | '1x3';
export type AssetMobileGridLayout = '1x1' | '1x2';
export const assetGridItemWidth: Record<AssetGridLayout, string> = {
  '1x1': '100%',
  '1x2': '50%',
  '1x3': `${100 / 3}%`,
};

export const assetMobileGridItemWidth: Record<AssetMobileGridLayout, string> = {
  '1x1': '100%',
  '1x2': '50%',
};

export interface SeeMoreConfig {
  name: string;
  url: string;
}

export interface TemplateItem {
  id: number;
  sourceProductId?: string;
  productUID?: string;
  title: string;
  price: string;
  views: string;
  rating: number;
  image: string;
  url?: string;
}

export interface IAssetData {
  assetUid: string;
  assetName: string;
  title: string;
  sectionTitle?: string;
  sortMode: AssetSortMode;
  gridLayout: AssetGridLayout;
  mobileGridLayout: AssetMobileGridLayout;
  seeMore: SeeMoreConfig;
  showSeeMore: boolean;
  showBottomNavigation: boolean;
  viewMoreText?: string;
  buyButtonText: string;
  templates: TemplateItem[];
}

export interface AssetProps {
  data?: IAssetData | string;
}

export const templateImagePlaceholder = 'https://i.ibb.co/j3Z3BK6/marketing.png';

export const defaultDataAsset2: IAssetData = {
  assetUid: 'asset-uid-2',
  assetName: 'All Theme',
  title: 'All Theme',
  sortMode: 'custom',
  gridLayout: '1x3',
  mobileGridLayout: '1x1',
  seeMore: {
    name: 'See More',
    url: '/all-assets',
  },
  showSeeMore: true,
  showBottomNavigation: true,
  buyButtonText: 'Buy Now',
  templates: [
    {
      id: 1,
      title: 'ShopMart - Premium Daraz Website Template',
      productUID: 'THEME-001',
      price: '1,750৳',
      views: '0.2k',
      rating: 5,
      image: templateImagePlaceholder,
    },
    { id: 2, title: 'News Paper WordPress Template', productUID: 'THEME-002', price: '1,750৳', views: '60', rating: 5, image: templateImagePlaceholder },
    { id: 3, title: 'Ads-Report WordPress Website Template', productUID: 'THEME-003', price: '0৳', views: '1.1k', rating: 5, image: templateImagePlaceholder },
    { id: 4, title: 'EcoMart - Premium Ecommerce Template', productUID: 'THEME-004', price: '1,750৳', views: '1k', rating: 5, image: templateImagePlaceholder },
  ],
};

export default defaultDataAsset2;
