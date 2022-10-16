import getCompany from "@/utils/getCompany"
import getUser from "@/utils/getUser"
import { GetServerSideProps } from "next"
import { parseCookies } from "nookies"

export default function Index() {
	return <div></div>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { "findzy.token": token } = parseCookies(ctx)

	const userData = await getUser(token)

	if (userData)
		return {
			redirect: {
				permanent: false,
				destination: "/user",
			},
		}

	const companyData = await getCompany(token)

	if (companyData)
		return {
			redirect: {
				permanent: false,
				destination: "/company",
			},
		}

	return {
		redirect: {
			permanent: false,
			destination: "/login",
		},
	}
}
