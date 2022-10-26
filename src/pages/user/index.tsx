import CompanyCard from "@/components/CompanyCard"
import { Header } from "@/components/index"
import withUserAuth from "@/utils/withUserAuth"

interface MainUserProps {
	user: {
		name: string
		email: string
		birthdate: string
		exp: string
	}
}

export default function MainUser({ user }: MainUserProps) {
	return (
		<div className="min-h-screen w-full bg-white">
			<Header />
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

export const getServerSideProps = withUserAuth(async ({ data }) => {
	return {
		props: {
			name: data.name,
		},
	}
})
