import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { LoginPayload, UserData } from "./types";
import { removeProfilePhoto, updateProfilePhoto } from "./user/profilePhotoSlice";
import { updateProfile } from "./user/profileSlice";

interface LoginState {
  loading: boolean;
  error: string | null;
  token: string | null;
  user: UserData | null;
}

const initialState: LoginState = {
  loading: false,
  error: null,
  token: null,
  user: null,
};

export const loginUser = createAsyncThunk(
  "login/user",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        payload
      );
      return response.data as { token: string; user: UserData };
    } catch (err) {
      if (err instanceof AxiosError) {
        return rejectWithValue(err.response?.data?.message || "Login failed");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearLoginError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = action.payload;
        }
      })



      .addCase(updateProfilePhoto.fulfilled, (state, action) => {
        if (state.user) {
          state.user = action.payload;
        }
      })
      .addCase(removeProfilePhoto.fulfilled, (state, action) => {
        if (state.user) {
          state.user = action.payload;
        }
      })

  },
});

export const { clearLoginError, logout } = loginSlice.actions;
export default loginSlice.reducer;