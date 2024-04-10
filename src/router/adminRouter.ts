import { Request, Response, Router } from 'express'
import asyncHandler from 'express-async-handler'
import { adminMiddleware } from '../middleware/adminMiddleware'
import attendanceTimeService from './../service/attendanceTimeService'
import companyService from '../service/companyService'
import employeeService from '../service/employeeService'

const adminRouter = Router()

adminRouter.use(adminMiddleware)

adminRouter.get('/ping', (req: Request, res: Response) => {
    res.send('pong')
})

adminRouter.post(
    '/signup',
    asyncHandler(async (req: Request, res: Response) => {
        const { companyId, email, password, role } = req.body

        const newUser = await employeeService.insertEmployee({
            companyId: companyId,
            email: email,
            plainPassword: password,
            role: role,
        })

        if (newUser.errorMessage != null) {
            res.status(500).json({ error: newUser.errorMessage })
            return
        }

        res.send({
            success: true,
            data: {},
            message: 'Data Created',
            code: 200,
        })
    }),
)

adminRouter.get(
    '/attendance-time',
    asyncHandler(async (req: Request, res: Response) => {
        const limit = parseInt(req.query.limit as string)
        const offset = parseInt(req.query.offset as string)
        const sortBy = req.query.sortBy!.toString()
        const sortOrder = req.query.sortOrder!.toString()

        const response = await attendanceTimeService.getAllAttendanceTimes(
            limit,
            offset,
            sortBy,
            sortOrder,
        )
        res.send(response)
    }),
)

adminRouter.get(
    '/companies',
    asyncHandler(async (req: Request, res: Response) => {
        const response = await companyService.getCompanyList()
        const curatedResponse = response.map((company) => ({
            id: company.id,
            name: company.name,
        }))
        res.send(curatedResponse)
    }),
)

export default adminRouter
