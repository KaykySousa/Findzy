import { sign } from "jsonwebtoken"

export default function tokenProvider(
	subject: string,
	accountType: "user" | "company" | "admin"
) {
	const token = sign(
		{
			accountType,
		},
		String(process.env.JWT_SECRET_KEY),
		{
			subject,
			issuer: "Findzy",
			expiresIn: "7d",
		}
	)

	return token
}
