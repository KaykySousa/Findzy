import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline"
import { InputHTMLAttributes, useState } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	togglePassword?: boolean
}

export default function Input({
	togglePassword,
	placeholder,
	type,
	...props
}: InputProps) {
	const [showPassword, setShowPassword] = useState(false)

	return (
		<div className="relative flex h-12 w-full items-center">
			<input
				type={
					!togglePassword || showPassword
						? type || "text"
						: "password"
				}
				className={`peer h-full w-full cursor-text border-0 border-b-2 border-gray-300 bg-transparent p-0 text-gray-700 placeholder-transparent transition-colors focus:border-purple-700 focus:ring-0 ${
					type === "date" && !props.value
						? "[&:not(:focus)]:text-transparent"
						: ""
				}`}
				placeholder={placeholder}
				{...props}
			/>
			<label
				className={`absolute left-0 -top-3 -z-10 text-sm text-gray-500 transition-[color,font-size,top] peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-purple-700 ${
					type === "date" && !props.value ? "top-3 text-base" : ""
				}`}
			>
				{placeholder}
			</label>
			{togglePassword && (
				<button
					type="button"
					className="absolute right-0 rounded-full p-1 text-gray-500 outline-purple-700 transition-colors hover:bg-neutral-200 peer-focus:text-purple-700"
					onClick={() => {
						setShowPassword(!showPassword)
					}}
				>
					{showPassword ? (
						<EyeIcon className="h-5 w-5" />
					) : (
						<EyeOffIcon className="h-5 w-5" />
					)}
				</button>
			)}
		</div>
	)
}
