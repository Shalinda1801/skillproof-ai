/** @type {import('tailwindcss').Config} */

export default {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],


  theme: {

    extend: {

      colors: {

        primary: {
          500: "#6366f1",
          600: "#4f46e5",
        },

        accent: {
          500: "#8b5cf6",
          600: "#7c3aed",
        },

      },


      boxShadow: {

        soft:
          "0 20px 60px rgba(15,23,42,0.08)",

        glow:
          "0 20px 50px rgba(99,102,241,0.25)",

      },


      animation: {

        float:
          "float 8s ease-in-out infinite",

        pulseSlow:
          "pulse 5s infinite",

      },


      keyframes: {

        float: {

          "0%,100%": {

            transform:
              "translateY(0px)",

          },


          "50%": {

            transform:
              "translateY(-25px)",

          },

        },

      },


    },

  },


  plugins: [],

};