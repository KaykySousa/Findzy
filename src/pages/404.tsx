import { Logo } from "@/components/index"
import SEO from "@/components/SEO"
import { LinkButton } from "@/design/index"

export default function Error404() {
	return (
		<div className="flex min-h-screen w-full flex-col items-center p-10">
			<SEO title="404" description="Página não encontrada" />
			<Logo className="!text-xl" />
			<div className="flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-y-6">
				<h1 className="text-6xl font-bold text-purple-700">404</h1>
				<p className="text-center text-3xl">
					Poxa... Aqui não tem nada!
				</p>
				<LinkButton href="/">Voltar ao início</LinkButton>
			</div>
		</div>
	)
}
