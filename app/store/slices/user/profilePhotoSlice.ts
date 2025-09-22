import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../../store";
import { UserData } from "../types";

export const updateProfilePhoto = createAsyncThunk(
  "profile/updatePhoto",
  async (file: File, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.login.token;

      const formData = new FormData();
      formData.append("profilePhoto", file);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/update-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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

export const removeProfilePhoto = createAsyncThunk(
  "profile/removePhoto",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.login.token;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/remove-photo`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.user as UserData;
    } catch (err) {
      if (err instanceof AxiosError) {
        return rejectWithValue(err.response?.data?.message || "Remove failed");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

interface ProfilePhotoState {
  loading: boolean;
  error: string | null;
}

const initialState: ProfilePhotoState = {
  loading: false,
  error: null,
};

const profilePhotoSlice = createSlice({
  name: "profilePhoto",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfilePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfilePhoto.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProfilePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(removeProfilePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProfilePhoto.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeProfilePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profilePhotoSlice.reducer;
