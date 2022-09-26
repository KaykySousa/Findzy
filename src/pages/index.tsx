import CompanyCard from "@/components/CompanyCard"
import getUser from "@/utils/getUser"
import {
	ChatBubbleBottomCenterTextIcon,
	Cog8ToothIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
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
		<div className="min-h-screen w-full bg-white">
			<header className="flex h-14 w-full items-center gap-x-4 border-b border-gray-100 bg-white px-2 md:h-16 md:justify-between md:px-8">
				<span className="hidden whitespace-nowrap text-lg text-purple-700 md:block">
					<strong>Findzy</strong> Perdeu? Achou!
				</span>
				<div className="relative flex h-8 w-full items-center md:max-w-3xl">
					<input
						type="text"
						className="h-full w-full cursor-text rounded border-0 bg-gray-100 pl-9 placeholder:text-sm focus:border-purple-700 focus:ring-0"
						placeholder="Buscar por item ou estabelecimento"
					/>
					<MagnifyingGlassIcon className="absolute left-2 h-5 w-5 text-purple-700" />
				</div>
				<div className="flex gap-x-4">
					<ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-purple-700" />
					<Cog8ToothIcon className="h-6 w-6 text-purple-700" />
				</div>
			</header>
			<div className="flex w-full flex-col items-center gap-y-2 p-2 md:p-0 md:py-4">
				<CompanyCard
					company="ETEC da Zona Leste"
					address="Av. Águia de Haia, 2633 - Cidade A. E. Carvalho"
					logoUrl="https://yt3.ggpht.com/ytc/AMLnZu-9lToKfZByYACsoOPzQnckD9O7hJVJRrWaZKZQ5Q=s900-c-k-c0x00ffffff-no-rj"
					itemsNumber={17}
					rating={5}
				/>
				<CompanyCard
					company="Assaí Atacadista"
					address="Av. Águia de Haia, 3362 - Cidade A. E. Carvalho"
					logoUrl="https://gazetaempregosrj.com.br/images/assai-atacadista.jpg"
					itemsNumber={11}
					rating={4.9}
				/>
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
