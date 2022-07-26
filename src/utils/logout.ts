import { NextApiResponse, NextPageContext } from "next"
import { destroyCookie } from "nookies"

type Logout = (
	ctx?: Pick<NextPageContext, "res"> | { res: NextApiResponse } | null
) => void

const logout: Logout = (ctx) => {
	destroyCookie(ctx, "findzy.token", {
		path: "/",
	})
}

export default logout
