"use client";
import { createSupabaseBrowserClient } from "../lib/client";
import { useEffect, useState } from "react";
import { FiLogIn } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AppNavbar() {
    const supabase = createSupabaseBrowserClient();
const [user, setUser] = useState<any>(null);

  const router = useRouter();
 useEffect(() => {

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  getUser();

  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setUser(session?.user ?? null);
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };

}, []);

const logout = async () => {
  await supabase.auth.signOut();
  router.push("/login");
};

  return (

    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card backdrop-blur-md p-1">

      <div className="h-14 flex items-center justify-between">

        {/* Left side → Logo */}

        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-lg font-semibold cursor-pointer pl-5"
        >

          <div className="w-10 h-10 rounded-full overflow-hidden">

            <Image
              src="/guru-meditate.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-cover"
            />

          </div>

          <span className="font-display">
            <span className="text-primary">Stay</span>{" "}
            <span className="text-white">Consistent</span>
          </span>

        </div>


        {/* Right side → Account */}

        <div className="relative group">

          {/* Account Icon */}

          <div className="p-2 rounded-full hover:bg-muted transition cursor-pointer">

            {user ? (

<img
  src={
    user?.user_metadata?.avatar_url || 
    `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`
  }
  className="w-9 h-9 rounded-full object-cover border border-primary"
/>

) : (

  <FaUserCircle
    size={30}
    className="text-muted-foreground group-hover:text-primary"
  />

)}

          </div>


          {/* Dropdown */}

          <div className="
          absolute right-0 top-full mt-0 w-content
          bg-card border border-border
          rounded-lg shadow-lg overflow-hidden
          opacity-0 invisible
          group-hover:opacity-100 group-hover:visible
          transition
          border-primary
          ">


            {user ? (

  <>

 {/* Account info */}
 <div className="px-4 py-3 border-b border-border">

   <p className="text-sm text-muted-foreground">
     Account
   </p>
   

   <p className="text-sm font-medium text-primary truncate">
     {user?.email}
   </p>
   {/* <p className="text-xs text-muted-foreground truncate">
  {user?.user_metadata?.full_name || "User"}
</p> */}

 </div>

 {/* Logout */}
 <button
   onClick={logout}
   className="
   flex items-center gap-3
   w-full px-4 py-3 text-sm
   hover:bg-muted transition
   text-red-500
   border border-t-primary
   "
 >
   <span>↪</span>
   Sign Out
 </button>

</>

) : (

  <button
    onClick={() => router.push("/login")}
    className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted text-primary"
  >
    <FiLogIn className="text-primary"/>
    Login / Sign Up
  </button>

)}

          </div>

        </div>

      </div>

    </nav>

  );
}