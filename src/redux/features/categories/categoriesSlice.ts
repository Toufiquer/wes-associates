/*
|-----------------------------------------
| setting up CategoriesSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCategories: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/categories/v1?page=${page || 1}&limit=${limit || 100}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeCategories', id: 'LIST' }],
    }),
    getCategoryById: builder.query({
      query: id => `/api/categories/v1?id=${id}`,
    }),
    addCategory: builder.mutation({
      query: newCategory => ({
        url: '/api/categories/v1',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: [{ type: 'tagTypeCategories' }],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/categories/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeCategories' }],
    }),
    deleteCategory: builder.mutation({
      query: ({ id }) => ({
        url: `/api/categories/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeCategories' }],
    }),
    bulkUpdateCategories: builder.mutation({
      query: bulkData => ({
        url: `/api/categories/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeCategories' }],
    }),
    bulkDeleteCategories: builder.mutation({
      query: bulkData => ({
        url: `/api/categories/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeCategories' }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useBulkUpdateCategoriesMutation,
  useBulkDeleteCategoriesMutation,
  useGetCategoryByIdQuery,
} = categoriesApi;
