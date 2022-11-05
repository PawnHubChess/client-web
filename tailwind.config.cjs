/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			gridTemplateColumns: {
				chessgrid: "auto 12rem"
			},
			backgroundImage: {
				mobilemenu: "linear-gradient(to bottom, transparent 2rem, #000000a6 14rem)"
			}
		},
		screens: {
			tall: { raw: "(min-height: 700px)" },
			...defaultTheme.screens
		}
	},
	plugins: [require("@tailwindcss/forms")]
};
