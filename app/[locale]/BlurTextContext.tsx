'use client';

import { createContext, useContext } from 'react';

interface BlurTextContextType {
    showBlurText: boolean;
}

const BlurTextContext = createContext<BlurTextContextType | undefined>(undefined);

export function BlurTextProvider({
    children,
    showBlurText,
}: {
    children: React.ReactNode;
    showBlurText: boolean;
}) {
    return (
        <BlurTextContext.Provider value={{ showBlurText }}>
            {children}
        </BlurTextContext.Provider>
    );
}

export function useBlurText() {
    const context = useContext(BlurTextContext);
    if (context === undefined) {
        throw new Error('useBlurText must be used within BlurTextProvider');
    }
    return context;
}
