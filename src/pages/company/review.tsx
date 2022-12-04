import { Button } from "@/components/design"
import { Logo } from "@/components/index"
import SEO from "@/components/SEO"
import getCompanyById from "@/utils/getCompanyById"
import logout from "@/utils/logout"
import validateToken from "@/utils/validateToken"
import { GetServerSideProps } from "next"
import { parseCookies } from "nookies"

export default function Review() {
	return (
		<div className="flex min-h-screen w-full flex-col items-center p-10">
			<SEO
				title="Em análise"
				description="Empresa em análise. Tente novamente mais tarde."
			/>
			<Logo className="!text-xl" />
			<div className="flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-y-6">
				<h1 className="text-6xl font-bold text-purple-700">
					EM ANÁLISE
				</h1>
				<p className="text-center text-3xl">
					O processo de análise de uma conta pode demorar até 48
					horas. Tente novamente mais tarde.
				</p>
				<Button
					onClick={() => {
						logout()
					}}
				>
					Sair
				</Button>
			</div>
		</div>
	)
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

	const company = await getCompanyById(decodedToken.sub!)

	if (!company) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
		}
	}

	if (company.status !== "review")
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
		}

	return {
		props: {
			a: "b",
		},
	}
}
