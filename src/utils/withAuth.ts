import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { parseCookies } from "nookies"
import getCompany from "./getCompany"
import getUser from "./getUser"
import validateToken from "./validateToken"

type gsspType = (data: {
	context: GetServerSidePropsContext
	data: { [key: string]: any }
	accountType: "user" | "company"
}) => Promise<GetServerSidePropsResult<any>>

export default function withAuth(
	accountTypeAllowed: Array<"user" | "company" | "admin">,
	gssp: gsspType
) {
	return async function (context: GetServerSidePropsContext) {
		const { "findzy.token": token } = parseCookies(context)

		const decodedToken = validateToken(token)

		if (!decodedToken) {
			return {
				redirect: {
					permanent: false,
					destination: "/login",
				},
			}
		}

		if (
			decodedToken.accountType === "user" &&
			accountTypeAllowed.indexOf("user") !== -1
		) {
			const userData = await getUser(decodedToken.sub!)

			if (!userData)
				return {
					redirect: {
						permanent: false,
						destination: "/login",
					},
				}

			return await gssp({ context, data: userData, accountType: "user" })
		}

		if (
			decodedToken.accountType === "company" &&
			accountTypeAllowed.indexOf("company") !== -1
		) {
			const companyData = await getCompany(decodedToken.sub!)

			if (!companyData)
				return {
					redirect: {
						permanent: false,
						destination: "/login",
					},
				}

			return await gssp({
				context,
				data: companyData,
				accountType: "company",
			})
		}

		return {
			redirect: {
				permanent: false,
				destination: "/login",
			},
		}
	}
}
