import { Header } from "@/components/index"
import SEO from "@/components/SEO"
import SettingsInput from "@/components/SettingsInput"
import { api } from "@/services/axios"
import logout from "@/utils/logout"
import withAuth from "@/utils/withAuth"
import {
	ArrowRightOnRectangleIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { useState } from "react"

interface SettingsPageProps {
	userData: {
		[key: string]: any
	}
}

export default function SettingsPage({ userData }: SettingsPageProps) {
	const [name, setName] = useState(userData.name)
	const [email, setEmail] = useState(userData.email)
	const [phone, setPhone] = useState(userData.phone)

	async function updateData(body: { [key: string]: any }) {
		const user = await api.patch("/api/update-user", body)
	}

	return (
		<div className="flex min-h-screen w-full flex-col items-center">
			<SEO title="Configurações" description="Configurar sua conta" />
			<Header showInput={false} className="hidden md:flex" />
			<div className="flex w-full max-w-2xl flex-1 flex-col rounded-md border-gray-100 p-5 md:my-5 md:border md:py-4">
				<div className="relative flex w-full items-center justify-center">
					<h1 className="text-lg font-bold text-purple-700">
						CONFIGURAÇÕES
					</h1>

					<Link href="/">
						<div className="absolute right-0">
							<XMarkIcon className=" h-6 w-6 text-red-600" />
						</div>
					</Link>
				</div>

				<div className="mt-5 flex flex-1 flex-col gap-y-6">
					<SettingsInput
						labelName="Nome de usuário"
						description="Altere seu nome visível para os estabelecimentos."
						value={name}
						onChange={(e) => {
							setName(e.target.value)
						}}
						onSave={() => {
							updateData({ name })
						}}
					/>
					<SettingsInput
						labelName="E-mail"
						description="Altere o e-mail da sua conta."
						value={email}
						onChange={(e) => {
							setEmail(e.target.value)
						}}
						onSave={() => {
							updateData({ email })
						}}
					/>
				</div>

				<div className="mt-4 flex w-full flex-col items-center">
					<button
						type="button"
						className="flex items-center justify-center py-2 font-bold text-gray-800"
						onClick={() => {
							logout()
						}}
					>
						Sair
						<ArrowRightOnRectangleIcon className="ml-1 h-6 w-6" />
					</button>
					{/* <button
						type="button"
						className="flex items-center justify-center py-2 font-bold text-red-800"
						onClick={deleteCompany}
					>
						Deletar Conta
						<TrashIcon className="ml-1 h-6 w-6" />
					</button> */}
				</div>
			</div>
		</div>
	)
}

export const getServerSideProps = withAuth(["user"], async ({ data }) => {
	return {
		props: {
			userData: {
				name: data.name,
				id: data.id,
				email: data.email,
			},
		},
	}
})
