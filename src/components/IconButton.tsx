import { ButtonHTMLAttributes } from "react"

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function IconButton({
	className,
	type,
	...props
}: IconButtonProps) {
	return (
		<button
			type={type || "button"}
			className={`flex-shrink-0 rounded-full p-1 text-gray-500 outline-purple-700 transition-colors hover:bg-purple-200 peer-focus:text-purple-700 ${className}`}
			{...props}
		/>
	)
}
