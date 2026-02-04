'use client';

interface CardDataOnlyProps {
    event: string;
    bibleReference: string;
    isAnimating?: boolean;
    isDragging?: boolean;
}

export default function CardDataOnly({ event, bibleReference, isAnimating = false, isDragging = false }: CardDataOnlyProps) {
    return (
        <div className="w-36 md:w-60 h-full " style={{ perspective: '1000px' }}>
            {/* Only Info Side - No Date */}
            <div className={`h-full bg-(--text-light) text-(--text-dark) dark:bg-(--text-dark) dark:text-(--text-light) rounded-lg shadow-lg flex flex-col items-center justify-center p-4 text-center cursor-pointer ${!isDragging ? 'transition-all duration-300 ease-out' : ''} hover:scale-105 card-hover-float ${isAnimating ? 'card-dragging-float' : ''}`}>
                <div className="">
                    <div className="text-[10px] md:text-[13px]  font-bold mb-2 line-clamp-0">{event}</div>
                    <div className="text-[10px] md:text-xs opacity-75">{bibleReference}</div>
                </div>
            </div>
        </div>
    );
}
