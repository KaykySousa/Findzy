import TextArea from "@/components/design/TextArea"
import Header from "@/components/Header"
import SEO from "@/components/SEO"
import { api } from "@/services/axios"
import getCompanyById from "@/utils/getCompanyById"
import getUserById from "@/utils/getUserById"
import withAuth from "@/utils/withAuth"
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"

interface ReportProps {
	accountToNotify: {
		[key: string]: any
	}
	accountType: "user" | "company" | "admin"
}

export default function Report({ accountToNotify, accountType }: ReportProps) {
	const [notifyMessage, setNotifyMessage] = useState("")

	const router = useRouter()

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()

		try {
			const notification = await api.post("/api/notify", {
				content: notifyMessage,
				notifyId: accountToNotify.id,
			})

			toast.success(`Conta ${accountToNotify.name} denunciada com êxito`)

			router.push("/")
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const error = (err.response?.data as any).error
				toast.error(error)
			} else if (err instanceof Error) {
				toast.error(err.message)
			}
		}
	}

	return (
		<div className="flex min-h-screen w-full flex-col items-center">
			<SEO description="" title={accountToNotify.name} />
			<Header showInput={false} className="hidden md:flex" />
			<div className="flex w-full max-w-2xl flex-1 flex-col rounded-md border-gray-100 p-5 md:my-5 md:border md:py-4">
				<div className="relative flex w-full items-center justify-center">
					<h1 className="text-lg font-bold text-purple-700">
						NOTIFICAR
					</h1>

					<Link href="/">
						<div className="absolute right-0">
							<XMarkIcon className=" h-6 w-6 text-red-600" />
						</div>
					</Link>
				</div>

				<form
					className="mt-5 flex flex-1"
					id="reportForm"
					onSubmit={handleSubmit}
				>
					<div className="flex flex-1 flex-col gap-y-5">
						<p className="text-center font-bold text-gray-800">
							Você está prestes a notificar{" "}
							<span className="uppercase">
								{accountToNotify.name}
							</span>
							.
						</p>
						<TextArea
							placeholder="Justifique o motivo da notificação"
							value={notifyMessage}
							onChange={(e) => {
								setNotifyMessage(e.target.value)
							}}
						/>
						<button
							type="submit"
							className="flex h-12 w-full items-center justify-center rounded-md border border-transparent font-bold text-red-600 transition-colors hover:border-red-600"
						>
							<ExclamationTriangleIcon className="mr-2 h-5 w-5" />
							Enviar notificação
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export const getServerSideProps = withAuth(
	["admin"],
	async ({ context, accountType }) => {
		const user = await getUserById(context.query.id!.toString(), {
			id: true,
			name: true,
		})

		if (user) {
			return {
				props: {
					accountToNotify: user,
				},
			}
		}

		const company = await getCompanyById(context.query.id!.toString(), {
			id: true,
			name: true,
		})

		if (company) {
			return {
				props: {
					accountToNotify: company,
				},
			}
		}

		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
		}
	}
)
