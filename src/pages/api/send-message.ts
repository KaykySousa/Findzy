import CustomError from "@/utils/CustomError"
import handleError from "@/utils/handleError"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method !== "POST") {
			throw new CustomError("Method not allowed", {
				statusCode: 405,
			})
		}

		// let fromId = ""

		// const token = req.headers.authorization?.replace("Bearer ", "")

		// const decodedToken = validateToken(token)

		// if (!decodedToken) {
		// 	throw new CustomError("Token not provided")
		// }

		// if (decodedToken.accountType === "user") {
		// 	const user = await getUser(decodedToken.sub!)

		// 	if (!user) {
		// 		throw new CustomError("Unauthorized", {
		// 			statusCode: 401,
		// 		})
		// 	}

		// 	fromId = user.id
		// }

		// if (decodedToken.accountType === "company") {
		// 	const company = await getCompany(decodedToken.sub!)

		// 	if (!company) {
		// 		throw new CustomError("Unauthorized", {
		// 			statusCode: 401,
		// 		})
		// 	}

		// 	fromId = company.id
		// }

		// const { toId, content } = req.body

		// const conversation = await prisma.conversation.findFirst({
		// 	where: {
		// 		AND: {
		// 			company_id:
		// 				decodedToken.accountType === "company" ? fromId : toId,
		// 			user_id:
		// 				decodedToken.accountType === "user" ? fromId : toId,
		// 		},
		// 	},
		// 	select: {
		// 		id: true,
		// 	},
		// })

		// const message = await prisma.message.create({
		// 	data: {
		// 		content,
		// 		sender_id: fromId,
		// 		conversation: {
		// 			connectOrCreate: {
		// 				where: {
		// 					id: conversation?.id,
		// 				},
		// 				create: {
		// 					company_id:
		// 						decodedToken.accountType === "company"
		// 							? fromId
		// 							: toId,
		// 					user_id:
		// 						decodedToken.accountType === "user"
		// 							? fromId
		// 							: toId,
		// 				},
		// 			},
		// 		},
		// 	},
		// })

		return res.status(200).json({ test: "test" })
	} catch (e) {
		console.log(e)
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
