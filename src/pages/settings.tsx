import getCompanyById from "@/utils/getCompanyById"
import getUserById from "@/utils/getUserById"
import validateToken from "@/utils/validateToken"
import { GetServerSideProps } from "next"
import { parseCookies } from "nookies"

export default function Settings() {
	return <div></div>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { "findzy.token": token } = parseCookies(ctx)

	const decodedToken = validateToken(token)

	if (!decodedToken) {
		return {
			redirect: {
				permanent: false,
				destination: "/user/settings",
			},
		}
	}

	const userData = await getUserById(decodedToken.sub!)

	if (userData)
		return {
			redirect: {
				permanent: false,
				destination: "/user/settings",
			},
		}

	const companyData = await getCompanyById(decodedToken.sub!)

	if (companyData)
		return {
			redirect: {
				permanent: false,
				destination: `/company/settings`,
			},
		}

	return {
		redirect: {
			permanent: false,
			destination: "/login",
		},
	}
}
