import { Request, Response, NextFunction } from 'express'

const ADMIN_PASSWORD_KEY = process.env.ADMIN_PASSWORD_KEY

export const adminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const adminPassword = req.headers['authorization']

    if (adminPassword !== ADMIN_PASSWORD_KEY) {
        return res.status(403).send()
    }

    next()
}
