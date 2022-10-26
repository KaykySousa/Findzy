import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { parseCookies } from "nookies"
import getUser from "./getUser"

type gsspType = (data: {
	context: GetServerSidePropsContext
	data: { name: string; email: string; birthdate: Date }
}) => Promise<GetServerSidePropsResult<any>>

export default function withUserAuth(gssp: gsspType) {
	return async function (context: GetServerSidePropsContext) {
		const { "findzy.token": token } = parseCookies(context)

		const userData = await getUser(token)

		if (!userData)
			return {
				redirect: {
					permanent: false,
					destination: "/login",
				},
			}

		return await gssp({ context, data: userData })
	}
}
