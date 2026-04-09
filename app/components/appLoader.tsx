export default function OrbitLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">

      {/* 👇 SIZE INCREASED HERE */}
      <div className="relative flex items-center justify-center h-44 w-44">

        {/* Outer faint circle */}
        <div className="absolute inset-0 rounded-full border border-green-500/10" />

        {/* Outer rotating arc */}
        <div
          className="absolute inset-0 rounded-full border-[3px] animate-spin"
          style={{
            borderColor: "transparent transparent transparent #22c55e",
            animationDuration: "2.5s",
          }}
        />

        {/* Middle */}
        <div className="absolute inset-6 rounded-full border border-green-500/10" />
        <div
          className="absolute inset-6 rounded-full border-[3px] animate-spin"
          style={{
            borderColor: "#4ade80 transparent transparent transparent",
            animationDirection: "reverse",
            animationDuration: "2s",
          }}
        />

        {/* Inner */}
        <div className="absolute inset-12 rounded-full border border-green-500/10" />
        <div
          className="absolute inset-12 rounded-full border-[3px] animate-spin"
          style={{
            borderColor: "transparent transparent #16a34a transparent",
            animationDuration: "1.2s",
          }}
        />

        {/* Center dot bigger */}
        <div className="h-4 w-4 rounded-full bg-green-400 animate-pulse shadow-[0_0_15px_#22c55e]" />

      </div>

      {/* Text spacing also adjust */}
      <div className="absolute mt-56 text-center">
        <p className="text-green-400 tracking-widest text-sm">LOADING</p>

        <div className="flex justify-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-green-600 animate-bounce" />
        </div>
      </div>

    </div>
  );
}