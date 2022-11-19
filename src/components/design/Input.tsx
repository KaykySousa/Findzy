import { InputHTMLAttributes, ReactNode } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	textLabel?: string
	icon?: ReactNode
	inputClassName?: string
}

export default function Input({
	textLabel,
	inputClassName,
	className,
	type,
	icon,
	...props
}: InputProps) {
	return (
		<div
			className={`relative flex w-full flex-col justify-center ${className}`}
		>
			{textLabel && (
				<label className="mb-1 w-full font-bold text-gray-800">
					{textLabel}
				</label>
			)}
			<input
				type={type || "text"}
				className={`h-10 w-full cursor-text rounded-3xl border-0 bg-gray-100 transition placeholder:text-sm focus:ring-purple-700 ${
					icon && "pl-9"
				} ${inputClassName}`}
				{...props}
			/>
			{icon}
		</div>
	)
}
