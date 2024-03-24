require('dotenv').config()
import express, { Request, Response } from 'express'
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
        LoggerUtil.log(
            DOMAIN,
            `Error when initialization: ${JSON.stringify(err)}`,
        )
    })

app.use(express.json())

app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('Healthy!')
})

// Use the external router for the specific path
app.use('/admin', adminRouter)
app.use('/user', userRouter)

app.use('*', (req: Request, res: Response) => {
    Logger.log(DOMAIN, `Unhandled path: ${req.originalUrl}`)
    res.status(404).send('Not Found')
})

app.listen(port, () => {
    Logger.log(DOMAIN, `Server is running on http://localhost:${port}`)
})
