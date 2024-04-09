import companyAccessor from "../accessor/companyAccessor"

const getCompanyList = async () => {
    return await companyAccessor.getAllCompanies()
}

export default {
    getCompanyList
}
