'use client';

interface CardBothSidesProps {
    date: string;
    event: string;
    bibleReference: string;
}

export default function CardBothSides({ date, event, bibleReference }: CardBothSidesProps) {
    return (
        <div className="flex flex-col gap-2 h-64 w-48">
            {/* Date Side */}
            <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg flex items-center justify-center p-2 text-center">
                <div className="text-white">
                    <div className="text-3xl font-bold">{date}</div>
                </div>
            </div>

            {/* Info Side */}
            <div className="flex-1 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg shadow-lg flex flex-col items-center justify-center p-2 text-center">
                <div className="text-white">
                    <div className="text-sm font-bold mb-1">{event}</div>
                    <div className="text-xs opacity-75">{bibleReference}</div>
                </div>
            </div>
        </div>
    );
}
