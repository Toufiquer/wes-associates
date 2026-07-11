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
  category?: string[];
  title: string;
  price: string;
  views: string;
  rating: number;
  image: string;
  url?: string;
}

export interface CategoryItem {
  _id?: string;
  sl_no: number;
  name: string;
  children?: CategoryItem[];
}

export interface ProductItem {
  _id?: string;
  productUID?: string;
  title?: string;
  category?: string[];
  real_price?: number;
  discount_price?: number;
  primary_images?: {
    url?: string;
    name?: string;
  };
  star?: number;
  view?: string;
  liveUrl?: string;
}

export interface CategoriesResponse {
  data?: {
    categories?: CategoryItem[];
  };
}

export interface ProductsResponse {
  data?: {
    products?: ProductItem[];
  };
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

export const defaultDataAsset3: IAssetData = {
  assetUid: 'asset-uid-3',
  assetName: 'All Categories',
  title: 'All Categories',
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
  templates: [],
};

export default defaultDataAsset3;
