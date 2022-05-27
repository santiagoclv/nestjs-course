import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axios/axios";
import { User } from "../../dto/user";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => ({
        url: "users/@me",
        method: "GET"
      }),
      providesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "GET"
      }),
      invalidatesTags: ["User"]
    }),
  }),
});

export const {
  useGetMeQuery,
  useLogoutMutation
} = authApi;
