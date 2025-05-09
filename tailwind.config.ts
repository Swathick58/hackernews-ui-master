import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./node_modules/@daveyplate/better-auth-ui/dist/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // also include your app code!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
