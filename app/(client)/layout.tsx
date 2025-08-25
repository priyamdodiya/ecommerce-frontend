// import type { Metadata } from "next";
// import "../globals.css";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { ClerkProvider } from "@clerk/nextjs"

// export const metadata: Metadata = {
//   title: {
//     template: "%s - Shopcart online store",
//     default: "Shopcart online store"
//   },
//   description: "Shopcart online store, your one stop shop for all your needs"
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <ClerkProvider>
//       <body className="font-poppins antialiased">
//         <div className="flex flex-col">
//           <Header />
//           <main className="flex-1">{children}</main>
//           <Footer />
//         </div>
//       </body>

//     </ClerkProvider>
//   );
// }



import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/ToastProvider";
// import { ToastProvider } from "./ToastProvider"; // ✅ import kiya

export const metadata: Metadata = {
  title: {
    template: "%s - Shopcart online store",
    default: "Shopcart online store",
  },
  description:
    "Shopcart online store, your one stop shop for all your needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-poppins antialiased">
          <div className="flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ToastProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}
