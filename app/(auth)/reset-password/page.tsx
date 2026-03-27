"use client";
import { createSupabaseBrowserClient } from "../../lib/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Lock, Eye, EyeOff } from "lucide-react";
import Links from "next/link";
import toast from "react-hot-toast";
type Particle = {
  top: number;
  left: number;
  duration: number;
  delay: number;
};

type FormData = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {

  const supabase = createSupabaseBrowserClient();
const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>();

  const password = watch("password");

  const onSubmit = async (data: FormData) => {

  const { error } = await supabase.auth.updateUser({
    password: data.password,
  });

  if (error) {
   toast.error(error.message);
    return;
  }

toast.success("Password updated successfully!");

  router.push("/login");

};
useEffect(() => {

  const checkSession = async () => {

    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      alert("Reset link expired or invalid");
      router.push("/forget-password");
    }

  };

  checkSession();

}, []);

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 5
    }));

    setParticles(generated);
  }, []);

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

      {/* BACKGROUND GLOW */}
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
          <div className="p-4 rounded-xl bg-muted shadow-[0_0_30px_rgba(0,255,170,0.2)] border-2 border-primary">
            <Lock className="w-6 h-6 text-primary"/>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center font-display text-white">
          Set New Password
        </h1>

        <p className="text-center text-muted-foreground mt-2 mb-6">
          Choose a strong password for your account.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* NEW PASSWORD */}
          <div className="relative mb-4">

            <Lock className="text-primary absolute left-3 top-3 text-muted-foreground w-5 h-5"/>

            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required"
              })}
              placeholder="New Password"
              className="text-white w-full pl-10 pr-10 py-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none placeholder-primary
              border border-primary"
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground text-primary"
            >
              {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}

          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative mb-6">

            <Lock className="text-primary absolute left-3 top-3 text-muted-foreground w-5 h-5"/>

            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Confirm password required",
                validate: (value) =>
                  value === password || "Passwords do not match"
              })}
              placeholder="Confirm New Password"
              className="text-white w-full pl-10 pr-10 py-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none placeholder-primary
              border border-primary"
            />

            <button
              type="button"
              onClick={()=>setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-muted-foreground text-primary"
            >
              {showConfirm ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-primary text-primary-foreground shadow-[0_0_30px_rgba(0,255,170,0.4)]"
          >
            Update Password
          </button>

        </form>

        {/* BACK LINK */}
        <div className="text-center mt-6">
<Links href="/login" className="text-muted-foreground hover:text-primary">
            ← Back to Sign In
          </Links>

        </div>

      </div>

    </div>
  );
}