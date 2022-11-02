import { SelectHTMLAttributes, useState } from "react"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	textLabel?: string
	options: string[]
	inputClassName?: string
	defaultOption?: string
}

export default function Select({
	textLabel,
	options,
	className,
	inputClassName,
	defaultOption,
	onChange,
	value,
	...props
}: SelectProps) {
	const [isDefault, setIsDefault] = useState(true)

	return (
		<div
			className={`relative flex w-full flex-col justify-center ${className}`}
		>
			{textLabel && (
				<label className="mb-1 w-full font-bold text-gray-800">
					{textLabel}
				</label>
			)}
			<select
				className={`h-10 w-full cursor-text rounded border-0 bg-gray-100 focus:ring-purple-700 ${inputClassName} ${
					isDefault ? "text-sm text-gray-500" : ""
				}`}
				onChange={(e) => {
					if (e.target.value === "defaultOption") {
						setIsDefault(true)
					} else {
						setIsDefault(false)
					}
					if (onChange) {
						onChange(e)
					}
				}}
				value={value || "defaultOption"}
				{...props}
			>
				{defaultOption && (
					<option value={"defaultOption"} hidden disabled>
						{defaultOption}
					</option>
				)}
				{options.map((optionValue, index) => (
					<option
						className="text-base text-black"
						value={optionValue}
						key={index}
					>
						{optionValue}
					</option>
				))}
			</select>
		</div>
	)
}
