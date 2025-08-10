"use client";
import { Calculator, Twitter, Send, MessageSquare } from "lucide-react";
import { FaTwitter, FaDiscord, FaTelegramPlane } from "react-icons/fa";

import Link from "next/link"; // SARAN: Impor Link untuk navigasi

const Footer = () => {
    const currentYear = new Date().getFullYear();

    // Nama variabel didefinisikan sebagai 'footerlinks' (l kecil)
    const footerlinks = {
        "Produk" : [
            { name: "Konverter Kripto ke Rupiah", href: "/converter" },
            { name: "Kalkulator Ukuran Posisi (Position Size)", href: "/position-size" },
            { name: "Kalkulator Keuntungan & Kerugian", href: "/gain-loss" },
            { name: "Kalkulator DCA (Dollar-Cost Averaging)", href: "/dca" }
        ],
        "Donasi" : [
            { name: "USDT", href: "/d-usdt" },
            { name: "BTC", href: "/d-btc" },
            { name: "ETH", href: "/d-eth" },
        ],
        "Perusahaan" : [
            { name: "Tentang Kami", href: "/about" },
            { name: "Kontak", href: "/contact" },
            { name: "Kebijakan Privasi", href: "/privacy" },
            { name: "Ketentuan Layanan", href: "/terms" }
        ]
    };

    return (
        <footer className="bg-card border-t border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                                <Calculator className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold text-foreground">CryptoCalc</span>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {/* PERBAIKAN: Gunakan nama variabel 'footerlinks' yang benar */}
                    {Object.entries(footerlinks).map(([category, links]) => (
                        <div key={category} className="space-y-6">
                            <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        {/* SARAN: Gunakan komponen Link */}
                                        <Link 
                                            href={link.href}
                                            className="text-muted-foreground hover:text-primary transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="border-t border-border mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-muted-foreground text-sm">
                            © {currentYear} CryptoCalc. All rights reserved.
                        </p>
                       <div className="flex space-x-6">
                        {/* Link ke Twitter */}
                        <Link 
                            href="https://twitter.com/yourprofile"
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                            className="text-muted-foreground hover:text-primary transition-colors duration-200"
                        >
                            <FaTwitter className="w-5 h-5" />
                        </Link>

                        {/* Link ke Discord */}
                        <Link 
                            href="https://discord.gg/yourserver" 
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Discord"
                            className="text-muted-foreground hover:text-primary transition-colors duration-200"
                        >
                            <FaDiscord className="w-5 h-5" />
                        </Link>

                        {/* Link ke Telegram */}
                        <Link 
                            href="https://t.me/yourchannel" // Ganti dengan URL Telegram Anda
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Telegram"
                            className="text-muted-foreground hover:text-primary transition-colors duration-200"
                        >
                            <FaTelegramPlane className="w-5 h-5" /> 
                        </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;