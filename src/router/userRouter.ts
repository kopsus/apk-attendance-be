import { Request, Response, Router } from 'express'
import { employeeEntity } from '../model/employeeEntity'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const DOMAIN = 'User Router'

const userRouter = Router()

userRouter.post('/signup', async function (req: Request, res: Response) {
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
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

userRouter.post('/login', async function (req: Request, res: Response) {
    try {
        // Checking if the user exists in the database
        const user = await employeeEntity.findOne({
            attributes: ['id', 'password'],
            where: {
                email: req.body.email,
            },
        })

        const hashedPassword = user?.get('password')

        // Check if the password is valid
        if (typeof hashedPassword !== 'string' || hashedPassword === null) {
            res.status(400).send({ error: 'Invalid Password' })
            return
        }

        // Compare the password
        const match = await bcrypt.compare(req.body.password, hashedPassword)
        if (match) {
            const access_token = jwt.sign(
                { userId: user?.get('id') },
                'EternalPlus@100',
                {
                    expiresIn: '1w',
                },
            )

            res.send({
                success: true,
                data: { access_token },
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

export default userRouter
