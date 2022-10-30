import { hash } from "bcrypt"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import handleError from "@/utils/handleError"
import tokenProvider from "@/utils/tokenProvider"

import type { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method !== "POST") {
			throw new CustomError("Method not allowed", {
				statusCode: 405,
			})
		}

		const { name, email, password, birthdate } = req.body

		if (!name || !email || !password || !birthdate)
			throw new CustomError("Insira todos os dados")

		if (password.length < 8) throw new CustomError("Senha fraca")

		const passwordHash = await hash(password, 10)

		dayjs.extend(utc)

		if (dayjs(birthdate).isAfter(dayjs().subtract(16, "years"))) {
			throw new Error("Você não possui a idade mínima para se cadastrar")
		}

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: passwordHash,
				birthdate: dayjs.utc(birthdate).toISOString(),
			},
			select: {
				id: true,
				name: true,
				email: true,
				birthdate: true,
			},
		})

		const token = tokenProvider(user.id, "user")

		return res.status(201).json({
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
