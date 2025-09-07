"use client";
import React, { useState } from "react";
import Container from "../../../components/Container";
import Logo from "../../../components/Logo";
import MobileMenu from "../../../components/MobileMenu";
import SignIn from "@/components/SignIn";
import Link from "next/link";
const NewHeader = () => {
    const [open, setOpen] = useState(false);
    return (
        <header className="bg-white/70 py-5 sticky top-0 z-50 backdrop-blur-md shadow">
            <Container className="flex items-center justify-between text-gray-800">
                <div className="w-auto md:w-1/3 flex items-center gap-2.5 md:gap-0 justify-start">
                    <MobileMenu />
                    <Logo spanDesign="New" />
                </div>
                <nav className="hidden md:flex gap-6 font-medium relative">
                    <Link href="/dashboard" className="hover:text-blue-600">
                        Dashboard
                    </Link>
                    <div className="relative">
                        <button
                            onClick={() => setOpen((prev) => !prev)}
                            className="hover:text-blue-600"
                        >
                            Products
                        </button>
                        {open && (
                            <div className="absolute top-8 left-0 w-48 bg-white text-gray-800 shadow-lg rounded-md py-2 z-50">
                                <Link
                                    href="/admin/products"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setOpen(false)}
                                >
                                    All Products
                                </Link>
                                <Link
                                    href="/admin/products/add"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setOpen(false)}
                                >
                                    Add Product
                                </Link>
                            </div>
                        )}
                    </div>
                    <Link href="/services" className="hover:text-blue-600">
                        Services
                    </Link>
                    <Link href="/contact" className="hover:text-blue-600">
                        Contact
                    </Link>
                </nav>
                <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
                    <SignIn />
                </div>
            </Container>
        </header>
    );
};

export default NewHeader;
