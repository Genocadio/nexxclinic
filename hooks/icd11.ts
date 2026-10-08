"use client";

import { gql, useQuery } from "@apollo/client";

const SEARCH_ICD11_DISEASES_QUERY = gql`
  query SearchIcd11Diseases($query: String!, $lang: String, $limit: Int) {
    searchIcd11Diseases(query: $query, lang: $lang, limit: $limit) {
      status
      message
      data {
        results {
          id
          code
          title
          chapter
          score
        }
      }
    }
  }
`;

export interface Icd11DiseaseSuggestion {
  id: string | null;
  code: string | null;
  title: string | null;
  chapter: string | null;
  score: number;
}

interface SearchIcd11DiseasesData {
  searchIcd11Diseases?: {
    status?: string;
    message?: string | null;
    data?: {
      results?: Icd11DiseaseSuggestion[] | null;
    } | null;
  } | null;
}

export function useIcd11DiseaseSearch(query: string) {
  const { data, loading, error } = useQuery<SearchIcd11DiseasesData>(
    SEARCH_ICD11_DISEASES_QUERY,
    {
      variables: { query, lang: "en", limit: 10 },
      fetchPolicy: "cache-and-network",
      skip: query.trim().length < 2,
    },
  );

  const response = data?.searchIcd11Diseases;
  return {
    suggestions:
      response?.status === "SUCCESS" ? response.data?.results ?? [] : [],
    loading,
    error: error?.message ?? (
      response?.status && response.status !== "SUCCESS"
        ? response.message ?? "ICD-11 disease search failed."
        : null
    ),
  };
}
