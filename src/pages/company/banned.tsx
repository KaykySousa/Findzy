import { Button } from "@/components/design"
import { Logo } from "@/components/index"
import SEO from "@/components/SEO"
import prisma from "@/prisma/client"
import getCompanyById from "@/utils/getCompanyById"
import logout from "@/utils/logout"
import validateToken from "@/utils/validateToken"
import { GetServerSideProps } from "next"
import { parseCookies } from "nookies"

interface BannedProps {
	reason: string
}

export default function Banned({ reason }: BannedProps) {
	return (
		<div className="flex min-h-screen w-full flex-col items-center p-10">
			<SEO
				title="Conta banida"
				description="A conta foi banida. Entre em contato para mais informações."
			/>
			<Logo className="!text-xl" />
			<div className="flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-y-6">
				<h1 className="text-6xl font-bold text-purple-700">
					CONTA BANIDA
				</h1>
				<p className="text-center text-3xl">Motivo: {reason}</p>
				<p className="text-center text-3xl">
					Para mais informações entre em contato:{" "}
					<span className="text-purple-700">
						contato.findzy@gmail.com
					</span>
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

	if (company.status !== "banned")
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
		}

	const banDetails = await prisma.bannedCompany.findFirst({
		where: {
			company_id: decodedToken.sub!,
		},
		select: {
			reason: true,
			id: true,
		},
	})

	return {
		props: {
			reason: banDetails?.reason,
		},
	}
}
