import { apiSlice } from '@/redux/api/apiSlice';

export const serviceApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getServiceCountries: builder.query({
      query: ({ page = 1, limit = 50, q = '' }) =>
        `/api/service/v1?page=${page}&limit=${limit}${q ? `&q=${encodeURIComponent(q)}` : ''}`,
      providesTags: [{ type: 'tagTypeService', id: 'LIST' }],
    }),
    getServiceCountryById: builder.query({
      query: id => `/api/service/v1?id=${id}`,
      providesTags: (_result, _error, id) => [{ type: 'tagTypeService', id }],
    }),
    addServiceCountry: builder.mutation({
      query: body => ({ url: '/api/service/v1', method: 'POST', body }),
      invalidatesTags: [{ type: 'tagTypeService' }],
    }),
    updateServiceCountry: builder.mutation({
      query: ({ mongoId, ...body }) => ({ url: '/api/service/v1', method: 'PUT', body: { mongoId, ...body } }),
      invalidatesTags: [{ type: 'tagTypeService' }],
    }),
    deleteServiceCountry: builder.mutation({
      query: id => ({ url: '/api/service/v1', method: 'DELETE', body: { id } }),
      invalidatesTags: [{ type: 'tagTypeService' }],
    }),
  }),
});

export const {
  useGetServiceCountriesQuery,
  useGetServiceCountryByIdQuery,
  useAddServiceCountryMutation,
  useUpdateServiceCountryMutation,
  useDeleteServiceCountryMutation,
} = serviceApi;
