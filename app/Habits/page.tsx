"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const habits = [
  { 
    label: "Meditating", 
    description: "Find inner peace through mindful breathing and presence",
    image: "/guru-meditating.png",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    color: "#8B5CF6"
  },
  { 
    label: "Running", 
    description: "Build endurance and release endorphins with every stride",
    image: "/guru-running-new.png",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    color: "#06B6D4"
  },
  { 
    label: "Waking Up", 
    description: "Rise with the sun and embrace the morning energy",
    image: "/guru-waking-up.png",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    color: "#F59E0B"
  },
  { 
    label: "Eating on Time", 
    description: "Nourish your body with mindful, timely meals",
    image: "/guru-eating.png",
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    color: "#10B981"
  },
    {
    label: "Studying",
    description: "Expanding knowledge",
    image: "/guru-studying-new.png",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    color: "#6366F1"
  },
   {
    label: "Planning",
    description: "Organizing the day",
    image: "/guru-planning-new.png",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    color: "#F59E0B"
  },
   {
    label: "Cleaning",
    description: "Tidying the space",
    image: "/guru-cleaning-new.png",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    color: "#10B981"
  },
    {
    label: "Drinking Water",
    description: "Stay hydrated",
    image: "/guru-drinking-water.png",
    gradient: "from-sky-500 via-cyan-500 to-blue-500",
    color: "#0EA5E9"
  },
   {
    label: "Sleeping",
    description: "Rest and recover",
    image: "/guru-sleeping.png",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    color: "#8B5CF6"
  },
   {
    label: "Journaling",
    description: "Reflect and write",
    image: "/guru-journaling.png",
    gradient: "from-rose-500 via-pink-500 to-red-500",
    color: "#F43F5E"
  },
   {
    label: "Screen Limit",
    description: "Mindful tech usage",
    image: "/guru-screen-limit.png",
    gradient: "from-gray-500 via-slate-500 to-gray-700",
    color: "#6B7280"
  },
];

export default function Page() {
  const [index, setIndex] = useState(2);
 
  const [direction, setDirection] = useState(0);

  const active = habits[index];

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % habits.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + habits.length) % habits.length);
  };

 

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? -45 : 45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5,
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
      transition: {
        duration: 0.3,
      },
    }),
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      
      {/* Premium Background with Animated Gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        {/* Animated Orbs */}
        <motion.div 
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px]"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px]"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-600/10 blur-[120px]"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-6xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            Choose Habits
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-lg tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Transform your life • One habit at a time
          </motion.p>
        </motion.div>

        {/* Circle Container */}
  <div className="relative flex items-center justify-center">
  
  {/* Premium Dark Glow */}
  <motion.div
    className={`absolute rounded-full bg-gradient-to-r ${active.gradient} opacity-10 blur-3xl`}
    style={{ width: '500px', height: '500px' }}
    animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
    transition={{ duration: 5, repeat: Infinity }}
  />
  
  {/* Outer Elegant Ring */}
  <motion.div
    className="absolute rounded-full"
    style={{ 
      width: '400px', 
      height: '400px',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.1))',
      borderRadius: '50%',
    }}
    animate={{ rotate: 360 }}
    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
  />
  
  {/* Main Glass Circle */}
  <div className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px] rounded-full bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden">
    
    {/* Inner Glow */}
    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${active.gradient} opacity-15`} />
    
    {/* Rotating Light */}
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{
        background: `radial-gradient(circle at 30% 30%, ${active.color}15, transparent 70%)`,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 12, repeat: Infinity }}
    />
    
    {/* Image */}
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={active.image}
        custom={direction}
        variants={{
          enter: (d) => ({ x: d > 0 ? 120 : -120, opacity: 0, scale: 0.6 }),
          center: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 500, damping: 40 } },
          exit: (d) => ({ x: d > 0 ? -120 : 120, opacity: 0, scale: 0.6, transition: { duration: 0.2 } }),
        }}
        initial="enter"
        animate="center"
        exit="exit"
        className="absolute inset-0"
      >
        <div className="relative w-full h-full">
          <Image
            src={active.image}
            alt={active.label}
            fill
            className="object-contain p-10 drop-shadow-2xl"
            priority
          />
        </div>
      </motion.div>
    </AnimatePresence>
    
    {/* Subtle Shimmer */}
    <motion.div
      className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent"
      animate={{ x: ["-100%", "100%"], y: ["-100%", "100%"] }}
      transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.5 }}
    />
    
    {/* Border Accent */}
    <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />
    
  </div>
  
  {/* Subtle Orbiting Dots */}
  <motion.div
    className="absolute rounded-full"
    style={{ width: '430px', height: '430px' }}
    animate={{ rotate: -360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-white/20"
        style={{
          top: '50%',
          left: '50%',
          transform: `rotate(${i * 30}deg) translateX(215px)`,
        }}
      />
    ))}
  </motion.div>
  
  {/* Outer Thin Rings */}
  <div className="absolute rounded-full border-2 border-white/5" style={{ width: '460px', height: '460px' }} />
</div>
        
        {/* Content Section */}
        <div className="text-center mt-12 space-y-4">
          
          {/* Title with Selection */}
          <div className="flex items-center justify-center gap-3">
            <motion.h2
              className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent cursor-pointer"
              style={{ fontFamily: 'var(--font-display)' }}
              whileHover={{ scale: 1.05 }}  
            >
              {active.label}
            </motion.h2>
          </div>
          
          <motion.p 
            className="text-gray-300  max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {active.description}
          </motion.p>
          
        </div>
        
        {/* Navigation */}
        <div className="flex items-center gap-6 mt-5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            className="group relative w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          {/* Indicator Dots */}
          <div className="flex gap-3">
            {habits.map((habit, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                whileHover={{ scale: 1.2 }}
                className="relative"
              >
                <div className={`h-2 rounded-full transition-all duration-300 ${
                  i === index 
                    ? `w-8 bg-gradient-to-r ${habit.gradient}` 
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`} />
                {i === index && (
                  <motion.div
                    layoutId="activeDot"
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${habit.gradient} blur-sm`}
                  />
                )}
              </motion.button>
            ))}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="group relative w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-l from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
        
        
      
        
      </div>
      
      
    </div>
  );
}