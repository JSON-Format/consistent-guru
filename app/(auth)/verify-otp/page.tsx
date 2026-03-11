"use client";

import { useEffect, useRef, useState } from "react";
import { Link, MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import Links from "next/link";

type Particle = {
  top: number;
  left: number;
  duration: number;
  delay: number;
};

type FormData = {
  otp: string;
};

export default function VerifyOTPPage() {

  const { handleSubmit, setValue } = useForm<FormData>();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const [timer, setTimer] = useState(30);
  const [particles, setParticles] = useState<Particle[]>([]);

  const onSubmit = () => {
    const finalOTP = otp.join("");
    console.log("OTP:", finalOTP);
  };

  /* OTP CHANGE */
  const handleChange = (value: string, index: number) => {

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    setValue("otp", newOtp.join(""));
  };

  /* BACKSPACE */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  /* PASTE OTP */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {

    const pasteData = e.clipboardData.getData("text").slice(0,6);

    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);

    newOtp.forEach((num, i) => {
      if(inputs.current[i]){
        inputs.current[i]!.value = num;
      }
    });

    setValue("otp", newOtp.join(""));
  };

  /* TIMER */
  useEffect(() => {

    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

  }, [timer]);

  /* PARTICLES */
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
        <div className="flex justify-center mb-6 ">
          <div className="p-4 rounded-xl bg-muted shadow-[0_0_30px_rgba(0,255,170,0.2)] border-2 border-green-500">
            <MailCheck className="w-6 h-6 text-primary"/>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center font-display text-white">
          Verify Email
        </h1>

        <p className="text-center text-muted-foreground mt-2 mb-6">
          We've sent a 6-digit code to your email.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* OTP BOXES */}
          <div className="flex justify-between gap-2 mb-4">

            {otp.map((digit, index) => (

              <input
                key={index}
                maxLength={1}
                ref={(el) => { inputs.current[index] = el; }}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="
                  w-12
                  h-12
                  text-center
                  text-lg
                  rounded-lg
                  bg-input
                  border border-primary
                  focus:ring-2
                  focus:ring-primary
                  outline-none
                  text-white
                  mt-1
                  mb-3
                "
              />

            ))}

          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-primary text-primary-foreground shadow-[0_0_30px_rgba(0,255,170,0.4)]"
          >
            Verify & Proceed
          </button>

        </form>

        {/* RESEND */}
        <div className="text-center mt-6 text-sm text-muted-foreground">

          {timer > 0 ? (
            <p>
              Didn't receive the code?{" "}
              <span className="text-primary">
                Resend 00:{timer.toString().padStart(2,"0")}
              </span>
            </p>
          ) : (
            <button
              className="text-primary font-semibold"
              onClick={()=>setTimer(30)}
            >
              Resend Code
            </button>
          )}

        </div>

        {/* BACK */}
        <div className="text-center mt-4">
          <Links href="/register" className="text-muted-foreground hover:text-primary">
            ← Back to Registration
          </Links>
        </div>

      </div>
    </div>
  );
}