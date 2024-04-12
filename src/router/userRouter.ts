import { Request, Response, Router } from 'express'
import { employeeEntity } from '../model/employeeEntity'
import { companyEntity } from '../model/companyEntity'
import { attendanceTimeEntity } from '../model/attendanceTimeEntity'
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
            attributes: ['id', 'password', 'company_id', 'role', 'name'],
            where: {
                email: req.body.email,
            },
        })

        const company = await companyEntity.findOne({
            attributes: ['name', 'longitude', 'latitude'],
            where: {
                id: user?.get('company_id'),
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
                data: {
                    accessToken,
                    expiredAt: expiredAt,
                    companyName: company?.get('name'),
                    latitude: company?.get('latitude'),
                    longitude: company?.get('longitude'),
                    role: user?.get('role'),
                    name: user?.get('name'),
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
const upload = multer({ dest: 'uploads/' }) // Destination folder for uploaded files

// Endpoint for uploading photos
userRouter.post(
    '/attendance',
    upload.single('photo'),
    async (req: Request, res: Response) => {
        let decoded
        if (
            req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer'
        ) {
            const authorization = req.headers.authorization.split(' ')[1]
            const secret = 'EternalPlus@100'
            decoded = jwt.verify(authorization, secret)
            console.log(decoded)
        } else {
            res.send({
                success: true,
                data: {},
                message: 'Authorization header is not present',
                code: 403,
            })
            return
        }

        if (typeof decoded === 'string' || !decoded.userId) {
            res.send({
                success: false,
                data: {},
                message: 'Authorization failed',
                code: 403,
            })
            return
        }

        const lastHistory = await attendanceTimeEntity.findAll({
            attributes: ['action', 'timestamp'],
            where: {
                employee_id: decoded.userId,
            },
            order: [['timestamp', 'DESC']],
            limit: 1,
        })

        const companyId = await employeeEntity.findOne({
            attributes: ['company_id'],
            where: {
                id: decoded.userId,
            },
        })

        const companyTimeline = await companyEntity.findOne({
            attributes: ['clock_in', 'clock_out'],
            where: {
                id: companyId?.get('company_id'),
            },
        })

        let action
        let timestamp = Date.now()
        let clock = new Date(timestamp).toTimeString().slice(3, 9)
        let clockIn =
            companyTimeline && companyTimeline.get('clock_in')
                ? new Date(
                      companyTimeline.get('clock_in') as string | number | Date,
                  )
                      .toTimeString()
                      .slice(3, 9)
                : new Date(Date.now()).toTimeString().slice(3, 9)
        let clockOut =
            companyTimeline && companyTimeline.get('clock_out')
                ? new Date(
                      companyTimeline.get('clock_out') as
                          | string
                          | number
                          | Date,
                  )
                      .toTimeString()
                      .slice(3, 9)
                : new Date(Date.now()).toTimeString().slice(3, 9)
        let status
        if (!lastHistory || lastHistory.length === 0) {
            action = 'CHECK_IN'
            status = clock < clockIn ? 'LATE' : 'ON TIME'
        } else {
            action =
                lastHistory[0].get('action') === 'CHECK_IN'
                    ? 'CHECK_OUT'
                    : 'CHECK_IN'
            if (action === 'CHECK_OUT') {
                status = clock > clockOut ? 'EARLY' : 'ON TIME'
            } else {
                status = clock < clockIn ? 'LATE' : 'ON TIME'
            }
        }

        const imageId = req.file?.filename || ''

        const newAttendance = await AttendanceTimeService.insertAttendace({
            employeeId: decoded.userId,
            action: action,
            imageId: imageId,
            timestamp: timestamp,
            status: status,
        })

        if (newAttendance.errorMessage != null) {
            res.status(500).json({ error: newAttendance.errorMessage })
            return
        }

        res.send({
            success: true,
            data: {},
            message: `${action} Successfully`,
            code: 200,
        })
    },
)

userRouter.get('/getHistoryByUserId', async (req: Request, res: Response) => {
    let decoded
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        const authorization = req.headers.authorization.split(' ')[1]
        const secret = 'EternalPlus@100'
        decoded = jwt.verify(authorization, secret)
        console.log(decoded)
    } else {
        res.send({
            success: true,
            data: {},
            message: 'Authorization header is not present',
            code: 403,
        })
        return
    }

    let historyUser
    if (typeof decoded !== 'string' && 'userId' in decoded) {
        historyUser = await attendanceTimeEntity.findAll({
            attributes: ['action', 'timestamp', 'status'],
            where: {
                employee_id: decoded.userId,
            },
            order: [['timestamp', 'DESC']],
        })
    }

    res.send({
        success: true,
        data: historyUser,
        message: 'Get History Success',
        code: 200,
    })
})

userRouter.get('/getAttendanceStatus', async (req: Request, res: Response) => {
    let decoded
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        const authorization = req.headers.authorization.split(' ')[1]
        const secret = 'EternalPlus@100'
        decoded = jwt.verify(authorization, secret)
        console.log(decoded)
    } else {
        res.send({
            success: true,
            data: {},
            message: 'Authorization header is not present',
            code: 403,
        })
        return
    }

    let historyUser
    let companyDetail
    let companyId
    if (typeof decoded !== 'string' && 'userId' in decoded) {
        historyUser = await attendanceTimeEntity.findAll({
            attributes: ['action', 'timestamp'],
            where: {
                employee_id: decoded.userId,
            },
            order: [['timestamp', 'DESC']],
            limit: 1,
        })

        companyId = await employeeEntity.findOne({
            attributes: ['company_id'],
            where: {
                id: decoded.userId,
            },
        })

        companyDetail = await companyEntity.findOne({
            attributes: ['latitude', 'longitude', 'address'],
            where: {
                id: companyId?.get('company_id'),
            },
        })
    }

    if (historyUser && historyUser[0]) {
        console.log(historyUser[0].get('action'))
        const lastAction = historyUser[0].get('action')
        if (lastAction === 'CHECK_IN') {
            res.send({
                success: true,
                data: {
                    action: 'clock-out',
                    clockIn: historyUser[0].get('timestamp'),
                    clockOut: null,
                    companyAddress: companyDetail?.get('address'),
                    companyLatitude: companyDetail?.get('latitude'),
                    companyLongitude: companyDetail?.get('longitude'),
                },
                message: 'Get Attendance Status Success',
                code: 200,
            })
        } else {
            res.send({
                success: true,
                data: {
                    action: 'clock-in',
                    clockIn: null,
                    clockOut: null,
                    companyAddress: companyDetail?.get('address'),
                    companyLatitude: companyDetail?.get('latitude'),
                    companyLongitude: companyDetail?.get('longitude'),
                },
                message: 'Get Attendance Status Success',
                code: 200,
            })
        }
    } else {
        res.send({
            success: true,
            data: {
                action: 'clock-in',
                clockIn: null,
                clockOut: null,
                companyAddress: companyDetail?.get('address'),
                companyLatitude: companyDetail?.get('latitude'),
                companyLongitude: companyDetail?.get('longitude'),
            },
            message: 'Get Attendance Status Success',
            code: 200,
        })
    }
})

export default userRouter
