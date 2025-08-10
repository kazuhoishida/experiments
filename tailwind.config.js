const theme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './slices/**/*.{js,jsx,ts,tsx}'],
    theme: {
        fontFamily: {
            flex: "'Roboto Flex', 'Noto Sans JP', sans-serif",
            rock: "'Rock 3D', 'Noto Sans JP', cursive",
            serif: "'Roboto Serif', 'Noto Sans JP', serif",
            noto: "'Noto Sans JP', sans-serif",
            arrow: [
                null,
                {
                    fontVariationSettings: 'var(--setting-bold-H1)',
                },
            ],
            'bold-h1': [
                null,
                {
                    fontVariationSettings: 'var(--setting-bold-H1)',
                },
            ],
            'bold-h4': [
                null,
                {
                    fontVariationSettings: 'var(--setting-bold-H4)',
                },
            ],
            'bold-h6': [
                null,
                {
                    fontVariationSettings: 'var(--setting-bold-H6)',
                },
            ],
            'squash-h1': [
                null,
                {
                    fontVariationSettings: 'var(--setting-squash-H1)',
                },
            ],
            'squash-h4': [
                null,
                {
                    fontVariationSettings: 'var(--setting-squash-H4)',
                },
            ],
            'squash-h6': [
                null,
                {
                    fontVariationSettings: 'var(--setting-squash-H6)',
                },
            ],
        },
        extend: {
            colors: {
                'v-red': '#FF3D00',
                'v-light-gray': '#EEEEEE',
                'v-dark-gray': '#D2D2D2',
                'v-soft-black': '#565656',
            },
            screens: {
                xs: { max: '400px' },
                '2xl': '1600px',
            },
            fontFamily: {
                sans: ['Noto Sans JP', ...theme.fontFamily.sans],
            },
            width: {
                '9/10': '90%',
            },
        },
    },
    plugins: [require('@tailwindcss/aspect-ratio')],
};
