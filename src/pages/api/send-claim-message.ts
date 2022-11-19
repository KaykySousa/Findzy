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

		let fromId = ""

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

			fromId = user.id
		}

		if (decodedToken.accountType === "company") {
			const company = await getCompany(decodedToken.sub!)

			if (!company) {
				throw new CustomError("Unauthorized", {
					statusCode: 401,
				})
			}

			fromId = company.id
		}

		const { toId, content } = req.body

		if (!toId || !content) throw new CustomError("Missing parameters")

		const message = await prisma.message.create({
			data: {
				content,
				sender_id: fromId,
				conversation: {
					connectOrCreate: {
						where: {
							user_id_company_id: {
								user_id:
									decodedToken.accountType === "user"
										? fromId
										: toId,
								company_id:
									decodedToken.accountType === "company"
										? fromId
										: toId,
							},
						},
						create: {
							company_id:
								decodedToken.accountType === "company"
									? fromId
									: toId,
							user_id:
								decodedToken.accountType === "user"
									? fromId
									: toId,
						},
					},
				},
			},
		})

		return res.status(201).json({ message })
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
