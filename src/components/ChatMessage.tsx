interface ChatMessageProps {
	sender: "me" | "other"
	message: string
	timestamp: string
}

export default function ChatMessage({
	sender,
	message,
	timestamp,
}: ChatMessageProps) {
	return (
		<div
			className={`flex w-full flex-col ${
				sender === "other" ? "items-start" : "items-end"
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
			<span className="mt-1 text-sm text-gray-300">{timestamp}</span>
		</div>
	)
}
