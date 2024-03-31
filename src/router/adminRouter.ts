import { Request, Response, Router } from 'express'
import asyncHandler from 'express-async-handler'
import LoggerUtil from './../util/loggerUtil'
import { adminMiddleware } from '../middleware/adminMiddleware'
import attendanceTimeService from './../service/attendanceTimeService'

const DOMAIN = 'Admin Router'

const adminRouter = Router()

adminRouter.use(adminMiddleware)

adminRouter.get('/ping', (req: Request, res: Response) => {
    res.send('pong')
})

adminRouter.get('/attendance-time', asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string)
    const offset = parseInt(req.query.offset as string)
    const sortBy = req.query.sortBy!.toString()
    const sortOrder = req.query.sortOrder!.toString()

    const response = await attendanceTimeService.getAllAttendanceTimes(limit, offset, sortBy, sortOrder)
    res.send(response)
}))

export default adminRouter
