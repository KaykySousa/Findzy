import { TextareaHTMLAttributes } from "react"

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function TextArea({ className, ...props }: TextAreaProps) {
	return (
		<textarea
			className={`w-full flex-1 resize-none rounded border-gray-300 transition-colors focus:border-purple-700 focus:ring-purple-700 ${className}`}
			{...props}
		/>
	)
}
