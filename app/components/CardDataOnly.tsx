'use client';

interface CardDataOnlyProps {
    event: string;
    bibleReference: string;
}

export default function CardDataOnly({ event, bibleReference }: CardDataOnlyProps) {
    return (
        <div className="w-36 h-48 md:w-48 md:h-64">
            {/* Only Info Side - No Date */}
            <div className="h-full bg-linear-to-br from-purple-600 to-purple-800 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 text-center">
                <div className="text-white">
                    <div className="text-base md:text-lg font-bold mb-2">{event}</div>
                    <div className="text-[10px] md:text-xs opacity-75">{bibleReference}</div>
                </div>
            </div>
        </div>
    );
}
