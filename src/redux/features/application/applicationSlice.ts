import { apiSlice } from '@/redux/api/apiSlice';

export const applicationApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMyApplications: builder.query({ query: () => '/api/applicaton/v1?scope=my', providesTags: ['tagTypeApplication'] }),
    getAllApplications: builder.query({ query: () => '/api/applicaton/v1?scope=all', providesTags: ['tagTypeApplication'] }),
    addApplication: builder.mutation({
      query: body => ({ url: '/api/applicaton/v1', method: 'POST', body }),
      invalidatesTags: ['tagTypeApplication'],
    }),
    updateApplication: builder.mutation({
      query: body => ({ url: '/api/applicaton/v1', method: 'PUT', body }),
      invalidatesTags: ['tagTypeApplication'],
    }),
  }),
});

export const { useGetMyApplicationsQuery, useGetAllApplicationsQuery, useAddApplicationMutation, useUpdateApplicationMutation } = applicationApi;
