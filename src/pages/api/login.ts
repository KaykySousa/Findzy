import { compare } from "bcrypt"
import type { NextApiHandler } from "next"

import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import handleError from "@/utils/handleError"
import tokenProvider from "@/utils/tokenProvider"

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method !== "POST") {
			throw new CustomError("Method not allowed", {
				statusCode: 405,
			})
		}

		const { email, password } = req.body

		if (!email || !password) throw new CustomError("Missing parameters")

		const user = await prisma.user.findUnique({
			where: { email },
		})

		if (user) {
			const passwordMatch = await compare(password, user.password)

			if (!passwordMatch)
				throw new CustomError("User or password incorrect", {
					statusCode: 403,
				})

			const token = tokenProvider(user.id, "user")

			return res.status(200).json({
				token,
				accountType: "user",
			})
		}

		const company = await prisma.company.findUnique({
			where: { email },
		})

		if (company) {
			const passwordMatch = await compare(password, company.password)

			if (!passwordMatch)
				throw new CustomError("User or password incorrect", {
					statusCode: 403,
				})

			const token = tokenProvider(company.id, "company")

			return res.status(200).json({
				token,
				accountType: "company",
			})
		}

		const admin = await prisma.admin.findUnique({
			where: { email },
		})

		if (admin) {
			const passwordMatch = await compare(password, admin.password)

			if (!passwordMatch)
				throw new CustomError("User or password incorrect", {
					statusCode: 403,
				})

			const token = tokenProvider(admin.id, "admin")

			return res.status(200).json({
				token,
				accountType: "admin",
			})
		}

		if (!user || !company || !admin)
			throw new CustomError("User or password incorrect", {
				statusCode: 403,
			})
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
