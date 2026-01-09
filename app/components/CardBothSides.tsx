'use client';

interface CardBothSidesProps {
    date: string;
    event: string;
    bibleReference: string;
    bcText: string;
    adText: string;
}

export default function CardBothSides({ date, event, bibleReference, bcText, adText }: CardBothSidesProps) {
    // Format date with BC/AD
    const formatDate = (dateStr: string) => {
        const year = parseInt(dateStr);
        if (year < 0) {
            return `${Math.abs(year)} ${bcText}`;
        } else {
            return `${year} ${adText}`;
        }
    };

    return (
        <div className="w-48 h-64 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg shadow-lg flex flex-col p-4 text-white relative overflow-hidden">
            {/* Date Badge */}
            <div className="absolute top-0 left-0 right-0 bg-blue-600 py-2 px-4 text-center">
                <div className="text-2xl font-bold">{formatDate(date)}</div>
            </div>

            {/* Event Content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
                <div className="text-sm font-bold mb-2">{event}</div>
                <div className="text-xs opacity-75">{bibleReference}</div>
            </div>
        </div>
    );
}
