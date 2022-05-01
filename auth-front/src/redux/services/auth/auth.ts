import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../dto/user";
import { LoginQuery } from "../../dto/login-query";
import { RegisterQuery } from "../../dto/register-query";

const baseUrl =
  process.env.REACT_APP_API_BASE_URL ?? "http://localhost:3000/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<void, LoginQuery>({
      query: (loginData) => ({
        url: 'auth/login',
        method: 'POST',
        body: loginData,
        credentials: 'include'
      }),
      invalidatesTags: ['User']
    }),
    getMe: builder.query<User, void>({
      query: () => ({
        url: "users/@me",
        credentials: "include",
      }),
      providesTags: ['User']
    }),
    refresh: builder.mutation<void, void>({
      query: () => 'auth/refresh',
    }),
    register: builder.mutation<boolean, RegisterQuery>({
      query: (registerData) => ({
        url: 'auth/register',
        method: 'POST',
        body: registerData
      })
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        credentials: 'include'
      }),
      invalidatesTags: ['User']
    }),
    forgot: builder.query<void, string>({
      query: () => 'auth/forgot',
    }),
    reset: builder.query<void, string>({
      query: () => 'auth/reset',
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery
} = authApi;
