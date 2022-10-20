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
				className={`h-10 w-full cursor-text rounded border-0 bg-gray-100 placeholder:text-sm focus:border-purple-700 focus:ring-0 ${
					icon && "pl-9"
				} ${inputClassName}`}
				{...props}
			/>
			{icon}
		</div>
	)
}
