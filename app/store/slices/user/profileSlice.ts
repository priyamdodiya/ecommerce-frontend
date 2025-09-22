import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { UserData } from "../types";
import Cookies from "js-cookie";
interface ProfileState {
  loading: boolean;
  error: string | null;
}
const initialState: ProfileState = {
  loading: false,
  error: null,
};
export const updateProfile = createAsyncThunk(
  "profile/update",
  async (formData: { fullName: string; email: string; username: string; gender: string }, { rejectWithValue }) => {
    try {
    const token = Cookies.get("token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.user as UserData;
    } catch (err) {
      if (err instanceof AxiosError) {
        return rejectWithValue(err.response?.data?.message || "Update failed");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default profileSlice.reducer;