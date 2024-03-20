import { sequelize } from './sequelize'

export const initDbConnection = () => sequelize.authenticate()
