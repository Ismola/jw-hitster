'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SuccessContextType {
    triggerSuccess: () => void;
    triggerError: () => void;
    isSuccess: boolean;
    isError: boolean;
}

const SuccessContext = createContext<SuccessContextType | undefined>(undefined);

export function SuccessProvider({ children }: { children: ReactNode }) {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const triggerSuccess = () => {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 1500); // Vuelve a false después de 1.5 segundos
    };

    const triggerError = () => {
        setIsError(true);
        setTimeout(() => setIsError(false), 1500); // Vuelve a false después de 1.5 segundos
    };

    return (
        <SuccessContext.Provider value={{ triggerSuccess, triggerError, isSuccess, isError }}>
            {children}
        </SuccessContext.Provider>
    );
}

export function useSuccess() {
    const context = useContext(SuccessContext);
    if (context === undefined) {
        throw new Error('useSuccess must be used within a SuccessProvider');
    }
    return context;
}
