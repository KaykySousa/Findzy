import { hash } from "bcrypt"

import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import handleError from "@/utils/handleError"
import tokenProvider from "@/utils/tokenProvider"

import imageUploader from "@/utils/imageUploader"
import type { NextApiHandler, PageConfig } from "next"

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method !== "POST") {
			throw new CustomError("Method not allowed", {
				statusCode: 405,
			})
		}

		const {
			name,
			cnpj,
			cep,
			email,
			phone,
			password,
			address,
			profilePicture,
		} = req.body

		if (
			!name ||
			!cnpj ||
			!cep ||
			!email ||
			!phone ||
			!password ||
			!address ||
			!profilePicture
		)
			throw new CustomError("Insira todos os dados")

		if (password.length < 8) throw new CustomError("Senha fraca")

		const { secure_url: profilePictureUrl } = await imageUploader(
			profilePicture,
			"findzy-company-profile-pictures"
		)

		const passwordHash = await hash(password, 10)

		const company = await prisma.company.create({
			data: {
				cnpj,
				email,
				name,
				password: passwordHash,
				phone,
				profile_picture_url: profilePictureUrl,
				address: {
					create: {
						cep,
						city: address.city,
						district: address.district,
						street: address.street,
						uf: address.uf,
						number: address.number,
					},
				},
			},
		})

		const token = tokenProvider(company.id, "company")

		return res.status(201).json({
			token,
			company: {
				name: company.name,
				email: company.email,
			},
		})
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export const config: PageConfig = {
	api: {
		bodyParser: {
			sizeLimit: "4mb",
		},
	},
}

export default handler
