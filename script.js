import { config } from "dotenv"
config()

import { Configuration, OpenAIApi } from "openai"
import readline from "readline"
import io from "socket.io-client"

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.API_KEY
}))

const socket = io("http://localhost:4000") // Thay đổi địa chỉ và cổng phù hợp với ứng dụng của bạn

socket.on("message", async message => {
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
  })
  console.log(res.data.choices[0].message.content)
})

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

userInterface.prompt()
userInterface.on("line", input => {
  socket.emit("message", input)
  userInterface.prompt()
})
