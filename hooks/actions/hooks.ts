import { useQuery } from '@apollo/client'
import { GET_ACTIONS_QUERY } from '../queries'

export function useActions() {
  const { data, loading, error, refetch: refetchQuery } = useQuery(GET_ACTIONS_QUERY, {
    variables: { page: 0, size: 100 },
    fetchPolicy: 'cache-and-network'
  })

  const actions = data?.getActions?.data?.content || []

  const refetch = async (name?: string, page: number = 0, size: number = 100) => {
    return refetchQuery({ name, page, size })
  }

  return { actions, loading: loading || false, error: error?.message || null, refetch }
}
