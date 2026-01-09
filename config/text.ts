
interface MessageContent {
    [key: string]: string; // allow extra translation entries without changing the interface
}

export const messages: Record<string, MessageContent> = {
    es: {

        title: "Hipster",
        welcome: "Bienvenido",
        description: "Juego Bíblico basado en Hitster",

        language: "Idioma",
        spanish: "Español",
        english: "English",
    },
    en: {

        title: "Hipster",
        welcome: "Welcome",
        description: "Bible-based Game inspired by Hitster",

        language: "Language",
        spanish: "Español",
        english: "English",
    },
};