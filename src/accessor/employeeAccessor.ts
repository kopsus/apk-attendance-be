import { UniqueConstraintError } from 'sequelize'
import { employeeEntity } from '../model/employeeEntity'
import LoggerUtil from '../util/loggerUtil'
import { IStandardResponse } from '../model/dto/standardResponse'

const DOMAIN = 'Employee Accessor'

const insertEmployee = async ({
    companyId,
    email,
    hashedPassword,
    role,
    name,
}: {
    companyId: number
    email: string
    hashedPassword: string
    role: string,
    name: string
}): Promise<IStandardResponse> => {
    try {
        const newEmployee = await employeeEntity.create({
            email: email,
            password: hashedPassword,
            company_id: companyId,
            role: role,
            name: name
        })

        return { data: newEmployee }
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return { errorMessage: 'Email is already exists' }
        }
        LoggerUtil.error(
            DOMAIN,
            `Got error when inserting employee: ${JSON.stringify(error)}`,
        )
        throw error
    }
}

export default {
    insertEmployee,
}
