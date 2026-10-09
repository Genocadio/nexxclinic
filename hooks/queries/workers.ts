import { gql } from "@apollo/client";

export const SEARCH_WORKERS_QUERY = gql`
  query SearchWorkers(
    $name: String
    $role: RoleName
    $activeOnly: Boolean
  ) {
    searchWorkers(
      name: $name
      role: $role
      activeOnly: $activeOnly
    ) {
      status
      message
      data {
        id
        firstName
        lastName
        roles
        departments {
          id
          name
        }
      }
    }
  }
`;
