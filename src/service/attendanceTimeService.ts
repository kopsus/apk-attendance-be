import { SortOrderEnum } from '../model/enum/sortOrderEnum'
import attendanceTimeAccessor from './../accessor/attendanceTimeAccessor'

const getAllAttendanceTimes = async (limit: number, offset: number, sortBy: string, sortOrder: string) => {
    const sortOrderEnum = SortOrderEnum[sortOrder as keyof typeof SortOrderEnum]
    return await attendanceTimeAccessor.getAllAttendanceTimes(limit, offset, sortBy!, sortOrderEnum)
}

export default {
    getAllAttendanceTimes
}
