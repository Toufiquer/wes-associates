import { apiSlice } from '@/redux/api/apiSlice';

export const campaignApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCampaigns: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/campaign/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) url += `&q=${encodeURIComponent(q)}`;
        return url;
      },
      providesTags: [{ type: 'tagTypeCampaign', id: 'LIST' }],
    }),
    getCampaignById: builder.query({
      query: id => `/api/campaign/v1?id=${id}`,
      providesTags: (_result, _error, id) => [{ type: 'tagTypeCampaign', id }],
    }),
    getCampaignByCampaignId: builder.query({
      query: campaignId => `/api/campaign/v1?campaignId=${encodeURIComponent(campaignId)}`,
      providesTags: (_result, _error, campaignId) => [{ type: 'tagTypeCampaign', id: campaignId }],
    }),
    addCampaign: builder.mutation({
      query: newCampaign => ({
        url: '/api/campaign/v1',
        method: 'POST',
        body: newCampaign,
      }),
      invalidatesTags: [{ type: 'tagTypeCampaign' }],
    }),
    updateCampaign: builder.mutation({
      query: ({ id, ...data }) => ({
        url: '/api/campaign/v1',
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeCampaign' }],
    }),
    deleteCampaign: builder.mutation({
      query: ({ id }) => ({
        url: '/api/campaign/v1',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeCampaign' }],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useGetCampaignByCampaignIdQuery,
  useAddCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
} = campaignApi;
