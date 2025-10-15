/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      './app/**/*.{js,ts,jsx,tsx,mdx}',      // ← Must include your files
      './components/**/*.{js,ts,jsx,tsx,mdx}', // ← Must include components
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

