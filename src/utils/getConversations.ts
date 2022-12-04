import prisma from "@/prisma/client"
import CustomError from "./CustomError"

export default async function getConversations(id: string) {
	try {
		const conversations = await prisma.conversation.findMany({
			where: {
				OR: [
					{
						company_id: id,
					},
					{
						user_id: id,
					},
				],
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
				messages: {
					orderBy: {
						created_at: "desc",
					},
					take: 1,
					select: {
						content: true,
						created_at: true,
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
