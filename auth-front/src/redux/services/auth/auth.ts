import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axios/axios";
import { User } from "../../dto/user";
import { LoginQuery } from "../../dto/login-query";
import { RegisterQuery } from "../../dto/register-query";
import { ForgotPasswordQuery } from "../../dto/forgot-password-query";
import { ResetPasswordQuery } from "../../dto/reset-password-query";

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
    }),
    forgotPassword: builder.mutation<string, ForgotPasswordQuery>({
      query: (forgotPasswordData) => ({
        url: "auth/forgot",
        method: "POST",
        data: forgotPasswordData
      })
    }),
    resetPassword: builder.mutation<void, ResetPasswordQuery>({
      query: (resetPasswordData) => ({
        url: "auth/reset",
        method: "PATCH",
        data: resetPasswordData
      })
    })
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApi;
