import { Button } from "@/design/index"
import getUser from "@/utils/getUser"
import logout from "@/utils/logout"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { GetServerSideProps } from "next"
import { parseCookies } from "nookies"

interface HomeProps {
	user: {
		name: string
		email: string
		birthdate: string
		exp: string
	}
}

export default function Home({ user }: HomeProps) {
	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center">
			<h1 className="text-4xl font-bold">FINDZY</h1>
			<p className="mb-32 text-xl">
				Sua plataforma web de Achados e Perdidos
			</p>
			<h1 className="text-4xl font-bold">BEM VINDO, {user.name}</h1>
			<p className="text-xl">Seu email: {user.email}</p>
			<p className="text-xl">Sua data de nascimento: {user.birthdate}</p>
			<p className="text-xl">Sua sessão expirará em: {user.exp}</p>
			<div className="max-w-xl">
				<Button
					onClick={() => {
						logout()
					}}
				>
					Logout
				</Button>
			</div>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { "findzy.token": token } = parseCookies(ctx)
	if (!token)
		return {
			redirect: {
				permanent: false,
				destination: "/register",
			},
		}

	const user = await getUser(token)
	if (!user)
		return {
			redirect: {
				permanent: false,
				destination: "/login",
			},
		}

	dayjs.extend(utc)

	return {
		props: {
			user: {
				name: user.name,
				email: user.email,
				birthdate: dayjs.utc(user.birthdate).format("DD/MM/YYYY"),
				exp: dayjs.unix(user.exp!).format("DD/MM/YYYY HH:mm:ss"),
			},
		},
	}
}
