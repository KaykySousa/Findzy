import { ArrowRightIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { InputHTMLAttributes, useEffect, useRef, useState } from "react"
import Input from "./design/Input"
import IconButton from "./IconButton"

interface SettingsInputProps extends InputHTMLAttributes<HTMLInputElement> {
	labelName: string
	description: string
	onSave: () => void
}

export default function SettingsInput({
	labelName,
	description,
	onSave,
	...props
}: SettingsInputProps) {
	const [editable, setEditable] = useState(false)

	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		inputRef.current?.focus()
	}, [editable])

	return (
		<div className="flex w-full flex-col">
			<div className="mb-2 flex flex-col text-gray-800">
				<h1 className="font-bold">{labelName}</h1>
				<p className="text-sm">{description}</p>
			</div>
			<form
				className="flex w-full items-center gap-x-2"
				onSubmit={(e) => {
					e.preventDefault()
					setEditable(false)
					onSave()
				}}
			>
				<Input
					inputClassName="!h-8"
					disabled={!editable}
					required
					{...props}
				/>
				{editable ? (
					<IconButton type="submit">
						<ArrowRightIcon className="h-6 w-6 text-green-500" />
					</IconButton>
				) : (
					<IconButton
						type="button"
						onMouseUp={() => {
							setEditable(true)
						}}
					>
						<PencilSquareIcon className="h-6 w-6 text-gray-800" />
					</IconButton>
				)}
			</form>
		</div>
	)
}
