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

		if (!user)
			throw new CustomError("User or password incorrect", {
				statusCode: 403,
			})

		const passwordMatch = await compare(password, user.password)

		if (!passwordMatch)
			throw new CustomError("User or password incorrect", {
				statusCode: 403,
			})

		const token = tokenProvider(user.id)

		return res.status(200).json({
			token,
			user: {
				name: user.name,
				email: user.email,
				birthdate: user.birthdate,
			},
		})
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
