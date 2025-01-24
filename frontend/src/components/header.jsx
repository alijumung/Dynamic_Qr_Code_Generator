import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import apiClient from "../apiClient.js";


const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [auth, setAuth] = useState(false);
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState('/src/assets/avatar.png'); // Default profile picture
    const [messages, setMessages] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const dropdownRef = useRef(null); // Ref for the dropdown

    // Check authentication and fetch user data
    useEffect(() => {
        apiClient
            .get('/user', { withCredentials: true })
            .then((res) => {
                if (res.data.Status === "Success") {
                    setAuth(true);
                    setName(res.data.name);
                    setProfilePic(res.data.profile_pic);
                    setMessages("");
                    if (location.pathname === '/login') {
                        navigate('/', { replace: true });
                    }
                } else {
                    setAuth(false);
                    setMessages(res.data.Error || "An error occurred");
                    if (location.pathname !== '/login') {
                        navigate('/login');
                    }
                }
            })
            .catch((err) => {
                console.error("Error:", err);
                setAuth(false);
                setMessages("An error occurred while checking authentication");
                if (location.pathname !== '/login') {
                    navigate('/login');
                }
            });
    }, [location.pathname, navigate]);


    // Add scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false); // Close the dropdown
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Toggle dropdown visibility
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleLogout = () => {
        apiClient.post('/auth/logout', {}, { withCredentials: true })
            .then(() => {
                setAuth(false);
                navigate('/login', { replace: true });
            })
            .catch(err => console.error(err));
    };

    return (
        <>
            {auth ? (
                <header
                    className={`w-full fixed top-0 z-50 text-textColor p-4 flex items-center justify-between transition-all duration-300 ${
                        isScrolled ? 'bg-backGround shadow-lg' : 'bg-transparent'
                    }`}
                >
                    {/* Left side: Logo */}
                    <div className="text-3xl font-bold">
                        <Link to="/qr-generation">DEEPART <span className="text-primary">QR</span> </Link>
                    </div>

                    {/* Center: Navbar */}
                    <div className="flex space-x-6 ml-auto">
                        <Link to="/qr-generation" className="hover:underline">QR Menu</Link>

                        <Link to="/add-user" className="hover:underline">Add User</Link>
                    </div>

                    {/* Right side: Profile dropdown */}
                    <div className="relative ml-6" ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center space-x-2 transition-all p-2 rounded-full hover:bg-secondary"
                        >
                            <img
                                src={`${import.meta.env.VITE_API_BASE_URL}${profilePic}`}  // Profile picture URL
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                            />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 bg-backGround transition-all text-textColor rounded-md shadow-lg">
                                <ul className="space-y-2 p-3">
                                    <li>
                                        <Link
                                            to="/settings"
                                            onClick={() => setIsDropdownOpen(false)} // Close dropdown
                                            className="block px-4 py-2 hover:underline"
                                        >
                                            Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsDropdownOpen(false); // Close dropdown
                                            }}
                                            className="w-full text-left px-4 py-2 hover:underline"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </header>
            ) : (
                <header
                    className={`fixed top-0 left-0 w-full z-50 text-center p-4 transition-all duration-300 ${
                        isScrolled ? 'bg-backGround shadow-lg' : 'bg-transparent'
                    }`}
                >
                    <div className="flex justify-center items-center h-16">
                        <h1 className="text-3xl font-bold text-white">DEEPART <span className="text-primary">QR</span> </h1>
                    </div>
                </header>
            )}
        </>
    );
};

export default Header;
