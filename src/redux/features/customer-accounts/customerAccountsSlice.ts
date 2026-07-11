import { apiSlice } from '@/redux/api/apiSlice';

type CustomerAccountsQueryArgs = {
  page?: number;
  limit?: number;
  q?: string;
  blocked?: string;
};

type CustomerAccountPayload = Record<string, unknown> & {
  id?: string;
  name?: string;
  mobileNumber?: string;
  email?: string;
  oldPassword?: string;
  password?: string;
  isBlocked?: boolean;
};

export const customerAccountsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCustomerAccounts: builder.query<unknown, CustomerAccountsQueryArgs>({
      query: ({ page, limit, q, blocked }) => {
        let url = `/api/customer-accounts/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) url += `&q=${encodeURIComponent(q)}`;
        if (blocked) url += `&blocked=${encodeURIComponent(blocked)}`;
        return url;
      },
      providesTags: [{ type: 'tagTypeCustomerAccounts', id: 'LIST' }],
    }),
    getCustomerAccountsSummary: builder.query<unknown, Pick<CustomerAccountsQueryArgs, 'page' | 'limit'>>({
      query: ({ page, limit }) => `/api/customer-accounts/v1?summary=true&page=${page || 1}&limit=${limit || 10}`,
      providesTags: [{ type: 'tagTypeCustomerAccounts', id: 'LIST' }],
    }),
    getMyCustomerAccount: builder.query<unknown, void>({
      query: () => '/api/customer-accounts/v1?me=true',
      providesTags: [{ type: 'tagTypeCustomerAccounts', id: 'ME' }],
    }),
    addCustomerAccount: builder.mutation<unknown, CustomerAccountPayload>({
      query: newAccount => ({
        url: '/api/customer-accounts/v1',
        method: 'POST',
        body: newAccount,
      }),
      invalidatesTags: [{ type: 'tagTypeCustomerAccounts' }],
    }),
    updateCustomerAccount: builder.mutation<unknown, CustomerAccountPayload>({
      query: ({ id, ...data }) => ({
        url: '/api/customer-accounts/v1',
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeCustomerAccounts' }],
    }),
    updateMyCustomerAccount: builder.mutation<unknown, CustomerAccountPayload>({
      query: data => ({
        url: '/api/customer-accounts/v1?me=true',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [
        { type: 'tagTypeCustomerAccounts', id: 'ME' },
        { type: 'tagTypeCustomerAccounts', id: 'LIST' },
      ],
    }),
    deleteCustomerAccount: builder.mutation<unknown, { id?: string }>({
      query: ({ id }) => ({
        url: '/api/customer-accounts/v1',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeCustomerAccounts' }],
    }),
    bulkUpdateCustomerAccounts: builder.mutation<unknown, Array<{ id?: string; updateData: CustomerAccountPayload }>>({
      query: bulkData => ({
        url: '/api/customer-accounts/v1?bulk=true',
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeCustomerAccounts' }],
    }),
    bulkDeleteCustomerAccounts: builder.mutation<unknown, { ids: string[] }>({
      query: bulkData => ({
        url: '/api/customer-accounts/v1?bulk=true',
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeCustomerAccounts' }],
    }),
  }),
});

export const {
  useGetCustomerAccountsQuery,
  useGetCustomerAccountsSummaryQuery,
  useGetMyCustomerAccountQuery,
  useAddCustomerAccountMutation,
  useUpdateCustomerAccountMutation,
  useUpdateMyCustomerAccountMutation,
  useDeleteCustomerAccountMutation,
  useBulkUpdateCustomerAccountsMutation,
  useBulkDeleteCustomerAccountsMutation,
} = customerAccountsApi;
