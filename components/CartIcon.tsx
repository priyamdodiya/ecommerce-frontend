"use client"
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

const CartIcon = () => {
  const { items } = useSelector((state : RootState)=>state.cart);
  return (
    <Link href={"/cart"} className='group relative'>
      <ShoppingBag className='w-5 h-5 hover:text-shop_light_green hoverEffect' />
      <span className='absolute -top-1 -right-1 bg-shop_dark_green text-white h3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center'>{items?.length ?? 0}</span>
    </Link>
  )
}
export default CartIcon;