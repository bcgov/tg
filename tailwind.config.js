/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  purge: [
    './src/**/*.html',
    './src/**/*.js',
  ],
  darkMode: [
    "variant",
    [
      "@media (prefers-color-scheme: dark) { &:not(.light *) }",
      "&:is(.dark *)",
    ],
  ],
  theme: {
    fontSize: {
      xs: [
        "0.75rem",
        {
          lineHeight: "1rem",
        },
      ],
      sm: [
        "0.875rem",
        {
          lineHeight: "1.5rem",
        },
      ],
      base: [
        "1rem",
        {
          lineHeight: "1.75rem",
        },
      ],
      lg: [
        "1.125rem",
        {
          lineHeight: "2rem",
        },
      ],
      xl: [
        "1.25rem",
        {
          lineHeight: "2rem",
        },
      ],
      "2xl": [
        "1.5rem",
        {
          lineHeight: "2rem",
        },
      ],
      "3xl": [
        "2rem",
        {
          lineHeight: "2.5rem",
        },
      ],
      "4xl": [
        "2.5rem",
        {
          lineHeight: "3.5rem",
        },
      ],
      "5xl": [
        "3rem",
        {
          lineHeight: "3.5rem",
        },
      ],
      "6xl": [
        "3.75rem",
        {
          lineHeight: "1",
        },
      ],
      "7xl": [
        "4.5rem",
        {
          lineHeight: "1.1",
        },
      ],
      "8xl": [
        "6rem",
        {
          lineHeight: "1",
        },
      ],
      "9xl": [
        "8rem",
        {
          lineHeight: "1",
        },
      ],
    },
    extend: {
      boxShadow: {
        thick: "0px 7px 32px rgb(0 0 0 / 35%);",
      },
      colors: {
        background: {
          light: "#F1F3F4",
          dark: "#0D0F11",
        },
        unit: {
          light: "#FFFFFF",
          dark: "#191D23",
        },
        stroke: {
          light: "#DCDCDD",
          dark: "#576776",
        },
        label: {
          light: "#2B2E48",
          dark: "#E3E3E3",
        },
        label2: {
          light: "#7D7D7D",
          dark: "#B8C0CC",
        },
        link: {
          light: "#7D7D7D",
          dark: "#B8C0CC",
        },
        node: {
          app: {
            light: "#5DAAEE",
            dark: "#5395CF",
            peol: {
              light: "#F9837C",
              dark: "#F9837C",
            },
            neol: {
              light: "#FFC565",
              dark: "#EFB047",
            }
          },
          tech: {
            light: "#50C099",
            dark: "#47A785",
          },
          db: {
            light: "#34495e",
            dark: "#34495e",
          },
          server: {
            light: "#9b59b6",
            dark: "#9b59b6",
          },
        },
      },
      borderRadius: {
        "small": "8px",
        "5xl": "3rem",
        "6xl": "5rem",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        stock: [defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // ...
  ],
};
