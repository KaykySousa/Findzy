import Logo from "@/components/Logo"
import prisma from "@/prisma/client"
import { api } from "@/services/axios"
import withAuth from "@/utils/withAuth"
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Address } from "@prisma/client"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-toastify"

interface AdminPageProps {
	adminName: string

	companiesToValidate: {
		name: string
		address: Address | null
		is_validated: boolean
		cnpj: string
		created_at: Date
		email: string
		id: string
		phone: string
		profile_picture_url: string
	}[]

	companyReports: {
		images: {
			image_url: string
		}[]
		id: string
		message: string
		denounced: {
			name: string
			cnpj: string
			email: string
			id: string
			phone: string
		}
		denouncer: {
			name: string
			email: string
			id: string
		}
	}[]

	userReports: {
		images: {
			image_url: string
		}[]
		id: string
		message: string
		denounced: {
			name: string
			email: string
			id: string
		}
		denouncer: {
			name: string
			cnpj: string
			email: string
			id: string
			phone: string
		}
	}[]
}

export default function AdminPage({
	adminName,
	companiesToValidate,
	companyReports,
	userReports,
}: AdminPageProps) {
	const [page, setPage] = useState<
		"validations" | "companyReports" | "userReports"
	>("validations")

	const router = useRouter()

	async function handleCompanyStatus(
		companyId: string,
		status: "review" | "valid" | "invalid"
	) {
		try {
			const companyStatusRes = await api.post("/api/company-status", {
				companyId,
				status,
			})

			if (companyStatusRes.data.company.status === "valid") {
				toast.success(
					`Empresa ${companyStatusRes.data.company.name} validada`
				)
			} else if (companyStatusRes.data.company.status === "invalid") {
				toast.success(
					`Empresa ${companyStatusRes.data.company.name} invalidada`
				)
			}

			router.reload()
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
			<header className="mb-4 flex h-14 w-full items-center border-b border-gray-100 bg-white px-8">
				<Logo />
				<div className="ml-8 flex w-full items-center gap-x-4">
					<button
						className={`h-12 px-2 text-purple-700 ${
							page === "validations" ? "font-bold" : ""
						}`}
						onClick={() => {
							setPage("validations")
						}}
					>
						Validações
					</button>
					<button
						className={`h-12 px-2 text-purple-700 ${
							page === "companyReports" ? "font-bold" : ""
						}`}
						onClick={() => {
							setPage("companyReports")
						}}
					>
						Denúncias de Estabelecimentos
					</button>
					<button
						className={`h-12 px-2 text-purple-700 ${
							page === "userReports" ? "font-bold" : ""
						}`}
						onClick={() => {
							setPage("userReports")
						}}
					>
						Denúncias de Usuários
					</button>
				</div>
				<p>{adminName}</p>
			</header>
			<div className="flex w-full max-w-3xl flex-1">
				{page === "validations" &&
					(companiesToValidate.length > 0 ? (
						<div className="flex w-full flex-1 flex-col gap-y-2">
							{companiesToValidate.map(
								(companyToValidate, index) => (
									<div
										className="relative flex w-full items-center rounded border border-gray-100 bg-white p-4"
										key={index}
									>
										<img
											src={
												companyToValidate.profile_picture_url
											}
											alt={`${companyToValidate.name} logo`}
											className="h-20 w-20 rounded-full border border-gray-100 object-cover"
										/>
										<div className="ml-4 flex flex-1 flex-col">
											<p className="mb-2 font-bold uppercase">
												{companyToValidate.name}
											</p>
											<p className="text-sm text-gray-700">
												<strong>Endereço: </strong>
												{`${
													companyToValidate.address!
														.street
												}, ${
													companyToValidate.address!
														.number
												} - ${
													companyToValidate.address!
														.district
												} - ${
													companyToValidate.address!
														.uf
												}`}
											</p>
											<p className="text-sm text-gray-700">
												<strong>CNPJ: </strong>
												{companyToValidate.cnpj}
											</p>
											<p className="text-sm text-gray-700">
												<strong>E-mail: </strong>
												{companyToValidate.email}
											</p>
											<p className="text-sm text-gray-700">
												<strong>ID: </strong>
												{companyToValidate.id}
											</p>
											<p className="text-sm text-gray-700">
												<strong>Telefone: </strong>
												{companyToValidate.phone}
											</p>
										</div>
										<div className="absolute right-4 z-40 flex gap-x-2">
											<button
												className="h-8 w-8 rounded bg-green-500 p-1 transition-colors hover:bg-green-600"
												onClick={() => {
													handleCompanyStatus(
														companyToValidate.id,
														"valid"
													)
												}}
											>
												<CheckIcon className="h-full w-full text-white" />
											</button>
											<button
												className="h-8 w-8 rounded bg-red-500 p-1 transition-colors hover:bg-red-600"
												onClick={() => {
													handleCompanyStatus(
														companyToValidate.id,
														"invalid"
													)
												}}
											>
												<XMarkIcon className="h-full w-full text-white" />
											</button>
										</div>
									</div>
								)
							)}
						</div>
					) : (
						<div className="flex w-full flex-1 items-center justify-center">
							<p className="text-lg text-gray-600">
								Não há solicitações de validação
							</p>
						</div>
					))}

				{page === "companyReports" &&
					(companyReports.length > 0 ? (
						<div className="flex w-full flex-1 flex-col gap-y-2">
							{companyReports.map((report, index) => (
								<div
									className="relative flex w-full flex-col justify-center rounded border border-gray-100 bg-white p-4"
									key={index}
								>
									<p className="mb-2 font-bold uppercase">
										{report.denounced.name}
									</p>
									<p className="text-sm text-gray-700">
										<strong>ID: </strong>
										{report.denounced.id}
									</p>
									<p className="text-sm text-gray-700">
										<strong>E-mail: </strong>
										{report.denounced.email}
									</p>
									<p className="text-sm text-gray-700">
										<strong>Telefone: </strong>
										{report.denounced.phone}
									</p>
									<p className="text-sm text-gray-700">
										<strong>CNPJ: </strong>
										{report.denounced.cnpj}
									</p>
									<p className="mb-2 mt-2 font-bold uppercase">
										DENUNCIANTE
									</p>
									<p className="text-sm text-gray-700">
										<strong>ID: </strong>
										{report.denouncer.id}
									</p>
									<p className="text-sm text-gray-700">
										<strong>Nome: </strong>
										{report.denouncer.name}
									</p>
									<p className="text-sm text-gray-700">
										<strong>E-mail: </strong>
										{report.denouncer.email}
									</p>
									<p className="mb-2 mt-2 font-bold uppercase">
										DESCRIÇÃO
									</p>
									<p className="text-sm text-gray-700">
										{report.message}
									</p>
									<p className="mb-2 mt-2 font-bold uppercase">
										COMPROVAÇÕES
									</p>
									{report.images.map((image, index) => (
										<Link
											href={image.image_url}
											key={index}
										>
											<a className="text-sm text-purple-700">
												Prova {index + 1}
											</a>
										</Link>
									))}
								</div>
							))}
						</div>
					) : (
						<div className="flex w-full flex-1 items-center justify-center">
							<p className="text-lg text-gray-600">
								Não há denúncias de empresas
							</p>
						</div>
					))}

				{page === "userReports" &&
					(userReports.length > 0 ? (
						<div className="flex w-full flex-1 flex-col gap-y-2">
							{userReports.map((report, index) => (
								<div
									className="relative flex w-full flex-col justify-center rounded border border-gray-100 bg-white p-4"
									key={index}
								>
									<p className="mb-2 font-bold uppercase">
										{report.denounced.name}
									</p>
									<p className="text-sm text-gray-700">
										<strong>ID: </strong>
										{report.denounced.id}
									</p>
									<p className="text-sm text-gray-700">
										<strong>E-mail: </strong>
										{report.denounced.email}
									</p>
									<p className="mb-2 mt-2 font-bold uppercase">
										DENUNCIANTE
									</p>
									<p className="text-sm text-gray-700">
										<strong>ID: </strong>
										{report.denouncer.id}
									</p>
									<p className="text-sm text-gray-700">
										<strong>Nome: </strong>
										{report.denouncer.name}
									</p>
									<p className="text-sm text-gray-700">
										<strong>E-mail: </strong>
										{report.denouncer.email}
									</p>
									<p className="text-sm text-gray-700">
										<strong>Telefone: </strong>
										{report.denouncer.phone}
									</p>
									<p className="text-sm text-gray-700">
										<strong>CNPJ: </strong>
										{report.denouncer.cnpj}
									</p>
									<p className="mb-2 mt-2 font-bold uppercase">
										DESCRIÇÃO
									</p>
									<p className="text-sm text-gray-700">
										{report.message}
									</p>
									<p className="mb-2 mt-2 font-bold uppercase">
										COMPROVAÇÕES
									</p>
									{report.images.map((image, index) => (
										<Link
											href={image.image_url}
											key={index}
										>
											<a className="text-sm text-purple-700">
												Prova {index + 1}
											</a>
										</Link>
									))}
								</div>
							))}
						</div>
					) : (
						<div className="flex w-full flex-1 items-center justify-center">
							<p className="text-lg text-gray-600">
								Não há denúncias de usuários
							</p>
						</div>
					))}
			</div>
		</div>
	)
}

export const getServerSideProps = withAuth(["admin"], async ({ data }) => {
	const companiesToValidate = await prisma.company.findMany({
		where: {
			status: "review",
		},
		select: {
			address: {
				select: {
					cep: true,
					city: true,
					district: true,
					number: true,
					street: true,
					uf: true,
				},
			},
			cnpj: true,
			// created_at: true,
			email: true,
			id: true,
			status: true,
			name: true,
			phone: true,
			profile_picture_url: true,
		},
	})

	const companyReports = await prisma.companyReport.findMany({
		select: {
			id: true,
			denounced: {
				select: {
					id: true,
					name: true,
					email: true,
					phone: true,
					cnpj: true,
				},
			},
			denouncer: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			images: {
				select: {
					image_url: true,
				},
			},
			message: true,
		},
	})

	const userReports = await prisma.userReport.findMany({
		select: {
			id: true,
			denounced: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			denouncer: {
				select: {
					id: true,
					name: true,
					email: true,
					phone: true,
					cnpj: true,
				},
			},
			images: {
				select: {
					image_url: true,
				},
			},
			message: true,
		},
	})

	return {
		props: {
			adminName: data.name,
			companiesToValidate,
			companyReports,
			userReports,
		},
	}
})
