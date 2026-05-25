import Link from 'next/link';

interface CTAButton {
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
}

interface HeroTextProps {
    name: string;
    subtitle: string;
    description: string;
    ctaButtons: CTAButton[];
    isRTL: boolean;
}

export default function HeroText({
    name,
    subtitle,
    description,
    ctaButtons,
    isRTL,
}: HeroTextProps) {
    const alignmentClass = isRTL ? 'lg:text-right' : 'lg:text-left';
    const justifyClass = isRTL ? 'lg:justify-start' : 'lg:justify-start'; // هر دو از استارت چیده میشن

    return (
        <div className={`flex-1 text-center ${alignmentClass} space-y-6`}>
            
                {/* Name */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {name}  
                </h1>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl text-gray-400 font-medium">
                    {subtitle}
                </p>

                {/* Description */}
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 whitespace-pre-line">
                    {description}
                </p>

                {/* CTA Buttons */}
                <div
                    className={`flex flex-wrap items-center justify-center ${justifyClass} gap-4 pt-4`}
                >
                    {ctaButtons.map((button) => (
                        <Link
                            key={button.href}
                            href={button.href}
                            className={
                                button.variant === 'primary'
                                    ? 'bg-[#E0E0E0] text-[#1E1E24] px-8 py-3 rounded-lg font-medium hover:bg-white transition-all duration-300 shadow-lg shadow-black/20'
                                    : 'bg-[#1E1E24] text-gray-300 px-8 py-3 rounded-lg font-medium border border-gray-700 hover:bg-[#2a2a35] hover:text-white transition-all duration-300'
                            }
                        >
                            {button.label}
                        </Link>
                    ))}
                </div>
        </div>
    );
}