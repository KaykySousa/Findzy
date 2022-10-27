import ChatMessage from "@/components/ChatMessage"
import { Input } from "@/components/design"
import Header from "@/components/Header"
import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

interface MessageData {
	sender: "me" | "other"
	message: string
}

export default function Chat() {
	const [message, setMessage] = useState("")
	const [messages, setMessages] = useState<MessageData[]>([])

	function sendMessage() {
		if (!message) return

		setMessages([
			...messages,
			{
				message,
				sender: "me",
			},
		])
		setMessage("")
	}

	return (
		<div className="flex min-h-screen w-full flex-col items-center">
			<Header className="hidden md:flex" />
			<div className="flex w-full flex-1 items-center justify-center">
				<div className="flex h-[calc(100vh-3.5rem-3rem)] w-full max-w-5xl items-stretch rounded-md border-gray-100 md:border">
					<div className="flex w-full flex-col items-center border-gray-100 px-3 py-4 md:w-96 md:border-r">
						<h1 className="mb-4 font-bold text-purple-700">
							CONVERSAS
						</h1>
						<div className="flex w-full flex-1 flex-col gap-y-2">
							<div className="flex cursor-pointer items-center rounded-md border border-purple-700 p-2">
								<img
									src="https://www.w3schools.com/howto/img_avatar.png"
									alt=""
									className="mr-2 h-12 w-12 rounded-full object-cover"
								/>
								<p className="text-sm uppercase text-gray-800">
									Kayky de Sousa
								</p>
							</div>
						</div>
					</div>
					<div className="hidden w-full flex-col md:flex">
						<div className="flex flex-1 flex-col-reverse overflow-y-auto p-4">
							<div className="flex flex-col gap-y-2">
								{messages.map(({ message, sender }, index) => (
									<ChatMessage
										key={index}
										message={message}
										sender={sender}
									/>
								))}
							</div>
						</div>
						<div className="flex items-center gap-x-2 border-t border-gray-100 p-4">
							<Input
								placeholder="Mande uma mensagem!"
								value={message}
								onChange={(e) => {
									setMessage(e.target.value)
								}}
							/>
							<PhotoIcon className="h-7 w-7 cursor-pointer text-purple-700" />
							<PaperAirplaneIcon
								className="h-7 w-7 cursor-pointer text-purple-700"
								onClick={sendMessage}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
