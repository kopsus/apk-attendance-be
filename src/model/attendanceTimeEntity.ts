import { DataTypes } from 'sequelize'
import { sequelize } from './../accessor/sequelize'

export const attendanceTimeEntity = sequelize.define(
    'AttendanceTime',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false
        },
        timestamp: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        image_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'imageId'
        }
    },
    {
        freezeTableName: true
    }
)
