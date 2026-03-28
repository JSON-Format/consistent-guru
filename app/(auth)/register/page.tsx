"use client";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, Eye, EyeOff, Github } from "lucide-react";
import Link from "next/link";
import { showToast } from "@/app/components/appToast";
type Particle = {
  top: number;
  left: number;
  duration: number;
  delay: number;
};

type FormData = {
  name: string;
  email: string;
  password: string;
};


export default function RegisterPage() {
const router = useRouter();
const supabase = createSupabaseBrowserClient();
  const [showPassword, setShowPassword] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

 const onSubmit = async (data: FormData) => {

   if (loading) return; // prevent double click

  setLoading(true);
  const { name, email, password } = data;

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: name
      }
    }
  });

  if (error) {
  showToast.error(error.message);
   setLoading(false);
    return;
  }

 showToast.success("Account created! Check your email 📩");
  setLoading(false);
  router.push("/login");

};
  useEffect(() => {
    const generated = Array.from({ length: 20 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 5
    }));

    setParticles(generated);
  }, []);
  const handleGoogleLogin = async () => {
      if (loading) return;
        setLoading(true);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`,
    },
  });

 if (error) {
  showToast.error(error.message); 
  setLoading(false);
}

};

const handleGithubLogin = async () => {

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`,
    },
  });

  if (error) {
    alert(error.message);
  }
};

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">

      {/* FLOAT ANIMATION */}
      <style>
        {`
        @keyframes float {
          0% { transform: translateY(0); opacity:0 }
          10% { opacity:1 }
          90% { opacity:1 }
          100% { transform: translateY(-100vh); opacity:0 }
        }
      `}
      </style>

      {/* GLOW BACKGROUND */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/30 blur-[150px] rounded-full animate-pulse"></div>

      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-400/30 blur-[150px] rounded-full animate-pulse"></div>

      <div className="absolute w-[700px] h-[700px] bg-green-500/10 blur-[200px] rounded-full"></div>

      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              animation: `float ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      {/* CARD */}
      <div className="relative z-10 w-[420px] p-8 rounded-[var(--radius)] bg-card border border-border shadow-[0_0_60px_rgba(0,255,170,0.15)]">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-xl bg-muted shadow-[0_0_30px_rgba(0,255,170,0.2)] border-2 border-green-500">
            <User className="w-6 h-6 text-primary"/>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center font-display text-white">
          Join Us
        </h1>

        <p className="text-center text-muted-foreground mt-2 mb-6">
          Create your account to get started
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* NAME */}
          <div className="relative mb-4">

            <User className="text-primary absolute left-3 top-3 text-muted-foreground w-5 h-5"/>

            <input
              {...register("name",{ required:"Name required" })}
              placeholder="Full Name"
              className=" placeholder-primary text-white
              border border-primary w-full pl-10 py-3 rounded-lg bg-input  focus:ring-2 focus:ring-primary outline-none"
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}

          </div>

          {/* EMAIL */}
          <div className="relative mb-4">

            <Mail  className="text-primary absolute left-3 top-3 text-muted-foreground w-5 h-5"/>

            <input
              {...register("email",{ required:"Email required" })}
              placeholder="Email Address"
              className="w-full pl-10 py-3 
              rounded-lg bg-input text-white
              focus:ring-2 
              focus:ring-primary outline-none
               placeholder-primary
              border border-primary"
            />

          </div>

          {/* PASSWORD */}
          <div className="relative mb-6">

            <Lock className="text-primary absolute left-3 top-3 text-muted-foreground w-5 h-5"/>

            <input
              type={showPassword ? "text":"password"}
              {...register("password",{ required:"Password required" })}
              placeholder="Password"
              className="
              w-full pl-10 pr-10 py-3 rounded-lg bg-input
               focus:ring-2 focus:ring-primary outline-none
                placeholder-primary
              border border-primary text-white"
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground text-primary"
            >
              {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>

          </div>

         <button
  type="submit"
  disabled={loading}
  className="w-full py-3 rounded-lg font-semibold bg-primary text-primary-foreground shadow-[0_0_30px_rgba(0,255,170,0.4)] disabled:opacity-50"
>
  {loading ? "Creating..." : "Create Account"}
</button>

        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-primary"></div>
          <span className="text-muted-foreground text-sm">
            OR JOIN WITH
          </span>
          <div className="flex-1 h-px bg-primary"></div>
        </div>

        {/* OAUTH */}
        <div className="flex gap-3">

          <button 
            onClick={handleGoogleLogin} 
             disabled={loading}
          className="flex-1 border border-border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary transition  border-green-500 text-white">

            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5"
            />

            Google

          </button>

          <button 
            onClick={handleGithubLogin}
            disabled={loading}
          className="flex-1 border border-border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary transition  border-green-500  text-white">

            <Github className="w-5 h-5  text-white"/>

            GitHub

          </button>

        </div>

        <p className="text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link 
           href="/login"
          className="text-primary font-semibold cursor-pointer"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
