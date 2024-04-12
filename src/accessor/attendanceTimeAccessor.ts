import { QueryTypes } from 'sequelize'
import { SortOrderEnum } from '../model/enum/sortOrderEnum'
import { sequelize } from './sequelize'
import { IStandardResponse } from '../model/dto/standardResponse'
import { attendanceTimeEntity } from '../model/attendanceTimeEntity'
import LoggerUtil from '../util/loggerUtil'

interface ITotalRows {
    total: number
}

const DOMAIN = 'Attendance Time Accessor'

const getAllAttendanceTimes = async (
    limit: number,
    offset: number,
    sortBy: string,
    sortOrder: SortOrderEnum,
) => {
    const query =
        'SELECT Employee.name as name, Company.id as companyId, Company.name as companyName, AttendanceTime.action as action, AttendanceTime.timestamp as time ' +
        'FROM Employee, Company, AttendanceTime ' +
        'WHERE AttendanceTime.employee_id = Employee.id AND Employee.company_id = Company.id ' +
        `ORDER BY ${sortBy} ${SortOrderEnum[sortOrder]} ` +
        `LIMIT ${limit} ` +
        `OFFSET ${offset};`

    const data = await sequelize.query(query, { type: QueryTypes.SELECT })
    return data
}

const getAllAttendanceTimesCount = async (): Promise<ITotalRows[]> => {
    const query =
        'SELECT COUNT(*) as total FROM Employee, Company, AttendanceTime ' +
        'WHERE AttendanceTime.employee_id = Employee.id AND Employee.company_id = Company.id;'

    const data = await sequelize.query(query, { type: QueryTypes.SELECT })
    return data.map((each) => each as ITotalRows)
}

const insertAttendace = async ({
    employeeId,
    action,
    imageId,
    timestamp,
}: {
    employeeId: number
    action: string
    imageId: string
    timestamp: number
}): Promise<IStandardResponse> => {
    try {
        const newEmployee = await attendanceTimeEntity.create({
            employee_id: employeeId,
            action: action,
            image_id: imageId,
            timestamp: timestamp,
        })

        return { data: newEmployee }
    } catch (error) {
        LoggerUtil.error(
            DOMAIN,
            `Got error when inserting employee: ${JSON.stringify(error)}`,
        )
        throw error
    }
}

export default {
    getAllAttendanceTimes,
    insertAttendace,
    getAllAttendanceTimesCount,
}
