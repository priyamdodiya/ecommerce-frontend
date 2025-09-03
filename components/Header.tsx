// import React from 'react'
// import Container from './Container'
// import Logo from './Logo'
// import HeaderMenu from './HeaderMenu'
// import SearchBar from './SearchBar'
// import CartIcon from './CartIcon'
// import FavoriteButton from './FavoriteButton'
// import MobileMenu from './MobileMenu'
// import SignIn from './SignIn'
// const Header = async () => {
//     return (
//         <header className='bg-white/70 py-5 sticky top-0 z-50  backdrop-blur-md  '>
//             <Container className='flex items-center justify-between text-lightColor'>
//                 <div className='w-auto md:w-1/3 flex items-center gap-2.5 justift-start md:gap-0'>
//                     <MobileMenu />
//                     <Logo spanDesign={''} />
//                 </div>
//                 <HeaderMenu />
//                 <div className='w-auto md:w1/3 flex items-center justify-end gap-5'>
//                     <SearchBar />
//                     <CartIcon />
//                     <FavoriteButton />
//                     <SignIn />
//                 </div>
//             </Container>
//         </header>
//     )
// }
// export default Header




"use client";
import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import MobileMenu from "./MobileMenu";
import SignIn from "./SignIn";
import { useSelector } from "react-redux";
import { RootState } from "../app/store/store";
import Link from "next/link";

const Header = () => {
  const { user } = useSelector((state: RootState) => state.login);

  const renderAdminHeader = () => (
    <nav className="flex gap-6 font-medium text-gray-700">
      <Link href="/admin/dashboard" className="hover:text-shop_dark_green">
        Dashboard
      </Link>
      <Link href="/admin/products" className="hover:text-shop_dark_green">
        Products
      </Link>
      <Link href="/admin/orders" className="hover:text-shop_dark_green">
        Orders
      </Link>
      <Link href="/admin/users" className="hover:text-shop_dark_green">
        Users
      </Link>
    </nav>
  );

  const renderUserHeader = () => (
    <>
      <HeaderMenu />
      <div className="flex items-center gap-5">
        <SearchBar />
        <CartIcon />
        <FavoriteButton />
      </div>
    </>
  );

  return (
    <header className="bg-white/70 py-5 sticky top-0 z-50 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        {/* Left Section: Logo + MobileMenu */}
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 md:gap-0">
          <MobileMenu />
          <Logo spanDesign={""} />
        </div>

        {/* Middle Section: Navigation */}
        <div className="hidden md:flex w-1/3 justify-center">
          {user?.role === "ADMIN" ? renderAdminHeader() : <HeaderMenu />}
        </div>

        {/* Right Section: Actions */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          {user?.role === "ADMIN" ? (
            <SignIn />
          ) : (
            <>
              <SearchBar />
              <CartIcon />
              <FavoriteButton />
              <SignIn />
            </>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
