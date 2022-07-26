/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
	content: ["./src/pages/**/*.tsx", "./src/components/**/*.tsx"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Open Sans", ...defaultTheme.fontFamily.sans],
			},
			backgroundImage: {
				"box-login-texture": "url('/box.svg')",
			},
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("prettier-plugin-tailwindcss"),
	],
}
