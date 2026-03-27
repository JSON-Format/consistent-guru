"use client";
import { createSupabaseBrowserClient } from "../../lib/client";
import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import toast from "react-hot-toast";

type FormData = {
  email: string;
};

type Particle = {
  top: number;
  left: number;
  duration: number;
  delay: number;
};

export default function ForgotPasswordPage() {
  const supabase = createSupabaseBrowserClient();

  const { register, handleSubmit, formState:{errors} } = useForm<FormData>();

  const [particles, setParticles] = useState<Particle[]>([]);
  const [timer, setTimer] = useState(0);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

 const onSubmit = async (data: FormData) => {

  setLoading(true);

  // const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
  //   // redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`
    
  // });

 await supabase.auth.resetPasswordForEmail(data.email, {
  redirectTo: "http://localhost:3000/callback?flow=reset",
});

 
  setLoading(false);

  // if (error) {
  //   alert(error.message);
  //   return;
  // }
    toast.success("Reset link sent to your email 📩");
  setSent(true);
  setTimer(30);

};

  /* TIMER */
  useEffect(()=>{

    if(timer === 0) return;

    const interval = setInterval(()=>{
      setTimer((prev)=>prev-1);
    },1000);

    return ()=>clearInterval(interval);

  },[timer]);

  /* FLOAT PARTICLES */
  useEffect(()=>{

    const generated = Array.from({length:20}).map(()=>({
      top: Math.random()*100,
      left: Math.random()*100,
      duration:5+Math.random()*5,
      delay:Math.random()*5
    }));

    setParticles(generated);

  },[]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">

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

      {/* Glow Background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/30 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-400/30 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute w-[700px] h-[700px] bg-green-500/10 blur-[200px] rounded-full"></div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p,i)=>(
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              top:`${p.top}%`,
              left:`${p.left}%`,
              animation:`float ${p.duration}s linear infinite`,
              animationDelay:`${p.delay}s`
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="relative z-10 w-[420px] p-8 rounded-[var(--radius)] bg-card border border-border shadow-[0_0_60px_rgba(0,255,170,0.15)]">

        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-xl bg-muted shadow-[0_0_30px_rgba(0,255,170,0.2)] border-2 border-green-500">
            <Mail className="w-6 h-6 text-primary"/>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center font-display text-white">
          Forgot Password
        </h1>

        <p className="text-center text-muted-foreground mt-2 mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="relative mb-4">

            <Mail className="text-primary absolute left-3 top-3 w-5 h-5"/>

            <input
              {...register("email",{required:"Email required"})}
              placeholder="Email Address"
              className="
              w-full
              pl-10
              py-3
              rounded-lg
              bg-input
              placeholder-primary
              focus:ring-2
              focus:ring-primary
              outline-none
              text-white
              border border-primary
              "
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}

            {sent && (
              <p className="text-green-400 text-sm mt-2">
                If that email exists, we’ve sent a reset link.
              </p>
            )}

          </div>

          <button
            type="submit"
            disabled={loading || timer>0}
            className="
            w-full
            py-3
            rounded-lg
            font-semibold
            bg-primary
            text-primary-foreground
            shadow-[0_0_30px_rgba(0,255,170,0.4)]
            disabled:opacity-50
            "
          >
            {loading
              ? "Sending..."
              : timer>0
              ? `Send Again in ${timer}s`
              : "Send Reset Link"}
          </button>

        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-muted-foreground hover:text-primary">
            ← Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}