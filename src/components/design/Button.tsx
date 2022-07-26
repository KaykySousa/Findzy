import { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	theme?: "primary" | "secondary"
}

export default function Button({
	className,
	theme = "primary",
	...props
}: ButtonProps) {
	const themes = {
		primary:
			"h-12 w-full rounded-md bg-purple-700 text-lg font-bold text-white",
		secondary:
			"h-12 w-full rounded-md bg-white font-bold text-purple-700 border-2 border-purple-700",
	}

	return <button className={themes[theme] + ` ${className}`} {...props} />
}
