import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { parseCookies } from "nookies"
import getAdmin from "./getAdmin"
import getCompanyById from "./getCompanyById"
import getUserById from "./getUserById"
import validateToken from "./validateToken"

type gsspType = (data: {
	context: GetServerSidePropsContext
	data: { [key: string]: any }
	accountType: "user" | "company" | "admin"
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
			const userData = await getUserById(decodedToken.sub!)

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
			const companyData = await getCompanyById(decodedToken.sub!)

			if (!companyData)
				return {
					redirect: {
						permanent: false,
						destination: "/login",
					},
				}

			if (companyData.status === "review")
				return {
					redirect: {
						permanent: false,
						destination: "/company/review",
					},
				}

			if (companyData.status === "invalid")
				return {
					redirect: {
						permanent: false,
						destination: "/company/invalid",
					},
				}

			if (companyData.status === "banned")
				return {
					redirect: {
						permanent: false,
						destination: "/company/banned",
					},
				}

			return await gssp({
				context,
				data: companyData,
				accountType: "company",
			})
		}

		if (
			decodedToken.accountType === "admin" &&
			accountTypeAllowed.indexOf("admin") !== -1
		) {
			const adminData = await getAdmin(decodedToken.sub!)

			if (!adminData)
				return {
					redirect: {
						permanent: false,
						destination: "/login",
					},
				}

			return await gssp({
				context,
				data: adminData,
				accountType: "admin",
			})
		}

		const userData = await getUserById(decodedToken.sub!)

		if (userData)
			return {
				redirect: {
					permanent: false,
					destination: "/",
				},
			}

		const companyData = await getCompanyById(decodedToken.sub!)

		if (companyData)
			return {
				redirect: {
					permanent: false,
					destination: `/company/${companyData.id}`,
				},
			}

		const adminData = await getAdmin(decodedToken.sub!)

		if (adminData)
			return {
				redirect: {
					permanent: false,
					destination: `/admin`,
				},
			}

		return {
			redirect: {
				permanent: false,
				destination: "/login",
			},
		}
	}
}
