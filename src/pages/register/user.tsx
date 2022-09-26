import { Button, Input, LinkButton } from "@/design/index"
import { api } from "@/services/axios"
import { UserRegisterResponseData } from "@/types/api"
import CustomError from "@/utils/CustomError"
import axios from "axios"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import { setCookie } from "nookies"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"

export default function RegisterUser() {
	const [name, setName] = useState("")
	const [birthdate, setBirthdate] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [passwordConfirmation, setPasswordConfirmation] = useState("")

	const router = useRouter()

	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()

		try {
			if (password !== passwordConfirmation) {
				throw new CustomError("As senhas não conferem")
			}

			setLoading(true)

			const { data: registerResponse } =
				await api.post<UserRegisterResponseData>("/api/register/user", {
					name,
					birthdate,
					email,
					password,
				})

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
						Cadastre-se e encontre seu objeto com uma facilidade
						nunca antes vista
					</p>
					<form
						id="user-register-form"
						className="mb-12 flex w-full flex-col gap-y-6"
						onSubmit={handleSubmit}
					>
						<Input
							placeholder="Nome"
							required
							value={name}
							onChange={(e) => {
								setName(e.target.value)
							}}
						/>
						<Input
							type="date"
							placeholder="Data de Nascimento"
							min="1900-01-01"
							max={dayjs()
								.subtract(16, "years")
								.format("YYYY-MM-DD")}
							required
							value={birthdate}
							onChange={(e) => {
								setBirthdate(e.target.value)
							}}
						/>
						<Input
							type="email"
							placeholder="Email"
							required
							value={email}
							onChange={(e) => {
								setEmail(e.target.value)
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
						Encontrar meu item
					</Button>
					<LinkButton
						href="/login"
						className="lg:hidden"
						theme="secondary"
					>
						Já possui uma conta? Entre
					</LinkButton>
				</div>
			</div>

			<div className="hidden w-2/5 flex-col items-center justify-center gap-y-12 bg-purple-700 p-12 lg:flex">
				<p className="text-center text-3xl font-bold text-white">
					Já possui uma conta no Findzy e caiu aqui por engano?
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
