import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  discountPrice?: string;
  stock: number;
  image: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  loading: boolean;
  error: string | null;
  products: Product[];
}

const initialState: ProductState = {
  loading: false,
  error: null,
  products: [],
};

export const getProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("user/product/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<Product[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
});

const userProductSlice = createSlice({
  name: "userProduct",
  initialState,
  reducers: {
    resetUserProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { resetUserProductState } = userProductSlice.actions;
export default userProductSlice.reducer;
