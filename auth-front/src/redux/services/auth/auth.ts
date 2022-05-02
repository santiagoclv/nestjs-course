import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axios/axios";
import { User } from "../../dto/user";
import { LoginQuery } from "../../dto/login-query";
import { RegisterQuery } from "../../dto/register-query";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation<void, LoginQuery>({
      query: (loginData) => ({
        url: "auth/login",
        method: "POST",
        data: loginData
      }),
      invalidatesTags: ["User"],
    }),
    getMe: builder.query<User, void>({
      query: () => ({
        url: "users/@me",
        method: "GET"
      }),
      providesTags: ["User"],
    }),
    register: builder.mutation<boolean, RegisterQuery>({
      query: (registerData) => ({
        url: "auth/register",
        method: "POST",
        data: registerData,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "GET"
      }),
      invalidatesTags: ["User"],
    })
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;
