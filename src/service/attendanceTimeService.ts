import { SortOrderEnum } from '../model/enum/sortOrderEnum'
import attendanceTimeAccessor from './../accessor/attendanceTimeAccessor'
import { IStandardResponse } from '../model/dto/standardResponse'

const getAllAttendanceTimes = async (
    limit: number,
    offset: number,
    sortBy: string,
    sortOrder: string,
) => {
    const sortOrderEnum = SortOrderEnum[sortOrder as keyof typeof SortOrderEnum]
    const attendanceTimesData =
        await attendanceTimeAccessor.getAllAttendanceTimes(
            limit,
            offset,
            sortBy!,
            sortOrderEnum,
        )
    const attendanceTimesCountRows =
        await attendanceTimeAccessor.getAllAttendanceTimesCount()
    return {
        data: attendanceTimesData,
        count: attendanceTimesCountRows[0].total,
    }
}

const insertAttendace = async ({
    employeeId,
    action,
    imageId,
}: {
    employeeId: number
    action: string
    imageId: string
}): Promise<IStandardResponse> => {
    const timestamp = Date.now()
    return await attendanceTimeAccessor.insertAttendace({
        employeeId,
        action,
        imageId,
        timestamp,
    })
}

export default {
    getAllAttendanceTimes,
    insertAttendace,
}
