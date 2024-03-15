import { Request, Response, Router } from 'express'
import LoggerUtil from './../util/loggerUtil'

const DOMAIN = 'ADMIN_ROUTER'

const adminRouter = Router()

adminRouter.get('/ping', (req: Request, res: Response) => {
    res.send('pong')
})

export default adminRouter
