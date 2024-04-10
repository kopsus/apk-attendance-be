require('dotenv').config()
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import adminRouter from './router/adminRouter'
import Logger from './util/loggerUtil'
import { initDbConnection } from './accessor/databaseConnectionInitializer'
import { initModel } from './model/modelInitializer'
import LoggerUtil from './util/loggerUtil'
import userRouter from './router/userRouter'

const DOMAIN = 'ROOT'

const app = express()
const port = 3000

// Init database
initDbConnection()
    .then(() => {
        initModel()
    })
    .catch((err: Error) => {
        LoggerUtil.info(
            DOMAIN,
            `Error when initialization: ${JSON.stringify(err)}`,
        )
    })

app.use(cors())
app.use(express.json())

app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('Healthy!')
})

// Use the external router for the specific path
app.use('/admin', adminRouter)
app.use('/user', userRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    LoggerUtil.error(DOMAIN, `Got exception: ${err.message}`)
    res.status(500).send()
})

app.listen(port, () => {
    Logger.info(DOMAIN, `Server is running on http://localhost:${port}`)
})
