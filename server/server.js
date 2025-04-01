import ollama from 'ollama'
import { WebSocketServer } from 'ws';
import markdownit from 'markdown-it'
import fs from 'fs'

const wss = new WebSocketServer({
	port: 5173
})

const users = {}

wss.on('connection', function connection(ws) {
	ws.on('error', console.error);

	ws.on('message', async (data) => {
		const userMsg = data.toString()
		// const userData = JSON.parse(data.toString())
		// let user = users[userData.uid]

		// if (!user) {
		// 	user = users[userData.uid] = {
		// 		history: [
		// 			// {
		// 			// 	role: 'system',
		// 			// 	content: 'Ты — злобная девушка Гёха, которая постоянно говорит о шпротах.'
		// 			// }
		// 		]
		// 	}
		// }

		// user.history.push({
		// 	role: 'user',
		// 	content: userData.msg
		// })

		const response = await ollama.chat({
			stream: true,
			model: 'gemma3:12b',
			messages: [
				{
					role: 'user',
					content: userMsg
				}
			]
			// messages: user.history,
		})

		// user.history.push(response.message)

		// const md = markdownit()
		// const result = md.render(response.message.content);

		for await (const part of response) {
			ws.send(part.message.content)
		}
	});
});