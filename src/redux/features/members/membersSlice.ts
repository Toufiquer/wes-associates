import { apiSlice } from '@/redux/api/apiSlice';

type MembersQueryArgs = {
  page?: number;
  limit?: number;
  q?: string;
};

type MemberPayload = Record<string, unknown> & {
  id?: string;
  title?: string;
  description?: string;
  realPrice?: number;
  discountPrice?: number;
  endDiscount?: string;
  productIds?: string[];
};

type MembershipUserPayload = Record<string, unknown> & {
  orderId?: string;
  accountId?: string;
  membershipIds?: string[];
};

export const membersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMembers: builder.query<unknown, MembersQueryArgs>({
      query: ({ page, limit, q }) => {
        let url = `/api/members/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) url += `&q=${encodeURIComponent(q)}`;
        return url;
      },
      providesTags: [{ type: 'tagTypeMembers', id: 'LIST' }],
    }),
    getMembersSummary: builder.query<unknown, Pick<MembersQueryArgs, 'page' | 'limit'>>({
      query: ({ page, limit }) => `/api/members/v1?summary=true&page=${page || 1}&limit=${limit || 10}`,
      providesTags: [{ type: 'tagTypeMembers', id: 'LIST' }],
    }),
    getMembershipUsers: builder.query<unknown, MembersQueryArgs>({
      query: ({ page, limit, q }) => {
        let url = `/api/members/v1?membershipUsers=true&page=${page || 1}&limit=${limit || 10}`;
        if (q) url += `&q=${encodeURIComponent(q)}`;
        return url;
      },
      providesTags: [{ type: 'tagTypeMembers', id: 'USERS' }],
    }),
    addMember: builder.mutation<unknown, MemberPayload>({
      query: newMember => ({
        url: '/api/members/v1',
        method: 'POST',
        body: newMember,
      }),
      invalidatesTags: [{ type: 'tagTypeMembers' }],
    }),
    updateMember: builder.mutation<unknown, MemberPayload>({
      query: ({ id, ...data }) => ({
        url: '/api/members/v1',
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeMembers' }],
    }),
    deleteMember: builder.mutation<unknown, { id?: string }>({
      query: ({ id }) => ({
        url: '/api/members/v1',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeMembers' }],
    }),
    bulkUpdateMembers: builder.mutation<unknown, Array<{ id?: string; updateData: MemberPayload }>>({
      query: bulkData => ({
        url: '/api/members/v1?bulk=true',
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeMembers' }],
    }),
    bulkDeleteMembers: builder.mutation<unknown, { ids: string[] }>({
      query: bulkData => ({
        url: '/api/members/v1?bulk=true',
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeMembers' }],
    }),
    addMembershipUser: builder.mutation<unknown, MembershipUserPayload>({
      query: payload => ({
        url: '/api/members/v1?membershipUsers=true',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [
        { type: 'tagTypeMembers', id: 'USERS' },
        { type: 'tagTypeMembers', id: 'LIST' },
      ],
    }),
    updateMembershipUser: builder.mutation<unknown, MembershipUserPayload>({
      query: payload => ({
        url: '/api/members/v1?membershipUsers=true',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [
        { type: 'tagTypeMembers', id: 'USERS' },
        { type: 'tagTypeMembers', id: 'LIST' },
      ],
    }),
    deleteMembershipUser: builder.mutation<unknown, { orderId?: string }>({
      query: payload => ({
        url: '/api/members/v1?membershipUsers=true',
        method: 'DELETE',
        body: payload,
      }),
      invalidatesTags: [{ type: 'tagTypeMembers', id: 'USERS' }],
    }),
  }),
});

export const {
  useGetMembersQuery,
  useGetMembersSummaryQuery,
  useGetMembershipUsersQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useBulkUpdateMembersMutation,
  useBulkDeleteMembersMutation,
  useAddMembershipUserMutation,
  useUpdateMembershipUserMutation,
  useDeleteMembershipUserMutation,
} = membersApi;
