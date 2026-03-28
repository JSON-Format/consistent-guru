"use client";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, Github } from "lucide-react";
import Link from "next/link";
import { showToast } from "@/app/components/appToast";
type Particle = {
  top: number;
  left: number;
  duration: number;
  delay: number;
};

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();
const supabase = createSupabaseBrowserClient();

  const [showPassword, setShowPassword] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

 const onSubmit = async (data: FormData) => {
 if (loginLoading) return;
  setLoginLoading(true);
  const { email, password } = data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showToast.error(error.message);
     setLoginLoading(false);
    return;
  }

   showToast.success("Login successful 🎉");
   setLoginLoading(false);

  // router.push("/habit");
  const { data: userData } = await supabase.auth.getUser();
const user = userData.user;

if (!user) return;

// 🔥 check habits
const { data: habits } = await supabase
  .from("habits")
  .select("id")
  .eq("user_id", user.id);

if (habits && habits.length > 0) {
  router.push("/tracker"); // ✅ has habit
} else {
  router.push("/habit"); // ❌ no habit
}
};

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 6 + Math.random() * 5,
      delay: Math.random() * 5,
    }));

    setParticles(generated);
  }, []);

const [loading, setLoading] = useState(false);
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
    alert(error.message);
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

      {/* Floating animation */}
      <style>
        {`
        @keyframes float {
          0% { transform: translateY(0); opacity:0; }
          10% { opacity:1; }
          90% { opacity:1; }
          100% { transform: translateY(-100vh); opacity:0; }
        }
      `}
      </style>

      {/* Glow Background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/30 blur-[150px] rounded-full animate-pulse"></div>

      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-400/30 blur-[150px] rounded-full animate-pulse"></div>

      <div className="absolute w-[700px] h-[700px] bg-green-500/10 blur-[200px] rounded-full"></div>

      {/* Floating Particles */}
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

      {/* LOGIN CARD */}
      <div className="relative z-10 w-[420px] p-8 rounded-[var(--radius)] bg-card text-card-foreground border border-border shadow-[0_0_60px_rgba(0,255,170,0.15)] backdrop-blur-xl">

        {/* Icon */}
        <div className="flex justify-center mb-6   ">
          <div className="p-4 rounded-xl bg-muted shadow-[0_0_30px_rgba(0,255,170,0.2)]  border-2 border-green-500">
            <Lock className="w-6 h-6 text-primary"/>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center font-display ">
          Welcome
        </h1>

        <p className="text-center text-muted-foreground mt-2 mb-6">
          Enter your credentials to access your account
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* EMAIL */}
          <div className="relative mb-4">

            <Mail className="absolute left-3 top-3 text-muted-foreground w-5 h-5 text-primary"/>

            <input
             type="email"
              {...register("email", {
                required: "Email is required"
              })}
              placeholder="Email Address"
              className="
              w-full
              pl-10
              py-3
              rounded-lg
              bg-input
               placeholder-primary
              border border-primary
              focus:ring-2
              focus:ring-primary
              outline-none
              transition
            
            "
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}

          </div>

          {/* PASSWORD */}
          <div className="relative mb-3">

            <Lock className="absolute left-3 top-3 text-muted-foreground w-5 h-5 text-primary" />

            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required"
              })}
              placeholder="Password"
              className="
              w-full
              placeholder-primary
              pl-10
              pr-10
              py-3
              rounded-lg
              bg-input
              border border-primary
              focus:ring-2
              focus:ring-primary
              outline-none
        
            "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground text-primary"
            >
              {showPassword ? <EyeOff  size={20}/> : <Eye size={20}/>}
            </button>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}

          </div>

          <div onClick={() => router.push("/forget-password")} className="text-right text-sm text-muted-foreground mb-6 hover:text-primary cursor-pointer">
            Forgot Password?
          </div>

          {/* SIGN IN */}
          <button
             type="submit"
  disabled={loginLoading}
            className="
            w-full
            py-3
            rounded-lg
            font-semibold
            bg-primary
            text-primary-foreground
            shadow-[0_0_30px_rgba(0,255,170,0.4)]
            hover:scale-[1.02]
            transition
          "
          >
            Sign In
          </button>

        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border bg-primary"></div>

          <span className="text-muted-foreground text-sm">
            OR CONTINUE WITH
          </span>

          <div className="flex-1 h-px bg-primary"></div>
        </div>

        {/* OAUTH */}
        <div className="flex gap-3">

          <button
            onClick={handleGoogleLogin} 
             disabled={loading}
          className="flex-1 border border-border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary transition  border-green-500">

            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5"
            />

            Google

          </button>

          <button 
          onClick={handleGithubLogin}
          className="flex-1 border border-border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary transition  border-green-500">

            <Github className="w-5 h-5"/>

            GitHub

          </button>

        </div>

      <p className="text-center text-muted-foreground mt-6">
  New here?{" "}
  <Link
    href="/register"
    className="text-primary font-semibold cursor-pointer"
  >
    Create an account
  </Link>
</p>

      </div>

    </div>
  );
}