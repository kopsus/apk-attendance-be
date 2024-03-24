require('dotenv').config()
import express, { Request, Response } from 'express'
import adminRouter from './router/adminRouter'
import Logger from './util/loggerUtil'
import { initDbConnection } from './accessor/databaseConnectionInitializer'
import { initModel } from './model/modelInitializer'
import { employeeEntity } from './model/employeeEntity'
import LoggerUtil from './util/loggerUtil'
import bcrypt from 'bcrypt'

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

app.post('/signup', async function (req: Request, res: Response) {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        // Insert a new user into the database
        const newUser = await employeeEntity.create({
            email: req.body.email,
            password: hashedPassword,
            company_id: req.body.company_id,
        })

        // Response status code 200
        res.send({
            success: true,
            data: {},
            message: 'Data Created',
            code: 200,
        })
    } catch (error) {
        // TO DO: Handle error
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.post('/login', async function (req: Request, res: Response) {
    try {
        // Checking if the user exists in the database
        const userPassword = await employeeEntity.findOne({
            attributes: ['password'],
            where: {
                email: req.body.email,
            },
        })

        const hashedPassword = userPassword?.get('password')

        // Check if the password is valid
        if (typeof hashedPassword !== 'string' || hashedPassword === null) {
            res.status(400).send({ error: 'Invalid Password' })
            return
        }

        // Compare the password
        const match = await bcrypt.compare(req.body.password, hashedPassword)
        if (match) {
            res.send({
                success: true,
                data: {},
                message: 'Login Successfully',
                code: 200,
            })
        } else {
            res.status(401).json({ error: 'Invalid Email or Password' })
        }
    } catch (err) {
        console.error('Error authenticating user:', err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
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
