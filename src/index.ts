require('dotenv').config()
import express, { Request, Response } from 'express'
import adminRouter from './router/adminRouter'
import Logger from './util/loggerUtil'
import { initDbConnection } from './accessor/databaseConnectionInitializer'
import { initModel } from './model/modelInitializer'
import { employeeEntity } from './model/employeeEntity'
import LoggerUtil from './util/loggerUtil'

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

app.post('/signup', async function (request: Request, response: Response) {
    // Insert a new user into the database
    const newUser = await employeeEntity.create({
        email: request.body.email,
        password: request.body.password,
        company_id: request.body.company_id,
    })
    response.send(newUser)
})

app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('Healthy!')
})

// Use the external router for the specific path
app.use('/admin', adminRouter)

app.use('*', (req: Request, res: Response) => {
    Logger.log(DOMAIN, `Unhandled path: ${req.originalUrl}`)
    res.status(404).send('Not Found')
})

app.listen(port, () => {
    Logger.log(DOMAIN, `Server is running on http://localhost:${port}`)
})
