import { Logo } from "@/components/index"
import SEO from "@/components/SEO"
import { Anchor, Button, FloatingInput, LinkButton } from "@/design/index"
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

	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()

		try {
			setLoading(true)

			const { data: loginResponse } = await api.post<LoginResponseData>(
				"/api/login",
				{
					email,
					password,
				}
			)

			setCookie(null, "findzy.token", loginResponse.token, {
				path: "/",
				maxAge: 60 * 60 * 24 * 7, // 7 days
				sameSite: "strict",
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
			<SEO
				title="Login"
				description="Ingresse no Findzy e encontre facilmente seu objeto desaparecido"
			/>
			<div className="hidden w-2/5 flex-col bg-purple-700 p-10 lg:flex">
				<div className="flex flex-col justify-center w-full h-full">
					<Logo className="hiden mb-4 !text-xl !text-white lg:block" />
					<div className="flex flex-1 flex-col items-center justify-center gap-y-8">
						<p className="text-center text-3xl font-bold text-white">
							Primeira vez?
						</p>
						<p className="text-center text-lg text-white">
							Conheça a nossa plataforma de achados e perdidos.
						</p>
						<LinkButton href="/register/user" theme="secondary">
							Cadastre-se
						</LinkButton>
					</div>
				</div>
				<p className="mt-4 text-purple-200 text-sm font-semibold text-center">
					É responsável por um estabelecimento?&nbsp;
					<Anchor href="/register/company" className="text-white">
					Cadastre-o agora.
				</Anchor>
				</p>
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
						desaparecido.
					</p>
					<form
						id="login-form"
						className="mb-10 flex w-full flex-col gap-y-6"
						onSubmit={handleSubmit}
					>
						<FloatingInput
							type="email"
							placeholder="Email"
							required
							value={email}
							onChange={(e) => {
								setEmail(e.target.value)
							}}
						/>
						<div className="flex flex-col w-full">
							<FloatingInput
								placeholder="Senha"
								togglePassword
								required
								value={password}
								onChange={(e) => {
									setPassword(e.target.value)
								}}
							/>
							{/* <Anchor href="/forgot-password" theme="second" className="mt-3">
								Esqueci minha senha
							</Anchor> */}
						</div>
					</form>
					<Button
						type="submit"
						form="login-form"
						className="mb-2"
						loading={loading}
					>
						Entrar
					</Button>
					<LinkButton
						href="/register"
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
