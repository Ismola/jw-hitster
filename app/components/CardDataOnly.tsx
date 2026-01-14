'use client';

interface CardDataOnlyProps {
    event: string;
    bibleReference: string;
    isAnimating?: boolean;
    isDragging?: boolean;
}

export default function CardDataOnly({ event, bibleReference, isAnimating = false, isDragging = false }: CardDataOnlyProps) {
    return (
        <div className="w-36 h-64 md:w-48 md:h-72" style={{ perspective: '1000px' }}>
            {/* Only Info Side - No Date */}
            <div className={`h-full bg-linear-to-br from-purple-600 to-purple-800 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 text-center cursor-pointer ${!isDragging ? 'transition-all duration-300 ease-out' : ''} hover:scale-105 card-hover-float ${isAnimating ? 'card-dragging-float' : ''}`}>
                <div className="text-white">
                    <div className="text-base md:text-lg font-bold mb-2">{event}</div>
                    <div className="text-[10px] md:text-xs opacity-75">{bibleReference}</div>
                </div>
            </div>
        </div>
    );
}
