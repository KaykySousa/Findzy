import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import getAdminById from "@/utils/getAdminById"
import getCompanyById from "@/utils/getCompanyById"
import getUserById from "@/utils/getUserById"
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

		if (!token) {
			throw new CustomError("Token not provided")
		}

		const decodedToken = validateToken(token)

		if (!decodedToken) {
			throw new CustomError("Token invalid")
		}

		const admin = await getAdminById(decodedToken.sub!)

		if (!admin) {
			throw new CustomError("Unauthorized")
		}

		const { content, notifyId } = req.body

		if (!content || !notifyId) throw new CustomError("Missing parameters")

		const user = await getUserById(notifyId)
		const company = await getCompanyById(notifyId)

		if (user) {
			const userNotification = await prisma.userNotification.create({
				data: {
					content,
					user_id: notifyId,
				},
				select: {
					content: true,
					id: true,
					user_id: true,
				},
			})

			return res.status(201).json(userNotification)
		}

		if (company) {
			const companyNotification = await prisma.companyNotification.create(
				{
					data: {
						content,
						company_id: notifyId,
					},
					select: {
						content: true,
						id: true,
						company_id: true,
					},
				}
			)

			return res.status(201).json(companyNotification)
		}
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
