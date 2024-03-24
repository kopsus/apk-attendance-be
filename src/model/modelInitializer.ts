import LoggerUtil from '../util/loggerUtil'
import { companyEntity } from './companyEntity'
import { employeeEntity } from './employeeEntity'

const CLASS_NAME = 'Model Initializer'

export const initModel = () => {
    companyEntity
        .sync({ alter: true })
        .catch((e) =>
            LoggerUtil.log(
                CLASS_NAME,
                `Error when init company entity. Error: ${e}`,
            ),
        )

    employeeEntity
        .sync({ alter: true })
        .catch((e) =>
            LoggerUtil.log(
                CLASS_NAME,
                `Error when init company entity. Error: ${e}`,
            ),
        )
}
