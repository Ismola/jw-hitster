

import es from '@/messages/es.json';
import en from '@/messages/en.json';

export type MessageContent = Record<string, string>;

export const messages = {
    es: es as MessageContent,
    en: en as MessageContent,
} as const;