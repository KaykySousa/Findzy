interface ChatMessageProps {
	sender: "me" | "other"
	message: string
}

export default function ChatMessage({ sender, message }: ChatMessageProps) {
	return (
		<div
			className={`flex w-full ${
				sender === "other" ? "justify-start" : "justify-end"
			}`}
		>
			<div
				className={`max-w-xs rounded-md py-2 px-3 text-gray-800 ${
					sender === "other"
						? "border-2 border-gray-200 bg-white"
						: "bg-gray-100"
				}`}
			>
				<p>{message}</p>
			</div>
		</div>
	)
}
