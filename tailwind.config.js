/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { Mona_Sans: ['Mona Sans', 'sans-serif'] },
      colors: {
        // bgPrimary: '#e3edfc',
        bgPrimary: '#EEF0F2',
        bgAside: '#f1f1f1',
        bgPrimaryButton: '#0A66C2',
        bgPrimaryButtonDisabled: '#C0C0C0',
        bgPrimaryButtonHover: '#09509B',
        primaryText: '#212529',
        secondaryText: '#1C1C1C',
        inputError: '#AD1A1A',
        inputBorder: '#495057',
        accordionBg: '#ebf2fd',
        tableHeadingColour: '#f1f1f1',
        tableBorder: '#80858A',
        breadCrumbHeading: '#f4f5f7',
        smallMenuHover: '#ADB5BD',
        errorColour: '#AD1A1A',
        labelColour: '#A1A1A1',
        scrollBarColor: '#848689',
        scrollBarBg: '#cccdcf',
        primaryTextDisabled: '#A1A1A1',
      },
    },
  },
  plugins: [tailwindScrollbar],
};
