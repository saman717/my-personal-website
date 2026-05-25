export default function HeroBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* نقطه بالا وسط */}
            <div className="absolute top-[15%] left-[55%] w-24 h-24 bg-[#2a2a3a] rounded-full opacity-40 blur-xl transform -translate-x-1/2" />

            {/* نقطه وسط راست */}
            <div className="absolute top-[40%] right-[10%] w-16 h-16 bg-[#2a2a3a] rounded-full opacity-30 blur-lg" />

            {/* نقطه پایین چپ */}
            <div className="absolute bottom-[20%] left-[15%] w-20 h-20 bg-[#2a2a3a] rounded-full opacity-30 blur-xl" />

            {/* نقطه پایین راست */}
            <div className="absolute bottom-[10%] right-[30%] w-12 h-12 bg-[#2a2a3a] rounded-full opacity-20 blur-md" />

            {/* نقطه کوچک بالا چپ */}
            <div className="absolute top-[25%] left-[10%] w-8 h-8 bg-[#2a2a3a] rounded-full opacity-20 blur-sm" />
        </div>
    );
}