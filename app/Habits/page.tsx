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
];

export default function Page() {
  const [index, setIndex] = useState(2);
  const [selectedHabits, setSelectedHabits] = useState([]);
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

  const toggleHabit = () => {
    if (selectedHabits.includes(index)) {
      setSelectedHabits(selectedHabits.filter(i => i !== index));
    } else {
      setSelectedHabits([...selectedHabits, index]);
    }
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
            className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent mb-4"
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
          
          {/* Main Glow Effect */}
          <motion.div
            className={`absolute rounded-full bg-gradient-to-r ${active.gradient} opacity-40 blur-3xl`}
            style={{ width: '380px', height: '380px' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Outer Rotating Ring */}
          <motion.div
            className="absolute rounded-full border border-white/30"
            style={{ width: '360px', height: '360px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Middle Ring */}
          <motion.div
            className="absolute rounded-full border border-white/20"
            style={{ width: '340px', height: '340px' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner Ring with Gradient */}
          <motion.div
            className={`absolute rounded-full bg-gradient-to-r ${active.gradient} opacity-20 blur-xl`}
            style={{ width: '320px', height: '320px' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Main Circle */}
          <div className="relative w-[300px] h-[300px] md:w-[340px] md:h-[340px] rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
            
            {/* Animated Gradient Overlay */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${active.color}, transparent, ${active.color})`,
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Image Container with Animation */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active.image}
                custom={direction}
                variants={variants}
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
                    className="object-contain p-8 md:p-10"
                    sizes="(max-width: 768px) 300px, 340px"
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Selection Badge */}
            {selectedHabits.includes(index) && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
            
          </div>
          
        </div>
        
        {/* Content Section */}
        <div className="text-center mt-12 space-y-4">
          
          {/* Title with Selection */}
          <div className="flex items-center justify-center gap-3">
            <motion.h2
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent cursor-pointer"
              style={{ fontFamily: 'var(--font-display)' }}
              whileHover={{ scale: 1.05 }}
              onClick={toggleHabit}
            >
              {active.label}
            </motion.h2>
            
            <motion.button
              onClick={toggleHabit}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                selectedHabits.includes(index)
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50'
                  : 'bg-white/10 hover:bg-white/20 border border-white/20'
              }`}
            >
              {selectedHabits.includes(index) ? (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </motion.svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </motion.button>
          </div>
          
          <motion.p 
            className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {active.description}
          </motion.p>
          
          {selectedHabits.includes(index) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full"
            >
              <motion.div
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-green-400 text-sm font-medium">Added to your journey</span>
            </motion.div>
          )}
          
        </div>
        
        {/* Navigation */}
        <div className="flex items-center gap-6 mt-12">
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
        
        {/* Progress Section */}
        <motion.div 
          className="mt-12 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{selectedHabits.length}/{habits.length} habits selected</span>
          </div>
          
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(selectedHabits.length / habits.length) * 100}%` }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <motion.div
                className="absolute inset-0 bg-white/30"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </motion.div>
        
      </div>
      
      {/* Floating Action Button */}
      <AnimatePresence>
        {selectedHabits.length > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-8 right-8 z-20 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold shadow-2xl flex items-center gap-3">
              <span>Continue Journey</span>
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
      
    </div>
  );
}