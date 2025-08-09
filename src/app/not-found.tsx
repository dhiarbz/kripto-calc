"use client";

import React from "react";
import { usePathname } from "next/navigation"; // 1. Gunakan hook dari Next.js
import Link from "next/link"; // 2. Impor komponen Link
import { useEffect } from "react";

const NotFound = () => {
    const pathname = usePathname(); // 3. Dapatkan path URL

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route",
            pathname // 4. Gunakan variabel yang benar
        );
    }, [pathname]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
                {/* 5. Ganti <a> dengan <Link> */}
                <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;