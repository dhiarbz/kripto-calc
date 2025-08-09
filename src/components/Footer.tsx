"use client";
import { Calculator, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link"; // SARAN: Impor Link untuk navigasi

const Footer = () => {
    const currentYear = new Date().getFullYear();

    // Nama variabel didefinisikan sebagai 'footerlinks' (l kecil)
    const footerlinks = {
        "Tools" : [
            { name: "Crypto Converter", href: "/converter" },
            { name: "Position Size Calculator", href: "/position-size" },
            { name: "Gain & Loss Calculator", href: "/gain-loss" },
            { name: "ROI Mining Calculator", href: "/roi-mining" }
        ],
        "Resources" : [
            { name: "Trading Guide", href: "/guide" },
            { name: "API Documentation", href: "/api" },
            { name: "Blog", href: "/blog" },
            { name: "FAQ", href: "/faq" }
        ],
        "Company" : [
            { name: "About Us", href: "/about" },
            { name: "Contact", href: "/contact" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" }
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
                        <p className="text-muted-foreground leading-relaxed">
                            Your trusted partner for cryptocurrency trading calculations. 
                            Make informed decisions with our professional-grade tools.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span>support@cryptocalc.id</span>
                            </div>
                            <div className="flex items-center space-x-3 text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                <span>+62 21 1234 5678</span>
                            </div>
                            <div className="flex items-center space-x-3 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>Jakarta, Indonesia</span>
                            </div>
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
                            {/* SARAN: Gunakan komponen Link */}
                            <Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">
                                Terms of Service
                            </Link>
                            <Link href="/cookies" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;