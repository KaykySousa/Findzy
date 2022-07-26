import { Anchor, Button, Input, LinkButton } from "@/design/index"
import { api } from "@/services/axios"
import { LoginResponseData } from "@/types/api"
import axios from "axios"
import { useRouter } from "next/router"
import { setCookie } from "nookies"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"

export default function Login() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const router = useRouter()

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()

		console.log("a")

		try {
			const { data: loginResponse } = await api.post<LoginResponseData>(
				"/api/login",
				{
					email,
					password,
				}
			)

			setCookie(null, "findzy.token", loginResponse.token, {
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
		}
	}

	return (
		<div className="flex min-h-screen w-full">
			<div className="hidden w-2/5 flex-col bg-purple-700 p-10 lg:flex">
				<span className="mb-4 hidden text-xl text-white lg:block">
					<strong>Findzy</strong> Perdeu? Achou!
				</span>
				<div className="flex flex-1 flex-col items-center justify-center gap-y-8">
					<p className="text-center text-3xl font-bold text-white">
						Primeira vez?
					</p>
					<p className="text-center text-lg text-white">
						Conheça a nossa plataforma de achados e perdidos
					</p>
					<LinkButton href="/register" theme="secondary">
						Cadastre-se
					</LinkButton>
				</div>
			</div>
			<div className="flex flex-1 flex-col items-center p-5 md:justify-center lg:p-10">
				<div className="flex w-full max-w-xl flex-1 flex-col items-center md:justify-center">
					<span className="mb-4 text-lg font-bold text-purple-700 md:text-3xl lg:hidden">
						Findzy
					</span>
					<span className="mb-4 hidden text-3xl font-bold text-purple-700 lg:block">
						Entre na sua conta
					</span>
					<p className="mb-12 text-center text-purple-700">
						Ingresse no Findzy e encontre facilmente seu objeto
						desaparecido
					</p>
					<form
						id="login-form"
						className="mb-12 flex w-full flex-col gap-y-6"
						onSubmit={handleSubmit}
					>
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
							placeholder="Senha"
							togglePassword
							required
							value={password}
							onChange={(e) => {
								setPassword(e.target.value)
							}}
						/>
						<Anchor href="/forgot-password">
							Esqueci minha senha
						</Anchor>
					</form>
					<Button type="submit" form="login-form" className="mb-2">
						Entrar
					</Button>
					<LinkButton
						href="/login"
						className="lg:hidden"
						theme="secondary"
					>
						Ainda não possui uma conta? Cadastre-se
					</LinkButton>
				</div>
			</div>
		</div>
	)
}