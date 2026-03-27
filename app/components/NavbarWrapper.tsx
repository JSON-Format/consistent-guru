"use client";

import { usePathname } from "next/navigation";
import AppNavbar from "./appNavbar";
import { AppToaster } from "./appToast";

export default function NavbarWrapper() {

  const pathname = usePathname();

  const hideNavbar =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
     pathname.startsWith("/forget-password") ||
     pathname.startsWith("/reset-password") 
     || pathname.startsWith("/habit")
      ;

  if (hideNavbar) return null;

  return <>
   <AppToaster /> 
  <AppNavbar />
  </>
  
}