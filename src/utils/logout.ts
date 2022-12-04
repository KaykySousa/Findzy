import { NextApiResponse, NextPageContext } from "next"
import Router from "next/router"
import { destroyCookie } from "nookies"

type Logout = (
	ctx?:
		| Pick<NextPageContext, "res">
		| { res: NextApiResponse }
		| null
		| undefined
) => void

const logout: Logout = (ctx) => {
	destroyCookie(ctx, "findzy.token", {
		path: "/",
	})
	Router.push("/")
}

export default logout
