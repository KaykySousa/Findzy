import ChatMessage from "@/components/ChatMessage"
import { Input } from "@/components/design"
import Header from "@/components/Header"
import IconButton from "@/components/IconButton"
import SEO from "@/components/SEO"
import { api } from "@/services/axios"
import { MessagesResponseData } from "@/types/api"
import getCompanyById from "@/utils/getCompanyById"
import getConversations from "@/utils/getConversations"
import getUserById from "@/utils/getUserById"
import validateToken from "@/utils/validateToken"
import {
	ChevronLeftIcon,
	ExclamationTriangleIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/outline"
import dayjs from "dayjs"
import useChannel from "hooks/useChannel"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { parseCookies } from "nookies"
import { FormEvent, useEffect, useState } from "react"

interface MessageData {
	sender: string
	message: string
	timestamp: string
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
					lastMessage: {
						content: string
						timestamp: string
					}
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
	const [otherName, setOtherName] = useState<string | undefined>("")

	const channel = useChannel(channelName, (message) => {
		setChatMessages([
			...chatMessages,
			{
				message: message.data.content,
				sender: message.data.senderId,
				timestamp: dayjs(new Date()).format("DD/MM/YYYY HH:mm"),
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
						timestamp: dayjs(message.created_at).format(
							"DD/MM/YYYY HH:mm"
						),
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

		try {
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
		} catch (error) {
			console.error(error)
		}

		setMessageToSend("")
	}

	return (
		<div className="flex min-h-screen w-full flex-col items-center">
			<SEO description="" title="Chat" />
			<Header className="hidden md:flex" />
			<div className="flex w-full flex-1 md:items-center md:justify-center">
				<div className="flex w-full max-w-5xl flex-1 items-stretch rounded-md border-gray-100 md:h-[calc(100vh-3.5rem-3rem)] md:border">
					<div
						className={`h-full w-full flex-col items-center border-gray-100 px-3 py-4 md:flex md:w-96 md:border-r ${
							channelName ? "hidden" : "flex"
						}`}
					>
						<div className="relative mb-4 flex w-full items-center justify-center">
							<Link href="/" className="absolute left-0">
								<IconButton>
									<ChevronLeftIcon className="h-5 w-5 text-purple-700" />
								</IconButton>
							</Link>
							<h1 className="font-bold text-purple-700">
								CONVERSAS
							</h1>
						</div>
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
										setOtherName(conversation.data.name)
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
									<div className="flex h-full w-full flex-col justify-center">
										<p className="text-sm uppercase text-gray-800">
											{conversation.data.name}
										</p>
										<p className="text-xs text-gray-500">
											{
												conversation.data.lastMessage
													.timestamp
											}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
					<div
						className={`h-screen w-full flex-col pt-4 md:flex md:h-full ${
							channelName ? "flex" : "hidden"
						}`}
					>
						<div className="relative mb-4 flex w-full items-center justify-center md:hidden">
							<IconButton
								className="absolute left-3"
								onClick={() => {
									setChannelName("")
								}}
							>
								<ChevronLeftIcon className="h-5 w-5 text-purple-700" />
							</IconButton>
							<h1 className="font-bold text-purple-700">
								{otherName}
							</h1>
						</div>
						{channelName ? (
							<div className="relative flex flex-1 flex-col-reverse overflow-y-auto p-4">
								{otherId && (
									<Link
										href={`/report/${otherId}`}
										className="absolute right-2 top-2"
									>
										<button className="flex items-center rounded border border-gray-300 bg-white px-1 text-gray-600">
											<ExclamationTriangleIcon className="mr-1 h-5 w-5" />
											Denunciar
										</button>
									</Link>
								)}
								<div className="flex flex-col gap-y-2">
									{chatMessages.map(
										(
											{ message, sender, timestamp },
											index
										) => (
											<ChatMessage
												key={index}
												message={message}
												sender={
													sender === accountData.id
														? "me"
														: "other"
												}
												timestamp={timestamp}
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
							{/* <button type="button">
								<PhotoIcon className="h-7 w-7 cursor-pointer text-purple-700" />
							</button> */}
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

	const userData = await getUserById(decodedToken.sub!)

	if (userData) {
		const userConversations = conversations?.map((conversation) => {
			return {
				id: conversation.id,
				data: {
					id: conversation.company?.id,
					name: conversation.company?.name,
					profile_picture_url:
						conversation.company?.profile_picture_url,
					lastMessage: {
						content: conversation.messages[0].content,
						timestamp: dayjs(
							conversation.messages[0].created_at
						).format("DD/MM/YYYY HH:mm"),
					},
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

	const companyData = await getCompanyById(decodedToken.sub!)

	if (companyData) {
		const companyConversations = conversations?.map((conversation) => {
			return {
				id: conversation.id,
				data: {
					id: conversation.user?.id,
					name: conversation.user?.name,
					profile_picture_url: "",

					lastMessage: {
						content: conversation.messages[0].content,
						timestamp: dayjs(
							conversation.messages[0].created_at
						).format("DD/MM/YYYY HH:mm"),
					},
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
