'use client'

import Link from 'next/link'
import { FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa'

export default function FooterClient() {
    return (
        <footer className="bg-blue-600 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo and Description Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <img src="/logo.png" alt="SeaHotel Logo" className="h-12 w-auto brightness-0 invert" />
                            <span className="text-2xl font-bold">SEAHOTEL</span>
                        </div>
                        <p className="text-gray-200">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="/" className="text-white hover:text-gray-200 transition-colors">
                                <FaFacebook size={24} />
                            </Link>
                            <Link href="/" className="text-white hover:text-gray-200 transition-colors">
                                <FaYoutube size={24} />
                            </Link>
                            <Link href="/" className="text-white hover:text-gray-200 transition-colors">
                                <FaInstagram size={24} />
                            </Link>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Tổ Hữu, Đà Nẵng</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>Phuongly@gmail.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>0708079579</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-4">Newsletter</h3>
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="w-full px-4 py-2 rounded-md bg-blue-700 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300">
                                SUBSCRIBE NOW
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}