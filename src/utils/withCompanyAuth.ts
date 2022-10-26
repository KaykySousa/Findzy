import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { parseCookies } from "nookies"
import getCompany from "./getCompany"

type gsspType = (data: {
	context: GetServerSidePropsContext
	data: { name: string; email: string }
}) => Promise<GetServerSidePropsResult<any>>

export default function withCompanyAuth(gssp: gsspType) {
	return async function (context: GetServerSidePropsContext) {
		const { "findzy.token": token } = parseCookies(context)

		const companyData = await getCompany(token)

		if (!companyData)
			return {
				redirect: {
					permanent: false,
					destination: "/login",
				},
			}

		return await gssp({ context, data: companyData })
	}
}
