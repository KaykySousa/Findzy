import { Button } from "@/components/design"
import TextArea from "@/components/design/TextArea"
import Header from "@/components/Header"
import ImageCard from "@/components/ImageCard"
import ImageUpload from "@/components/ImageUpload"
import { api } from "@/services/axios"
import getCompany from "@/utils/getCompany"
import getUser from "@/utils/getUser"
import withAuth from "@/utils/withAuth"
import {
	ExclamationTriangleIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"

interface ReportProps {
	accountToReport: {
		[key: string]: any
	}
	accountType: "user" | "company" | "admin"
}

export default function Report({ accountToReport, accountType }: ReportProps) {
	const [showImageUpload, setShowImageUpload] = useState(false)
	const [reportMessage, setReportMessage] = useState("")
	const [reportImages, setReportImages] = useState<string[]>([])

	const router = useRouter()

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()

		try {
			if (accountType === "user") {
				const companyReport = await api.post("/api/report-company", {
					message: reportMessage,
					images: reportImages,
					denouncedId: accountToReport.id,
				})

				toast.success(
					`Empresa ${companyReport.data.report.denounced.name} denunciada com êxito`
				)

				router.push("/")
			}
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
			<Header showInput={false} className="hidden md:flex" />
			<div className="flex w-full max-w-2xl flex-1 flex-col rounded-md border-gray-100 p-5 md:my-5 md:border md:py-4">
				<div className="relative flex w-full items-center justify-center">
					<h1 className="text-lg font-bold text-purple-700">
						DENÚNCIA
					</h1>

					<Link href="/">
						<a className="absolute right-0">
							<XMarkIcon className=" h-6 w-6 text-red-600" />
						</a>
					</Link>
				</div>

				<form
					className="mt-5 flex flex-1"
					id="reportForm"
					onSubmit={handleSubmit}
				>
					<div className="flex flex-1 flex-col gap-y-5">
						<p className="text-center font-bold text-gray-800">
							Você está prestes a denunciar{" "}
							<span className="uppercase">
								{accountToReport.name}
							</span>
							.
						</p>
						<TextArea
							placeholder="Relate o que aconteceu"
							value={reportMessage}
							onChange={(e) => {
								setReportMessage(e.target.value)
							}}
						/>

						<div className="flex flex-col gap-y-4">
							<p className="text-center font-bold text-gray-800">
								Envie provas da sua acusação.
							</p>
							{reportImages.length > 0 && (
								<div className="flex flex-col gap-y-4">
									{reportImages.map((image, index) => (
										<ImageCard
											key={index}
											imageSrc={image}
											title={`Imagem ${index + 1}`}
											onDelete={() => {
												setReportImages(
													reportImages.filter(
														(
															imageToDel,
															indexToDel
														) => {
															return (
																indexToDel !==
																index
															)
														}
													)
												)
											}}
										/>
									))}
								</div>
							)}
							<Button
								theme="tertiary"
								type="button"
								onClick={() => {
									setShowImageUpload(true)
								}}
							>
								<PlusIcon className="mr-2 h-6 w-6" /> Imagem
							</Button>
						</div>
						<button
							type="submit"
							className="flex h-12 w-full items-center justify-center rounded-md border border-transparent font-bold text-red-600 transition-colors hover:border-red-600"
						>
							<ExclamationTriangleIcon className="mr-2 h-5 w-5" />
							Denunciar conta
						</button>
					</div>
				</form>
			</div>

			{showImageUpload && (
				<ImageUpload
					onUploadButton={(image) => {
						setReportImages([...reportImages, image])
						setShowImageUpload(false)
					}}
					title="Insira uma prova da sua denúncia"
					dropMessage="Arraste sua imagem aqui"
					buttonTitle="Carregar"
					onClose={() => {
						setShowImageUpload(false)
					}}
				/>
			)}
		</div>
	)
}

export const getServerSideProps = withAuth(
	["user", "company"],
	async ({ context, accountType }) => {
		if (accountType === "user") {
			const companyToReport = await getCompany(
				context.query.id!.toString()
			)

			if (!companyToReport) {
				return {
					redirect: {
						permanent: false,
						destination: "/",
					},
				}
			}

			return {
				props: {
					accountType,
					accountToReport: companyToReport,
				},
			}
		}

		if (accountType === "company") {
			const userToReport = await getUser(context.query.id!.toString())

			if (!userToReport) {
				return {
					redirect: {
						permanent: false,
						destination: "/",
					},
				}
			}

			return {
				props: {
					accountType,
					accountToReport: userToReport,
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
