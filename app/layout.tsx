"use client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
          {children}
          <Toaster position="top-right" toastOptions={{style: {background: "#000000",color: "#fff",},}}/>
        </PersistGate>
        </Provider>
      </body>
    </html>
  );
};
export default RootLayout;