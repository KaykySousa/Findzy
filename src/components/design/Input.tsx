import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { ChangeEvent, useState } from "react"
import InputMask, { Props as InputMaskProps } from "react-input-mask"

interface InputProps extends Omit<InputMaskProps, "mask"> {
	togglePassword?: boolean
	mask?: "cep" | "cnpj"
}

const masks = {
	cep: "99999-999",
	cnpj: "99.999.999/9999-99",
}

export default function Input({
	togglePassword,
	placeholder,
	type,
	mask,
	onChange,
	...props
}: InputProps) {
	const [showPassword, setShowPassword] = useState(false)

	function handleChangeWithoutMask(e: ChangeEvent<HTMLInputElement>) {
		if (onChange) {
			onChange({
				...e,
				target: {
					...e.target,
					value: e.target.value.replace(/\D/g, ""),
				},
			})
		}
	}

	return (
		<div className="relative flex h-12 w-full items-center">
			<InputMask
				mask={mask ? masks[mask] : ""}
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
				onChange={mask ? handleChangeWithoutMask : onChange}
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
						<EyeSlashIcon className="h-5 w-5" />
					)}
				</button>
			)}
		</div>
	)
}
