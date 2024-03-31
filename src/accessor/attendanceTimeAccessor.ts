import { QueryTypes } from "sequelize"
import { SortOrderEnum } from "../model/enum/sortOrderEnum"
import { sequelize } from "./sequelize"

const getAllAttendanceTimes = async (limit: number, offset: number, sortBy: string, sortOrder: SortOrderEnum) => {
    const query = 'SELECT Employee.name as name, Company.id as companyId, Company.name as companyName, AttendanceTime.action as action, Attendancetime.timestamp as time '
        + 'FROM Employee, Company, AttendanceTime '
        + 'WHERE AttendanceTime.employee_id = Employee.id AND Employee.company_id = Company.id '
        + `ORDER BY AttendanceTime.${sortBy} ${SortOrderEnum[sortOrder]} `
        + `LIMIT ${limit} `
        + `OFFSET ${offset};`

    const data = await sequelize.query(query, { type: QueryTypes.SELECT })
    return data
}

export default {
    getAllAttendanceTimes
}
