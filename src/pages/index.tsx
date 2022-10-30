import getCompany from "@/utils/getCompany"
import getUser from "@/utils/getUser"
import validateToken from "@/utils/validateToken"
import { GetServerSideProps } from "next"
import { parseCookies } from "nookies"

export default function Index() {
	return <div></div>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { "findzy.token": token } = parseCookies(ctx)

	const decodedToken = validateToken(token)

	if (!decodedToken) {
		return {
			redirect: {
				permanent: false,
				destination: "/login",
			},
		}
	}

	const userData = await getUser(decodedToken.sub!)

	if (userData)
		return {
			redirect: {
				permanent: false,
				destination: "/user",
			},
		}

	const companyData = await getCompany(decodedToken.sub!)

	if (companyData)
		return {
			redirect: {
				permanent: false,
				destination: `/company/${companyData.id}`,
			},
		}

	return {
		redirect: {
			permanent: false,
			destination: "/login",
		},
	}
}
