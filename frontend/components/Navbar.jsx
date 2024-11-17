'use client'
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState } from "react";
import { 
  FiLogIn, 
  FiLogOut, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiHome,
  FiShoppingBag,
  FiSettings,
  FiHelpCircle
} from "react-icons/fi";
import { Transition } from "@headlessui/react";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-red-500 to-red-600 py-4 shadow-xl relative z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-white hover:opacity-90 transition-opacity"
            >
              <FiShoppingBag className="w-8 h-8" />
              <span className="text-2xl font-extrabold hidden sm:block">Restaurant App</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white hover:text-red-200 transition-colors duration-200 flex items-center space-x-1"
            >
              <FiHome className="w-5 h-5" />
              <span>Home</span>
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-white hover:text-red-200 transition-colors duration-200 flex items-center space-x-1"
                >
                  <FiUser className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="text-white hover:text-red-200 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <img
                      src={user?.avatar || "data:image/jpeg;base64,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"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                    <span>{user?.name || 'User'}</span>
                  </button>

                  <Transition
                    show={showProfileMenu}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1">
                      {user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className=" px-4 py-2 text-gray-700 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <FiSettings className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className=" w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </Transition>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-red-200 transition-colors duration-200 flex items-center space-x-1"
                >
                  <FiLogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-red-200 transition-colors duration-200"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <Transition
          show={isOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-lg rounded-b-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              >
                Home
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </Transition>
      </div>
    </nav>
  );
}