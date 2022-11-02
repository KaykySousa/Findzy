import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import getCompany from "@/utils/getCompany"
import getUser from "@/utils/getUser"
import handleError from "@/utils/handleError"
import validateToken from "@/utils/validateToken"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method !== "POST") {
			throw new CustomError("Method not allowed", {
				statusCode: 405,
			})
		}

		const token = req.headers.authorization?.replace("Bearer ", "")

		const decodedToken = validateToken(token)

		if (!decodedToken) {
			throw new CustomError("Token not provided")
		}

		if (decodedToken.accountType === "user") {
			const user = await getUser(decodedToken.sub!)

			if (!user) {
				throw new CustomError("Unauthorized", {
					statusCode: 401,
				})
			}
		}

		if (decodedToken.accountType === "company") {
			const company = await getCompany(decodedToken.sub!)

			if (!company) {
				throw new CustomError("Unauthorized", {
					statusCode: 401,
				})
			}
		}

		const { conversationId } = req.body

		const messages = await prisma.message.findMany({
			where: {
				conversation_id: conversationId,
			},
			select: {
				content: true,
				sender_id: true,
			},
		})

		return res.status(201).json({ messages })
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
