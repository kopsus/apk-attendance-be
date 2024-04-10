import { ICompany, companyEntity } from '../model/companyEntity'

const getAllCompanies = async (): Promise<ICompany[]> => {
    return (await companyEntity.findAll()).map(
        (company) => company.toJSON() as ICompany,
    )
}

export default {
    getAllCompanies,
}
