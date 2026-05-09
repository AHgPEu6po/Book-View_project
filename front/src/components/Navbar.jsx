import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { AppContext } from "../context/AppContext";

const Navbar = () => {

    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const { setShowLogin, token, logout, userData, navigate } = useContext(AppContext);

    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setProfileOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])
    
  return (
    <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24 
    xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all 
    ${location.pathname === "/" && "bg-light"}`}>
        <Link to='/'>
            <img src={assets.logo} alt="logo" className="h-8 px-8"/>
        </Link>

        <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 
        max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row 
        items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all 
        duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-white"} 
        ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
            {menuLinks.map((link, index)=> (
                <Link key={index} to={link.path}>
                    {link.name}
                </Link>
            ))}

            <div className='flex items-start sm:items-center gap-6'>
                {!token ? (
                    <button onClick={()=> setShowLogin(true)} className='cursor-pointer px-8 py-2 bg-primary 
                    hover:bg-primary-dull transition-all text-white rounded-lg'>Log in</button>
                ):(
                    <div className='flex gap-4'>
                        <div className="relative">

                            <img src={assets.profile} alt="profile" className="h-8 w-8 cursor-pointer rounded-full"
                                onClick={() => setProfileOpen(!profileOpen)}
                            />

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">

                                    <button
                                        onClick={() => { navigate("/profile"), setProfileOpen(false) }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Профіль
                                    </button>
                                    <button
                                        onClick={() => { navigate("/tickets"), setProfileOpen(false) }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Мої квитки
                                    </button>

                                    <button
                                        onClick={() => { navigate("/history"), setProfileOpen(false) }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Історія
                                    </button>

                                    <button onClick={() => { logout(), setProfileOpen(false) }}
                                        className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <img src={assets.cart} alt="cart" className="h-8 w-8 cursor-pointer"
                                onClick={() => navigate("/cart")}
                            />
                        </div>
                    </div>
                )}
                
            </div>
        </div>

        <button className='sm:hidden cursor-pointer' aria-label='Menu' onClick={()=> setOpen(!open)}>
            <img className='w-7' src={open ? assets.close : assets.menu} alt="menu" />
        </button>

    </div>
  )
}

export default Navbar
