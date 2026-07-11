import { apiSlice } from '@/redux/api/apiSlice';

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getOrders: builder.query({
      query: ({ page, limit, q, paymentStatus, deliveryStatus, orderStatus }) => {
        let url = `/api/orders/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) url += `&q=${encodeURIComponent(q)}`;
        if (paymentStatus) url += `&paymentStatus=${encodeURIComponent(paymentStatus)}`;
        if (deliveryStatus) url += `&deliveryStatus=${encodeURIComponent(deliveryStatus)}`;
        if (orderStatus) url += `&orderStatus=${encodeURIComponent(orderStatus)}`;
        return url;
      },
      providesTags: [{ type: 'tagTypeOrders', id: 'LIST' }],
    }),
    getOrdersSummary: builder.query({
      query: ({ page, limit }) => `/api/orders/v1?summary=true&page=${page || 1}&limit=${limit || 10}`,
      providesTags: [{ type: 'tagTypeOrders', id: 'LIST' }],
    }),
    getOrderById: builder.query({
      query: id => `/api/orders/v1?id=${id}`,
    }),
    addOrder: builder.mutation({
      query: newOrder => ({
        url: '/api/orders/v1',
        method: 'POST',
        body: newOrder,
      }),
      invalidatesTags: [{ type: 'tagTypeOrders' }],
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: '/api/orders/v1',
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeOrders' }],
    }),
    deleteOrder: builder.mutation({
      query: ({ id }) => ({
        url: '/api/orders/v1',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeOrders' }],
    }),
    bulkUpdateOrders: builder.mutation({
      query: bulkData => ({
        url: '/api/orders/v1?bulk=true',
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeOrders' }],
    }),
    bulkDeleteOrders: builder.mutation({
      query: bulkData => ({
        url: '/api/orders/v1?bulk=true',
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeOrders' }],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrdersSummaryQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useBulkUpdateOrdersMutation,
  useBulkDeleteOrdersMutation,
  useGetOrderByIdQuery,
} = ordersApi;
