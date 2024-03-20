import LoggerUtil from "../util/loggerUtil";
import { companyEntity } from "./companyEntity";

const CLASS_NAME = 'Model Initializer'

export const initModel = () => {
    companyEntity.sync({ alter: true }).catch(e => LoggerUtil.log(CLASS_NAME, `Error when init company entity. Error: ${e}`))
}
