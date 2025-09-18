import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  discount?: number;
  discountPrice?: string;
  category: string;
  stock: number;
  image?: string;
  images?: string[];
}

interface ProductState {
  loading: boolean;
  error: string | null;
  product: Product | null;
}

const initialState: ProductState = {
  loading: false,
  error: null,
  product: null,
};

export const getProductById = createAsyncThunk<
  Product,
  number,
  { rejectValue: string }
>("user/singleProduct/getById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get<Product>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to fetch product");
  }
});

const singleProductSlice = createSlice({
  name: "singleProduct",
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.product = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { resetProductState } = singleProductSlice.actions;
export default singleProductSlice.reducer;
