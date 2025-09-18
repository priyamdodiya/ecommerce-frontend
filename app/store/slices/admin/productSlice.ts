import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface ProductState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ProductState = {
  loading: false,
  success: false,
  error: null,
};

interface ApiResponse {
  message: string;
  product?: unknown;
}

export const createProduct = createAsyncThunk<ApiResponse, FormData, { rejectValue: string }>("product/create", async (formData, { rejectWithValue }) => {
  try {
    console.log({ formData })
    const response = await axios.post<ApiResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    console.log({ response }, "response from slice")
    return response.data;
  } catch (err) {
    console.log({ err }, "err")
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Something went wrong"
    );
  }
}
);

export const deleteProduct = createAsyncThunk<
  ApiResponse,
  number,
  { rejectValue: string }
>("product/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete<ApiResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete product"
    );
  }
});

export const updateProduct = createAsyncThunk<
  ApiResponse,
  { id: number; formData: FormData },
  { rejectValue: string }
>(
  "product/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`,
        formData,
        {
          withCredentials: true, 
        }
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);


const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
