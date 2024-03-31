import LoggerUtil from '../util/loggerUtil'
import { attendanceTimeEntity } from './attendanceTimeEntity'
import { companyEntity } from './companyEntity'
import { employeeEntity } from './employeeEntity'

const CLASS_NAME = 'Model Initializer'

export const initModel = () => {
    companyEntity
        .sync({ alter: true })
        .catch((e) =>
            LoggerUtil.info(
                CLASS_NAME,
                `Error when init company entity. Error: ${e}`,
            ),
        )

    employeeEntity
        .sync({ alter: true })
        .catch((e) =>
            LoggerUtil.info(
                CLASS_NAME,
                `Error when init employee entity. Error: ${e}`,
            ),
        )

    attendanceTimeEntity
        .sync({ alter: true })
        .catch((e) => 
            LoggerUtil.info(
                CLASS_NAME,
                `Error when init attendance time entity. Error: ${e}`
            )
        )
}
