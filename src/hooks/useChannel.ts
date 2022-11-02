import { Types } from "ably"
import { Realtime } from "ably/promises"
import { useEffect } from "react"

const ably = new Realtime.Promise({
	authUrl: "/api/ably-token",
})

export default function useChannel(
	channelName: string,
	callbackOnMessage: (message: Types.Message) => void
) {
	const channel = channelName ? ably.channels.get(channelName) : null

	useEffect(() => {
		if (!channel) return

		channel.subscribe((message) => {
			callbackOnMessage(message)
		})
		return () => {
			channel.unsubscribe()
		}
	})

	return channel
}
