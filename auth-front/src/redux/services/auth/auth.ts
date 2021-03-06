import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axios/axios";
import { LoginQuery } from "../../dto/login-query";
import { ForgotPasswordQuery } from "../../dto/forgot-password-query";
import { ResetPasswordQuery } from "../../dto/reset-password-query";
import { LoginResponse } from "../../dto/login-response";
import { TfaQuery } from "../../dto/tfa-query";
import { initialState, loginState } from "../../slices/sing-in";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginQuery>({
      query: (loginData) => ({
        url: "auth/login",
        method: "POST",
        data: loginData
      }),
      onQueryStarted( arg, { queryFulfilled, dispatch }) {
        queryFulfilled.then( ({data}) => {
          dispatch(loginState(data))
        });
      }
    }),
    tfa: builder.mutation<boolean, TfaQuery>({
      query: (loginData) => ({
        url: "auth/tfa",
        method: "POST",
        data: loginData
      }),
      onQueryStarted( arg, { queryFulfilled, dispatch }) {
        queryFulfilled.then(() => {
          dispatch(loginState(initialState))
        });
      }
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "GET"
      })
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
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useTfaMutation
} = authApi;
