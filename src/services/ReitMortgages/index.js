import httpClient from '../../plugins/axios'

export default {
  getReitMortgage(reitMortgageId) {
    return httpClient.get(`/reit-mortgage/${reitMortgageId}`)
  },
  getReitMortgages(query, filters = {}, sorter = {}) {
    return httpClient.get(`/reit-mortgage`, {
      params: {
        page: query?.page || null,
        size: query?.size || null,
        search: query?.search || null,
        ...filters,
        ...sorter,
      },
    })
  },
  createReitMortgages({
                        reit_id,
                        reit_type_id,
                        year,
                        quarter,
                        net_income,
                        return_on_enquity,
                        return_on_assets,
                        return_on_invested_capital,
                        interest_income,
                        number_loans,
                        outstanding_portfolio,
                        overdue_portfolio,
                        avg_interest_rate_fovisste,
                        avg_interest_rate_pdh,
                        dollar,
                        divided_yield,
                        total_portfolio,
             }) {
    return httpClient.post(`/reit-mortgage`, {
      reit_id,
      reit_type_id,
      year,
      quarter,
      net_income,
      return_on_enquity,
      return_on_assets,
      return_on_invested_capital,
      interest_income,
      number_loans,
      outstanding_portfolio,
      overdue_portfolio,
      avg_interest_rate_fovisste,
      avg_interest_rate_pdh,
      dollar,
      divided_yield,
      total_portfolio,
    })
  },
  updateReitMortgages(
    reitMortgageId,
    {
      reit_id,
      reit_type_id,
      year,
      quarter,
      net_income,
      return_on_enquity,
      return_on_assets,
      return_on_invested_capital,
      interest_income,
      number_loans,
      outstanding_portfolio,
      overdue_portfolio,
      avg_interest_rate_fovisste,
      avg_interest_rate_pdh,
      dollar,
      divided_yield,
      total_portfolio,
    },
  ) {
    return httpClient.put(`/reit-mortgage/${reitMortgageId}`, {
      reit_id,
      reit_type_id,
      year,
      quarter,
      net_income,
      return_on_enquity,
      return_on_assets,
      return_on_invested_capital,
      interest_income,
      number_loans,
      outstanding_portfolio,
      overdue_portfolio,
      avg_interest_rate_fovisste,
      avg_interest_rate_pdh,
      dollar,
      divided_yield,
      total_portfolio,
    })
  },
  deleteReitMortgage(reitMortgageId) {
    return httpClient.delete(`/reit-mortgage/${reitMortgageId}`)
  },
}
