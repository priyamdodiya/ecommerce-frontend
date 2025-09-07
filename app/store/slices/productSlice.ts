// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";

// interface ProductState {
//   loading: boolean;
//   success: boolean;
//   error: string | null;
// }

// const initialState: ProductState = {
//   loading: false,
//   success: false,
//   error: null,
// };

// interface ApiResponse {
//   message: string;
//   product?: unknown;
// }

// export const createProduct = createAsyncThunk<ApiResponse, FormData, { rejectValue: string }>("product/create", async (formData, { rejectWithValue }) => {
//   try {
//     console.log({ formData })
//     const response = await axios.post<ApiResponse>(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     console.log({ response }, "response from slice")
//     return response.data;
//   } catch (err) {
//     console.log({ err }, "err")
//     const error = err as AxiosError<{ message: string }>;
//     return rejectWithValue(
//       error.response?.data?.message || "Something went wrong"
//     );
//   }
// }
// );

// const productSlice = createSlice({
//   name: "product",
//   initialState,
//   reducers: {
//     resetProductState: (state) => {
//       state.loading = false;
//       state.success = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createProduct.pending, (state) => {
//         state.loading = true;
//         state.success = false;
//         state.error = null;
//       })
//       .addCase(createProduct.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(createProduct.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? "Unknown error";
//       });
//   },
// });

// export const { resetProductState } = productSlice.actions;
// export default productSlice.reducer;





import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface Product {
  id : number;
  name : string;
  description : string;
  price : string;
  discountPrice?:string;
  stock : number;
  image : string;
  isAvailable : boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  loading: boolean;
  success: boolean;
  error: string | null;
  products: Product[];
}

const initialState: ProductState = {
  loading: false,
  success: false,
  error: null,
  products: [],
};

interface ApiResponse {
  message: string;
  product?: Product;
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


export const getProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("product/getAll", async (_, { rejectWithValue }) => {
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
      });

      builder
      .addCase(getProducts.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })

      .addCase(getProducts.fulfilled,(state,action)=>{
        state.loading = false;
        state.products = action.payload;
      })

      .addCase(getProducts.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })

  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;