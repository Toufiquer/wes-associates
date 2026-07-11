/*
|-----------------------------------------
| setting up SidebarsSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export const themeModeApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getThemeMode: builder.query({
      query: () => '/api/theme-mode/v1',
      providesTags: ['ThemeMode'],
    }),
    updateThemeMode: builder.mutation({
      query: data => ({
        url: '/api/theme-mode/v1',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ThemeMode'],
    }),
  }),
});

export const { useGetThemeModeQuery, useUpdateThemeModeMutation } = themeModeApi;
