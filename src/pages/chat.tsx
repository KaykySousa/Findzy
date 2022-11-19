import ChatMessage from "@/components/ChatMessage"
import { Input } from "@/components/design"
import Header from "@/components/Header"
import { api } from "@/services/axios"
import { MessagesResponseData } from "@/types/api"
import getCompany from "@/utils/getCompany"
import getConversations from "@/utils/getConversations"
import getUser from "@/utils/getUser"
import validateToken from "@/utils/validateToken"
import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline"
import useChannel from "hooks/useChannel"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { parseCookies } from "nookies"
import { FormEvent, useEffect, useState } from "react"

interface MessageData {
	sender: string
	message: string
}

interface ChatProps {
	accountType: "user" | "company"
	accountData: {
		[key: string]: any
	}
	conversations:
		| {
				id: string
				data: {
					id: string | undefined
					name: string | undefined
					profile_picture_url: string | undefined
				}
		  }[]
		| undefined
}

export default function Chat({
	accountType,
	accountData,
	conversations,
}: ChatProps) {
	const [messageToSend, setMessageToSend] = useState("")
	const [chatMessages, setChatMessages] = useState<MessageData[]>([])
	const [channelName, setChannelName] = useState("")
	const [otherId, setOtherId] = useState<string | undefined>("")

	const channel = useChannel(channelName, (message) => {
		setChatMessages([
			...chatMessages,
			{
				message: message.data.content,
				sender: message.data.senderId,
			},
		])
	})

	useEffect(() => {
		api.post<MessagesResponseData>("/api/get-messages", {
			conversationId: channelName,
		}).then((historyMessagesResponse) => {
			const historyMessages = historyMessagesResponse.data.messages.map(
				(message) => {
					return {
						message: message.content,
						sender: message.sender_id,
					}
				}
			)
			setChatMessages(historyMessages)
		})
	}, [channelName])

	async function sendMessage(e: FormEvent) {
		e.preventDefault()

		if (!messageToSend) return

		if (!channel) return

		channel.publish({
			name: "chat-message",
			data: {
				content: messageToSend,
				senderId: accountData.id,
			},
		})

		await api.post("/api/send-message", {
			conversationId: channelName,
			content: messageToSend,
		})

		setMessageToSend("")
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
							{conversations?.map((conversation, index) => (
								<div
									className={`flex cursor-pointer items-center rounded-md border p-2 ${
										conversation.id === channelName
											? "border-purple-700"
											: "border-gray-300"
									}`}
									key={index}
									onClick={() => {
										setOtherId(conversation.data.id)
										setChannelName(conversation.id)
									}}
								>
									<img
										src={
											conversation.data
												.profile_picture_url ||
											"https://www.w3schools.com/howto/img_avatar.png"
										}
										alt=""
										className="mr-2 h-12 w-12 rounded-full object-cover"
									/>
									<p className="text-sm uppercase text-gray-800">
										{conversation.data.name}
									</p>
								</div>
							))}
						</div>
					</div>
					<div className="hidden w-full flex-col md:flex">
						{otherId && (
							<Link href={`/report/${otherId}`}>
								<a>
									<button>Denunciar Empresa</button>
								</a>
							</Link>
						)}
						{channelName ? (
							<div className="flex flex-1 flex-col-reverse overflow-y-auto p-4">
								<div className="flex flex-col gap-y-2">
									{chatMessages.map(
										({ message, sender }, index) => (
											<ChatMessage
												key={index}
												message={message}
												sender={
													sender === accountData.id
														? "me"
														: "other"
												}
											/>
										)
									)}
								</div>
							</div>
						) : (
							<div className="flex flex-1 items-center justify-center p-4">
								<p className="text-xl text-gray-600">
									Selecione uma Conversa
								</p>
							</div>
						)}
						<form
							className="flex items-center gap-x-2 border-t border-gray-100 p-4"
							onSubmit={sendMessage}
						>
							<Input
								placeholder="Mande uma mensagem!"
								value={messageToSend}
								onChange={(e) => {
									setMessageToSend(e.target.value)
								}}
							/>
							<button type="button">
								<PhotoIcon className="h-7 w-7 cursor-pointer text-purple-700" />
							</button>
							<button type="submit">
								<PaperAirplaneIcon className="h-7 w-7 text-purple-700" />
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { "findzy.token": token } = parseCookies(ctx)

	const decodedToken = validateToken(token)

	if (!decodedToken) {
		return {
			redirect: {
				permanent: false,
				destination: "/login",
			},
		}
	}

	const conversations = await getConversations(decodedToken.sub!)

	const userData = await getUser(decodedToken.sub!)

	if (userData) {
		const userConversations = conversations?.map((conversation) => {
			return {
				id: conversation.id,
				data: {
					id: conversation.company?.id,
					name: conversation.company?.name,
					profile_picture_url:
						conversation.company?.profile_picture_url,
				},
			}
		})

		return {
			props: {
				accountType: "user",
				accountData: {
					id: userData.id,
					name: userData.name,
					email: userData.email,
				},
				conversations: userConversations,
			},
		}
	}

	const companyData = await getCompany(decodedToken.sub!)

	if (companyData) {
		const companyConversations = conversations?.map((conversation) => {
			return {
				id: conversation.id,
				data: {
					id: conversation.user?.id,
					name: conversation.user?.name,
					profile_picture_url: "",
				},
			}
		})

		return {
			props: {
				accountType: "company",
				accountData: companyData,
				conversations: companyConversations,
			},
		}
	}

	return {
		redirect: {
			permanent: false,
			destination: "/login",
		},
	}
}
