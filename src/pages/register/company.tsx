import { Anchor, Button, Input, LinkButton } from "@/design/index"
import { api } from "@/services/axios"
import { CompanyRegisterResponseData } from "@/types/api"
import CustomError from "@/utils/CustomError"
import axios from "axios"
import { useRouter } from "next/router"
import { setCookie } from "nookies"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"

interface AddressData {
	logradouro: string
	bairro: string
	localidade: string
	uf: string
}

export default function RegisterUser() {
	const [name, setName] = useState("")
	const [cnpj, setCnpj] = useState("")
	const [cep, setCep] = useState("")
	const [number, setNumber] = useState("")
	const [email, setEmail] = useState("")
	const [phone, setPhone] = useState("")
	const [password, setPassword] = useState("")
	const [passwordConfirmation, setPasswordConfirmation] = useState("")

	const [address, setAddress] = useState<AddressData | null>(null)

	const router = useRouter()

	const [loading, setLoading] = useState(false)

	async function getAddressByCep() {
		try {
			const { data: address } = await axios.get(
				`https://viacep.com.br/ws/${cep}/json/`,
				{}
			)

			if (address.erro) throw new CustomError("CPF Inválido")

			setAddress({
				bairro: address.bairro,
				localidade: address.localidade,
				logradouro: address.logradouro,
				uf: address.uf,
			})
		} catch (err) {
			if (err instanceof Error) {
				setAddress(null)
				toast.error(err.message)
			}
		}
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()

		try {
			if (password !== passwordConfirmation) {
				throw new CustomError("As senhas não conferem")
			}
			setLoading(true)

			const { data: registerResponse } =
				await api.post<CompanyRegisterResponseData>(
					"/api/register/company",
					{
						name,
						email,
						password,
					}
				)

			setCookie(null, "findzy.token", registerResponse.token, {
				path: "/",
				maxAge: 60 * 60, // 1 hour
			})

			router.push("/")
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const error = (err.response?.data as any).error
				toast.error(error)
			} else if (err instanceof Error) {
				toast.error(err.message)
			}

			setLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen w-full">
			<div className="flex flex-1 flex-col items-center p-5 md:justify-center lg:p-10">
				<span className="mb-4 hidden self-start text-xl text-purple-700 lg:block">
					<strong>Findzy</strong> Perdeu? Achou!
				</span>
				<div className="flex w-full max-w-xl flex-1 flex-col items-center md:justify-center">
					<span className="mb-4 text-lg font-bold text-purple-700 md:text-3xl lg:hidden">
						Findzy
					</span>
					<span className="mb-4 hidden text-3xl font-bold text-purple-700 lg:block">
						Bem-vindo!
					</span>
					<p className="mb-12 text-center text-purple-700">
						Cadastre sua empresa e ajude a sua comunidade e clientes
						a encontrarem seus objetos perdidos
					</p>
					<form
						id="user-register-form"
						className="mb-12 flex w-full flex-col gap-y-6"
						onSubmit={handleSubmit}
					>
						<Input
							placeholder="Nome da Empresa"
							required
							value={name}
							onChange={(e) => {
								setName(e.target.value)
							}}
						/>
						<Input
							placeholder="CNPJ"
							mask="cnpj"
							required
							value={cnpj}
							onChange={(e) => {
								setCnpj(e.target.value)
							}}
						/>
						<div className="flex w-full flex-col gap-y-6 md:flex-row md:gap-x-6">
							<div className="w-full">
								<Input
									placeholder="CEP"
									mask="cep"
									required
									value={cep}
									onChange={(e) => {
										setCep(e.target.value)
									}}
									onBlur={(e) => {
										if (e.target.value.length === 8) {
											getAddressByCep()
										}
									}}
								/>
								<Anchor
									className="mt-2"
									href="https://buscacepinter.correios.com.br/app/endereco/index.php"
									target="_blank"
									rel="noopener noreferrer"
								>
									Não sabe o seu CEP?
								</Anchor>
								<p className="text-sm text-slate-500">
									{address &&
										`${address.logradouro} - ${address.bairro} - ${address.localidade} - ${address.uf}`}
								</p>
							</div>
							<Input
								placeholder="Número"
								required
								value={number}
								onChange={(e) => {
									setNumber(e.target.value)
								}}
							/>
						</div>
						<Input
							type="email"
							placeholder="Email"
							required
							value={email}
							onChange={(e) => {
								setEmail(e.target.value)
							}}
						/>
						<Input
							type="email"
							placeholder="Telefone"
							required
							value={phone}
							onChange={(e) => {
								setPhone(e.target.value)
							}}
						/>
						<div className="flex w-full flex-col gap-y-6 md:flex-row md:gap-x-6">
							<Input
								placeholder="Senha"
								minLength={8}
								togglePassword
								required
								value={password}
								onChange={(e) => {
									setPassword(e.target.value)
								}}
							/>
							<Input
								placeholder="Repita a senha"
								minLength={8}
								togglePassword
								required
								value={passwordConfirmation}
								onChange={(e) => {
									setPasswordConfirmation(e.target.value)
								}}
							/>
						</div>
					</form>
					<Button
						type="submit"
						form="user-register-form"
						className="mb-2"
						loading={loading}
					>
						Iniciar Solicitação
					</Button>
					<LinkButton
						href="/login"
						className="lg:hidden"
						theme="secondary"
					>
						Empresa já cadastrada? Entre
					</LinkButton>
				</div>
			</div>

			<div className="hidden w-2/5 flex-col items-center justify-center gap-y-12 bg-purple-700 p-12 lg:flex">
				<p className="text-center text-3xl font-bold text-white">
					Sua empresa já está cadastrada?
				</p>
				<LinkButton
					href="/login"
					buttonClassName="border-2 border-white"
				>
					Entre agora
				</LinkButton>
			</div>
		</div>
	)
}
