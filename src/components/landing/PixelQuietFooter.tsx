/**
 * Blocky, low-detail footer band inspired by cozy pixel landscapes (no external assets).
 */
export function PixelQuietFooter() {
  return (
    <div
      className="relative mt-auto h-44 w-full shrink-0 overflow-hidden md:h-52"
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    >
      {/* sky / sage continuation */}
      <div className="absolute inset-0 bg-[#C7E1D8]" />

      {/* soft clouds */}
      <div className="absolute left-[6%] top-6 h-10 w-24 rounded-sm bg-white/80 shadow-sm md:top-8 md:h-12 md:w-32" />
      <div className="absolute left-[10%] top-10 h-8 w-16 bg-white/70 md:top-12" />
      <div className="absolute right-[18%] top-8 h-9 w-28 bg-white/75 md:top-10" />
      <div className="absolute right-[22%] top-12 h-7 w-14 bg-white/65" />

      {/* distant hills */}
      <div className="absolute bottom-16 left-0 right-0 h-8 bg-[#6a9e7d]/90 md:bottom-20 md:h-10" />
      <div className="absolute bottom-14 left-[15%] h-10 w-[45%] bg-[#5a8f6f] md:bottom-[4.5rem] md:h-12" />
      <div className="absolute bottom-14 right-[10%] h-9 w-[38%] bg-[#4d7f62] md:bottom-[4.5rem]" />

      {/* islands */}
      <div className="absolute bottom-12 left-[12%] h-3 w-20 bg-[#8b7355] md:bottom-14 md:w-24" />
      <div className="absolute bottom-12 right-[20%] h-3 w-16 bg-[#7a6548] md:bottom-14" />

      {/* trees (simple columns) */}
      <div className="absolute bottom-[3.25rem] left-[18%] flex gap-1 md:bottom-16">
        <div className="h-10 w-3 bg-[#2d5a3d]" />
        <div className="h-12 w-3 bg-[#234a32]" />
        <div className="h-8 w-3 bg-[#356b48]" />
      </div>
      <div className="absolute bottom-[3.25rem] right-[26%] flex gap-1 md:bottom-16">
        <div className="h-9 w-3 bg-[#2d5a3d]" />
        <div className="h-11 w-3 bg-[#1e4028]" />
      </div>

      {/* tiny “rabbit” — block shapes */}
      <div className="absolute bottom-[3.35rem] left-[20%] flex items-end gap-0.5 md:bottom-[4.1rem]">
        <div className="h-3 w-3 rounded-[1px] bg-white" />
        <div className="mb-0.5 h-2.5 w-2 rounded-[1px] bg-[#F0625D]" />
      </div>

      {/* water */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#7eb8d4] md:h-14">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#9ecce3]/80" />
      </div>
    </div>
  )
}
