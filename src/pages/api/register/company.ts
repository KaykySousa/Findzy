import { hash } from "bcrypt"

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

		const { name, cnpj, cep, number, email, phone, password, address } = req.body

		if (!name || !cnpj || !cep || !number || !email || !phone || !password || !address)
			throw new CustomError("Insira todos os dados")

		if (password.length < 8) throw new CustomError("Senha fraca")

		const passwordHash = await hash(password, 10)

		const company = await prisma.company.create({
			data: {
				address,
				cep,
				cnpj,
				email,
				name,
				number,
				password: passwordHash,
				phone
			}
		})

		const token = tokenProvider(company.id)

		return res.status(201).json({
			token,
			company: {
				name: company.name,
				email: company.email,
			}
		})
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
