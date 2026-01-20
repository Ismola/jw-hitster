import type { Config } from "tailwindcss";

import lineClamp from '@tailwindcss/line-clamp';

const config: Config = {
    darkMode: "class",
    plugins: [lineClamp],
};

export default config;
