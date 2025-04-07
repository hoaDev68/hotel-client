'use client'

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import SearchRoom from "../SearchRoom";

export default function HeaderClient() {
    const wrapperRef = useRef<any>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const bannerHeight = 600;
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > bannerHeight - 80);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    return (
        <>
            <header 
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                    isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
                }`} 
                ref={wrapperRef}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-2">
                                <img src="logo.png" alt="SeaHotel Logo" className="h-12 w-auto" />
                                <span className={`text-2xl font-bold ${isScrolled ? 'text-blue-600' : 'text-white'}`}>
                                    SEAHOTEL
                                </span>
                            </Link>
                        </div>
                        <nav className="hidden md:flex">
                            <ul className="flex space-x-8">
                                {['Home', 'Rooms', 'Features', 'Blog', 'About'].map((item) => (
                                    <li key={item}>
                                        <Link 
                                            href="/" 
                                            className={`transition-colors duration-300 text-lg font-medium ${
                                                isScrolled 
                                                    ? 'text-gray-600 hover:text-blue-600' 
                                                    : 'text-white hover:text-gray-200'
                                            }`}
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Banner Section */}
            <section className="relative">
                {/* Main Banner */}
                <div className="relative h-[600px] w-full">
                    <Image
                        src="/banner.jpg"
                        alt="Hotel Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-6 lg:px-8 container mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Book Early</h1>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Save More</h2>
                        <p className="text-xl text-white mb-8">Where every stay is unique</p>
                        
                        {/* Search Box */}
                            <SearchRoom />
                    </div>
                </div>

                {/* Secondary Banners */}
                <div className="container mx-auto px-4 -mt-20 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { src: '/banner1.jpg', alt: 'Hotel View' },
                            { src: '/banner2.jpg', alt: 'Pool View' },
                            { src: '/banner3.jpg', alt: 'Night View' }
                        ].map((banner, index) => (
                            <div key={index} className="relative h-48 rounded-lg overflow-hidden shadow-lg">
                                <Image
                                    src={banner.src}
                                    alt={banner.alt}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}