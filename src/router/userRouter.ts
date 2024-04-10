import { Request, Response, Router } from 'express'
import { employeeEntity } from '../model/employeeEntity'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import AttendanceTimeService from '../service/attendanceTimeService'

const DOMAIN = 'User Router'

const userRouter = Router()

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
            const expiredAt = Date.now() + 7 * 24 * 60 * 60 * 1000
            const accessToken = jwt.sign(
                { userId: user?.get('id') },
                'EternalPlus@100',
                {
                    expiresIn: '1w',
                },
            )

            res.send({
                success: true,
                data: { accessToken,
                    expiredAt: expiredAt,
                 },
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

// Set up Multer for handling multipart/form-data (file uploads)
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

// Endpoint for uploading photos
userRouter.post('/attendance', upload.single('photo'), async (req: Request, res: Response) => {
    const { employeeId, action } = req.body
    const imageId = req.file?.filename || ''

    const newAttendance = await AttendanceTimeService.insertAttendace({
        employeeId: employeeId,
        action: action,
        imageId: imageId,
    })

    if (newAttendance.errorMessage != null) {
        res.status(500).json({ error: newAttendance.errorMessage })
        return
    }

    res.send({
        success: true,
        data: {},
        message:`${action} Successfully`,
        code: 200,
    })
});

userRouter.get(
    '/getHistoryByUserId',
   async (req: Request, res: Response) => {
        const response = await companyService.getCompanyList()
        const curatedResponse = response.map((company) => ({
            id: company.id,
            name: company.name,
        }))
        res.send(curatedResponse)
    })

export default userRouter
