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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();

  const latestOrderId = user?.orders?.[0]?._id || null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r from-red-500 to-red-600 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
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
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    navigationMenuTriggerStyle(),
                    "text-white hover:text-red-200 bg-transparent hover:bg-red-600/20"
                  )}>
                    <FiHome className="w-4 h-4 mr-2" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {isLoggedIn ? (
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white hover:text-red-200 bg-transparent hover:bg-red-600/20">
                    <FiUser className="w-4 h-4 mr-2" />
                    Dashboard
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[200px]">
                      <li>
                        <Link href="/dashboard" legacyBehavior passHref>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="flex items-center text-sm font-medium">
                              <FiUser className="w-4 h-4 mr-2" />
                              Dashboard
                            </div>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link href="/orders" legacyBehavior passHref>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="flex items-center text-sm font-medium">
                              <FiShoppingBag className="w-4 h-4 mr-2" />
                              Orders
                            </div>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      {user?.role === 'admin' && (
                        <li>
                          <Link href="/admin" legacyBehavior passHref>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="flex items-center text-sm font-medium">
                                <FiSettings className="w-4 h-4 mr-2" />
                                Admin Panel
                              </div>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      )}
                      <li>
                        <button
                          onClick={logout}
                          className="w-full flex items-center text-sm font-medium rounded-md p-3 leading-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <FiLogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <>
                  <NavigationMenuItem>
                    <Link href="/login" legacyBehavior passHref>
                      <NavigationMenuLink className={cn(
                        navigationMenuTriggerStyle(),
                        "text-white hover:text-red-200 bg-transparent hover:bg-red-600/20"
                      )}>
                        <FiLogIn className="w-4 h-4 mr-2" />
                        Login
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="ml-2">
                    <Link href="/register" legacyBehavior passHref>
                      <Button variant="secondary" className="bg-white text-red-600 hover:bg-red-50 shadow-md hover:shadow-lg">
                        Register
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-red-600/20">
                <FiMenu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 py-4">
                <Link
                  href="/"
                  className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
                >
                  <FiHome className="mr-2 h-4 w-4" />
                  Home
                </Link>
                
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
                    >
                      <FiUser className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
                    >
                      <FiShoppingBag className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
                      >
                        <FiSettings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent text-left w-full"
                    >
                      <FiLogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
                    >
                      <FiLogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center px-3 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}