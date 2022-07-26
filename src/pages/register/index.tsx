import { LinkButton } from "@/design/index"

export default function Register() {
	return (
		<div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-y-2 p-5">
			<LinkButton href="/register/user">Cadastrar usuário</LinkButton>
			<LinkButton href="/register/company" theme="secondary">
				Cadastrar empresa
			</LinkButton>
		</div>
	)
}
