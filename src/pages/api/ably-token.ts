import CustomError from "@/utils/CustomError"
import handleError from "@/utils/handleError"
import { Realtime } from "ably/promises"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method !== "GET") {
			throw new CustomError("Method not allowed", {
				statusCode: 405,
			})
		}

		const client = new Realtime(process.env.ABLY_API_KEY!)

		const ablyTokenRequest = await client.auth.createTokenRequest({
			clientId: "findzy-chat",
		})

		return res.status(200).json(ablyTokenRequest)
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
