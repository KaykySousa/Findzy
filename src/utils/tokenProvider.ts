import { sign } from "jsonwebtoken"

export default function tokenProvider(subject: string) {
	const token = sign({}, String(process.env.JWT_SECRET_KEY), {
		subject,
		issuer: "Findzy",
		expiresIn: "1h",
	})

	return token
}
