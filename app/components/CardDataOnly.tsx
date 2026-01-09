'use client';

interface CardDataOnlyProps {
    event: string;
    bibleReference: string;
}

export default function CardDataOnly({ event, bibleReference }: CardDataOnlyProps) {
    return (
        <div className="h-64 w-48">
            {/* Only Info Side - No Date */}
            <div className="h-full bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 text-center">
                <div className="text-white">
                    <div className="text-lg font-bold mb-2">{event}</div>
                    <div className="text-xs opacity-75">{bibleReference}</div>
                </div>
            </div>
        </div>
    );
}
