import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import router from "./routes/app.router";

const PORT = 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use(morgan('dev'))

app.use("/api", router)

//app.use("/", (req, res) => {
//  res.send('hola!')
//})

app.listen(PORT, () => {
    console.log(`Servidor ejecutado en puerto ${PORT}`)
})