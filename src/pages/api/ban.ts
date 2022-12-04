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

		const { reason, banId } = req.body

		if (!reason || !banId) throw new CustomError("Missing parameters")

		const user = await getUserById(banId)
		const company = await getCompanyById(banId)

		if (user) {
			const updatedUser = await prisma.user.update({
				where: {
					id: banId,
				},
				data: {
					status: "banned",
				},
			})

			const bannedUser = await prisma.bannedUser.create({
				data: {
					reason,
					user_id: banId,
				},
				select: {
					reason: true,
					user_id: true,
					id: true,
				},
			})

			return res.status(201).json(bannedUser)
		}

		if (company) {
			const updatedCompany = await prisma.company.update({
				where: {
					id: banId,
				},
				data: {
					status: "banned",
				},
			})

			const bannedCompany = await prisma.bannedCompany.create({
				data: {
					reason,
					company_id: banId,
				},
				select: {
					reason: true,
					id: true,
					company_id: true,
				},
			})

			return res.status(201).json(bannedCompany)
		}
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
