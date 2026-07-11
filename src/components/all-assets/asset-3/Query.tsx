'use client';

import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';

import { useGetCategoriesQuery } from '@/redux/features/categories/categoriesSlice';
import { useGetProductsQuery } from '@/redux/features/products/productsSlice';

import {
  AssetProps,
  CategoriesResponse,
  CategoryItem,
  defaultDataAsset3,
  IAssetData,
  ProductItem,
  ProductsResponse,
  TemplateItem,
  templateImagePlaceholder,
} from './data';
import RenderItem from './RenderItem';

const mobileGridLayoutClasses: Record<IAssetData['mobileGridLayout'], string> = {
  '1x1': 'grid-cols-1',
  '1x2': 'grid-cols-2',
};

const gridLayoutClasses: Record<IAssetData['gridLayout'], string> = {
  '1x1': 'md:grid-cols-1',
  '1x2': 'md:grid-cols-2',
  '1x3': 'md:grid-cols-3',
};

const sortTemplates = (templates: TemplateItem[], sortMode: IAssetData['sortMode']) => {
  if (sortMode === 'custom') return templates;
  return [...templates].sort((a, b) => {
    const result = a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
    return sortMode === 'ascending' ? result : -result;
  });
};

const resolveData = (data?: IAssetData | string): IAssetData => {
  if (!data) return defaultDataAsset3;

  try {
    const parsedData = typeof data === 'string' ? (JSON.parse(data) as Partial<IAssetData>) : data;
    const settings = {
      ...defaultDataAsset3,
      ...parsedData,
      title: parsedData.title || parsedData.sectionTitle || defaultDataAsset3.title,
      sortMode: parsedData.sortMode || defaultDataAsset3.sortMode,
      gridLayout: parsedData.gridLayout || defaultDataAsset3.gridLayout,
      mobileGridLayout: parsedData.mobileGridLayout || defaultDataAsset3.mobileGridLayout,
      showSeeMore: parsedData.showSeeMore ?? defaultDataAsset3.showSeeMore,
      showBottomNavigation: parsedData.showBottomNavigation ?? defaultDataAsset3.showBottomNavigation,
      seeMore: {
        ...defaultDataAsset3.seeMore,
        ...(parsedData.seeMore || {}),
        name: parsedData.seeMore?.name || parsedData.viewMoreText || defaultDataAsset3.seeMore.name,
      },
      templates: parsedData.templates || defaultDataAsset3.templates,
    };

    return {
      ...settings,
      templates: sortTemplates(settings.templates, settings.sortMode),
    };
  } catch {
    return defaultDataAsset3;
  }
};

const getProductPrice = (product: ProductItem) => {
  const value = Number(product.discount_price || product.real_price || 0);
  return value ? `${value.toLocaleString()}৳` : '0৳';
};

const productToTemplate = (product: ProductItem, fallbackId: number): TemplateItem => ({
  id: fallbackId,
  sourceProductId: product._id,
  productUID: product.productUID || '',
  category: product.category || [],
  title: product.title || 'Untitled Product',
  price: getProductPrice(product),
  views: product.view || '0',
  rating: Math.min(5, Math.max(0, Number(product.star) || 5)),
  image: product.primary_images?.url || templateImagePlaceholder,
  url: product.liveUrl || (product._id ? `/template?id=${product._id}` : ''),
});

const getCategoryProducts = (categoryName: string, products: ProductItem[]) => {
  const normalizedCategoryName = categoryName.trim().toLowerCase();
  return products.filter(product => (product.category || []).some(category => category.trim().toLowerCase() === normalizedCategoryName));
};

const CategoryProductGroup = ({
  category,
  products,
  settings,
  gridClassName,
  mobileGridClassName,
  depth = 0,
}: {
  category: CategoryItem;
  products: ProductItem[];
  settings: IAssetData;
  gridClassName: string;
  mobileGridClassName: string;
  depth?: number;
}) => {
  const categoryProducts = getCategoryProducts(category.name, products);

  return (
    <div className={depth === 0 ? 'space-y-5' : 'space-y-4 border-l border-blue-100 pl-4 md:pl-6'}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 pb-2">
        <h3 className={depth === 0 ? 'text-lg font-bold text-gray-900 md:text-2xl' : 'text-base font-bold text-gray-800 md:text-xl'}>{category.name}</h3>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {categoryProducts.length} product{categoryProducts.length === 1 ? '' : 's'}
        </span>
      </div>

      {categoryProducts.length > 0 ? (
        <div className={`grid items-stretch gap-4 ${mobileGridClassName} ${gridClassName}`}>
          {sortTemplates(
            categoryProducts.map(product => productToTemplate(product, Math.max(1, products.findIndex(item => item._id === product._id) + 1))),
            settings.sortMode,
          ).map(template => (
            <RenderItem key={template.sourceProductId || template.productUID || template.title} item={template} settings={settings} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-blue-100 bg-blue-50/40 px-4 py-6 text-sm text-gray-500">No products found in this category.</div>
      )}

      {category.children?.length ? (
        <div className="space-y-6 pt-2">
          {category.children.map(child => (
            <CategoryProductGroup
              key={`${child._id || child.sl_no}-${child.name}`}
              category={child}
              products={products}
              settings={settings}
              gridClassName={gridClassName}
              mobileGridClassName={mobileGridClassName}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const QueryAsset3 = ({ data }: AssetProps) => {
  const settings = useMemo(() => resolveData(data), [data]);
  const mobileGridClassName = mobileGridLayoutClasses[settings.mobileGridLayout] || mobileGridLayoutClasses[defaultDataAsset3.mobileGridLayout];
  const gridClassName = gridLayoutClasses[settings.gridLayout] || gridLayoutClasses[defaultDataAsset3.gridLayout];

  const {
    data: categoriesResponse,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetCategoriesQuery({ page: 1, limit: 1000 }) as {
    data?: CategoriesResponse;
    isLoading: boolean;
    isError: boolean;
  };
  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useGetProductsQuery({ page: 1, limit: 1000 }) as {
    data?: ProductsResponse;
    isLoading: boolean;
    isError: boolean;
  };

  const categories = categoriesResponse?.data?.categories || [];
  const products = productsResponse?.data?.products || [];
  const isLoading = isCategoriesLoading || isProductsLoading;
  const hasError = isCategoriesError || isProductsError;

  return (
    <section className="bg-white px-4 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        {/* <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-blue-600 md:text-3xl">{settings.title}</h2>
          {settings.showSeeMore && (
            <Link href={settings.seeMore.url || '#'} className="rounded-sm bg-blue-600 px-2 py-1 text-sm font-semibold text-white hover:underline md:rounded-lg md:px-6 md:py-2">
              {settings.seeMore.name}
            </Link>
          )}
        </div> */}

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center rounded-lg border border-blue-100 bg-blue-50/40 text-blue-600">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading categories and products...
          </div>
        ) : hasError ? (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-6 text-sm font-semibold text-red-600">Failed to load categories or products.</div>
        ) : categories.length === 0 ? (
          <div className="rounded-lg border border-dashed border-blue-100 bg-blue-50/40 px-4 py-10 text-center text-sm text-gray-500">No categories found.</div>
        ) : (
          <div className="space-y-10">
            {categories.map(category => (
              <CategoryProductGroup
                key={`${category._id || category.sl_no}-${category.name}`}
                category={category}
                products={products}
                settings={settings}
                gridClassName={gridClassName}
                mobileGridClassName={mobileGridClassName}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default QueryAsset3;
