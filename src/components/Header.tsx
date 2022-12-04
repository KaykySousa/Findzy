import { ItemCard, Logo } from "@/components/index"
import { Input } from "@/design/index"
import { api } from "@/services/axios"
import {
	BellIcon as BellIconOutline,
	ChatBubbleBottomCenterTextIcon as ChatIconOutline,
	ChevronLeftIcon,
	ChevronRightIcon,
	Cog8ToothIcon as CogToothIconOutline,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"

import {
	BellIcon as BellIconSolid,
	ChatBubbleBottomCenterTextIcon as ChatIconSolid,
	Cog8ToothIcon as CogToothIconSolid,
} from "@heroicons/react/24/solid"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

interface HeaderProps {
	showInput?: boolean
	className?: string
}

interface CompanyFoundData {
	id: string
	name: string
	profile_picture_url: string
}

interface ItemsFoundData {
	images: string[]
	id: string
	name: string
	color: string
	description: string
	local: string
}

export default function Header({ showInput = true, className }: HeaderProps) {
	const [showSearch, setShowSearch] = useState(false)
	const [companySliderIndex, setCompanySliderIndex] = useState(0)
	const [searchText, setSearchText] = useState("")
	const [companiesFound, setCompaniesFound] = useState<CompanyFoundData[]>([])
	const [itemsFound, setItemsFound] = useState<ItemsFoundData[]>([])
	const [searchLoading, setSearchLoading] = useState(false)

	const router = useRouter()
	const urlPathname = router.pathname

	useEffect(() => {
		setCompaniesFound([])
		setItemsFound([])
		setSearchLoading(false)

		if (searchText.trim().length < 3) {
			return () => {}
		}

		setSearchLoading(true)

		const timerId = setTimeout(async () => {
			try {
				const companies = await api.post("/api/search/company", {
					searchName: searchText.trim(),
				})

				setCompaniesFound(companies.data.companies)

				const items = await api.post("/api/search/items", {
					searchName: searchText.trim(),
				})

				setItemsFound(items.data.items)

				if (
					!items.data.items.length &&
					!companies.data.companies.length
				) {
					toast.error("Nenhum item corresponde a sua pesquisa")
				}
			} catch (error) {
				if (error instanceof Error) {
					toast.error("Consulta inválida")
				}
			}

			setSearchLoading(false)
		}, 2000)

		return () => clearTimeout(timerId)
	}, [searchText])

	return (
		<>
			<header
				className={`flex h-14 w-full items-center gap-x-4 border-b border-gray-100 bg-white px-2 md:h-16 md:justify-between md:px-8 ${className}`}
			>
				<Logo className="hidden md:block" />
				{showInput && (
					<Input
						icon={
							<MagnifyingGlassIcon className="absolute left-2 h-5 w-5 text-purple-700" />
						}
						placeholder="Buscar por item ou estabelecimento"
						className="md:max-w-3xl"
						inputClassName="!h-8"
						onClick={() => {
							setShowSearch(true)
						}}
					/>
				)}
				<div className="flex gap-x-4">
					<Link href="/notifications">
						{urlPathname.indexOf("/notifications") !== -1 ? (
							<BellIconSolid className="h-6 w-6 text-purple-700" />
						) : (
							<BellIconOutline className="h-6 w-6 text-purple-700" />
						)}
					</Link>
					<Link href="/chat">
						{urlPathname === "/chat" ? (
							<ChatIconSolid className="h-6 w-6 text-purple-700" />
						) : (
							<ChatIconOutline className="h-6 w-6 text-purple-700" />
						)}
					</Link>
					<Link href="/settings">
						{urlPathname.indexOf("/settings") !== -1 ? (
							<CogToothIconSolid className="h-6 w-6 text-purple-700" />
						) : (
							<CogToothIconOutline className="h-6 w-6 text-purple-700" />
						)}
					</Link>
				</div>
			</header>

			{showSearch && (
				<div
					className="fixed top-0 left-0 z-40 flex h-screen w-full justify-center gap-x-8 bg-black bg-opacity-70 backdrop-blur-[2px] md:items-center md:p-4"
					onClick={() => {
						setShowSearch(false)
					}}
				>
					<main
						className="flex w-full max-w-4xl flex-1 flex-col gap-y-6 bg-white p-4 md:rounded-xl md:p-6"
						onClick={(e) => {
							e.stopPropagation()
						}}
					>
						<div className="flex items-center">
							<ChevronLeftIcon
								className="-ml-2 mr-2 h-8 w-8 cursor-pointer text-purple-700 md:hidden"
								onClick={() => {
									setShowSearch(false)
								}}
							/>
							<Input
								type="search"
								icon={
									searchLoading ? (
										<svg
											className="absolute left-2 h-5 w-5 animate-spin text-purple-700"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												opacity="0.2"
												fillRule="evenodd"
												clipRule="evenodd"
												d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
												fill="currentColor"
											/>
											<path
												d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
												fill="currentColor"
											/>
										</svg>
									) : (
										<MagnifyingGlassIcon className="absolute left-2 h-5 w-5 text-purple-700" />
									)
								}
								autoFocus
								placeholder="Buscar por item ou estabelecimento"
								value={searchText}
								onChange={(e) => {
									setSearchText(e.target.value)
								}}
							/>
						</div>
						<div
							className={`w-full flex-col gap-y-6 ${
								searchText &&
								(companiesFound.length || itemsFound.length)
									? "flex"
									: "hidden"
							}`}
						>
							{companiesFound.length > 0 && (
								<div>
									<p className="mb-4 font-bold uppercase text-purple-700">
										ESTABELECIMENTOS
									</p>
									<div className="relative flex w-full items-center justify-between">
										<ChevronLeftIcon
											className="h-8 w-8 cursor-pointer text-purple-700"
											onClick={() => {
												if (companySliderIndex > 0) {
													setCompanySliderIndex(
														companySliderIndex - 1
													)
												}
											}}
										/>
										<div className="w-full overflow-x-hidden">
											<div
												className="flex w-full gap-x-4 transition-transform"
												style={{
													transform: `translate(-${
														companySliderIndex * 100
													}%)`,
												}}
											>
												{companiesFound.map(
													(company, index) => (
														<Link
															key={index}
															href={`/company/${company.id}`}
														>
															<div
																className="flex w-28 flex-shrink-0 cursor-pointer flex-col items-center justify-center"
																onClick={() => {
																	setShowSearch(
																		false
																	)
																}}
															>
																<img
																	className="mb-2 h-20 w-20 rounded-full border border-gray-300"
																	src={
																		company.profile_picture_url
																	}
																	alt=""
																/>
																<p className="text-center text-sm font-bold text-gray-800">
																	{
																		company.name
																	}
																</p>
															</div>
														</Link>
													)
												)}
											</div>
										</div>
										<ChevronRightIcon
											className="h-8 w-8 cursor-pointer text-purple-700"
											onClick={() => {
												if (companySliderIndex < 1) {
													setCompanySliderIndex(
														companySliderIndex + 1
													)
												}
											}}
										/>
									</div>
								</div>
							)}
							{itemsFound.length > 0 && (
								<div>
									<p className="mb-4 font-bold uppercase text-purple-700">
										ITENS
									</p>
									<div className="flex w-full flex-col items-center justify-between gap-x-4 md:flex-row">
										<ChevronLeftIcon
											className="hidden h-8 w-8 cursor-pointer text-purple-700 md:block"
											onClick={() => {
												if (companySliderIndex > 0) {
													setCompanySliderIndex(
														companySliderIndex - 1
													)
												}
											}}
										/>
										<div className="w-full overflow-x-hidden">
											<div
												className="flex w-full gap-x-4 transition-transform"
												style={{
													transform: `translate(-${
														companySliderIndex * 100
													}%)`,
												}}
											>
												{itemsFound.map(
													(item, index) => (
														<ItemCard
															key={index}
															color={item.color}
															description={
																item.description
															}
															images={item.images}
															local={item.local}
															title={item.name}
															className="md:w-72"
														/>
													)
												)}
											</div>
										</div>
										<ChevronRightIcon
											className="hidden h-8 w-8 cursor-pointer text-purple-700 md:block"
											onClick={() => {
												if (companySliderIndex < 1) {
													setCompanySliderIndex(
														companySliderIndex + 1
													)
												}
											}}
										/>
									</div>
								</div>
							)}
						</div>
					</main>
				</div>
			)}
		</>
	)
}
