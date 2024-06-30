import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logOut } from '../userSlice'

const baseQuery = fetchBaseQuery({ 
  baseUrl: 'https://commercius.onrender.com/api/',
  prepareHeaders: (headers, { getState }: any) => {
    const token = getState().user.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  }
 })

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log('unauthorized', result.error)
    api.dispatch(logOut())
  }
  return result;
};

export const REST_API = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Rooms'],
  endpoints: () => ({}),
})