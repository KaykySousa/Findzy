import prisma from "@/prisma/client"
import CustomError from "./CustomError"
import validateToken from "./validateToken"

export default async function getConversations(token: string) {
	try {
		const decodedToken = validateToken(token)

		if (!decodedToken) throw new CustomError("Token invalid")

		const conversations = await prisma.conversation.findMany({
			where: {
				OR: {
					company_id: decodedToken.sub,
					user_id: decodedToken.sub,
				},
			},
			include: {
				company: {
					select: {
						id: true,
						name: true,
						profile_picture_url: true,
					},
				},
				user: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		})

		if (!conversations) throw new CustomError("Conversations not found")

		return conversations
	} catch (error) {
		return undefined
	}
}
