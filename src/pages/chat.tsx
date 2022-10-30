import ChatMessage from "@/components/ChatMessage"
import { Input } from "@/components/design"
import Header from "@/components/Header"
import getCompany from "@/utils/getCompany"
import getConversations from "@/utils/getConversations"
import getUser from "@/utils/getUser"
import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline"
import { GetServerSideProps } from "next"
import { parseCookies } from "nookies"
import { FormEvent, useState } from "react"

interface MessageData {
	sender: "me" | "other"
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

	function sendMessage(e: FormEvent) {
		e.preventDefault()

		if (!messageToSend) return

		//TODO: Publish message in a channel

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
									className="flex cursor-pointer items-center rounded-md border border-purple-700 p-2"
									key={index}
								>
									<img
										src="https://www.w3schools.com/howto/img_avatar.png"
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
						<div className="flex flex-1 flex-col-reverse overflow-y-auto p-4">
							<div className="flex flex-col gap-y-2">
								{chatMessages.map(
									({ message, sender }, index) => (
										<ChatMessage
											key={index}
											message={message}
											sender={sender}
										/>
									)
								)}
							</div>
						</div>
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

	const conversations = await getConversations(token)

	const userData = await getUser(token)

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

	const companyData = await getCompany(token)

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
