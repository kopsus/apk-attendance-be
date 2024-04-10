import employeeAccessor from '../accessor/employeeAccessor'
import bcrypt from 'bcrypt'
import { IStandardResponse } from '../model/dto/standardResponse'

const insertEmployee = async ({
    companyId,
    email,
    plainPassword,
}: {
    companyId: number
    email: string
    plainPassword: string
}): Promise<IStandardResponse> => {
    const hashedPassword = await bcrypt.hash(plainPassword, 10)
    return await employeeAccessor.insertEmployee({
        companyId,
        email,
        hashedPassword,
    })
}

export default {
    insertEmployee,
}
