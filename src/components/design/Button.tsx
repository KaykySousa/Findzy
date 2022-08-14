import { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	theme?: "primary" | "secondary"
	loading?: boolean
}

export default function Button({
	className,
	theme = "primary",
	loading,
	children,
	...props
}: ButtonProps) {
	const themes = {
		primary:
			"h-12 w-full rounded-md bg-purple-700 text-lg font-bold text-white disabled:bg-purple-500",
		secondary:
			"h-12 w-full rounded-md bg-white font-bold text-purple-700 disabled:bg-gray-200",
	}

	return (
		<button
			className={
				themes[theme] +
				` transition-colors disabled:cursor-not-allowed ${className}`
			}
			disabled={loading}
			{...props}
		>
			{!loading ? (
				children
			) : (
				<div className="flex items-center justify-center gap-x-1">
					<div className="h-3 w-3 animate-[loading_1.2s_ease-in-out_infinite]  rounded-full bg-current"></div>
					<div className="h-3 w-3 animate-[loading_1.2s_ease-in-out_infinite_0.25s] rounded-full bg-current"></div>
					<div className="h-3 w-3 animate-[loading_1.2s_ease-in-out_infinite_0.5s] rounded-full bg-current"></div>
				</div>
			)}
		</button>
	)
}
