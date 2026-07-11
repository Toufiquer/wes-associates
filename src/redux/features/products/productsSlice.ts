// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice';

type ProductsQueryArgs = {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
};

type ProductMutationPayload = Record<string, unknown> & {
  id?: string;
  shareButtonsVisible?: boolean;
};

export const productsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query<unknown, ProductsQueryArgs>({
      query: ({ page, limit, q, status }) => {
        let url = `/api/products/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) url += `&q=${encodeURIComponent(q)}`;
        if (status) url += `&status=${encodeURIComponent(status)}`;
        return url;
      },
      providesTags: [{ type: 'tagTypeProducts', id: 'LIST' }],
    }),
    getProductsSummary: builder.query<unknown, Pick<ProductsQueryArgs, 'page' | 'limit'>>({
      query: ({ page, limit }) => `/api/products/v1?summary=true&page=${page || 1}&limit=${limit || 10}`,
      providesTags: [{ type: 'tagTypeProducts', id: 'LIST' }],
    }),
    getProductById: builder.query<unknown, string>({
      query: id => `/api/products/v1?id=${id}`,
    }),
    addProduct: builder.mutation<unknown, ProductMutationPayload>({
      query: newProduct => ({
        url: '/api/products/v1',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: [{ type: 'tagTypeProducts' }],
    }),
    updateProduct: builder.mutation<unknown, ProductMutationPayload>({
      query: ({ id, ...data }) => ({
        url: '/api/products/v1',
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeProducts' }],
    }),
    deleteProduct: builder.mutation<unknown, { id?: string }>({
      query: ({ id }) => ({
        url: '/api/products/v1',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeProducts' }],
    }),
    bulkUpdateProducts: builder.mutation<unknown, Array<{ id?: string; updateData: ProductMutationPayload }>>({
      query: bulkData => ({
        url: '/api/products/v1?bulk=true',
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeProducts' }],
    }),
    bulkDeleteProducts: builder.mutation<unknown, { ids: string[] }>({
      query: bulkData => ({
        url: '/api/products/v1?bulk=true',
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeProducts' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsSummaryQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBulkUpdateProductsMutation,
  useBulkDeleteProductsMutation,
  useGetProductByIdQuery,
} = productsApi;
