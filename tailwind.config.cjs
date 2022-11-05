/** @type {import('tailwindcss').Config} */
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
		}
	},
	plugins: [require("@tailwindcss/forms")]
};
