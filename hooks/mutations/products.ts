import { gql } from "@apollo/client";

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      status
      message

      data {
        id
        name
        genericName
        code
        description
        type
        unit
        metadata
        privateRhicPrice
        clinicPrice
        insuranceCoverages {
          id
          insuranceProvider {
            id
            insuranceName
            acronym
            defaultCoveragePercentage
          }
          cost
          covered
          requireMedicalAdvisor
          mustPrescribedBy
          drugAdministrationFrequency
          authorizationRequestReasons
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($productId: ID!, $input: UpdateProductInput!) {
    updateProduct(productId: $productId, input: $input) {
      status
      message

      data {
        id
        name
        genericName
        code
        description
        type
        unit
        metadata
        privateRhicPrice
        clinicPrice
        insuranceCoverages {
          id
          insuranceProvider {
            id
            insuranceName
            acronym
            defaultCoveragePercentage
          }
          cost
          covered
          requireMedicalAdvisor
          mustPrescribedBy
          drugAdministrationFrequency
          authorizationRequestReasons
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($productId: ID!) {
    deleteProduct(productId: $productId) {
      status
      message
    }
  }
`;

export const ADD_PRODUCT_INSURANCE_COVERAGE_MUTATION = gql`
  mutation AddProductInsuranceCoverage(
    $productId: ID!
    $input: CreateProductInsuranceCoverageInput!
  ) {
    createProductInsuranceCoverage(productId: $productId, input: $input) {
      status
      message

      data {
        id
        insuranceProvider {
          id
          insuranceName
          acronym
          defaultCoveragePercentage
        }
        cost
        covered
        requireMedicalAdvisor
        mustPrescribedBy
        drugAdministrationFrequency
        authorizationRequestReasons
      }
    }
  }
`;

export const REMOVE_PRODUCT_INSURANCE_COVERAGE_MUTATION = gql`
  mutation RemoveProductInsuranceCoverage($productInsuranceCoverageId: ID!) {
    deleteProductInsuranceCoverage(
      productInsuranceCoverageId: $productInsuranceCoverageId
    ) {
      status
      message
    }
  }
`;
