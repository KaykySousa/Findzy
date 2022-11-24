import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import handleError from "@/utils/handleError"

import validateToken from "@/utils/validateToken"
import type { NextApiHandler, PageConfig } from "next"

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method !== "PATCH") {
			throw new CustomError("Method not allowed", {
				statusCode: 405,
			})
		}

		const token = req.headers.authorization?.replace("Bearer ", "")

		const decodedToken = validateToken(token)

		if (!decodedToken) {
			throw new CustomError("Token not provided")
		}

		const id = decodedToken.sub

		const { name, email, phone } = req.body

		const company = await prisma.company.update({
			data: {
				name,
				email,
				phone,
			},
			where: {
				id,
			},
			select: {
				address: {
					select: {
						cep: true,
						city: true,
						district: true,
						number: true,
						street: true,
						uf: true,
					},
				},
				cnpj: true,
				email: true,
				id: true,
				name: true,
				phone: true,
				profile_picture_url: true,
			},
		})

		return res.status(200).json({ company })
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
