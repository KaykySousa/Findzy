import { HTMLAttributes } from "react"

interface LogoProps extends HTMLAttributes<HTMLParagraphElement> {}

export default function Logo({ className, ...props }: LogoProps) {
	return (
		<p
			className={`whitespace-nowrap text-lg text-purple-700 ${className}`}
			{...props}
		>
			<strong>Findzy</strong> Perdeu? Achou!
		</p>
	)
}
