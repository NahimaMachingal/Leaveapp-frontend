// src/features/auth/authApi.js
import axios from "axios";
import { loginSuccess, logout } from "./authSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = `${import.meta.env.VITE_API_URL}`;


export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken", // action type prefix
  async (_, { getState, dispatch }) => {
    try {
      const refreshToken =
        getState().auth.refreshToken || localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("Refresh token not found");
      }

      const response = await axios.post(`${API_URL}/api/token/refresh/`, {
        refresh: refreshToken,
      });

      const { access, refresh } = response.data;

      // Dispatch loginSuccess action
      dispatch(
        loginSuccess({
          user: getState().auth.user,
          access,
          refresh: refresh || refreshToken,
        }),
      );

      return access; // Return the new access token
    } catch (error) {
      console.error("Token refresh failed:", error);
      dispatch(logout()); // Dispatch logout if token refresh fails
      throw error;
    }
  },
);

export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, credentials);
    dispatch(loginSuccess(response.data));
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const logoutUser = () => (dispatch) => {
  dispatch(logout());
};