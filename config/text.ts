

import es from '@/messages/es.json';
import en from '@/messages/en.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageContent = Record<any, any>;

export const messages = {
    es: es as MessageContent,
    en: en as MessageContent,
} as const;