import { Header } from "@/components/index"
import SEO from "@/components/SEO"
import prisma from "@/prisma/client"
import withAuth from "@/utils/withAuth"
import { useRouter } from "next/router"

interface UserNotificationsProps {
	notifications: {
		content: string
	}[]
}

export default function UserNotifications({
	notifications,
}: UserNotificationsProps) {
	const router = useRouter()

	return (
		<div className="flex min-h-screen w-full flex-col bg-white">
			<SEO title="Início" description="Página inicial." />
			<Header />
			{notifications.length > 0 ? (
				<div className="flex w-full flex-col items-center gap-y-2 p-2 md:p-0 md:py-4">
					{notifications.map((notification, index) => (
						<div
							className="w-full max-w-3xl rounded-md border border-gray-300 p-4"
							key={index}
						>
							{notification.content}
						</div>
					))}
				</div>
			) : (
				<div className="flex w-full flex-1 items-center justify-center">
					<p className="text-gray-600">Não há notificações</p>
				</div>
			)}
		</div>
	)
}

export const getServerSideProps = withAuth(["company"], async ({ data }) => {
	const companyNotifications = await prisma.companyNotification.findMany({
		where: {
			company_id: data.id,
		},
		select: {
			content: true,
		},
	})

	return {
		props: {
			notifications: companyNotifications,
		},
	}
})
