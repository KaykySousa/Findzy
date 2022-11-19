import Head from "next/head"

interface SEOProps {
	title?: string
	description?: string
}

export default function SEO({ title, description }: SEOProps) {
	return (
		<Head>
			<title>{title ? `Findzy | ${title}` : "Findzy"}</title>

			{description && (
				<meta
					name="description"
					content={description || "Findzy, perdeu? achou!"}
				/>
			)}
		</Head>
	)
}
