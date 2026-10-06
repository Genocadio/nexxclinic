module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/hooks/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * hooks/types.ts - Hook-specific re-exports only
 * All entity types MUST come from lib/api-types.ts (canonical source)
 * All input types MUST come from lib/api-input-types.ts (canonical source)
 * This file only contains hook-specific wrappers for API responses
 */ __turbopack_context__.s([]);
;
}),
"[project]/lib/error-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getErrorMessage",
    ()=>getErrorMessage,
    "isCORSError",
    ()=>isCORSError,
    "isNetworkError",
    ()=>isNetworkError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$errors$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/errors/index.js [app-ssr] (ecmascript)");
;
function getErrorMessage(error) {
    if (!error) return "";
    // Apollo Error object
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$errors$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApolloError"]) {
        // Check for network errors first (like CORS)
        if (error.networkError) {
            const networkErr = error.networkError;
            if (networkErr.message) return networkErr.message;
            if (networkErr.statusCode) return `Network error (${networkErr.statusCode})`;
            return "Network connection failed";
        }
        // Check for GraphQL errors
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            return error.graphQLErrors[0].message;
        }
        // Fallback to main message
        if (error.message) return error.message;
    }
    // Standard Error object
    if (error instanceof Error) {
        return error.message;
    }
    // String error
    if (typeof error === "string") {
        return error;
    }
    // Object with message property
    if (typeof error === "object" && "message" in error && typeof error.message === "string") {
        return error.message;
    }
    return "An unexpected error occurred";
}
function isNetworkError(error) {
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$errors$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApolloError"] && error.networkError) {
        return true;
    }
    return false;
}
function isCORSError(error) {
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$errors$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApolloError"] && error.networkError) {
        const networkErr = error.networkError;
        const message = networkErr.message || "";
        return message.includes("CORS") || message.includes("Same Origin Policy") || message.includes("disallows reading");
    }
    return false;
}
}),
"[project]/hooks/mutations/departments.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CREATE_DEPARTMENT_MUTATION",
    ()=>CREATE_DEPARTMENT_MUTATION,
    "REMOVE_DEPARTMENT_PROFILE_MUTATION",
    ()=>REMOVE_DEPARTMENT_PROFILE_MUTATION,
    "UPDATE_DEPARTMENT_MUTATION",
    ()=>UPDATE_DEPARTMENT_MUTATION
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const DEPARTMENT_PROFILE_PRODUCT_FRAGMENT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  fragment DepartmentProfileProduct on Product {
    id
    name
    genericName
    code
    description
    type
    unit
    privateRhicPrice
    clinicPrice
    insuranceCoverages {
      id
      insuranceProvider {
        id
        insuranceName
        acronym
        coverages {

                        id

                        insuranceProviderId

                        insuranceProviderName

                        departmentId

                        departmentName

                        encounterType

                        patientSharePercentage

                        createdAt

                        updatedAt

                      }
        supportedByClinic
        iconUrl
      }
      cost
      covered
      requireMedicalAdvisor
    }
  }
`;
const DEPARTMENT_PROFILE_FRAGMENT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  ${DEPARTMENT_PROFILE_PRODUCT_FRAGMENT}
  fragment DepartmentProfileFields on DepartmentProfile {
    id
    name
    encounterType
    isDefault
    products {
      ...DepartmentProfileProduct
    }
    createdAt
    updatedAt
  }
`;
const CREATE_DEPARTMENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      status
      message
      data {
        id
        name
        nursing
        supportRequests
        requestsProducts
        insurancePolicyMode
        insurancePolicies {
          id
          insuranceName
          acronym
          coverages {

                          id

                          insuranceProviderId

                          insuranceProviderName

                          departmentId

                          departmentName

                          encounterType

                          patientSharePercentage

                          createdAt

                          updatedAt

                        }
          supportedByClinic
          iconUrl
        }
        profiles {
          ...DepartmentProfileFields
        }
        createdAt
        updatedAt
      }
    }
  }
  ${DEPARTMENT_PROFILE_PRODUCT_FRAGMENT}
  ${DEPARTMENT_PROFILE_FRAGMENT}
`;
const UPDATE_DEPARTMENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateDepartment($departmentId: ID!, $input: UpdateDepartmentInput!) {
    updateDepartment(departmentId: $departmentId, input: $input) {
      status
      message
      data {
        id
        name
        nursing
        supportRequests
        requestsProducts
        insurancePolicyMode
        insurancePolicies {
          id
          insuranceName
          acronym
          coverages {

                          id

                          insuranceProviderId

                          insuranceProviderName

                          departmentId

                          departmentName

                          encounterType

                          patientSharePercentage

                          createdAt

                          updatedAt

                        }
          supportedByClinic
          iconUrl
        }
        profiles {
          ...DepartmentProfileFields
        }
        createdAt
        updatedAt
      }
    }
  }
  ${DEPARTMENT_PROFILE_PRODUCT_FRAGMENT}
  ${DEPARTMENT_PROFILE_FRAGMENT}
`;
const REMOVE_DEPARTMENT_PROFILE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation RemoveDepartmentProfile($profileId: ID!) {
    removeDepartmentProfile(profileId: $profileId) {
      status
      message
      data {
        id
        name
        nursing
        supportRequests
        requestsProducts
        insurancePolicyMode
        insurancePolicies {
          id
          insuranceName
          acronym
          coverages {

                          id

                          insuranceProviderId

                          insuranceProviderName

                          departmentId

                          departmentName

                          encounterType

                          patientSharePercentage

                          createdAt

                          updatedAt

                        }
          supportedByClinic
          iconUrl
        }
        profiles {
          ...DepartmentProfileFields
        }
        createdAt
        updatedAt
      }
    }
  }
  ${DEPARTMENT_PROFILE_PRODUCT_FRAGMENT}
  ${DEPARTMENT_PROFILE_FRAGMENT}
`;
}),
"[project]/hooks/mutations/products.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ADD_PRODUCT_INSURANCE_COVERAGE_MUTATION",
    ()=>ADD_PRODUCT_INSURANCE_COVERAGE_MUTATION,
    "CREATE_PRODUCT_MUTATION",
    ()=>CREATE_PRODUCT_MUTATION,
    "DELETE_PRODUCT_MUTATION",
    ()=>DELETE_PRODUCT_MUTATION,
    "REMOVE_PRODUCT_INSURANCE_COVERAGE_MUTATION",
    ()=>REMOVE_PRODUCT_INSURANCE_COVERAGE_MUTATION,
    "UPDATE_PRODUCT_MUTATION",
    ()=>UPDATE_PRODUCT_MUTATION
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const CREATE_PRODUCT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
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
        notPaid
        quantifiable
        insuranceCoverages {
          id
          insuranceProvider {
            id
            insuranceName
            acronym
            coverages {
              id
              insuranceProviderId
              insuranceProviderName
              departmentId
              departmentName
              encounterType
              patientSharePercentage
              createdAt
              updatedAt
            }
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
const UPDATE_PRODUCT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
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
        notPaid
        quantifiable
        insuranceCoverages {
          id
          insuranceProvider {
            id
            insuranceName
            acronym
            coverages {
              id
              insuranceProviderId
              insuranceProviderName
              departmentId
              departmentName
              encounterType
              patientSharePercentage
              createdAt
              updatedAt
            }
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
const DELETE_PRODUCT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation DeleteProduct($productId: ID!) {
    deleteProduct(productId: $productId) {
      status
      message
    }
  }
`;
const ADD_PRODUCT_INSURANCE_COVERAGE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
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
          coverages {

                          id

                          insuranceProviderId

                          insuranceProviderName

                          departmentId

                          departmentName

                          encounterType

                          patientSharePercentage

                          createdAt

                          updatedAt

                        }
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
const REMOVE_PRODUCT_INSURANCE_COVERAGE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation RemoveProductInsuranceCoverage($productInsuranceCoverageId: ID!) {
    deleteProductInsuranceCoverage(
      productInsuranceCoverageId: $productInsuranceCoverageId
    ) {
      status
      message
    }
  }
`;
}),
"[project]/hooks/mutations/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACTIVATE_USER_MUTATION",
    ()=>ACTIVATE_USER_MUTATION,
    "ADMIN_CREATE_USER_MUTATION",
    ()=>ADMIN_CREATE_USER_MUTATION,
    "ADMIN_UPDATE_USER_MUTATION",
    ()=>ADMIN_UPDATE_USER_MUTATION,
    "CHANGE_PASSWORD_MUTATION",
    ()=>CHANGE_PASSWORD_MUTATION,
    "DEACTIVATE_USER_MUTATION",
    ()=>DEACTIVATE_USER_MUTATION,
    "DELETE_USER_PASSWORD_MUTATION",
    ()=>DELETE_USER_PASSWORD_MUTATION,
    "LOGIN_MUTATION",
    ()=>LOGIN_MUTATION,
    "REGISTER_MUTATION",
    ()=>REGISTER_MUTATION,
    "SET_INITIAL_PASSWORD_MUTATION",
    ()=>SET_INITIAL_PASSWORD_MUTATION,
    "UPDATE_CLINIC_PROFILE_MUTATION",
    ()=>UPDATE_CLINIC_PROFILE_MUTATION,
    "UPDATE_MY_PROFILE_MUTATION",
    ()=>UPDATE_MY_PROFILE_MUTATION,
    "UPDATE_USER_ROLES_MUTATION",
    ()=>UPDATE_USER_ROLES_MUTATION
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const LOGIN_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      status
      message

      data {
        accessToken
        refreshToken
        user {
          id
          firstName
          lastName
          email
          phoneNumber
          username
          accountStatus
          roles
          departments {
            id
            name
          }
          createdAt
          updatedAt
        }
      }
    }
  }
`;
const SET_INITIAL_PASSWORD_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation SetInitialPassword($input: SetInitialPasswordInput!) {
    setInitialPassword(input: $input) {
      status
      message
    }
  }
`;
const REGISTER_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation Register($input: SelfRegisterInput!) {
    selfRegister(input: $input) {
      status
      message

      data {
        id
        firstName
        lastName
        email
        phoneNumber
        username
      }
    }
  }
`;
const ADMIN_CREATE_USER_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation AdminCreateUser($input: AdminCreateUserInput!) {
    adminCreateUser(input: $input) {
      status
      message

      data {
        id
        firstName
        lastName
        email
        phoneNumber
        username
        accountStatus
        roles
        departments {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`;
const ACTIVATE_USER_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation ActivateUser($input: ActivateUserInput!) {
    activateUser(input: $input) {
      status
      message
    }
  }
`;
const DEACTIVATE_USER_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation DeactivateUser($input: DeactivateUserInput!) {
    deactivateUser(input: $input) {
      status
      message
    }
  }
`;
const ADMIN_UPDATE_USER_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation AdminUpdateUser($userId: ID!, $input: AdminUpdateUserInput!) {
    adminUpdateUser(userId: $userId, input: $input) {
      status
      message

      data {
        id
        firstName
        lastName
        email
        phoneNumber
        username
        accountStatus
        roles
        departments {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`;
const UPDATE_USER_ROLES_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateUserRoles($input: ActivateUserInput!) {
    activateUser(input: $input) {
      status
      message
    }
  }
`;
const UPDATE_MY_PROFILE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
    updateMyProfile(input: $input) {
      status
      message
      data {
        id
        firstName
        lastName
        email
        phoneNumber
        username
        accountStatus
        roles
        departments {
          id
          name
        }
      }
    }
  }
`;
const CHANGE_PASSWORD_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation ChangePassword($input: ChangeMyPasswordInput!) {
    changeMyPassword(input: $input) {
      status
      message
    }
  }
`;
const DELETE_USER_PASSWORD_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation AdminTriggerPasswordReset($input: AdminTriggerPasswordResetInput!) {
    adminTriggerPasswordReset(input: $input) {
      status
      message
    }
  }
`;
const UPDATE_CLINIC_PROFILE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateClinicProfile($input: UpdateClinicProfileInput!) {
    updateClinicProfile(input: $input) {
      status
      message

      data {
        id
        name
        username
        address
        contacts {
          contactType
          value
          description
        }
        tinNumber
        logoUrl
        metadata {
          key
          value
        }
        createdAt
        updatedAt
      }
    }
  }
`;
}),
"[project]/hooks/mutations/patients.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CREATE_PATIENT_INSURANCE_MUTATION",
    ()=>CREATE_PATIENT_INSURANCE_MUTATION,
    "DELETE_PATIENT_INSURANCE_MUTATION",
    ()=>DELETE_PATIENT_INSURANCE_MUTATION,
    "REGISTER_PATIENT_MUTATION",
    ()=>REGISTER_PATIENT_MUTATION,
    "UPDATE_PATIENT_INSURANCE_MUTATION",
    ()=>UPDATE_PATIENT_INSURANCE_MUTATION,
    "UPDATE_PATIENT_MUTATION",
    ()=>UPDATE_PATIENT_MUTATION
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const REGISTER_PATIENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation RegisterPatient($input: CreatePatientInput!) {
    createPatient(input: $input) {
      status
      message
      data {
        id
        visitDate
        status
        patient {
          id
          firstName
          lastName
          middleName
          gender
          dateOfBirth
          primaryPhoneNumber
          alternativePhone
          village
          city
          district
          postalAddress
          nationalIdNumber
          passportNumber
          emergencyContactName
          emergencyContactRelationship
          emergencyContactPhoneNumber
          createdAt
          updatedAt
        }
        linkedInsurances {
          id
          insuranceCardNumber
          patientSharePercentage
          deactivated
          principalMember
          principalMemberName
          principalMemberPhoneNumber
          validFrom
          validUntil
          insuranceProvider {
            id
            insuranceName
            acronym
            coverages {
              id
              insuranceProviderId
              insuranceProviderName
              departmentId
              departmentName
              encounterType
              patientSharePercentage
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
`;
const CREATE_PATIENT_INSURANCE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation CreatePatientInsurance($input: CreatePatientInsuranceInput!) {
    createPatientInsurance(input: $input) {
      status
      message
      data {
        id
        insuranceCardNumber
          patientSharePercentage
          deactivated
        principalMember
        principalMemberName
        principalMemberPhoneNumber
        validFrom
        validUntil
      }
    }
  }
`;
const UPDATE_PATIENT_INSURANCE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdatePatientInsurance($patientInsuranceId: ID!, $input: UpdatePatientInsuranceInput!) {
    updatePatientInsurance(patientInsuranceId: $patientInsuranceId, input: $input) {
      status
      message
      data {
        id
        insuranceCardNumber
          patientSharePercentage
          deactivated
        principalMember
        principalMemberName
        principalMemberPhoneNumber
        validFrom
        validUntil
      }
    }
  }
`;
const UPDATE_PATIENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdatePatient($patientId: ID!, $input: UpdatePatientInput!) {
    updatePatient(patientId: $patientId, input: $input) {
      status
      message
      data {
        id
        firstName
        lastName
        middleName
        gender
        dateOfBirth
        primaryPhoneNumber
        alternativePhone
        village
        city
        district
        postalAddress
        nationalIdNumber
        passportNumber
        emergencyContactName
        emergencyContactRelationship
        emergencyContactPhoneNumber
        createdAt
        updatedAt
      }
    }
  }
`;
const DELETE_PATIENT_INSURANCE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation DeletePatientInsurance($patientInsuranceId: ID!) {
    deletePatientInsurance(patientInsuranceId: $patientInsuranceId) {
      status
      message
      data
    }
  }
`;
}),
"[project]/hooks/mutations/visits.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ADD_CHILD_VISIT_DEPARTMENT_MUTATION",
    ()=>ADD_CHILD_VISIT_DEPARTMENT_MUTATION,
    "ADD_DEPARTMENT_NOTE_MUTATION",
    ()=>ADD_DEPARTMENT_NOTE_MUTATION,
    "ADD_DEPARTMENT_TO_VISIT_MUTATION",
    ()=>ADD_DEPARTMENT_TO_VISIT_MUTATION,
    "ADD_DIAGNOSIS_MUTATION",
    ()=>ADD_DIAGNOSIS_MUTATION,
    "ADD_MEDICATION_MUTATION",
    ()=>ADD_MEDICATION_MUTATION,
    "ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION",
    ()=>ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION,
    "ADD_VISIT_DEPARTMENT_NOTE_MUTATION",
    ()=>ADD_VISIT_DEPARTMENT_NOTE_MUTATION,
    "ADD_VISIT_NOTE_MUTATION",
    ()=>ADD_VISIT_NOTE_MUTATION,
    "ADD_VISIT_VITAL_SIGNS_MUTATION",
    ()=>ADD_VISIT_VITAL_SIGNS_MUTATION,
    "CANCEL_VISIT_MUTATION",
    ()=>CANCEL_VISIT_MUTATION,
    "CHANGE_VISIT_DATE_MUTATION",
    ()=>CHANGE_VISIT_DATE_MUTATION,
    "CHANGE_VISIT_DEPARTMENT_PROFILE_MUTATION",
    ()=>CHANGE_VISIT_DEPARTMENT_PROFILE_MUTATION,
    "COMPLETE_CONSULTATION_VISIT_MUTATION",
    ()=>COMPLETE_CONSULTATION_VISIT_MUTATION,
    "COMPLETE_VISIT_DEPARTMENT_MUTATION",
    ()=>COMPLETE_VISIT_DEPARTMENT_MUTATION,
    "COMPLETE_VISIT_MUTATION",
    ()=>COMPLETE_VISIT_MUTATION,
    "CONSULT_VISIT_MUTATION",
    ()=>CONSULT_VISIT_MUTATION,
    "CREATE_VISIT_MUTATION",
    ()=>CREATE_VISIT_MUTATION,
    "DELETE_VISIT_MUTATION",
    ()=>DELETE_VISIT_MUTATION,
    "FINALISE_VISIT_DEPARTMENT_MUTATION",
    ()=>FINALISE_VISIT_DEPARTMENT_MUTATION,
    "FINALISE_VISIT_MUTATION",
    ()=>FINALISE_VISIT_MUTATION,
    "GENERATE_CONSULTATION_PDF_MUTATION",
    ()=>GENERATE_CONSULTATION_PDF_MUTATION,
    "LINK_VISIT_INSURANCES_MUTATION",
    ()=>LINK_VISIT_INSURANCES_MUTATION,
    "MARK_VISIT_DEPARTMENT_NOTES_VIEWED_MUTATION",
    ()=>MARK_VISIT_DEPARTMENT_NOTES_VIEWED_MUTATION,
    "MARK_VISIT_DEPARTMENT_NOTE_VIEWED_MUTATION",
    ()=>MARK_VISIT_DEPARTMENT_NOTE_VIEWED_MUTATION,
    "PROCESS_VISIT_DEPARTMENT_MUTATION",
    ()=>PROCESS_VISIT_DEPARTMENT_MUTATION,
    "REMOVE_ACTION_FROM_VISIT_DEPARTMENT_MUTATION",
    ()=>REMOVE_ACTION_FROM_VISIT_DEPARTMENT_MUTATION,
    "REMOVE_CONSUMABLE_FROM_VISIT_DEPARTMENT_MUTATION",
    ()=>REMOVE_CONSUMABLE_FROM_VISIT_DEPARTMENT_MUTATION,
    "REMOVE_VISIT_DEPARTMENT_MUTATION",
    ()=>REMOVE_VISIT_DEPARTMENT_MUTATION,
    "REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION",
    ()=>REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION,
    "REMOVE_VISIT_DEPARTMENT_PROFILE_MUTATION",
    ()=>REMOVE_VISIT_DEPARTMENT_PROFILE_MUTATION,
    "REOPEN_VISIT_MUTATION",
    ()=>REOPEN_VISIT_MUTATION,
    "UNLINK_VISIT_INSURANCES_MUTATION",
    ()=>UNLINK_VISIT_INSURANCES_MUTATION,
    "UPDATE_ACTION_QUANTITY_MUTATION",
    ()=>UPDATE_ACTION_QUANTITY_MUTATION,
    "UPDATE_CONSUMABLE_QUANTITY_MUTATION",
    ()=>UPDATE_CONSUMABLE_QUANTITY_MUTATION,
    "UPDATE_VISIT_DEPARTMENT_ENCOUNTER_DATE_MUTATION",
    ()=>UPDATE_VISIT_DEPARTMENT_ENCOUNTER_DATE_MUTATION,
    "UPDATE_VISIT_DEPARTMENT_ENCOUNTER_TYPE_MUTATION",
    ()=>UPDATE_VISIT_DEPARTMENT_ENCOUNTER_TYPE_MUTATION,
    "UPDATE_VISIT_DEPARTMENT_PRODUCT_PROCESSOR_MUTATION",
    ()=>UPDATE_VISIT_DEPARTMENT_PRODUCT_PROCESSOR_MUTATION,
    "UPDATE_VISIT_DEPARTMENT_PRODUCT_QUANTITY_MUTATION",
    ()=>UPDATE_VISIT_DEPARTMENT_PRODUCT_QUANTITY_MUTATION,
    "UPDATE_VISIT_DEPARTMENT_PRODUCT_STATUS_MUTATION",
    ()=>UPDATE_VISIT_DEPARTMENT_PRODUCT_STATUS_MUTATION,
    "UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION",
    ()=>UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION,
    "UPDATE_VISIT_VITAL_SIGNS_MUTATION",
    ()=>UPDATE_VISIT_VITAL_SIGNS_MUTATION,
    "UPSERT_CONSULTATION_ANSWERS_MUTATION",
    ()=>UPSERT_CONSULTATION_ANSWERS_MUTATION
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const CREATE_VISIT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation CreateVisit($input: CreateVisitInput!) {
    createVisit(input: $input) {
      status
      message

      data {
        id
        visitDate
        status
        patient {
          id
          firstName
          lastName
        }
        linkedInsurances {
          id
          insuranceProvider {
            id
            insuranceName
            acronym
            coverages {
              id
              insuranceProviderId
              insuranceProviderName
              departmentId
              departmentName
              encounterType
              patientSharePercentage
              createdAt
              updatedAt
            }
          }
        }
        departments {
          id
          department {
            id
            name
          }
        }
      }
    }
  }
`;
const ADD_VISIT_NOTE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation AddVisitNote($visitId: ID!, $note: String!) {
    addVisitNote(visitId: $visitId, note: $note) {
      status
      message

      data {
        id
        note
        createdBy {
          id
          firstName
          lastName
          email
        }
        createdAt
      }
    }
  }
`;
const ADD_VISIT_VITAL_SIGNS_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation AddVisitVitalSigns($input: AddVisitVitalSignsInput!) {
    addVisitVitalSigns(input: $input) {
      status
      message

      data {
        id
        visitDate
        status
        patient {
          id
          firstName
          lastName
        }
        vitalSigns {
          id
          createdAt
          addedBy {
            id
            firstName
            lastName
          }
          measurements {
            id
            measurementName
            value
            unit
            createdAt
          }
        }
      }
    }
  }
`;
const UPDATE_VISIT_VITAL_SIGNS_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateVisitVitalSigns($input: UpdateVisitVitalSignsInput!) {
    updateVisitVitalSigns(input: $input) {
      status
      message

      data {
        id
        visitDate
        status
        patient {
          id
          firstName
          lastName
        }
        vitalSigns {
          id
          createdAt
          addedBy {
            id
            firstName
            lastName
          }
          measurements {
            id
            measurementName
            value
            unit
            createdAt
          }
        }
      }
    }
  }
`;
const ADD_DEPARTMENT_NOTE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation AddDepartmentNote(
    $visitId: ID!
    $departmentId: ID!
    $note: String!
  ) {
    addDepartmentNote(
      visitId: $visitId
      departmentId: $departmentId
      note: $note
    ) {
      status
      message

      data {
        id
        note
        createdBy {
          id
          firstName
          lastName
          email
        }
        createdAt
      }
    }
  }
`;
const ADD_CHILD_VISIT_DEPARTMENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation AddChildVisitDepartment($input: AddChildVisitDepartmentInput!) {
    addChildVisitDepartment(input: $input) {
      status
      message
      data {
        id
        status
        startedAt
        completedAt
        department {
          id
          name
        }
        products {
          id
          product {
            id
            name
            code
            type
          }
          quantity
          status
        }
        createdAt
        updatedAt
      }
    }
  }
`;
const ADD_DIAGNOSIS_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation AddDiagnosis($input: AddDiagnosisInput!) {
    addDiagnosis(input: $input) {
      status
      message
      data {
        id
        status
        startedAt
        completedAt
        updatedAt
        department {
          id
          name
        }
        diagnostics {
          id
          diagnosisName
          icd11Code
          createdAt
        }
      }
    }
  }
`;
const ADD_MEDICATION_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation AddMedication($input: AddMedicationInput!) {
    addMedication(input: $input) {
      status
      message
      data {
        id
        status
        startedAt
        completedAt
        updatedAt
        department {
          id
          name
        }
        medications {
          id
          medicationName
          instructions
          createdAt
        }
      }
    }
  }
`;
const UPSERT_CONSULTATION_ANSWERS_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpsertConsultationAnswers($input: ConsultationAnswersInput!) {
    upsertConsultationAnswers(input: $input) {
      status
      message
      data {
        id
        consultationId
        visitId
        patientId
        departmentId
        status
        answers
        submittedAt
        updatedAt
        dedicatedForm {
          id
          version
        }
      }
    }
  }
`;
const GENERATE_CONSULTATION_PDF_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation GenerateConsultationPdf($consultationId: ID!, $departmentId: ID!) {
    generateConsultationPdf(
      consultationId: $consultationId
      departmentId: $departmentId
    ) {
      status
      message
      data {
        pdfBase64
        pdfUrl
      }
    }
  }
`;
const PROCESS_VISIT_DEPARTMENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation ProcessVisitDepartment($visitId: ID!, $departmentId: ID!) {
    processVisitDepartment(visitId: $visitId, departmentId: $departmentId) {
      status
      message
      data {
        id
        status
        transferTime
        completedTime
      }
    }
  }
`;
const REMOVE_VISIT_DEPARTMENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation RemoveVisitDepartment($visitDepartmentId: ID!) {
    removeVisitDepartment(visitDepartmentId: $visitDepartmentId) {
      status
      message
      data {
        id
        status
        departments {
          id
          status
          department {
            id
            name
          }
        }
      }
    }
  }
`;
const ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation AddVisitDepartmentProduct(
    $input: CreateVisitDepartmentProductInput!
  ) {
    addVisitDepartmentProduct(input: $input) {
      status
      message

      data {
        id
        department {
          id
          name
        }
        status
        products {
          id
          product {
            id
            name
            type
            privateRhicPrice
            clinicPrice
            notPaid
            quantifiable
            insuranceCoverages {
              id
              insuranceProvider {
                id
                insuranceName
                acronym
                coverages {
                  id
                  insuranceProviderId
                  insuranceProviderName
                  departmentId
                  departmentName
                  encounterType
                  patientSharePercentage
                  createdAt
                  updatedAt
                }
              }
              cost
              covered
              notPaid
              requireMedicalAdvisor
            }
          }
          quantity
          status
          processor {
            id
            firstName
            lastName
          }
          addedBy {
            id
            firstName
            lastName
            email
          }
        }
      }
    }
  }
`;
const COMPLETE_VISIT_DEPARTMENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation CompleteVisitDepartment($visitId: ID!, $departmentId: ID!) {
    completeVisitDepartment(visitId: $visitId, departmentId: $departmentId) {
      status
      message

      data {
        id
        status
        completedTime
      }
    }
  }
`;
const UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateVisitDepartmentStatus(
    $input: UpdateVisitDepartmentStatusInput!
  ) {
    updateVisitDepartmentStatus(input: $input) {
      status
      message

      data {
        id
        status
        startedAt
        completedAt
        updatedAt
        department {
          id
          name
        }
      }
    }
  }
`;
const ADD_DEPARTMENT_TO_VISIT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation AddDepartmentToVisit(
    $visitId: ID!
    $departmentId: ID!
    $profileId: ID
    $processorId: ID
    $encounterType: EncounterType
  ) {
    addVisitDepartment(
      visitId: $visitId
      departmentId: $departmentId
      profileId: $profileId
      processorId: $processorId
      encounterType: $encounterType
    ) {
      status
      message
      data {
        id
        status
        visitDate
        createdAt
        patient {
          id
          firstName
          middleName
          lastName
          patientIdentifier
          gender
          dateOfBirth
          age
          primaryPhoneNumber
          district
          cell
          village
          nationalIdNumber
        }
        linkedInsurances {
          id
          insuranceCardNumber
          providingCompanyOrEmployer
          principalMember
          insuranceProvider {
            id
            insuranceName
            acronym
          }
        }
        departments {
          id
          department {
            id
            name
          }
          status
          startedAt
          completedAt
          createdAt
          updatedAt
          profile {
            id
            name
            isDefault
            products {
              id
              name
            }
          }
          childVisitDepartments {
            id
            status
            department {
              id
              name
            }
          }
        }
      }
    }
  }
`;
const CONSULT_VISIT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation ConsultVisit($visitDepartmentId: ID!, $profileId: ID) {
    consultVisit(
      visitDepartmentId: $visitDepartmentId
      profileId: $profileId
    ) {
      status
      message
      data {
        id
        status
        encounterType
        startedAt
        completedAt
        addedBy {
          id
          firstName
          lastName
        }
        completedBy {
          id
          firstName
          lastName
        }
        processors {
          id
          firstName
          lastName
        }
        profile {
          id
          name
          isDefault
          products {
            id
            name
          }
        }
        department {
          id
          name
          requestsProducts
        }
        products {
          id
          product {
            id
            name
            code
            type
            unit
            privateRhicPrice
            clinicPrice
            notPaid
            quantifiable
          }
          quantity
          status
          source
          addedBy {
            id
            firstName
            lastName
          }
          billedBy {
            id
            firstName
            lastName
          }
          processor {
            id
            firstName
            lastName
          }
          createdAt
          updatedAt
        }
        diagnostics {
          id
          diagnosisName
          icd11Code
          createdAt
        }
        medications {
          id
          medicationName
          instructions
          createdAt
        }
        childVisitDepartments {
          id
          status
          startedAt
        completedAt
          addedBy {
            id
            firstName
            lastName
          }
          completedBy {
            id
            firstName
            lastName
          }
          processors {
            id
            firstName
            lastName
          }
          department {
            id
            name
            requestsProducts
          }
          products {
            id
            product {
              id
              name
              code
              type
              unit
              privateRhicPrice
              clinicPrice
              notPaid
              quantifiable
            }
            quantity
            status
            source
            addedBy {
              id
              firstName
              lastName
            }
            billedBy {
              id
              firstName
              lastName
            }
            processor {
              id
              firstName
              lastName
            }
            createdAt
            updatedAt
          }
          answerId
          hasFinalizedConsultationAnswers
          hasBillableProducts
          createdAt
          updatedAt
        }
        notes {
          totalNotes
          newNotes
        }
        answerId
        hasFinalizedConsultationAnswers
        hasBillableProducts
        createdAt
        updatedAt
      }
    }
  }
`;
const CHANGE_VISIT_DEPARTMENT_PROFILE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation ChangeVisitDepartmentProfile($visitDepartmentId: ID!, $profileId: ID) {
    changeVisitDepartmentProfile(
      visitDepartmentId: $visitDepartmentId
      profileId: $profileId
    ) {
      status
      message
      data {
        id
        status
        profile {
          id
          name
          isDefault
          products {
            id
            name
          }
        }
        department {
          id
          name
        }
        products {
          id
          product {
            id
            name
          }
          quantity
          status
          source
        }
      }
    }
  }
`;
const REMOVE_VISIT_DEPARTMENT_PROFILE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation RemoveVisitDepartmentProfile($visitDepartmentId: ID!) {
    removeVisitDepartmentProfile(visitDepartmentId: $visitDepartmentId) {
      status
      message
      data {
        id
        status
        profile {
          id
          name
        }
        department {
          id
          name
        }
        products {
          id
          product {
            id
            name
          }
          quantity
          status
          source
        }
      }
    }
  }
`;
const LINK_VISIT_INSURANCES_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation LinkVisitInsurances($visitId: ID!, $insuranceIds: [ID!]!) {
    linkVisitInsurances(visitId: $visitId, insuranceIds: $insuranceIds) {
      status
      message
      data {
        id
        linkedInsurances {
          id
          insuranceCardNumber
          patientSharePercentage
          deactivated
          principalMember
          principalMemberName
          principalMemberPhoneNumber
          validFrom
          validUntil
          insuranceProvider {
            id
            insuranceName
            acronym
            coverages {
              id
              insuranceProviderId
              insuranceProviderName
              departmentId
              departmentName
              encounterType
              patientSharePercentage
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
`;
const UNLINK_VISIT_INSURANCES_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UnlinkVisitInsurances($visitId: ID!, $insuranceIds: [ID!]!) {
    unlinkVisitInsurances(visitId: $visitId, insuranceIds: $insuranceIds) {
      status
      message
      data {
        id
        linkedInsurances {
          id
          insuranceCardNumber
          patientSharePercentage
          deactivated
          principalMember
          principalMemberName
          principalMemberPhoneNumber
          validFrom
          validUntil
          insuranceProvider {
            id
            insuranceName
            acronym
            coverages {
              id
              insuranceProviderId
              insuranceProviderName
              departmentId
              departmentName
              encounterType
              patientSharePercentage
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
`;
const UPDATE_VISIT_DEPARTMENT_PRODUCT_QUANTITY_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateVisitDepartmentProductQuantity(
    $input: UpdateVisitDepartmentProductQuantityInput!
  ) {
    updateVisitDepartmentProductQuantity(input: $input) {
      status
      message
      data {
        id
        department {
          id
          name
        }
        status
        products {
          id
          product {
            id
            name
            type
          }
          quantity
          status
        }
      }
    }
  }
`;
const UPDATE_VISIT_DEPARTMENT_PRODUCT_STATUS_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateVisitDepartmentProductStatus(
    $input: UpdateVisitDepartmentProductStatusInput!
  ) {
    updateVisitDepartmentProductStatus(input: $input) {
      status
      message
      data {
        id
        department {
          id
          name
        }
        status
        products {
          id
          product {
            id
            name
            type
          }
          quantity
          status
        }
      }
    }
  }
`;
const REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation RemoveVisitDepartmentProduct($visitDepartmentProductId: ID!) {
    removeVisitDepartmentProduct(
      visitDepartmentProductId: $visitDepartmentProductId
    ) {
      status
      message
      data {
        id
        department {
          id
          name
        }
        status
        products {
          id
          product {
            id
            name
            type
          }
          quantity
          status
        }
      }
    }
  }
`;
const REMOVE_ACTION_FROM_VISIT_DEPARTMENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation RemoveActionFromVisitDepartment(
    $visitId: ID!
    $departmentId: ID!
    $itemId: ID!
  ) {
    removeActionFromVisitDepartment(
      input: { visitId: $visitId, departmentId: $departmentId, itemId: $itemId }
    ) {
      status
      data {
        id
        departments {
          id
          status
          actions {
            id
            action {
              id
              name
              type
              privatePrice
            }
            quantity
          }
          consumables {
            id
            consumable {
              id
              name
              type
              privatePrice
            }
            quantity
          }
        }
      }
      messages {
        text
        type
      }
    }
  }
`;
const REMOVE_CONSUMABLE_FROM_VISIT_DEPARTMENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation RemoveConsumableFromVisitDepartment(
    $visitId: ID!
    $departmentId: ID!
    $itemId: ID!
  ) {
    removeConsumableFromVisitDepartment(
      input: { visitId: $visitId, departmentId: $departmentId, itemId: $itemId }
    ) {
      status
      data {
        id
        departments {
          id
          status
          actions {
            id
            action {
              id
              name
              type
              privatePrice
            }
            quantity
          }
          consumables {
            id
            consumable {
              id
              name
              type
              privatePrice
            }
            quantity
          }
        }
      }
      messages {
        text
        type
      }
    }
  }
`;
const UPDATE_ACTION_QUANTITY_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateActionQuantity(
    $visitId: ID!
    $departmentId: ID!
    $itemId: ID!
    $quantity: Int!
  ) {
    updateActionQuantity(
      input: {
        visitId: $visitId
        departmentId: $departmentId
        itemId: $itemId
        quantity: $quantity
      }
    ) {
      status
      data {
        id
        departments {
          id
          status
          actions {
            id
            action {
              id
              name
              type
              privatePrice
            }
            quantity
          }
          consumables {
            id
            consumable {
              id
              name
              type
              privatePrice
            }
            quantity
          }
        }
      }
      messages {
        text
        type
      }
    }
  }
`;
const UPDATE_CONSUMABLE_QUANTITY_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateConsumableQuantity(
    $visitId: ID!
    $departmentId: ID!
    $itemId: ID!
    $quantity: Int!
  ) {
    updateConsumableQuantity(
      input: {
        visitId: $visitId
        departmentId: $departmentId
        itemId: $itemId
        quantity: $quantity
      }
    ) {
      status
      data {
        id
        departments {
          id
          status
          actions {
            id
            action {
              id
              name
              type
              privatePrice
            }
            quantity
          }
          consumables {
            id
            consumable {
              id
              name
              type
              privatePrice
            }
            quantity
          }
        }
      }
      messages {
        text
        type
      }
    }
  }
`;
const COMPLETE_VISIT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation CompleteVisit($visitId: ID!) {
    completeVisit(visitId: $visitId) {
      status
      message
      data {
        id
        status
      }
    }
  }
`;
const COMPLETE_CONSULTATION_VISIT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation CompleteConsultationVisit(
    $input: ConsultationAnswersInput!
    $final: Boolean!
  ) {
    completeConsultationVisit(input: $input, final: $final) {
      status
      message
      data {
        id
        visitDate
        status
        patient {
          id
          firstName
          lastName
        }
        departments {
          id
          department {
            id
            name
          }
          status
        }
      }
    }
  }
`;
const ADD_VISIT_DEPARTMENT_NOTE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation AddVisitDepartmentNote($input: AddVisitDepartmentNoteInput!) {
    addVisitDepartmentNote(input: $input) {
      status
      message
      data {
        id
        visitDepartmentId
        content
        createdBy {
          id
          firstName
          lastName
        }
        viewed
        createdAt
      }
    }
  }
`;
const MARK_VISIT_DEPARTMENT_NOTE_VIEWED_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation MarkVisitDepartmentNoteViewed($noteId: ID!) {
    markVisitDepartmentNoteViewed(noteId: $noteId) {
      status
      message
      data {
        id
        visitDepartmentId
        content
        createdBy {
          id
          firstName
          lastName
        }
        viewed
        createdAt
      }
    }
  }
`;
const MARK_VISIT_DEPARTMENT_NOTES_VIEWED_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation MarkVisitDepartmentNotesViewed($visitDepartmentId: ID!) {
    markVisitDepartmentNotesViewed(visitDepartmentId: $visitDepartmentId) {
      status
      message
      data {
        totalNotes
        newNotes
      }
    }
  }
`;
const UPDATE_VISIT_DEPARTMENT_ENCOUNTER_TYPE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateVisitDepartmentEncounterType($visitDepartmentId: ID!, $encounterType: EncounterType!) {
    updateVisitDepartmentEncounterType(visitDepartmentId: $visitDepartmentId, encounterType: $encounterType) {
      status
      message
      data {
        id
        encounterType
        status
        department {
          id
          name
        }
      }
    }
  }
`;
const UPDATE_VISIT_DEPARTMENT_PRODUCT_PROCESSOR_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateVisitDepartmentProductProcessor(
    $input: UpdateVisitDepartmentProductProcessorInput!
  ) {
    updateVisitDepartmentProductProcessor(input: $input) {
      status
      message
      data {
        id
        department {
          id
          name
        }
        status
        processors {
          id
          firstName
          lastName
        }
        products {
          id
          product {
            id
            name
          }
          processor {
            id
            firstName
            lastName
          }
        }
      }
    }
  }
`;
const CANCEL_VISIT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation CancelVisit($visitId: ID!) {
    cancelVisit(visitId: $visitId) {
      status
      message
      data {
        id
        status
      }
    }
  }
`;
const FINALISE_VISIT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation FinaliseVisit($visitId: ID!) {
    finaliseVisit(visitId: $visitId) {
      status
      message
      data {
        id
        status
        departments {
          id
          status
          department {
            id
            name
          }
        }
      }
    }
  }
`;
const REOPEN_VISIT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation ReopenVisit($visitId: ID!) {
    reopenVisit(visitId: $visitId) {
      status
      message
      data {
        id
        status
        departments {
          id
          status
          department {
            id
            name
          }
        }
      }
    }
  }
`;
const DELETE_VISIT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation DeleteVisit($visitId: ID!) {
    deleteVisit(visitId: $visitId) {
      status
      message
      data
    }
  }
`;
const CHANGE_VISIT_DATE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation ChangeVisitDate($input: ChangeVisitDateInput!) {
    changeVisitDate(input: $input) {
      status
      message
      data {
        id
        visitDate
      }
    }
  }
`;
const UPDATE_VISIT_DEPARTMENT_ENCOUNTER_DATE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateVisitDepartmentEncounterDate($input: UpdateVisitDepartmentEncounterDateInput!) {
    updateVisitDepartmentEncounterDate(input: $input) {
      status
      message
      data {
        id
        status
        startedAt
        createdAt
        updatedAt
        department {
          id
          name
        }
      }
    }
  }
`;
const FINALISE_VISIT_DEPARTMENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation FinaliseVisitDepartment($visitDepartmentId: ID!) {
    updateVisitDepartmentStatus(
      input: { visitDepartmentId: $visitDepartmentId, status: FINALISED }
    ) {
      status
      message
      data {
        id
        status
        startedAt
        completedAt
        updatedAt
        department {
          id
          name
        }
      }
    }
  }
`;
}),
"[project]/hooks/mutations/insurances.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CREATE_INSURANCE_PROVIDER_MUTATION",
    ()=>CREATE_INSURANCE_PROVIDER_MUTATION,
    "DELETE_INSURANCE_PROVIDER_MUTATION",
    ()=>DELETE_INSURANCE_PROVIDER_MUTATION,
    "UPDATE_INSURANCE_PROVIDER_MUTATION",
    ()=>UPDATE_INSURANCE_PROVIDER_MUTATION
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const CREATE_INSURANCE_PROVIDER_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation CreateInsuranceProvider($input: CreateInsuranceProviderInput!) {
    createInsuranceProvider(input: $input) {
      status
      message
      
      data {
        id
        insuranceName
        acronym
        coverages {

                        id

                        insuranceProviderId

                        insuranceProviderName

                        departmentId

                        departmentName

                        encounterType

                        patientSharePercentage

                        createdAt

                        updatedAt

                      }
        supportedByClinic
        iconUrl
        createdAt
        updatedAt
      }
    }
  }
`;
const UPDATE_INSURANCE_PROVIDER_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateInsuranceProvider($insuranceProviderId: ID!, $input: UpdateInsuranceProviderInput!) {
    updateInsuranceProvider(insuranceProviderId: $insuranceProviderId, input: $input) {
      status
      message
      
      data {
        id
        insuranceName
        acronym
        coverages {

                        id

                        insuranceProviderId

                        insuranceProviderName

                        departmentId

                        departmentName

                        encounterType

                        patientSharePercentage

                        createdAt

                        updatedAt

                      }
        supportedByClinic
        iconUrl
        createdAt
        updatedAt
      }
    }
  }
`;
const DELETE_INSURANCE_PROVIDER_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation DeleteInsuranceProvider($insuranceProviderId: ID!) {
    deleteInsuranceProvider(insuranceProviderId: $insuranceProviderId) {
      status
      message
    }
  }
`;
}),
"[project]/hooks/mutations/billing.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CANCEL_BILL_EDITING_MUTATION",
    ()=>CANCEL_BILL_EDITING_MUTATION,
    "COMPLETE_BILL_EDITING_MUTATION",
    ()=>COMPLETE_BILL_EDITING_MUTATION,
    "CONFIRM_VISIT_DEPARTMENT_PRODUCT_MUTATION",
    ()=>CONFIRM_VISIT_DEPARTMENT_PRODUCT_MUTATION,
    "CREATE_BILL_MUTATION",
    ()=>CREATE_BILL_MUTATION,
    "EDIT_BILL_MUTATION",
    ()=>EDIT_BILL_MUTATION,
    "GENERATE_INVOICE_MUTATION",
    ()=>GENERATE_INVOICE_MUTATION,
    "QUICK_BILL_MUTATION",
    ()=>QUICK_BILL_MUTATION,
    "RECORD_VISIT_BILLING_PAYMENT_MUTATION",
    ()=>RECORD_VISIT_BILLING_PAYMENT_MUTATION,
    "START_BILL_EDITING_MUTATION",
    ()=>START_BILL_EDITING_MUTATION,
    "UPDATE_BILLING_DATE_MUTATION",
    ()=>UPDATE_BILLING_DATE_MUTATION,
    "VISIT_DEPARTMENT_BILLING_FRAGMENT",
    ()=>VISIT_DEPARTMENT_BILLING_FRAGMENT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const VISIT_DEPARTMENT_BILLING_FRAGMENT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  fragment VisitDepartmentBillingFields on VisitDepartmentBilling {
    id
    visitDepartment {
      id
      status
      department {
        id
        name
      }
    }
    status
    totalAmount
    insuranceCoveredAmount
    patientPayableAmount
    paidAmount
    outstandingAmount
    payments {
      id
      amount
      paymentMethod
      reference
      createdAt
      updatedAt
    }
    insuranceBillings {
      id
      patientInsurance {
        id
        insuranceCardNumber
          patientSharePercentage
          patientShareCoverageId
          deactivated
        principalMemberName
        insuranceProvider {
          id
          insuranceName
          acronym
        }
      }
      status
      totalAmount
      insuranceCoveredAmount
      patientPayableAmount
      paidAmount
      outstandingAmount
      outstandingType
      outstandingReason
      items {
        id
        visitDepartmentProductId
        productId
        productName
        unitPriceSnapshot
        quantitySnapshot
        insuranceCoveredAmount
        patientPayableAmount
        appliedPatientSharePct
        patientShareSource
      }
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
`;
const CREATE_BILL_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation BillVisit($input: BillVisitInput!) {
    billVisit(input: $input) {
      status
      message
      data {
        id
        visitId
        version {
          id
          version
        }
        departments {
          ...VisitDepartmentBillingFields
        }
        createdAt
        updatedAt
      }
    }
  }
  ${VISIT_DEPARTMENT_BILLING_FRAGMENT}
`;
const EDIT_BILL_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation EditBillVisit($input: EditBillVisitInput!) {
    editBillVisit(input: $input) {
      status
      message
      data {
        id
        visitId
        version {
          id
          version
        }
        departments {
          ...VisitDepartmentBillingFields
        }
        createdAt
        updatedAt
      }
    }
  }
  ${VISIT_DEPARTMENT_BILLING_FRAGMENT}
`;
const RECORD_VISIT_BILLING_PAYMENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation RecordVisitBillingPayment($input: RecordVisitBillingPaymentInput!) {
    recordVisitBillingPayment(input: $input) {
      status
      message
      data {
        id
        visitId
        version {
          id
          version
        }
        departments {
          ...VisitDepartmentBillingFields
        }
        createdAt
        updatedAt
      }
    }
  }
  ${VISIT_DEPARTMENT_BILLING_FRAGMENT}
`;
const GENERATE_INVOICE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation GenerateInvoice(
    $visitDepartmentId: ID
    $departmentInsuranceBillingId: ID
    $copyType: String
  ) {
    generateInvoice(
      visitDepartmentId: $visitDepartmentId
      departmentInsuranceBillingId: $departmentInsuranceBillingId
      copyType: $copyType
    ) {
      status
      message
      data {
        signedUrl
      }
    }
  }
`;
const START_BILL_EDITING_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation StartBillEditing($visitDepartmentId: ID!) {
    startBillEditing(visitDepartmentId: $visitDepartmentId) {
      status
      message
      data {
        visitDepartmentId
        status
      }
    }
  }
`;
const COMPLETE_BILL_EDITING_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation CompleteBillEditing($visitDepartmentId: ID!) {
    completeBillEditing(visitDepartmentId: $visitDepartmentId) {
      status
      message
      data {
        visitDepartmentId
        status
      }
    }
  }
`;
const CANCEL_BILL_EDITING_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation CancelBillEditing($visitDepartmentId: ID!, $addedProductIds: [ID!]) {
    cancelBillEditing(visitDepartmentId: $visitDepartmentId, addedProductIds: $addedProductIds) {
      status
      message
      data {
        visitDepartmentId
        status
      }
    }
  }
`;
const UPDATE_BILLING_DATE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateBillingDate($input: UpdateBillingDateInput!) {
    updateBillingDate(input: $input) {
      status
      message
      data {
        id
        billingDate
        totalAmount
      }
    }
  }
`;
const QUICK_BILL_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation QuickBill($visitId: ID!) {
    quickBill(visitId: $visitId) {
      status
      message
    }
  }
`;
const CONFIRM_VISIT_DEPARTMENT_PRODUCT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation ConfirmVisitDepartmentProduct($visitDepartmentProductId: ID!) {
    confirmVisitDepartmentProduct(visitDepartmentProductId: $visitDepartmentProductId) {
      status
      message
    }
  }
`;
}),
"[project]/hooks/mutations/forms.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CREATE_FORM_MUTATION",
    ()=>CREATE_FORM_MUTATION,
    "FINALIZE_FORM_MUTATION",
    ()=>FINALIZE_FORM_MUTATION,
    "UPDATE_FORM_MUTATION",
    ()=>UPDATE_FORM_MUTATION
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const CREATE_FORM_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation CreateForm($departmentId: ID!, $input: FormInput!) {
    createForm(departmentId: $departmentId, input: $input) {
      status
      message
      
      data {
        id
        title
        description
        status
        version
        createdAt
        updatedAt
        sections {
          id
          title
          boldTitle
          italicTitle
          underlineTitle
          centerTitle
          columns
          order
          fields {
            id
            label
            type
            placeholder
            required
            options
            hideLabel
            boldLabel
            italicLabel
            underlineLabel
            centerLabel
            order
            tableConfig {
              mode
              rows
              columns
              headerPlacement
              columnHeaders
              rowHeaders
            }
            conditionalRendering {
              dependsOn
              condition
              value
              itemType
            }
          }
        }
        fields {
          id
          label
          type
          placeholder
          required
          options
          hideLabel
          boldLabel
          italicLabel
          underlineLabel
          centerLabel
          order
          tableConfig {
            mode
            rows
            columns
            headerPlacement
            columnHeaders
            rowHeaders
          }
          conditionalRendering {
            dependsOn
            condition
            value
            itemType
          }
        }
        actions {
          id
          name
          type
          quantity
          price
          isQuantifiable
          backendId
        }
      }
    }
  }
`;
const UPDATE_FORM_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateForm($departmentId: ID!, $formId: ID!, $input: FormInput!) {
    updateForm(departmentId: $departmentId, formId: $formId, input: $input) {
      status
      message
      
      data {
        id
        title
        description
        status
        version
        createdAt
        updatedAt
        sections {
          id
          title
          boldTitle
          italicTitle
          underlineTitle
          centerTitle
          columns
          order
          fields {
            id
            label
            type
            placeholder
            required
            options
            hideLabel
            boldLabel
            italicLabel
            underlineLabel
            centerLabel
            order
            tableConfig {
              mode
              rows
              columns
              headerPlacement
              columnHeaders
              rowHeaders
            }
            conditionalRendering {
              dependsOn
              condition
              value
              itemType
            }
          }
        }
        fields {
          id
          label
          type
          placeholder
          required
          options
          hideLabel
          boldLabel
          italicLabel
          underlineLabel
          centerLabel
          order
          tableConfig {
            mode
            rows
            columns
            headerPlacement
            columnHeaders
            rowHeaders
          }
          conditionalRendering {
            dependsOn
            condition
            value
            itemType
          }
        }
        actions {
          id
          name
          type
          quantity
          price
          isQuantifiable
          backendId
        }
      }
    }
  }
`;
const FINALIZE_FORM_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation FinalizeForm($departmentId: ID!, $formId: ID!) {
    finalizeForm(departmentId: $departmentId, formId: $formId) {
      status
      message
      
      data {
        id
        title
        description
        status
        version
        createdAt
        updatedAt
        sections {
          id
          title
          boldTitle
          italicTitle
          underlineTitle
          centerTitle
          columns
          order
          fields {
            id
            label
            type
            placeholder
            required
            options
            hideLabel
            boldLabel
            italicLabel
            underlineLabel
            centerLabel
            order
            tableConfig {
              mode
              rows
              columns
              headerPlacement
              columnHeaders
              rowHeaders
            }
            conditionalRendering {
              dependsOn
              condition
              value
              itemType
            }
          }
        }
        fields {
          id
          label
          type
          placeholder
          required
          options
          hideLabel
          boldLabel
          italicLabel
          underlineLabel
          centerLabel
          order
          tableConfig {
            mode
            rows
            columns
            headerPlacement
            columnHeaders
            rowHeaders
          }
          conditionalRendering {
            dependsOn
            condition
            value
            itemType
          }
        }
        actions {
          id
          name
          type
          quantity
          price
          isQuantifiable
          backendId
        }
      }
    }
  }
`;
}),
"[project]/hooks/mutations/standalone-forms.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CREATE_STANDALONE_FORM_MUTATION",
    ()=>CREATE_STANDALONE_FORM_MUTATION,
    "DELETE_STANDALONE_FORM_MUTATION",
    ()=>DELETE_STANDALONE_FORM_MUTATION,
    "DUPLICATE_STANDALONE_FORM_MUTATION",
    ()=>DUPLICATE_STANDALONE_FORM_MUTATION,
    "LINK_STANDALONE_FORM_TO_DEPARTMENT_MUTATION",
    ()=>LINK_STANDALONE_FORM_TO_DEPARTMENT_MUTATION,
    "SAVE_STANDALONE_ANSWER_MUTATION",
    ()=>SAVE_STANDALONE_ANSWER_MUTATION,
    "SAVE_VISIT_STANDALONE_ANSWER_MUTATION",
    ()=>SAVE_VISIT_STANDALONE_ANSWER_MUTATION,
    "SET_DEFAULT_STANDALONE_FORM_FOR_DEPARTMENT_MUTATION",
    ()=>SET_DEFAULT_STANDALONE_FORM_FOR_DEPARTMENT_MUTATION,
    "SET_STANDALONE_FORM_AS_TEMPLATE_MUTATION",
    ()=>SET_STANDALONE_FORM_AS_TEMPLATE_MUTATION,
    "UNLINK_STANDALONE_FORM_FROM_DEPARTMENT_MUTATION",
    ()=>UNLINK_STANDALONE_FORM_FROM_DEPARTMENT_MUTATION,
    "UPDATE_STANDALONE_ANSWER_MUTATION",
    ()=>UPDATE_STANDALONE_ANSWER_MUTATION,
    "UPDATE_STANDALONE_FORM_MUTATION",
    ()=>UPDATE_STANDALONE_FORM_MUTATION
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const CREATE_STANDALONE_FORM_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation CreateStandaloneForm($input: StandaloneFormInput!) {
    createStandaloneForm(input: $input) {
      status
      message
      data {
        id
        name
        description
        type
        category
        isTemplate
        createdAt
        updatedAt
        activeVersion {
          id
          formId
          versionLabel
          majorVersion
          minorVersion
          blocks
          theme
          status
          createdAt
        }
      }
    }
  }
`;
const UPDATE_STANDALONE_FORM_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateStandaloneForm(
    $id: ID!
    $input: StandaloneFormInput!
    $markFinal: Boolean
  ) {
    updateStandaloneForm(id: $id, input: $input, markFinal: $markFinal) {
      status
      message
      data {
        id
        name
        description
        type
        category
        isTemplate
        createdAt
        updatedAt
        activeVersion {
          id
          formId
          versionLabel
          majorVersion
          minorVersion
          blocks
          theme
          status
          createdAt
        }
      }
    }
  }
`;
const DELETE_STANDALONE_FORM_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation DeleteStandaloneForm($id: ID!, $confirmDeleteAnswers: Boolean) {
    deleteStandaloneForm(id: $id, confirmDeleteAnswers: $confirmDeleteAnswers) {
      status
      message
      data
    }
  }
`;
const DUPLICATE_STANDALONE_FORM_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation DuplicateStandaloneForm($sourceFormId: ID!) {
    duplicateStandaloneForm(sourceFormId: $sourceFormId) {
      status
      message
      data {
        id
        name
        description
        type
        category
        isTemplate
        createdAt
        updatedAt
        activeVersion {
          id
          formId
          versionLabel
          majorVersion
          minorVersion
          blocks
          theme
          status
          createdAt
        }
      }
    }
  }
`;
const SAVE_STANDALONE_ANSWER_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation SaveStandaloneAnswer(
    $formVersionId: ID!
    $answers: JSON!
    $status: AnswerStatus
    $score: Float
  ) {
    saveStandaloneAnswer(
      formVersionId: $formVersionId
      answers: $answers
      status: $status
      score: $score
    ) {
      status
      message
      data {
        id
        answers
        score
        status
        submittedAt
        createdAt
        updatedAt
      }
    }
  }
`;
const UPDATE_STANDALONE_ANSWER_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateStandaloneAnswer(
    $answerId: ID!
    $answers: JSON!
    $status: AnswerStatus
    $score: Float
  ) {
    updateStandaloneAnswer(
      answerId: $answerId
      answers: $answers
      status: $status
      score: $score
    ) {
      status
      message
      data {
        id
        answers
        score
        status
        visitId
        submittedAt
        createdAt
        updatedAt
        formVersion {
          id
        }
      }
    }
  }
`;
const SAVE_VISIT_STANDALONE_ANSWER_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation SaveVisitStandaloneAnswer(
    $visitId: ID!
    $visitDepartmentId: ID!
    $formVersionId: ID!
    $answers: JSON!
    $status: AnswerStatus
    $score: Float
  ) {
    saveVisitStandaloneAnswer(
      visitId: $visitId
      visitDepartmentId: $visitDepartmentId
      formVersionId: $formVersionId
      answers: $answers
      status: $status
      score: $score
    ) {
      status
      message
      data {
        answer {
          id
          answers
          score
          status
          visitId
          submittedAt
          createdAt
          updatedAt
          formVersion {
            id
          }
        }
        visitDepartment {
          id
          answerId
        }
      }
    }
  }
`;
const LINK_STANDALONE_FORM_TO_DEPARTMENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation LinkStandaloneFormToDepartment($departmentId: ID!, $formId: ID!) {
    linkStandaloneFormToDepartment(
      departmentId: $departmentId
      formId: $formId
    ) {
      status
      message
      data {
        id
        name
        activeVersion {
          id
        }
      }
    }
  }
`;
const UNLINK_STANDALONE_FORM_FROM_DEPARTMENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UnlinkStandaloneFormFromDepartment(
    $departmentId: ID!
    $formId: ID!
  ) {
    unlinkStandaloneFormFromDepartment(
      departmentId: $departmentId
      formId: $formId
    ) {
      status
      message
      data
    }
  }
`;
const SET_DEFAULT_STANDALONE_FORM_FOR_DEPARTMENT_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation SetDefaultStandaloneFormForDepartment(
    $departmentId: ID!
    $formId: ID!
  ) {
    setDefaultStandaloneFormForDepartment(
      departmentId: $departmentId
      formId: $formId
    ) {
      status
      message
      data {
        id
        name
      }
    }
  }
`;
const SET_STANDALONE_FORM_AS_TEMPLATE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation SetStandaloneFormAsTemplate(
    $formId: ID!
    $isTemplate: Boolean!
  ) {
    setStandaloneFormAsTemplate(
      formId: $formId
      isTemplate: $isTemplate
    ) {
      status
      message
      data {
        id
        name
        isTemplate
        updatedAt
      }
    }
  }
`;
}),
"[project]/hooks/mutations/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$departments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/departments.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/products.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$patients$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/patients.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/visits.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$insurances$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/insurances.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/billing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$forms$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/forms.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$standalone$2d$forms$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/standalone-forms.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
}),
"[project]/hooks/queries/departments.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEPARTMENT_PROFILE_FRAGMENT",
    ()=>DEPARTMENT_PROFILE_FRAGMENT,
    "DEPARTMENT_PROFILE_PRODUCT_FRAGMENT",
    ()=>DEPARTMENT_PROFILE_PRODUCT_FRAGMENT,
    "GET_DEPARTMENTS_QUERY",
    ()=>GET_DEPARTMENTS_QUERY,
    "GET_DEPARTMENT_QUERY",
    ()=>GET_DEPARTMENT_QUERY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const DEPARTMENT_PROFILE_PRODUCT_FRAGMENT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  fragment DepartmentProfileProduct on Product {
    id
    name
    genericName
    code
    description
    type
    unit
    privateRhicPrice
    clinicPrice
    insuranceCoverages {
      id
      insuranceProvider {
        id
        insuranceName
        acronym
        coverages {

                        id

                        insuranceProviderId

                        insuranceProviderName

                        departmentId

                        departmentName

                        encounterType

                        patientSharePercentage

                        createdAt

                        updatedAt

                      }
        supportedByClinic
        iconUrl
      }
      cost
      covered
      requireMedicalAdvisor
    }
  }
`;
const DEPARTMENT_PROFILE_FRAGMENT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  ${DEPARTMENT_PROFILE_PRODUCT_FRAGMENT}
  fragment DepartmentProfileFields on DepartmentProfile {
    id
    name
    encounterType
    isDefault
    products {
      ...DepartmentProfileProduct
    }
    createdAt
    updatedAt
  }
`;
const GET_DEPARTMENTS_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetDepartments($input: SearchDepartmentsInput) {
    departments(input: $input) {
      status
      message
      
      data {
        id
        name
        nursing
        supportRequests
        requestsProducts
        insurancePolicyMode
        insurancePolicies {
          id
          insuranceName
          acronym
          coverages {

                          id

                          insuranceProviderId

                          insuranceProviderName

                          departmentId

                          departmentName

                          encounterType

                          patientSharePercentage

                          createdAt

                          updatedAt

                        }
          supportedByClinic
          iconUrl
        }
        profiles {
          ...DepartmentProfileFields
        }
        createdAt
        updatedAt
      }
      pagination {
        total
        perPage
        currentPage
        totalPages
      }
    }
  }
  ${DEPARTMENT_PROFILE_PRODUCT_FRAGMENT}
  ${DEPARTMENT_PROFILE_FRAGMENT}
`;
const GET_DEPARTMENT_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetDepartment($id: ID!) {
    department(departmentId: $id) {
      status
      message
      
      data {
        id
        name
        nursing
        supportRequests
        requestsProducts
        insurancePolicyMode
        insurancePolicies {
          id
          insuranceName
          acronym
          coverages {

                          id

                          insuranceProviderId

                          insuranceProviderName

                          departmentId

                          departmentName

                          encounterType

                          patientSharePercentage

                          createdAt

                          updatedAt

                        }
          supportedByClinic
          iconUrl
        }
        profiles {
          ...DepartmentProfileFields
        }
        createdAt
        updatedAt
      }
    }
  }
  ${DEPARTMENT_PROFILE_PRODUCT_FRAGMENT}
  ${DEPARTMENT_PROFILE_FRAGMENT}
`;
}),
"[project]/hooks/queries/products.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET_PRODUCTS_QUERY",
    ()=>GET_PRODUCTS_QUERY,
    "GET_PRODUCT_QUERY",
    ()=>GET_PRODUCT_QUERY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const GET_PRODUCTS_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetProducts($input: SearchProductsInput) {
    products(input: $input) {
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
        notPaid
        quantifiable
        insuranceCoverages {
          id
          insuranceProvider {
            id
            insuranceName
            acronym
            coverages {
              id
              insuranceProviderId
              insuranceProviderName
              departmentId
              departmentName
              encounterType
              patientSharePercentage
              createdAt
              updatedAt
            }
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
      pagination {
        total
        perPage
        currentPage
        totalPages
      }
    }
  }
`;
const GET_PRODUCT_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetProduct($id: ID!) {
    product(productId: $id) {
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
        notPaid
        quantifiable
        insuranceCoverages {
          id
          insuranceProvider {
            id
            insuranceName
            acronym
            coverages {
              id
              insuranceProviderId
              insuranceProviderName
              departmentId
              departmentName
              encounterType
              patientSharePercentage
              createdAt
              updatedAt
            }
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
}),
"[project]/hooks/queries/patients.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET_PATIENTS_QUERY",
    ()=>GET_PATIENTS_QUERY,
    "GET_PATIENT_QUERY",
    ()=>GET_PATIENT_QUERY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const GET_PATIENTS_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query SearchPatients($input: SearchPatientsInput) {
    searchPatients(input: $input) {
      status
      message
      data {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        gender
        primaryPhoneNumber
        alternativePhone
        village
        city
        district
        postalAddress
        nationalIdNumber
        passportNumber
        emergencyContactName
        emergencyContactRelationship
        emergencyContactPhoneNumber
        patientInsurances {
          id
          insuranceCardNumber
          providingCompanyOrEmployer
          patientSharePercentage
          patientShareCoverageId
          deactivated
          principalMember
          principalMemberName
          principalMemberPhoneNumber
          insuranceProvider {
            id
            insuranceName
            acronym
            iconUrl
            coverages {
              id
              insuranceProviderId
              insuranceProviderName
              departmentId
              departmentName
              encounterType
              patientSharePercentage
              createdAt
              updatedAt
            }
          }
        }
        createdAt
      }
      pagination {
        total
        totalPages
      }
    }
  }
`;
const GET_PATIENT_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetPatient($patientId: ID!) {
    patient(patientId: $patientId) {
      status
      message
      data {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        gender
        primaryPhoneNumber
        alternativePhone
        village
        city
        district
        postalAddress
        nationalIdNumber
        passportNumber
        emergencyContactName
        emergencyContactRelationship
        emergencyContactPhoneNumber
        createdAt
      }
    }
    patientInsurances(patientId: $patientId) {
      status
      data {
        id
        insuranceCardNumber
        providingCompanyOrEmployer
          patientSharePercentage
          deactivated
        principalMember
        principalMemberName
        principalMemberPhoneNumber
        insuranceProvider {
          id
          insuranceName
          acronym
          iconUrl
          coverages {

                          id

                          insuranceProviderId

                          insuranceProviderName

                          departmentId

                          departmentName

                          encounterType

                          patientSharePercentage

                          createdAt

                          updatedAt

                        }
        }
      }
    }
  }
`;
}),
"[project]/hooks/queries/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CLINIC_PROFILE_QUERY",
    ()=>CLINIC_PROFILE_QUERY,
    "GET_USERS_QUERY",
    ()=>GET_USERS_QUERY,
    "ME_QUERY",
    ()=>ME_QUERY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const ME_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query Me {
    me {
      status
      message

      data {
        id
        firstName
        lastName
        email
        phoneNumber
        username
        accountStatus
        roles
        departments {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`;
const CLINIC_PROFILE_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query ClinicProfile {
    clinicProfile {
      status
      message

      data {
        id
        name
        username
        address
        contacts {
          contactType
          value
          description
        }
        tinNumber
        logoUrl
        metadata {
          key
          value
        }
        createdAt
        updatedAt
      }
    }
  }
`;
const GET_USERS_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetUsers {
    listUsers {
      status
      message

      data {
        id
        firstName
        lastName
        email
        phoneNumber
        username
        accountStatus
        roles
        departments {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`;
}),
"[project]/hooks/queries/visits.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DASHBOARD_STATS_QUERY",
    ()=>DASHBOARD_STATS_QUERY,
    "GET_PATIENT_HISTORY_QUERY",
    ()=>GET_PATIENT_HISTORY_QUERY,
    "GET_VISIT_QUERY",
    ()=>GET_VISIT_QUERY,
    "LAST_PATIENT_DEPARTMENT_VISIT_QUERY",
    ()=>LAST_PATIENT_DEPARTMENT_VISIT_QUERY,
    "VISITS_QUERY",
    ()=>VISITS_QUERY,
    "VISIT_DEPARTMENT_NOTES_QUERY",
    ()=>VISIT_DEPARTMENT_NOTES_QUERY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
/** Product line items on a visit department (parent or child). */ const visitDepartmentProductFields = `
  id
  product {
    id
    name
    code
    type
    unit
    privateRhicPrice
    clinicPrice
    notPaid
    quantifiable
    insuranceCoverages {
      id
      insuranceProvider {
        id
        insuranceName
        acronym
        coverages {

                        id

                        insuranceProviderId

                        insuranceProviderName

                        departmentId

                        departmentName

                        encounterType

                        patientSharePercentage

                        createdAt

                        updatedAt

                      }
      }
      cost
      covered
      requireMedicalAdvisor
    }
  }
  quantity
  status
  source
  addedBy {
    id
    firstName
    lastName
  }
  billedBy {
    id
    firstName
    lastName
  }
  processor {
    id
    firstName
    lastName
  }
  createdAt
  updatedAt
`;
/** Nested visit department (child of a consultation department). */ const childVisitDepartmentFields = `
  id
  status
  completedAt
  department {
    id
    name
    requestsProducts
  }
  addedBy {
    id
    firstName
    lastName
  }
  processors {
    id
    firstName
    lastName
  }
  diagnostics {
    id
    diagnosisName
    icd11Code
    createdAt
  }
  medications {
    id
    medicationName
    instructions
    createdAt
  }
  products {
    ${visitDepartmentProductFields}
  }
  answerId
  hasFinalizedConsultationAnswers
  hasBillableProducts
  createdAt
  updatedAt
`;
const GET_VISIT_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetVisit($id: ID!) {
    visit(visitId: $id) {
      status
      message

      data {
        id
        status
        visitDate
        createdAt
        patient {
          id
          firstName
          lastName
          middleName
          patientIdentifier
          gender
          dateOfBirth
          primaryPhoneNumber
          alternativePhone
          village
          city
          district
          postalAddress
          nationalIdNumber
          passportNumber
          emergencyContactName
          emergencyContactRelationship
          emergencyContactPhoneNumber
          patientInsurances {
            id
            insuranceCardNumber
          patientSharePercentage
          patientShareCoverageId
          deactivated
            providingCompanyOrEmployer
            principalMember
            principalMemberName
            principalMemberPhoneNumber
            validFrom
            validUntil
            insuranceProvider {
              id
              insuranceName
              acronym
              coverages {
              id
              insuranceProviderId
              insuranceProviderName
              departmentId
              departmentName
              encounterType
              patientSharePercentage
              createdAt
              updatedAt
            }
            }
          }
        }
        vitalSigns {
          id
          createdAt
          addedBy {
            id
            firstName
            lastName
          }
          measurements {
            id
            measurementName
            value
            unit
            createdAt
          }
        }
        linkedInsurances {
          id
          patient {
            id
            firstName
            lastName
          }
          insuranceProvider {
            id
            insuranceName
            acronym
            coverages {
              id
              insuranceProviderId
              insuranceProviderName
              departmentId
              departmentName
              encounterType
              patientSharePercentage
              createdAt
              updatedAt
            }
          }
          insuranceCardNumber
          patientSharePercentage
          patientShareCoverageId
          deactivated
          providingCompanyOrEmployer
          principalMember
          principalMemberName
          principalMemberPhoneNumber
          validFrom
          validUntil
        }
        departments {
          id
          department {
            id
            name
            insurancePolicyMode
            requestsProducts
          }
          status
          profile {
            id
            name
            isDefault
            products {
              id
              name
            }
          }
          startedAt
          completedAt
          addedBy {
            id
            firstName
            lastName
          }
          completedBy {
            id
            firstName
            lastName
          }
          processors {
            id
            firstName
            lastName
          }
          diagnostics {
            id
            diagnosisName
            icd11Code
            createdAt
          }
          medications {
            id
            medicationName
            instructions
            createdAt
          }
          products {
            ${visitDepartmentProductFields}
          }
          childVisitDepartments {
            ${childVisitDepartmentFields}
          }
          preInstructions {
            id
            type
            note
            createdAt
            addedBy {
              id
              firstName
              lastName
            }
          }
          notes {
            totalNotes
            newNotes
          }
          answerId
          hasFinalizedConsultationAnswers
          hasBillableProducts
          createdAt
          updatedAt
        }
        estimatedTotal
        estimatedInsurancePay
        estimatedPatientPay
        quickBillEligible
      }
    }
  }
`;
const VISITS_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetVisits($input: SearchVisitsInput!) {
    visits(input: $input) {
      status
      message

      data {
        id
        status
        visitDate
        createdAt
        patient {
          id
          firstName
          middleName
          lastName
          patientIdentifier
          gender
          dateOfBirth
          age
          primaryPhoneNumber
          alternativePhone
          village
          cell
          city
          district
          postalAddress
          nationalIdNumber
          passportNumber
          emergencyContactName
          emergencyContactRelationship
          emergencyContactPhoneNumber
          patientInsurances {
            id
            insuranceCardNumber
            providingCompanyOrEmployer
            patientSharePercentage
            patientShareCoverageId
            deactivated
            principalMember
            principalMemberName
            principalMemberPhoneNumber
            insuranceProvider {
              id
              insuranceName
              acronym
              iconUrl
              coverages {
                id
                insuranceProviderId
                insuranceProviderName
                departmentId
                departmentName
                encounterType
                patientSharePercentage
                createdAt
                updatedAt
              }
            }
          }
        }
        linkedInsurances {
          id
          insuranceCardNumber
          providingCompanyOrEmployer
          principalMember
          insuranceProvider {
            id
            insuranceName
            acronym
          }
        }
        departments {
          id
          department {
            id
            name
          }
          status
          startedAt
          completedAt
          addedBy {
            id
            firstName
            lastName
          }
          completedBy {
            id
            firstName
            lastName
          }
          processors {
            id
            firstName
            lastName
          }
          createdAt
          updatedAt
          answerId
          hasFinalizedConsultationAnswers
          billing {
            id
            status
            totalAmount
            insuranceCoveredAmount
            patientPayableAmount
            paidAmount
            outstandingAmount
            insuranceBillings {
              id
              status
              totalAmount
              insuranceCoveredAmount
              patientPayableAmount
              paidAmount
              outstandingAmount
              outstandingType
              outstandingReason
              billingDate
            }
          }
          products {
            id
            product {
              id
              name
              code
              type
              unit
              privateRhicPrice
              clinicPrice
              notPaid
              quantifiable
            }
            quantity
            status
            source
            addedBy {
              id
              firstName
              lastName
            }
            billedBy {
              id
              firstName
              lastName
            }
            confirmedBy {
              id
              firstName
              lastName
            }
            billingConfirmationStatus
            processor {
              id
              firstName
              lastName
            }
            billingItem {
              id
              unitPriceSnapshot
              quantitySnapshot
              insuranceCoveredAmount
              patientPayableAmount
              appliedPatientSharePct
            }
            createdAt
            updatedAt
          }
          childVisitDepartments {
            id
            status
            startedAt
            completedAt
            addedBy {
              id
              firstName
              lastName
            }
            completedBy {
              id
              firstName
              lastName
            }
            processors {
              id
              firstName
              lastName
            }
            billing {
              id
              status
              totalAmount
              insuranceCoveredAmount
              patientPayableAmount
              paidAmount
              outstandingAmount
              insuranceBillings {
                id
                status
                totalAmount
                insuranceCoveredAmount
                patientPayableAmount
                paidAmount
                outstandingAmount
                outstandingType
                outstandingReason
                billingDate
              }
            }
            createdAt
            updatedAt
            answerId
            hasFinalizedConsultationAnswers
            hasBillableProducts
            department {
              id
              name
            }
            products {
              id
              product {
                id
                name
                code
                type
                unit
                privateRhicPrice
                clinicPrice
                notPaid
                quantifiable
              }
              quantity
              status
              source
              addedBy {
                id
                firstName
                lastName
              }
              billedBy {
                id
                firstName
                lastName
              }
              confirmedBy {
                id
                firstName
                lastName
              }
              billingConfirmationStatus
              processor {
                id
                firstName
                lastName
              }
              billingItem {
                id
                unitPriceSnapshot
                quantitySnapshot
                insuranceCoveredAmount
                patientPayableAmount
                appliedPatientSharePct
              }
              createdAt
              updatedAt
            }
          }
          notes {
            totalNotes
            newNotes
          }
        }
        estimatedTotal
        estimatedInsurancePay
        estimatedPatientPay
        quickBillEligible
      }
      pagination {
        total
        perPage
        currentPage
        totalPages
      }
    }
  }
`;
const GET_PATIENT_HISTORY_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetPatientHistory($patientId: ID!, $input: SearchPatientHistoryInput!) {
    getPatientHistory(patientId: $patientId, input: $input) {
      status
      message

      data {
        id
        status
        visitDate
        patient {
          id
          firstName
          lastName
          middleName
          patientIdentifier
          dateOfBirth
          gender
        }
        departments {
          id
          department {
            id
            name
          }
          status
          startedAt
          completedAt
          answerId
          hasFinalizedConsultationAnswers
          hasBillableProducts
          diagnostics {
            id
            diagnosisName
            icd11Code
            createdAt
          }
          medications {
            id
            medicationName
            instructions
            createdAt
          }
          products {
            id
            product {
              id
              name
              code
              type
            }
            quantity
            status
            billingConfirmationStatus
            confirmedBy {
              id
              firstName
              lastName
            }
            createdAt
          }
          createdAt
          updatedAt
        }
        estimatedTotal
        estimatedInsurancePay
        estimatedPatientPay
        quickBillEligible
      }
      pagination {
        total
        perPage
        currentPage
        totalPages
      }

    }
  }
`;
const LAST_PATIENT_DEPARTMENT_VISIT_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query LastPatientDepartmentVisit($visitId: ID!, $departmentId: ID!) {
    lastPatientDepartmentVisit(visitId: $visitId, departmentId: $departmentId) {
      status
      message
      data {
        lastVisit {
          id
          status
          visitDate
          patient {
            id
            firstName
            lastName
            middleName
            patientIdentifier
            dateOfBirth
            gender
          }
          departments {
            id
            department {
              id
              name
            }
            status
            startedAt
          completedAt
            diagnostics {
              id
              diagnosisName
              icd11Code
              createdAt
            }
            medications {
              id
              medicationName
              instructions
              createdAt
            }
            products {
              id
              product {
                id
                name
                code
                type
              }
              quantity
              status
              createdAt
            }            createdAt
            updatedAt
            answerId
            hasFinalizedConsultationAnswers
            hasBillableProducts
          }
          estimatedTotal
          estimatedInsurancePay
          estimatedPatientPay
          quickBillEligible

        }
        lastDepartmentVisit {
          visitId
          visitDepartment {
            id
            department {
              id
              name
            }
            status
            startedAt
          completedAt
            diagnostics {
              id
              diagnosisName
              icd11Code
              createdAt
            }
            medications {
              id
              medicationName
              instructions
              createdAt
            }
            products {
              id
              product {
                id
                name
                code
                type
              }
              quantity
              status
              createdAt
            }
            createdAt
            updatedAt
            answerId
          }
        }
      }
    }
  }
`;
const DASHBOARD_STATS_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query DashboardStats($days: Int!) {
    dashboardStats(days: $days) {
      status
      message

      data {
        totalVisits
        completedVisits
        inProgressVisits
        totalRevenue
      }
    }
  }
`;
const VISIT_DEPARTMENT_NOTES_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetVisitDepartmentNotes($visitId: ID!, $visitDepartmentId: ID) {
    visitDepartmentNotes(
      visitId: $visitId
      visitDepartmentId: $visitDepartmentId
    ) {
      status
      message
      data {
        id
        visitDepartmentId
        content
        createdBy {
          id
          firstName
          lastName
        }
        noteType
        viewed
        createdAt
      }
    }
  }
`;
}),
"[project]/lib/api-types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * api-types.ts - Canonical TypeScript types aligned with GraphQL schema
 * This is the single source of truth for all entity types in the application.
 * All other type files should import and re-export from here to maintain consistency.
 */ // ============================================
// ENUMS - Aligned with GraphQL schema
// ============================================
__turbopack_context__.s([
    "AccountStatus",
    ()=>AccountStatus,
    "AnswerStatus",
    ()=>AnswerStatus,
    "BillingConfirmationStatus",
    ()=>BillingConfirmationStatus,
    "ClinicContactType",
    ()=>ClinicContactType,
    "ConditionalCondition",
    ()=>ConditionalCondition,
    "CoverageType",
    ()=>CoverageType,
    "DepartmentInsurancePolicyMode",
    ()=>DepartmentInsurancePolicyMode,
    "DocumentType",
    ()=>DocumentType,
    "DrugAdministrationFrequency",
    ()=>DrugAdministrationFrequency,
    "EncounterType",
    ()=>EncounterType,
    "ExemptionType",
    ()=>ExemptionType,
    "FieldType",
    ()=>FieldType,
    "FormStatus",
    ()=>FormStatus,
    "Gender",
    ()=>Gender,
    "MustPrescribedBy",
    ()=>MustPrescribedBy,
    "NoteType",
    ()=>NoteType,
    "PatientShareSource",
    ()=>PatientShareSource,
    "PaymentMethod",
    ()=>PaymentMethod,
    "ProductType",
    ()=>ProductType,
    "ProductUnit",
    ()=>ProductUnit,
    "ResponseStatus",
    ()=>ResponseStatus,
    "RoleName",
    ()=>RoleName,
    "SearchIndexType",
    ()=>SearchIndexType,
    "TableMode",
    ()=>TableMode,
    "VisitBillingStatus",
    ()=>VisitBillingStatus,
    "VisitDepartmentProductSource",
    ()=>VisitDepartmentProductSource,
    "VisitDepartmentStatus",
    ()=>VisitDepartmentStatus,
    "VisitPreInstructionProductStatus",
    ()=>VisitPreInstructionProductStatus,
    "VisitProductStatus",
    ()=>VisitProductStatus,
    "VisitStatus",
    ()=>VisitStatus,
    "getBasePatientSharePercentage",
    ()=>getBasePatientSharePercentage
]);
var ResponseStatus = /*#__PURE__*/ function(ResponseStatus) {
    ResponseStatus["SUCCESS"] = "SUCCESS";
    ResponseStatus["ERROR"] = "ERROR";
    ResponseStatus["UNAUTHENTICATED"] = "UNAUTHENTICATED";
    ResponseStatus["UNAUTHORISED"] = "UNAUTHORISED";
    ResponseStatus["PARTIAL_SUCCESS"] = "PARTIAL_SUCCESS";
    return ResponseStatus;
}({});
var RoleName = /*#__PURE__*/ function(RoleName) {
    RoleName["MANAGER"] = "MANAGER";
    RoleName["CLINIC_ADMIN"] = "CLINIC_ADMIN";
    RoleName["FINANCE"] = "FINANCE";
    RoleName["STAFF"] = "STAFF";
    RoleName["RECEPTION"] = "RECEPTION";
    RoleName["NURSE"] = "NURSE";
    RoleName["CLINICIAN"] = "CLINICIAN";
    RoleName["ADMIN"] = "ADMIN";
    return RoleName;
}({});
var AccountStatus = /*#__PURE__*/ function(AccountStatus) {
    AccountStatus["PENDING"] = "PENDING";
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["DISABLED"] = "DISABLED";
    return AccountStatus;
}({});
var Gender = /*#__PURE__*/ function(Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHER"] = "OTHER";
    return Gender;
}({});
var DocumentType = /*#__PURE__*/ function(DocumentType) {
    DocumentType["LICENSE"] = "LICENSE";
    DocumentType["DIPLOMA_CERTIFICATE"] = "DIPLOMA_CERTIFICATE";
    DocumentType["DEGREE_CERTIFICATE"] = "DEGREE_CERTIFICATE";
    DocumentType["TRAINING_CERTIFICATE"] = "TRAINING_CERTIFICATE";
    DocumentType["NATIONAL_ID"] = "NATIONAL_ID";
    DocumentType["PASSPORT"] = "PASSPORT";
    DocumentType["BACKGROUND_CHECK"] = "BACKGROUND_CHECK";
    DocumentType["WORK_PERMIT"] = "WORK_PERMIT";
    DocumentType["OTHER"] = "OTHER";
    return DocumentType;
}({});
var ProductType = /*#__PURE__*/ function(ProductType) {
    ProductType["DRUG"] = "DRUG";
    ProductType["MEDICAL_ACT"] = "MEDICAL_ACT";
    ProductType["BIOLOGICAL_ACT"] = "BIOLOGICAL_ACT";
    ProductType["CONSUMABLE_DEVICE"] = "CONSUMABLE_DEVICE";
    return ProductType;
}({});
var ProductUnit = /*#__PURE__*/ function(ProductUnit) {
    ProductUnit["TABLET"] = "TABLET";
    ProductUnit["CAPSULE"] = "CAPSULE";
    ProductUnit["PESSARY"] = "PESSARY";
    ProductUnit["SUPPOSITORY"] = "SUPPOSITORY";
    ProductUnit["BOX_OF_6_TABLETS"] = "BOX_OF_6_TABLETS";
    ProductUnit["BOX_OF_7_PESSARIES"] = "BOX_OF_7_PESSARIES";
    ProductUnit["BOX_OF_9_TABLETS"] = "BOX_OF_9_TABLETS";
    ProductUnit["BOX_OF_12_TABLETS"] = "BOX_OF_12_TABLETS";
    ProductUnit["BOX_OF_12_PESSARIES"] = "BOX_OF_12_PESSARIES";
    ProductUnit["BOX_OF_14_TABLETS"] = "BOX_OF_14_TABLETS";
    ProductUnit["BOX_OF_18_TABLETS"] = "BOX_OF_18_TABLETS";
    ProductUnit["BOX_OF_18_PESSARIES"] = "BOX_OF_18_PESSARIES";
    ProductUnit["BOX_OF_24_TABLETS"] = "BOX_OF_24_TABLETS";
    ProductUnit["BOX_OF_1_PESSARY"] = "BOX_OF_1_PESSARY";
    ProductUnit["BOX_OF_3_PESSARIES"] = "BOX_OF_3_PESSARIES";
    ProductUnit["BOX_OF_6_PESSARIES"] = "BOX_OF_6_PESSARIES";
    ProductUnit["BOTTLE"] = "BOTTLE";
    ProductUnit["VIAL"] = "VIAL";
    ProductUnit["AMPOULE"] = "AMPOULE";
    ProductUnit["TUBE"] = "TUBE";
    ProductUnit["TUBE_OF_15_TABLETS"] = "TUBE_OF_15_TABLETS";
    ProductUnit["TUBE_OF_20_TABLETS"] = "TUBE_OF_20_TABLETS";
    ProductUnit["TUBE_OF_50_STRIPS"] = "TUBE_OF_50_STRIPS";
    ProductUnit["BOX"] = "BOX";
    ProductUnit["SACHET"] = "SACHET";
    ProductUnit["POT"] = "POT";
    ProductUnit["ROLL"] = "ROLL";
    ProductUnit["PIECE"] = "PIECE";
    ProductUnit["DOSE"] = "DOSE";
    ProductUnit["KIT_OF_ONE_DAY_DOSE"] = "KIT_OF_ONE_DAY_DOSE";
    ProductUnit["PCS"] = "PCS";
    ProductUnit["UNKNOWN"] = "UNKNOWN";
    return ProductUnit;
}({});
var MustPrescribedBy = /*#__PURE__*/ function(MustPrescribedBy) {
    MustPrescribedBy["ALL"] = "ALL";
    return MustPrescribedBy;
}({});
var DrugAdministrationFrequency = /*#__PURE__*/ function(DrugAdministrationFrequency) {
    DrugAdministrationFrequency["CUSTOM_HOURS"] = "CUSTOM_HOURS";
    return DrugAdministrationFrequency;
}({});
var DepartmentInsurancePolicyMode = /*#__PURE__*/ function(DepartmentInsurancePolicyMode) {
    DepartmentInsurancePolicyMode["ALL"] = "ALL";
    DepartmentInsurancePolicyMode["ONLY"] = "ONLY";
    DepartmentInsurancePolicyMode["EXCEPT"] = "EXCEPT";
    return DepartmentInsurancePolicyMode;
}({});
var VisitStatus = /*#__PURE__*/ function(VisitStatus) {
    VisitStatus["CREATED"] = "CREATED";
    VisitStatus["IN_PROGRESS"] = "IN_PROGRESS";
    VisitStatus["CANCELLED"] = "CANCELLED";
    VisitStatus["COMPLETED"] = "COMPLETED";
    VisitStatus["FINALISED"] = "FINALISED";
    return VisitStatus;
}({});
var VisitProductStatus = /*#__PURE__*/ function(VisitProductStatus) {
    VisitProductStatus["BILLED"] = "BILLED";
    VisitProductStatus["EXEMPTED"] = "EXEMPTED";
    /**
   * The patient's share was waived but insurance still covers its normal amount.
   * Distinct from EXEMPTED where the entire line is zeroed.
   */ VisitProductStatus["PATIENT_SHARE_EXEMPTED"] = "PATIENT_SHARE_EXEMPTED";
    /** Was BILLED/EXEMPTED and reset by the edit-billing correction flow. Not settable by clients. */ VisitProductStatus["CORRECTION_PENDING"] = "CORRECTION_PENDING";
    VisitProductStatus["UNPAID"] = "UNPAID";
    VisitProductStatus["PENDING"] = "PENDING";
    return VisitProductStatus;
}({});
var VisitDepartmentProductSource = /*#__PURE__*/ function(VisitDepartmentProductSource) {
    VisitDepartmentProductSource["USER"] = "USER";
    VisitDepartmentProductSource["PROFILE"] = "PROFILE";
    return VisitDepartmentProductSource;
}({});
var BillingConfirmationStatus = /*#__PURE__*/ function(BillingConfirmationStatus) {
    BillingConfirmationStatus["CONFIRMED"] = "CONFIRMED";
    BillingConfirmationStatus["PENDING_OPERATOR_CONFIRMATION"] = "PENDING_OPERATOR_CONFIRMATION";
    BillingConfirmationStatus["REJECTED"] = "REJECTED";
    return BillingConfirmationStatus;
}({});
var VisitDepartmentStatus = /*#__PURE__*/ function(VisitDepartmentStatus) {
    VisitDepartmentStatus["ACTIVE"] = "ACTIVE";
    VisitDepartmentStatus["PENDING"] = "PENDING";
    VisitDepartmentStatus["ON_HOLD"] = "ON_HOLD";
    VisitDepartmentStatus["BILLING"] = "BILLING";
    VisitDepartmentStatus["COMPLETED"] = "COMPLETED";
    VisitDepartmentStatus["FINALISED"] = "FINALISED";
    VisitDepartmentStatus["CANCELLED"] = "CANCELLED";
    VisitDepartmentStatus["DEPARTMENT_EDITING"] = "DEPARTMENT_EDITING";
    return VisitDepartmentStatus;
}({});
var EncounterType = /*#__PURE__*/ function(EncounterType) {
    EncounterType["OUTPATIENT"] = "OUTPATIENT";
    EncounterType["INPATIENT_OBSERVATION"] = "INPATIENT_OBSERVATION";
    EncounterType["INPATIENT_ADMISSION"] = "INPATIENT_ADMISSION";
    EncounterType["FOLLOWUP"] = "FOLLOWUP";
    return EncounterType;
}({});
var SearchIndexType = /*#__PURE__*/ function(SearchIndexType) {
    SearchIndexType["PRODUCTS"] = "PRODUCTS";
    SearchIndexType["PATIENTS"] = "PATIENTS";
    SearchIndexType["WORKERS"] = "WORKERS";
    return SearchIndexType;
}({});
var VisitBillingStatus = /*#__PURE__*/ function(VisitBillingStatus) {
    VisitBillingStatus["UNPAID"] = "UNPAID";
    VisitBillingStatus["PARTIALLY_PAID"] = "PARTIALLY_PAID";
    VisitBillingStatus["PAID"] = "PAID";
    return VisitBillingStatus;
}({});
var CoverageType = /*#__PURE__*/ function(CoverageType) {
    CoverageType["PRIVATE"] = "PRIVATE";
    CoverageType["INSURANCE"] = "INSURANCE";
    return CoverageType;
}({});
var ClinicContactType = /*#__PURE__*/ function(ClinicContactType) {
    ClinicContactType["PHONE"] = "PHONE";
    ClinicContactType["EMAIL"] = "EMAIL";
    ClinicContactType["POBOX"] = "POBOX";
    return ClinicContactType;
}({});
var FormStatus = /*#__PURE__*/ function(FormStatus) {
    FormStatus["DRAFT"] = "DRAFT";
    FormStatus["FINAL"] = "FINAL";
    return FormStatus;
}({});
var FieldType = /*#__PURE__*/ function(FieldType) {
    FieldType["text"] = "text";
    FieldType["email"] = "email";
    FieldType["number"] = "number";
    FieldType["date"] = "date";
    FieldType["textarea"] = "textarea";
    FieldType["actionListener"] = "actionListener";
    FieldType["select"] = "select";
    FieldType["radio"] = "radio";
    FieldType["checkbox"] = "checkbox";
    FieldType["table"] = "table";
    FieldType["labRecord"] = "labRecord";
    FieldType["signature"] = "signature";
    FieldType["file"] = "file";
    FieldType["heading"] = "heading";
    FieldType["paragraph"] = "paragraph";
    FieldType["diagnosticRecord"] = "diagnosticRecord";
    FieldType["medicationLongForm"] = "medicationLongForm";
    FieldType["medicationMiniForm"] = "medicationMiniForm";
    return FieldType;
}({});
var TableMode = /*#__PURE__*/ function(TableMode) {
    TableMode["STATIC"] = "STATIC";
    TableMode["DYNAMIC"] = "DYNAMIC";
    return TableMode;
}({});
var ConditionalCondition = /*#__PURE__*/ function(ConditionalCondition) {
    ConditionalCondition["equals"] = "equals";
    ConditionalCondition["not_equals"] = "not_equals";
    ConditionalCondition["contains"] = "contains";
    ConditionalCondition["not_contains"] = "not_contains";
    ConditionalCondition["greater_than"] = "greater_than";
    ConditionalCondition["less_than"] = "less_than";
    ConditionalCondition["is_empty"] = "is_empty";
    ConditionalCondition["is_not_empty"] = "is_not_empty";
    ConditionalCondition["hasItem"] = "hasItem";
    return ConditionalCondition;
}({});
var AnswerStatus = /*#__PURE__*/ function(AnswerStatus) {
    AnswerStatus["DRAFT"] = "DRAFT";
    AnswerStatus["FINAL"] = "FINAL";
    AnswerStatus["SUBMITTED"] = "SUBMITTED";
    return AnswerStatus;
}({});
var NoteType = /*#__PURE__*/ function(NoteType) {
    NoteType["BILLING"] = "BILLING";
    NoteType["FORMS"] = "FORMS";
    NoteType["CONSULTATION"] = "CONSULTATION";
    NoteType["ADMIN"] = "ADMIN";
    NoteType["PUBLIC"] = "PUBLIC";
    return NoteType;
}({});
var VisitPreInstructionProductStatus = /*#__PURE__*/ function(VisitPreInstructionProductStatus) {
    VisitPreInstructionProductStatus["PENDING"] = "PENDING";
    VisitPreInstructionProductStatus["ONGOING"] = "ONGOING";
    VisitPreInstructionProductStatus["COMPLETED"] = "COMPLETED";
    VisitPreInstructionProductStatus["REJECTED"] = "REJECTED";
    return VisitPreInstructionProductStatus;
}({});
var PaymentMethod = /*#__PURE__*/ function(PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["MOBILE_MONEY"] = "MOBILE_MONEY";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethod["CHEQUE"] = "CHEQUE";
    PaymentMethod["MIXED"] = "MIXED";
    PaymentMethod["NONE"] = "NONE";
    return PaymentMethod;
}({});
var ExemptionType = /*#__PURE__*/ function(ExemptionType) {
    ExemptionType["NONE"] = "NONE";
    ExemptionType["PATIENT_SHARE"] = "PATIENT_SHARE";
    ExemptionType["FULL"] = "FULL";
    return ExemptionType;
}({});
var PatientShareSource = /*#__PURE__*/ function(PatientShareSource) {
    /** Per-line override provided during billing (highest priority). */ PatientShareSource["OVERRIDE"] = "OVERRIDE";
    /** Matched an InsuranceCoverage (dept + encounter type). */ PatientShareSource["RULE"] = "RULE";
    /** Fell back to PatientInsurance.patientSharePercentage (patient-specific default). */ PatientShareSource["PATIENT_DEFAULT"] = "PATIENT_DEFAULT";
    /** Fell back to getBasePatientSharePercentage(InsuranceProvider). */ PatientShareSource["PROVIDER_DEFAULT"] = "PROVIDER_DEFAULT";
    /** Line was exempted (FULL or PATIENT_SHARE exemption). */ PatientShareSource["EXEMPTED"] = "EXEMPTED";
    return PatientShareSource;
}({});
function getBasePatientSharePercentage(provider) {
    return provider.coverages.find((c)=>!c.departmentId && !c.encounterType)?.patientSharePercentage ?? 0;
}
}),
"[project]/lib/gql-mappers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Maps GraphQL response shapes to canonical types in lib/api-types.ts.
 * All visit/patient/product hooks should use these mappers — no parallel entity types.
 */ __turbopack_context__.s([
    "mapGqlDepartmentSummary",
    ()=>mapGqlDepartmentSummary,
    "mapGqlInsuranceCoverage",
    ()=>mapGqlInsuranceCoverage,
    "mapGqlInsuranceProvider",
    ()=>mapGqlInsuranceProvider,
    "mapGqlLastDepartmentVisitInfo",
    ()=>mapGqlLastDepartmentVisitInfo,
    "mapGqlLastPatientDepartmentVisitOutput",
    ()=>mapGqlLastPatientDepartmentVisitOutput,
    "mapGqlPatient",
    ()=>mapGqlPatient,
    "mapGqlPatientInsurance",
    ()=>mapGqlPatientInsurance,
    "mapGqlPatientSummary",
    ()=>mapGqlPatientSummary,
    "mapGqlProduct",
    ()=>mapGqlProduct,
    "mapGqlProductInsuranceCoverage",
    ()=>mapGqlProductInsuranceCoverage,
    "mapGqlVisit",
    ()=>mapGqlVisit,
    "mapGqlVisitDepartment",
    ()=>mapGqlVisitDepartment,
    "mapGqlVisitDepartmentProduct",
    ()=>mapGqlVisitDepartmentProduct,
    "mapGqlVisitListItem",
    ()=>mapGqlVisitListItem,
    "mapGqlWorker",
    ()=>mapGqlWorker,
    "mapGqlWorkerRef",
    ()=>mapGqlWorkerRef
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-types.ts [app-ssr] (ecmascript)");
;
const EMPTY_TIMESTAMP = "";
function parseGender(value) {
    const normalized = String(value || "").toUpperCase();
    if (normalized === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Gender"].MALE || normalized === "M") return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Gender"].MALE;
    if (normalized === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Gender"].FEMALE || normalized === "F") return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Gender"].FEMALE;
    if (normalized === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Gender"].OTHER) return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Gender"].OTHER;
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Gender"].OTHER;
}
function parseEncounterType(value) {
    const normalized = String(value || "").toUpperCase();
    if (normalized in __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EncounterType"]) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EncounterType"][normalized];
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EncounterType"].OUTPATIENT;
}
function mapGqlInsuranceCoverage(rule) {
    return {
        id: rule.id,
        insuranceProviderId: rule.insuranceProviderId,
        insuranceProviderName: rule.insuranceProviderName,
        departmentId: rule.departmentId ?? null,
        departmentName: rule.departmentName ?? null,
        encounterType: rule.encounterType ? parseEncounterType(rule.encounterType) : null,
        patientSharePercentage: Number(rule.patientSharePercentage ?? 0),
        createdAt: rule.createdAt || EMPTY_TIMESTAMP,
        updatedAt: rule.updatedAt || EMPTY_TIMESTAMP
    };
}
function mapGqlInsuranceProvider(provider) {
    return {
        id: provider.id,
        insuranceName: provider.insuranceName,
        acronym: provider.acronym,
        coverages: (provider.coverages || []).map(mapGqlInsuranceCoverage),
        supportedByClinic: provider.supportedByClinic ?? true,
        iconUrl: provider.iconUrl,
        createdAt: EMPTY_TIMESTAMP,
        updatedAt: EMPTY_TIMESTAMP,
        name: provider.insuranceName
    };
}
function mapGqlProductInsuranceCoverage(coverage) {
    return {
        id: String(coverage.id || ""),
        insuranceProvider: mapGqlInsuranceProvider(coverage.insuranceProvider || {
            id: "",
            insuranceName: ""
        }),
        cost: Number(coverage.cost ?? 0),
        covered: Boolean(coverage.covered),
        notPaid: Boolean(coverage.notPaid),
        requireMedicalAdvisor: Boolean(coverage.requireMedicalAdvisor),
        mustPrescribedBy: coverage.mustPrescribedBy,
        drugAdministrationFrequency: coverage.drugAdministrationFrequency,
        authorizationRequestReasons: coverage.authorizationRequestReasons || [],
        createdAt: EMPTY_TIMESTAMP,
        updatedAt: EMPTY_TIMESTAMP
    };
}
function mapGqlProduct(product) {
    return {
        id: product.id,
        name: product.name,
        genericName: product.genericName,
        code: product.code || "",
        description: product.description || "",
        type: product.type || "MEDICAL_ACT",
        unit: product.unit || "UNKNOWN",
        privateRhicPrice: product.privateRhicPrice,
        clinicPrice: product.clinicPrice,
        notPaid: Boolean(product.notPaid),
        quantifiable: product.quantifiable !== false,
        insuranceCoverages: (product.insuranceCoverages || []).map(mapGqlProductInsuranceCoverage),
        createdAt: EMPTY_TIMESTAMP,
        updatedAt: EMPTY_TIMESTAMP
    };
}
function mapGqlWorkerRef(worker) {
    if (!worker?.id) return undefined;
    const firstName = worker.firstName || "";
    const lastName = worker.lastName;
    return {
        id: worker.id,
        firstName,
        lastName,
        email: worker.email,
        phoneNumber: worker.phoneNumber,
        username: worker.username,
        accountStatus: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccountStatus"].ACTIVE,
        roles: [],
        departments: [],
        createdAt: EMPTY_TIMESTAMP,
        updatedAt: EMPTY_TIMESTAMP,
        name: [
            firstName,
            lastName
        ].filter(Boolean).join(" ") || worker.email || undefined
    };
}
function parseAccountStatus(value) {
    const normalized = String(value || "").toUpperCase();
    if (normalized in __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccountStatus"]) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccountStatus"][normalized];
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccountStatus"].PENDING;
}
function mapGqlWorker(worker) {
    const ref = mapGqlWorkerRef(worker);
    if (!ref) {
        return {
            id: "",
            firstName: "",
            accountStatus: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccountStatus"].PENDING,
            roles: [],
            departments: [],
            createdAt: EMPTY_TIMESTAMP,
            updatedAt: EMPTY_TIMESTAMP
        };
    }
    return {
        ...ref,
        accountStatus: parseAccountStatus(worker?.accountStatus),
        roles: worker?.roles || [],
        departments: (worker?.departments || []).map((department)=>mapGqlDepartmentSummary({
                id: department.id,
                name: department.name,
                insurancePolicyMode: undefined,
                requestsProducts: false,
                nursing: false,
                supportRequests: false
            })),
        dateOfBirth: worker?.dateOfBirth || undefined,
        gender: worker?.gender || undefined,
        profilePhotoUrl: worker?.profilePhotoUrl || undefined,
        createdAt: worker?.createdAt || EMPTY_TIMESTAMP,
        updatedAt: worker?.updatedAt || EMPTY_TIMESTAMP
    };
}
function mapGqlPatient(patient) {
    const mapped = {
        id: patient.id,
        firstName: patient.firstName,
        middleName: patient.middleName,
        lastName: patient.lastName,
        patientIdentifier: patient.patientIdentifier,
        dateOfBirth: patient.dateOfBirth || EMPTY_TIMESTAMP,
        gender: parseGender(patient.gender),
        primaryPhoneNumber: patient.primaryPhoneNumber,
        alternativePhone: patient.alternativePhone,
        cell: patient.cell,
        village: patient.village,
        city: patient.city,
        district: patient.district,
        postalAddress: patient.postalAddress,
        nationalIdNumber: patient.nationalIdNumber,
        passportNumber: patient.passportNumber,
        emergencyContactName: patient.emergencyContactName,
        emergencyContactRelationship: patient.emergencyContactRelationship,
        emergencyContactPhoneNumber: patient.emergencyContactPhoneNumber,
        patientInsurances: [],
        createdAt: patient.createdAt || EMPTY_TIMESTAMP,
        updatedAt: patient.updatedAt || EMPTY_TIMESTAMP
    };
    mapped.patientInsurances = (patient.patientInsurances || []).map((insurance)=>mapGqlPatientInsurance(insurance, mapped));
    return mapped;
}
function mapGqlPatientSummary(patient) {
    return {
        id: patient.id,
        firstName: patient.firstName,
        middleName: patient.middleName || undefined,
        lastName: patient.lastName,
        patientIdentifier: patient.patientIdentifier,
        dateOfBirth: patient.dateOfBirth || EMPTY_TIMESTAMP,
        age: patient.age ?? null,
        gender: parseGender(patient.gender),
        primaryPhoneNumber: patient.primaryPhoneNumber,
        district: patient.district,
        cell: patient.cell,
        village: patient.village,
        nationalIdNumber: patient.nationalIdNumber,
        patientInsurances: [],
        createdAt: EMPTY_TIMESTAMP,
        updatedAt: EMPTY_TIMESTAMP
    };
}
function mapGqlPatientInsurance(insurance, patient) {
    return {
        id: insurance.id,
        patient,
        insuranceProvider: mapGqlInsuranceProvider(insurance.insuranceProvider),
        insuranceCardNumber: insurance.insuranceCardNumber,
        providingCompanyOrEmployer: insurance.providingCompanyOrEmployer,
        principalMember: Boolean(insurance.principalMember),
        principalMemberName: insurance.principalMemberName,
        principalMemberPhoneNumber: insurance.principalMemberPhoneNumber,
        validFrom: insurance.validFrom || EMPTY_TIMESTAMP,
        validUntil: insurance.validUntil || EMPTY_TIMESTAMP,
        deactivated: Boolean(insurance.deactivated),
        patientSharePercentage: insurance.patientSharePercentage ?? null,
        patientShareCoverageId: insurance.patientShareCoverageId ?? null,
        createdAt: EMPTY_TIMESTAMP,
        updatedAt: EMPTY_TIMESTAMP
    };
}
function mapGqlVisitDepartmentProduct(item) {
    const product = item.product ? mapGqlProduct(item.product) : {
        id: "",
        name: "",
        code: "",
        description: "",
        type: "MEDICAL_ACT",
        unit: "UNKNOWN",
        notPaid: false,
        insuranceCoverages: [],
        createdAt: EMPTY_TIMESTAMP,
        updatedAt: EMPTY_TIMESTAMP
    };
    return {
        id: item.id,
        product,
        quantity: Number(item.quantity ?? 0),
        status: item.status,
        source: item.source || null,
        addedBy: mapGqlWorkerRef(item.addedBy),
        billedBy: mapGqlWorkerRef(item.billedBy),
        confirmedBy: mapGqlWorkerRef(item.confirmedBy),
        billingConfirmationStatus: item.billingConfirmationStatus || null,
        processor: mapGqlWorkerRef(item.processor),
        billingItem: item.billingItem ? {
            id: String(item.billingItem.id),
            visitDepartmentProductId: String(item.billingItem.visitDepartmentProductId || item.id),
            productId: String(item.billingItem.productId || (item.product?.id ?? "")),
            productName: String(item.billingItem.productName || (item.product?.name ?? "")),
            unitPriceSnapshot: Number(item.billingItem.unitPriceSnapshot ?? 0),
            quantitySnapshot: Number(item.billingItem.quantitySnapshot ?? item.quantity ?? 0),
            insuranceCoveredAmount: Number(item.billingItem.insuranceCoveredAmount ?? 0),
            patientPayableAmount: Number(item.billingItem.patientPayableAmount ?? 0),
            appliedPatientSharePct: item.billingItem.appliedPatientSharePct ?? null,
            patientShareSource: item.billingItem.patientShareSource ?? null,
            createdAt: item.billingItem.createdAt || EMPTY_TIMESTAMP,
            updatedAt: item.billingItem.updatedAt || EMPTY_TIMESTAMP
        } : null,
        createdAt: item.createdAt || EMPTY_TIMESTAMP,
        updatedAt: item.updatedAt || EMPTY_TIMESTAMP
    };
}
function mapGqlDepartmentSummary(department) {
    return {
        id: department.id,
        name: department.name,
        insurancePolicyMode: department.insurancePolicyMode || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DepartmentInsurancePolicyMode"].ALL,
        insurancePolicies: [],
        profiles: [],
        nursing: department.nursing ?? false,
        supportRequests: department.supportRequests ?? false,
        requestsProducts: department.requestsProducts ?? false,
        createdAt: EMPTY_TIMESTAMP,
        updatedAt: EMPTY_TIMESTAMP
    };
}
function mapGqlVisitDepartment(dept) {
    const mappedDepartment = dept.department ? mapGqlDepartmentSummary(dept.department) : {
        id: "",
        name: "",
        insurancePolicyMode: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DepartmentInsurancePolicyMode"].ALL,
        insurancePolicies: [],
        profiles: [],
        nursing: false,
        supportRequests: false,
        requestsProducts: false,
        createdAt: EMPTY_TIMESTAMP,
        updatedAt: EMPTY_TIMESTAMP
    };
    return {
        id: dept.id,
        department: mappedDepartment,
        status: dept.status,
        encounterType: parseEncounterType(dept.encounterType),
        profile: dept.profile ? {
            id: dept.profile.id,
            name: dept.profile.name,
            encounterType: parseEncounterType(dept.profile.encounterType),
            isDefault: Boolean(dept.profile.isDefault),
            products: (dept.profile.products || []).map(mapGqlProduct),
            createdAt: dept.profile.createdAt || EMPTY_TIMESTAMP,
            updatedAt: dept.profile.updatedAt || EMPTY_TIMESTAMP
        } : null,
        startedAt: dept.startedAt ?? null,
        completedAt: dept.completedAt,
        addedBy: mapGqlWorkerRef(dept.addedBy),
        completedBy: mapGqlWorkerRef(dept.completedBy),
        processors: (dept.processors || []).map(mapGqlWorkerRef).filter((worker)=>Boolean(worker)),
        childVisitDepartments: (dept.childVisitDepartments || []).map(mapGqlVisitDepartment),
        products: (dept.products || []).map(mapGqlVisitDepartmentProduct),
        diagnostics: (dept.diagnostics || []).map((diagnosis)=>({
                id: String(diagnosis.id),
                diagnosisName: String(diagnosis.diagnosisName || ""),
                icd11Code: diagnosis.icd11Code,
                createdAt: diagnosis.createdAt || EMPTY_TIMESTAMP
            })),
        medications: (dept.medications || []).map((medication)=>({
                id: String(medication.id),
                medicationName: String(medication.medicationName || ""),
                instructions: String(medication.instructions || ""),
                createdAt: medication.createdAt || EMPTY_TIMESTAMP
            })),
        preInstructions: (dept.preInstructions || []).map((pi)=>({
                id: String(pi.id || ""),
                type: String(pi.type || ""),
                note: pi.note || null,
                addedBy: mapGqlWorkerRef(pi.addedBy),
                medications: [],
                products: [],
                createdAt: pi.createdAt || EMPTY_TIMESTAMP
            })),
        notes: dept.notes ? {
            totalNotes: Number(dept.notes.totalNotes || 0),
            newNotes: Number(dept.notes.newNotes || 0)
        } : null,
        billing: dept.billing ? {
            id: String(dept.billing.id),
            visitDepartment: null,
            status: dept.billing.status,
            totalAmount: Number(dept.billing.totalAmount ?? 0),
            insuranceCoveredAmount: Number(dept.billing.insuranceCoveredAmount ?? 0),
            patientPayableAmount: Number(dept.billing.patientPayableAmount ?? 0),
            paidAmount: Number(dept.billing.paidAmount ?? 0),
            outstandingAmount: Number(dept.billing.outstandingAmount ?? 0),
            payments: [],
            insuranceBillings: (dept.billing.insuranceBillings || []).map((ib)=>({
                    id: String(ib.id),
                    patientInsurance: ib.patientInsurance ? mapGqlPatientInsurance(ib.patientInsurance, null) : null,
                    status: ib.status,
                    totalAmount: Number(ib.totalAmount ?? 0),
                    insuranceCoveredAmount: Number(ib.insuranceCoveredAmount ?? 0),
                    patientPayableAmount: Number(ib.patientPayableAmount ?? 0),
                    paidAmount: Number(ib.paidAmount ?? 0),
                    outstandingAmount: Number(ib.outstandingAmount ?? 0),
                    outstandingType: ib.outstandingType ?? null,
                    outstandingReason: ib.outstandingReason ?? null,
                    items: [],
                    createdAt: ib.createdAt || EMPTY_TIMESTAMP,
                    updatedAt: ib.updatedAt || EMPTY_TIMESTAMP
                })),
            createdAt: dept.billing.createdAt || EMPTY_TIMESTAMP,
            updatedAt: dept.billing.updatedAt || EMPTY_TIMESTAMP
        } : null,
        answerId: dept.answerId ?? null,
        hasFinalizedConsultationAnswers: dept.hasFinalizedConsultationAnswers ?? null,
        hasBillableProducts: dept.hasBillableProducts ?? null,
        createdAt: dept.createdAt || EMPTY_TIMESTAMP,
        updatedAt: dept.updatedAt || EMPTY_TIMESTAMP
    };
}
function mapGqlLastDepartmentVisitInfo(input) {
    if (!input?.visitId || !input?.visitDepartment) return null;
    return {
        visitId: String(input.visitId),
        visitDepartment: mapGqlVisitDepartment(input.visitDepartment)
    };
}
function mapGqlLastPatientDepartmentVisitOutput(input) {
    if (!input) return null;
    return {
        lastVisit: input.lastVisit ? mapGqlVisit(input.lastVisit) : null,
        lastDepartmentVisit: mapGqlLastDepartmentVisitInfo(input.lastDepartmentVisit)
    };
}
function mapGqlVisit(visit, options) {
    const patient = options?.patientMapper ? options.patientMapper(visit.patient) : mapGqlPatient(visit.patient);
    return {
        id: visit.id,
        patient,
        status: visit.status,
        visitDate: visit.visitDate,
        linkedInsurances: (visit.linkedInsurances || []).map((insurance)=>mapGqlPatientInsurance(insurance, patient)),
        departments: (visit.departments || []).map(mapGqlVisitDepartment),
        vitalSigns: [],
        estimatedTotal: visit.estimatedTotal ?? null,
        estimatedInsurancePay: visit.estimatedInsurancePay ?? null,
        estimatedPatientPay: visit.estimatedPatientPay ?? null,
        quickBillEligible: visit.quickBillEligible ?? null
    };
}
function mapGqlVisitListItem(visit) {
    const patient = visit.patient.dateOfBirth ? mapGqlPatient(visit.patient) : mapGqlPatientSummary(visit.patient);
    return mapGqlVisit({
        ...visit,
        patient
    }, {
        patientMapper: ()=>patient
    });
}
}),
"[project]/hooks/queries/insurances.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET_INSURANCES_QUERY",
    ()=>GET_INSURANCES_QUERY,
    "GET_INSURANCE_QUERY",
    ()=>GET_INSURANCE_QUERY,
    "useInsuranceCoverages",
    ()=>useInsuranceCoverages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gql-mappers.ts [app-ssr] (ecmascript)");
;
;
const GET_INSURANCES_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetInsurances($input: SearchInsuranceProvidersInput) {
    insuranceProviders(input: $input) {
      status
      message
      
      data {
        id
        insuranceName
        acronym
        coverages {

                        id

                        insuranceProviderId

                        insuranceProviderName

                        departmentId

                        departmentName

                        encounterType

                        patientSharePercentage

                        createdAt

                        updatedAt

                      }
        supportedByClinic
        iconUrl
        createdAt
        updatedAt
      }
      pagination {
        total
        perPage
        currentPage
        totalPages
      }
    }
  }
`;
const GET_INSURANCE_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetInsurance($id: ID!) {
    insuranceProvider(insuranceProviderId: $id) {
      status
      message
      
      data {
        id
        insuranceName
        acronym
        coverages {

                        id

                        insuranceProviderId

                        insuranceProviderName

                        departmentId

                        departmentName

                        encounterType

                        patientSharePercentage

                        createdAt

                        updatedAt

                      }
        supportedByClinic
        iconUrl
        createdAt
        updatedAt
      }
    }
  }
`;
// ── Insurance Coverage Rules ──────────────────────────────────────────────────
const GET_INSURANCE_COVERAGE_RULES = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetInsuranceCoverages($input: SearchInsuranceCoveragesInput) {
    insuranceCoverages(input: $input) {
      status
      message
      data {
        id
        insuranceProviderId
        insuranceProviderName
        departmentId
        departmentName
        encounterType
        patientSharePercentage
        createdAt
        updatedAt
      }
    }
  }
`;
function useInsuranceCoverages(input) {
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(GET_INSURANCE_COVERAGE_RULES, {
        variables: {
            input: input || {}
        },
        fetchPolicy: 'cache-and-network',
        skip: !input?.insuranceProviderId
    });
    const rules = (data?.insuranceCoverages?.data || []).map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlInsuranceCoverage"]);
    return {
        rules,
        loading,
        error: error?.message || null,
        refetch
    };
}
}),
"[project]/hooks/queries/actions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET_ACTIONS_QUERY",
    ()=>GET_ACTIONS_QUERY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const GET_ACTIONS_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetActions($name: String, $page: Int, $size: Int) {
    products(input: { name: $name, type: MEDICAL_ACT, page: $page, size: $size }) {
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
            coverages {
              id
              insuranceProviderId
              insuranceProviderName
              departmentId
              departmentName
              encounterType
              patientSharePercentage
              createdAt
              updatedAt
            }
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
      pagination {
        total
        perPage
        currentPage
        totalPages
      }
    }
  }
`;
}),
"[project]/hooks/queries/billing.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET_BILL_BY_VISIT_QUERY",
    ()=>GET_BILL_BY_VISIT_QUERY,
    "GET_VISIT_DEPARTMENT_BILLING_QUERY",
    ()=>GET_VISIT_DEPARTMENT_BILLING_QUERY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const GET_BILL_BY_VISIT_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetVisitBilling($visitId: ID!) {
    visitBilling(visitId: $visitId) {
      status
      message
      data {
        id
        visitId
        version {
          id
          version
        }
        departments {
          id
          visitDepartment {
            id
            status
            department {
              id
              name
            }
          }
          status
          totalAmount
          insuranceCoveredAmount
          patientPayableAmount
          paidAmount
          outstandingAmount
          payments {
            id
            amount
            paymentMethod
            reference
            createdAt
            updatedAt
          }
          insuranceBillings {
            id
            patientInsurance {
              id
              insuranceCardNumber
          patientSharePercentage
          patientShareCoverageId
          deactivated
              principalMemberName
              insuranceProvider {
                id
                insuranceName
                acronym
              }
            }
            status
            totalAmount
            insuranceCoveredAmount
            patientPayableAmount
            paidAmount
            outstandingAmount
            outstandingType
            outstandingReason
            items {
              id
              visitDepartmentProductId
              productId
              productName
              unitPriceSnapshot
              quantitySnapshot
              insuranceCoveredAmount
              patientPayableAmount
              appliedPatientSharePct
              patientShareSource
            }
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;
const GET_VISIT_DEPARTMENT_BILLING_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetVisitDepartmentBilling($visitDepartmentId: ID!) {
    getVisitDepartmentBilling(visitDepartmentId: $visitDepartmentId) {
      status
      message
      data {
        id
        visitDepartment {
          id
          status
          department {
            id
            name
          }
        }
        status
        totalAmount
        insuranceCoveredAmount
        patientPayableAmount
        paidAmount
        outstandingAmount
        payments {
          id
          amount
          paymentMethod
          reference
          createdAt
          updatedAt
        }
        insuranceBillings {
          id
          patientInsurance {
            id
            insuranceCardNumber
            patientSharePercentage
            patientShareCoverageId
            deactivated
            principalMemberName
            insuranceProvider {
              id
              insuranceName
              acronym
            }
          }
          status
          totalAmount
          insuranceCoveredAmount
          patientPayableAmount
          paidAmount
          outstandingAmount
          outstandingType
          outstandingReason
          invoiceUrl
          items {
            id
            visitDepartmentProductId
            productId
            productName
            unitPriceSnapshot
            quantitySnapshot
            insuranceCoveredAmount
            patientPayableAmount
            appliedPatientSharePct
            patientShareSource
          }
          createdAt
          updatedAt
        }
        version {
          id
          version
        }
        createdAt
        updatedAt
      }
    }
  }
`;
}),
"[project]/hooks/queries/forms.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET_FORMS_QUERY",
    ()=>GET_FORMS_QUERY,
    "GET_FORM_QUERY",
    ()=>GET_FORM_QUERY,
    "GET_FORM_VERSION_HISTORY_QUERY",
    ()=>GET_FORM_VERSION_HISTORY_QUERY,
    "GET_LATEST_FORM_QUERY",
    ()=>GET_LATEST_FORM_QUERY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const GET_FORMS_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetForms($departmentId: ID!) {
    getForms(departmentId: $departmentId) {
      status
      message

      data {
        id
        departmentId
        title
        description
        status
        version
        createdAt
        updatedAt
        sections {
          id
          title
          boldTitle
          italicTitle
          underlineTitle
          centerTitle
          columns
          order
          fields {
            id
            label
            type
            placeholder
            required
            options
            hideLabel
            boldLabel
            italicLabel
            underlineLabel
            centerLabel
            order
            tableConfig {
              mode
              rows
              columns
              headerPlacement
              columnHeaders
              rowHeaders
            }
            conditionalRendering {
              dependsOn
              condition
              value
              itemType
            }
          }
        }
        fields {
          id
          label
          type
          placeholder
          required
          options
          hideLabel
          boldLabel
          italicLabel
          underlineLabel
          centerLabel
          order
          tableConfig {
            mode
            rows
            columns
            headerPlacement
            columnHeaders
            rowHeaders
          }
          conditionalRendering {
            dependsOn
            condition
            value
            itemType
          }
        }
        actions {
          id
          name
          type
          quantity
          price
          isQuantifiable
          backendId
        }
      }
    }
  }
`;
const GET_FORM_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetForm($departmentId: ID!, $formId: ID!) {
    getForm(departmentId: $departmentId, formId: $formId) {
      status
      message

      data {
        id
        departmentId
        title
        description
        status
        version
        createdAt
        updatedAt
        sections {
          id
          title
          boldTitle
          italicTitle
          underlineTitle
          centerTitle
          columns
          order
          fields {
            id
            label
            type
            placeholder
            required
            options
            hideLabel
            boldLabel
            italicLabel
            underlineLabel
            centerLabel
            order
            tableConfig {
              mode
              rows
              columns
              headerPlacement
              columnHeaders
              rowHeaders
            }
            conditionalRendering {
              dependsOn
              condition
              value
              itemType
            }
          }
        }
        fields {
          id
          label
          type
          placeholder
          required
          options
          hideLabel
          boldLabel
          italicLabel
          underlineLabel
          centerLabel
          order
          tableConfig {
            mode
            rows
            columns
            headerPlacement
            columnHeaders
            rowHeaders
          }
          conditionalRendering {
            dependsOn
            condition
            value
            itemType
          }
        }
        actions {
          id
          name
          type
          quantity
          price
          isQuantifiable
          backendId
        }
      }
    }
  }
`;
const GET_FORM_VERSION_HISTORY_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetFormVersionHistory($departmentId: ID!, $formId: ID!) {
    getFormVersionHistory(departmentId: $departmentId, formId: $formId) {
      status
      message

      data {
        id
        formId
        departmentId
        title
        description
        status
        version
        createdAt
        updatedAt
        sections {
          id
          title
          boldTitle
          italicTitle
          underlineTitle
          centerTitle
          columns
          order
          fields {
            id
            label
            type
            placeholder
            required
            options
            hideLabel
            boldLabel
            italicLabel
            underlineLabel
            centerLabel
            order
            tableConfig {
              mode
              rows
              columns
              headerPlacement
              columnHeaders
              rowHeaders
            }
            conditionalRendering {
              dependsOn
              condition
              value
              itemType
            }
          }
        }
        fields {
          id
          label
          type
          placeholder
          required
          options
          hideLabel
          boldLabel
          italicLabel
          underlineLabel
          centerLabel
          order
          tableConfig {
            mode
            rows
            columns
            headerPlacement
            columnHeaders
            rowHeaders
          }
          conditionalRendering {
            dependsOn
            condition
            value
            itemType
          }
        }
        actions {
          id
          name
          type
          quantity
          price
          isQuantifiable
          backendId
        }
      }
    }
  }
`;
const GET_LATEST_FORM_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query ConsultationGetLatestForm($departmentId: ID!) {
    getLatestForm(departmentId: $departmentId) {
      data {
        id
        title
        description
        status
        version
        fields {
          id
          label
          type
          placeholder
          required
          order
          hideLabel
          boldLabel
          italicLabel
          underlineLabel
          centerLabel
          options
          tableConfig {
            mode
            rows
            columns
            headerPlacement
            columnHeaders
            rowHeaders
          }
          conditionalRendering {
            dependsOn
            condition
            value
            itemType
          }
        }
        sections {
          id
          title
          boldTitle
          italicTitle
          underlineTitle
          centerTitle
          columns
          order
          fields {
            id
            label
            type
            placeholder
            required
            order
            hideLabel
            boldLabel
            italicLabel
            underlineLabel
            centerLabel
            options
            tableConfig {
              mode
              rows
              columns
              headerPlacement
              columnHeaders
              rowHeaders
            }
            conditionalRendering {
              dependsOn
              condition
              value
              itemType
            }
          }
        }
      }
    }
  }
`;
}),
"[project]/hooks/queries/standalone-forms.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET_DEPARTMENT_FORMS_QUERY",
    ()=>GET_DEPARTMENT_FORMS_QUERY,
    "GET_STANDALONE_ANSWER_QUERY",
    ()=>GET_STANDALONE_ANSWER_QUERY,
    "GET_STANDALONE_FORMS_QUERY",
    ()=>GET_STANDALONE_FORMS_QUERY,
    "GET_STANDALONE_FORM_ANSWERS_QUERY",
    ()=>GET_STANDALONE_FORM_ANSWERS_QUERY,
    "GET_STANDALONE_FORM_QUERY",
    ()=>GET_STANDALONE_FORM_QUERY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const GET_STANDALONE_FORMS_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetStandaloneForms(
    $isTemplate: Boolean
    $category: String
    $name: String
  ) {
    getStandaloneForms(
      isTemplate: $isTemplate
      category: $category
      name: $name
    ) {
      status
      message
      data {
        id
        name
        description
        type
        category
        isTemplate
        createdBy
        createdAt
        updatedAt
        activeVersion {
          id
          formId
          versionLabel
          majorVersion
          minorVersion
          blocks
          theme
          status
          createdAt
        }
      }
    }
  }
`;
const GET_STANDALONE_FORM_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetStandaloneForm($id: ID!) {
    getStandaloneForm(id: $id) {
      status
      message
      data {
        id
        name
        description
        type
        category
        isTemplate
        createdBy
        createdAt
        updatedAt
        activeVersion {
          id
          formId
          versionLabel
          majorVersion
          minorVersion
          blocks
          theme
          status
          createdAt
        }
      }
    }
  }
`;
const STANDALONE_FORM_FRAGMENT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  fragment StandaloneFormFields on StandaloneForm {
    id
    name
    description
    type
    category
    isTemplate
    createdBy
    createdAt
    updatedAt
    activeVersion {
      id
      formId
      versionLabel
      majorVersion
      minorVersion
      blocks
      theme
      status
      createdAt
    }
  }
`;
const GET_DEPARTMENT_FORMS_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetDepartmentForms($departmentId: ID!) {
    getDepartmentForms(departmentId: $departmentId) {
      status
      message
      data {
        forms {
          isDefault
          form {
            ...StandaloneFormFields
          }
        }
        defaultForm {
          ...StandaloneFormFields
        }
      }
    }
  }
  ${STANDALONE_FORM_FRAGMENT}
`;
const GET_STANDALONE_FORM_ANSWERS_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetStandaloneFormAnswers($formId: ID!) {
    getStandaloneFormAnswers(formId: $formId) {
      status
      message
      data {
        id
        answers
        score
        status
        patientId
        visitId
        submittedBy
        submittedAt
        createdAt
        updatedAt
        form {
          id
          name
        }
        formVersion {
          id
          versionLabel
          majorVersion
          minorVersion
        }
      }
    }
  }
`;
const GET_STANDALONE_ANSWER_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetStandaloneAnswer($id: ID!) {
    getStandaloneAnswer(id: $id) {
      status
      message
      data {
        id
        answers
        score
        status
        patientId
        visitId
        submittedAt
        createdAt
        updatedAt
        form {
          ...StandaloneFormFields
        }
        formVersion {
          id
          formId
          versionLabel
          majorVersion
          minorVersion
          blocks
          theme
          status
          createdAt
        }
      }
    }
  }
  ${STANDALONE_FORM_FRAGMENT}
`;
}),
"[project]/hooks/queries/reports.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET_USER_REPORTS",
    ()=>GET_USER_REPORTS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const GET_USER_REPORTS = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetUserReports(
    $fromDate: String
    $toDate: String
    $period: String
    $workerId: ID
  ) {
    getUserReports(
      fromDate: $fromDate
      toDate: $toDate
      period: $period
      workerId: $workerId
    ) {
      status
      message
      data
    }
  }
`;
}),
"[project]/hooks/queries/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$departments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/departments.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/products.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$patients$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/patients.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/visits.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$insurances$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/insurances.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/actions.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/billing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$forms$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/forms.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$standalone$2d$forms$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/standalone-forms.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$reports$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/reports.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/hooks/auth/hooks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useActivateUser",
    ()=>useActivateUser,
    "useAdminCreateUser",
    ()=>useAdminCreateUser,
    "useAdminUpdateUser",
    ()=>useAdminUpdateUser,
    "useChangePassword",
    ()=>useChangePassword,
    "useClinicProfile",
    ()=>useClinicProfile,
    "useCreatePassword",
    ()=>useCreatePassword,
    "useDeactivateUser",
    ()=>useDeactivateUser,
    "useDeleteUserPassword",
    ()=>useDeleteUserPassword,
    "useLogin",
    ()=>useLogin,
    "useRegister",
    ()=>useRegister,
    "useSetInitialPassword",
    ()=>useSetInitialPassword,
    "useUpdateMyProfile",
    ()=>useUpdateMyProfile,
    "useUpdateUserRoles",
    ()=>useUpdateUserRoles,
    "useUpsertClinicProfile",
    ()=>useUpsertClinicProfile,
    "useUsers",
    ()=>useUsers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useApolloClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useApolloClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/error-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/mutations/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/queries/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gql-mappers.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const mapClinicProfile = (profile)=>{
    if (!profile) return null;
    return {
        id: String(profile.id || ''),
        name: profile.name?.trim() || undefined,
        address: profile.address?.trim() || undefined,
        contacts: profile.contacts ?? [],
        tinNumber: profile.tinNumber?.trim() || undefined,
        logoUrl: profile.logoUrl?.trim() || undefined,
        metadata: profile.metadata ?? null,
        createdAt: profile.createdAt || '',
        updatedAt: profile.updatedAt || ''
    };
};
function useLogin() {
    const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useApolloClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useApolloClient"])();
    const [loginMutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOGIN_MUTATION"]);
    const login = async (identifier, password)=>{
        try {
            const result = await loginMutation({
                variables: {
                    input: {
                        identifier,
                        password
                    }
                }
            });
            const payload = result?.data?.login;
            // Log mutation result
            const buildUser = (profile)=>{
                const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlWorker"])(profile);
                if (!profile?.id && !profile?.firstName) {
                    return {
                        ...user,
                        name: user.name || identifier
                    };
                }
                return user;
            };
            if (payload?.status === 'SUCCESS' && payload.data?.accessToken) {
                const token = payload.data.accessToken;
                const loginUser = payload.data.user;
                let user = loginUser ? buildUser(loginUser) : buildUser();
                let clinicProfile = null;
                if (!loginUser) {
                    try {
                        const meResult = await client.query({
                            query: __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ME_QUERY"],
                            fetchPolicy: 'no-cache',
                            context: {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        });
                        const me = meResult?.data?.me?.data;
                        if (me) {
                            user = buildUser(me);
                        }
                    } catch  {
                    // Continue with token if profile hydration fails.
                    }
                }
                try {
                    const clinicProfileResult = await client.query({
                        query: __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLINIC_PROFILE_QUERY"],
                        fetchPolicy: 'no-cache',
                        context: {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    });
                    clinicProfile = mapClinicProfile(clinicProfileResult?.data?.clinicProfile?.data);
                } catch  {
                    clinicProfile = null;
                }
                // Log what will be stored
                return {
                    status: 'SUCCESS',
                    data: {
                        token,
                        accessToken: token,
                        refreshToken: payload.data.refreshToken,
                        user,
                        clinicProfile
                    },
                    messages: payload.message ? [
                        {
                            text: payload.message,
                            type: 'SUCCESS'
                        }
                    ] : undefined
                };
            }
            if (payload?.status === 'PARTIAL_SUCCESS' && payload.data) {
                const loginUser = payload.data.user;
                const user = loginUser ? buildUser(loginUser) : buildUser();
                return {
                    status: 'PARTIAL_SUCCESS',
                    data: {
                        token: undefined,
                        accessToken: undefined,
                        refreshToken: undefined,
                        user,
                        needsPasswordSetup: true
                    },
                    messages: payload.message ? [
                        {
                            text: payload.message,
                            type: 'INFO'
                        }
                    ] : undefined
                };
            }
            const fallbackMessage = payload?.message || 'Login failed';
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message,
                messages: [
                    {
                        text: fallbackMessage,
                        type: 'ERROR'
                    }
                ]
            };
        } catch (err) {
            const errorMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getErrorMessage"])(err) || 'Network error occurred';
            return {
                status: 'ERROR',
                messages: [
                    {
                        text: errorMessage,
                        type: 'ERROR'
                    }
                ]
            };
        }
    };
    return {
        login,
        loading,
        error
    };
}
function useSetInitialPassword() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SET_INITIAL_PASSWORD_MUTATION"]);
    const setInitialPassword = async (identifier, newPassword)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        identifier,
                        newPassword
                    }
                }
            });
            const payload = result.data?.setInitialPassword;
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message,
                messages: payload?.message ? [
                    {
                        text: payload.message,
                        type: payload.status || 'ERROR'
                    }
                ] : undefined
            };
        } catch (err) {
            const errorMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getErrorMessage"])(err) || 'Network error occurred';
            return {
                status: 'ERROR',
                message: errorMessage,
                messages: [
                    {
                        text: errorMessage,
                        type: 'ERROR'
                    }
                ]
            };
        }
    };
    return {
        setInitialPassword,
        loading,
        error
    };
}
function useRegister() {
    const [registerMutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REGISTER_MUTATION"]);
    const register = async (name, email, password, phoneNumber, gender, _title)=>{
        try {
            const [firstName, ...lastNameParts] = name.trim().split(/\s+/).filter(Boolean);
            const lastName = lastNameParts.length > 0 ? lastNameParts.join(' ') : null;
            const username = email?.split('@')?.[0] || phoneNumber || null;
            const result = await registerMutation({
                variables: {
                    input: {
                        firstName: firstName || name,
                        lastName,
                        gender,
                        email,
                        password,
                        phoneNumber,
                        username
                    }
                }
            });
            const payload = result?.data?.selfRegister;
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message,
                data: payload?.data ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlWorker"])(payload.data) : undefined,
                messages: payload?.message ? [
                    {
                        text: payload.message,
                        type: payload?.status || 'ERROR'
                    }
                ] : undefined
            };
        } catch (err) {
            console.error('Register error:', err);
            throw err;
        }
    };
    return {
        register,
        loading,
        error
    };
}
function useClinicProfile() {
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLINIC_PROFILE_QUERY"], {
        fetchPolicy: 'cache-and-network'
    });
    return {
        clinicProfile: mapClinicProfile(data?.clinicProfile?.data),
        loading,
        error: error?.message || null,
        refetch
    };
}
function useUpsertClinicProfile() {
    const [mutate, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_CLINIC_PROFILE_MUTATION"]);
    const upsertClinicProfile = async (input)=>{
        const formattedMetadata = Array.isArray(input.metadata) ? input.metadata.map((item)=>({
                key: item.key,
                value: item.value ?? null
            })) : input.metadata && typeof input.metadata === 'object' ? Object.entries(input.metadata).map(([key, value])=>({
                key,
                value: value ?? null
            })) : input.metadata;
        const { data } = await mutate({
            variables: {
                input: {
                    name: input.name,
                    username: input.username,
                    address: input.address,
                    contacts: input.contacts,
                    tinNumber: input.tinNumber,
                    logoUrl: input.logoUrl,
                    metadata: formattedMetadata
                }
            }
        });
        const payload = data?.updateClinicProfile;
        return {
            status: payload?.status || 'ERROR',
            message: payload?.message,
            data: mapClinicProfile(payload?.data)
        };
    };
    return {
        upsertClinicProfile,
        loading,
        error: error?.message || null
    };
}
function useUsers() {
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_USERS_QUERY"], {
        fetchPolicy: 'cache-and-network'
    });
    const errorMessage = error?.message || null;
    return {
        users: (data?.listUsers?.data || []).map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlWorker"]),
        loading,
        error: errorMessage,
        refetch
    };
}
function useAdminCreateUser() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ADMIN_CREATE_USER_MUTATION"]);
    const adminCreateUser = async (input)=>{
        try {
            const variables = {
                input: {
                    firstName: input.firstName,
                    lastName: input.lastName,
                    gender: input.gender,
                    dateOfBirth: input.dateOfBirth,
                    profilePhotoUrl: input.profilePhotoUrl,
                    email: input.email,
                    phoneNumber: input.phoneNumber,
                    username: input.username,
                    departmentIds: input.departmentIds ?? [],
                    roles: input.roles,
                    workerDocProfile: input.workerDocProfile || null
                }
            };
            const result = await mutation({
                variables
            });
            return result.data?.adminCreateUser;
        } catch (err) {
            console.error('Admin create user error:', err);
            throw err;
        }
    };
    return {
        adminCreateUser,
        loading,
        error
    };
}
function useAdminUpdateUser() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ADMIN_UPDATE_USER_MUTATION"]);
    const adminUpdateUser = async (userId, input)=>{
        try {
            const variables = {
                userId,
                input: {
                    firstName: input.firstName || undefined,
                    lastName: input.lastName || undefined,
                    gender: input.gender || undefined,
                    dateOfBirth: input.dateOfBirth || undefined,
                    profilePhotoUrl: input.profilePhotoUrl || undefined,
                    email: input.email || undefined,
                    phoneNumber: input.phoneNumber || undefined,
                    username: input.username || undefined,
                    departmentIds: input.departmentIds ?? undefined,
                    roles: input.roles || undefined,
                    workerDocProfile: input.workerDocProfile || undefined
                }
            };
            const result = await mutation({
                variables
            });
            return result.data?.adminUpdateUser;
        } catch (err) {
            console.error('Admin update user error:', err);
            throw err;
        }
    };
    return {
        adminUpdateUser,
        loading,
        error
    };
}
function useActivateUser() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ACTIVATE_USER_MUTATION"]);
    const activateUser = async (userId, roles)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        userId,
                        roles
                    }
                }
            });
            return result.data?.activateUser;
        } catch (err) {
            console.error('Activate user error:', err);
            throw err;
        }
    };
    return {
        activateUser,
        loading,
        error
    };
}
function useDeactivateUser() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEACTIVATE_USER_MUTATION"]);
    const deactivateUser = async (userId, revokeSessions = false)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        userId,
                        revokeSessions
                    }
                }
            });
            return result.data?.deactivateUser;
        } catch (err) {
            console.error('Deactivate user error:', err);
            throw err;
        }
    };
    return {
        deactivateUser,
        loading,
        error
    };
}
function useUpdateUserRoles() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_USER_ROLES_MUTATION"]);
    const updateUserRoles = async (userId, roles)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        userId,
                        roles
                    }
                }
            });
            return result.data?.activateUser;
        } catch (err) {
            console.error('Update user roles error:', err);
            throw err;
        }
    };
    return {
        updateUserRoles,
        loading,
        error
    };
}
function useUpdateMyProfile() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_MY_PROFILE_MUTATION"]);
    const updateMyProfile = async (input)=>{
        try {
            const [firstName, ...lastNameParts] = (input.name || '').trim().split(/\s+/).filter(Boolean);
            const lastName = lastNameParts.length > 0 ? lastNameParts.join(' ') : undefined;
            const result = await mutation({
                variables: {
                    input: {
                        firstName: firstName || undefined,
                        lastName,
                        email: input.email || undefined,
                        phoneNumber: input.phoneNumber || undefined,
                        gender: input.gender || undefined,
                        dateOfBirth: input.dateOfBirth || undefined,
                        profilePhotoUrl: input.profilePhotoUrl || undefined,
                        username: input.username || undefined
                    }
                }
            });
            const payload = result.data?.updateMyProfile;
            const worker = payload?.data;
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message,
                messages: payload?.message ? [
                    {
                        text: payload.message,
                        type: payload?.status || 'ERROR'
                    }
                ] : undefined,
                data: worker ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlWorker"])(worker) : undefined
            };
        } catch (err) {
            console.error('Update my profile error:', err);
            throw err;
        }
    };
    return {
        updateMyProfile,
        loading,
        error
    };
}
function useChangePassword() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHANGE_PASSWORD_MUTATION"]);
    const changePassword = async (currentPassword, newPassword)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        currentPassword,
                        newPassword
                    }
                }
            });
            const payload = result.data?.changeMyPassword;
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message,
                messages: payload?.message ? [
                    {
                        text: payload.message,
                        type: payload.status || 'ERROR'
                    }
                ] : undefined,
                data: payload?.data ? {
                    id: String(payload.data)
                } : undefined
            };
        } catch (err) {
            console.error('Change password error:', err);
            const errorMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getErrorMessage"])(err) || 'Unable to change password';
            return {
                status: 'ERROR',
                message: errorMessage,
                messages: [
                    {
                        text: errorMessage,
                        type: 'ERROR'
                    }
                ]
            };
        }
    };
    return {
        changePassword,
        loading,
        error
    };
}
function useCreatePassword() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SET_INITIAL_PASSWORD_MUTATION"]);
    const createPassword = async (identifier, password)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        identifier,
                        newPassword: password
                    }
                }
            });
            const payload = result.data?.setInitialPassword;
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message,
                messages: payload?.message ? [
                    {
                        text: payload.message,
                        type: payload.status || 'ERROR'
                    }
                ] : undefined
            };
        } catch (err) {
            console.error('Create password error:', err);
            const errorMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getErrorMessage"])(err) || 'Unable to create password';
            return {
                status: 'ERROR',
                message: errorMessage,
                messages: [
                    {
                        text: errorMessage,
                        type: 'ERROR'
                    }
                ]
            };
        }
    };
    return {
        createPassword,
        loading,
        error
    };
}
function useDeleteUserPassword() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DELETE_USER_PASSWORD_MUTATION"]);
    const deleteUserPassword = async (userId)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        userId,
                        revokeSessions: true
                    }
                }
            });
            const payload = result.data?.adminTriggerPasswordReset;
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message,
                messages: payload?.message ? [
                    {
                        text: payload.message,
                        type: payload.status || 'ERROR'
                    }
                ] : undefined
            };
        } catch (err) {
            console.error('Delete user password error:', err);
            const errorMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getErrorMessage"])(err) || 'Unable to require password reset';
            return {
                status: 'ERROR',
                message: errorMessage,
                messages: [
                    {
                        text: errorMessage,
                        type: 'ERROR'
                    }
                ]
            };
        }
    };
    return {
        deleteUserPassword,
        loading,
        error
    };
}
}),
"[project]/hooks/auth/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/auth/hooks.ts [app-ssr] (ecmascript)");
;
}),
"[project]/hooks/departments/hooks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapDepartmentProfileFromApi",
    ()=>mapDepartmentProfileFromApi,
    "useCreateDepartment",
    ()=>useCreateDepartment,
    "useDepartments",
    ()=>useDepartments,
    "useRemoveDepartmentProfile",
    ()=>useRemoveDepartmentProfile,
    "useUpdateDepartment",
    ()=>useUpdateDepartment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/queries/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$departments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/departments.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/mutations/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$departments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/departments.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gql-mappers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-types.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const mapGqlProductForProfile = (product)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlProduct"])({
        ...product,
        insuranceCoverages: (product.insuranceCoverages || []).map((coverage)=>({
                id: coverage.id,
                insuranceProvider: coverage.insuranceProvider ? {
                    id: coverage.insuranceProvider.id,
                    insuranceName: coverage.insuranceProvider.insuranceName || '',
                    acronym: coverage.insuranceProvider.acronym,
                    coverages: (coverage.insuranceProvider.coverages || []).map((c)=>({
                            id: String(c.id || ''),
                            insuranceProviderId: String(coverage.insuranceProvider?.id || ''),
                            insuranceProviderName: String(coverage.insuranceProvider?.insuranceName || ''),
                            departmentId: null,
                            departmentName: null,
                            encounterType: null,
                            patientSharePercentage: Number(c.patientSharePercentage ?? 0),
                            createdAt: '',
                            updatedAt: ''
                        }))
                } : coverage.insurance ? {
                    id: coverage.insurance.id,
                    insuranceName: coverage.insurance.name || '',
                    acronym: coverage.insurance.acronym,
                    coverages: [
                        {
                            id: '',
                            insuranceProviderId: '',
                            insuranceProviderName: '',
                            departmentId: null,
                            departmentName: null,
                            encounterType: null,
                            patientSharePercentage: Number(coverage.insurance.coveragePercentage ?? 0),
                            createdAt: '',
                            updatedAt: ''
                        }
                    ]
                } : {
                    id: '',
                    insuranceName: '',
                    coverages: []
                },
                cost: coverage.cost,
                covered: coverage.covered,
                requireMedicalAdvisor: coverage.requireMedicalAdvisor
            }))
    });
const mapDepartmentProfileFromApi = (profile)=>({
        id: profile.id,
        name: profile.name,
        encounterType: profile.encounterType || 'OUTPATIENT',
        isDefault: Boolean(profile.isDefault),
        products: (profile.products || []).map(mapGqlProductForProfile),
        createdAt: profile.createdAt || '',
        updatedAt: profile.updatedAt || ''
    });
const mapDepartmentFromApi = (department)=>({
        id: department.id,
        name: department.name,
        insurancePolicyMode: department.insurancePolicyMode || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DepartmentInsurancePolicyMode"].ALL,
        nursing: department.nursing ?? false,
        supportRequests: department.supportRequests ?? false,
        requestsProducts: department.requestsProducts ?? false,
        insurancePolicies: (department.insurancePolicies || []).map((insurance)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlInsuranceProvider"])({
                id: insurance.id,
                insuranceName: insurance.insuranceName || 'Unknown Insurance',
                acronym: insurance.acronym,
                coverages: insurance.coverages || [],
                supportedByClinic: insurance.supportedByClinic,
                iconUrl: insurance.iconUrl
            })),
        profiles: (department.profiles || []).map(mapDepartmentProfileFromApi),
        createdAt: department.createdAt || '',
        updatedAt: department.updatedAt || ''
    });
function useDepartments(options) {
    const variables = {
        input: {
            page: options?.input?.page ?? 0,
            size: options?.input?.size ?? 200,
            name: options?.input?.name || undefined,
            supportRequests: options?.input?.supportRequests,
            requestsProducts: options?.input?.requestsProducts
        }
    };
    const { data, loading, error, refetch: refetchQuery } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$departments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_DEPARTMENTS_QUERY"], {
        variables,
        fetchPolicy: 'cache-and-network',
        skip: options?.skip ?? false
    });
    const departments = (data?.departments?.data || []).map(mapDepartmentFromApi);
    const refetch = ()=>refetchQuery(variables);
    return {
        departments,
        loading: loading || false,
        error: error?.message || null,
        refetch
    };
}
function useCreateDepartment() {
    const [mutate, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$departments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CREATE_DEPARTMENT_MUTATION"]);
    const createDepartment = async (name, input)=>{
        const { data } = await mutate({
            variables: {
                input: {
                    name,
                    insuranceProviderIds: input?.insuranceProviderIds,
                    profiles: input?.profiles,
                    insurancePolicyMode: input?.insurancePolicyMode,
                    nursing: input?.nursing,
                    supportRequests: input?.supportRequests,
                    requestsProducts: input?.requestsProducts
                }
            }
        });
        const payload = data?.createDepartment;
        return {
            status: payload?.status || 'ERROR',
            message: payload?.message,
            data: payload?.data ? mapDepartmentFromApi(payload.data) : null
        };
    };
    return {
        createDepartment,
        loading,
        error: error?.message || null
    };
}
function useUpdateDepartment() {
    const [mutate, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$departments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_DEPARTMENT_MUTATION"]);
    const updateDepartment = async (id, input)=>{
        const { data } = await mutate({
            variables: {
                departmentId: id,
                input
            }
        });
        const payload = data?.updateDepartment;
        return {
            status: payload?.status || 'ERROR',
            message: payload?.message,
            data: payload?.data ? mapDepartmentFromApi(payload.data) : null
        };
    };
    return {
        updateDepartment,
        loading,
        error: error?.message || null
    };
}
function useRemoveDepartmentProfile() {
    const [mutate, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$departments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REMOVE_DEPARTMENT_PROFILE_MUTATION"]);
    const removeDepartmentProfile = async (profileId)=>{
        const { data } = await mutate({
            variables: {
                profileId
            }
        });
        const payload = data?.removeDepartmentProfile;
        return {
            status: payload?.status || 'ERROR',
            message: payload?.message,
            data: payload?.data ? mapDepartmentFromApi(payload.data) : null
        };
    };
    return {
        removeDepartmentProfile,
        loading,
        error: error?.message || null
    };
}
}),
"[project]/hooks/departments/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$departments$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/departments/hooks.ts [app-ssr] (ecmascript)");
;
}),
"[project]/hooks/visits/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
}),
"[project]/hooks/visits/vital-signs.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeVisitVitalSigns",
    ()=>normalizeVisitVitalSigns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gql-mappers.ts [app-ssr] (ecmascript)");
;
const EMPTY_TIMESTAMP = "";
const toGroupCreatedAt = (value)=>{
    if (!value) return "unknown";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "unknown" : parsed.toISOString();
};
const normalizeVisitVitalSigns = (vitalSigns = [])=>{
    if (!Array.isArray(vitalSigns) || vitalSigns.length === 0) return [];
    const hasGroupedShape = Array.isArray(vitalSigns[0]?.measurements);
    if (hasGroupedShape) {
        return vitalSigns.map((group, index)=>({
                id: String(group?.id || group?.createdAt || `group-${index}`),
                createdAt: toGroupCreatedAt(group?.createdAt),
                addedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlWorkerRef"])(group?.addedBy) ?? null,
                measurements: (group?.measurements || []).map((measurement, measurementIndex)=>({
                        id: String(measurement?.id || `${group?.id || group?.createdAt || "group"}-${measurementIndex}`),
                        measurementName: String(measurement?.measurementName || ""),
                        value: String(measurement?.value || ""),
                        unit: String(measurement?.unit || ""),
                        createdAt: measurement?.createdAt || group?.createdAt || EMPTY_TIMESTAMP
                    })).filter((measurement)=>measurement.measurementName || measurement.value || measurement.unit)
            })).filter((group)=>group.measurements.length > 0).sort((a, b)=>{
            if (a.createdAt === "unknown") return 1;
            if (b.createdAt === "unknown") return -1;
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
    }
    const grouped = new Map();
    vitalSigns.forEach((vitalSign)=>{
        const key = toGroupCreatedAt(vitalSign?.createdAt);
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key).push(vitalSign);
    });
    return Array.from(grouped.entries()).map(([createdAt, items], index)=>({
            id: `group-${index}-${createdAt}`,
            createdAt,
            measurements: items.map((vitalSign, measurementIndex)=>({
                    id: String(vitalSign?.id || `${createdAt}-${measurementIndex}`),
                    measurementName: String(vitalSign?.measurementName || ""),
                    value: String(vitalSign?.value || ""),
                    unit: String(vitalSign?.unit || ""),
                    createdAt: vitalSign?.createdAt || createdAt || EMPTY_TIMESTAMP
                })),
            addedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlWorkerRef"])(items[0]?.addedBy) ?? null
        })).sort((a, b)=>{
        if (a.createdAt === "unknown") return 1;
        if (b.createdAt === "unknown") return -1;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
};
}),
"[project]/hooks/visits/queries.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDashboardStats",
    ()=>useDashboardStats,
    "useLastPatientDepartmentVisit",
    ()=>useLastPatientDepartmentVisit,
    "useVisit",
    ()=>useVisit,
    "useVisits",
    ()=>useVisits
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/queries/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/visits.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gql-mappers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$vital$2d$signs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/vital-signs.ts [app-ssr] (ecmascript)");
;
;
;
;
;
function useVisits(size, page, filter) {
    const visitDate = filter?.fromDate && filter?.toDate ? filter.fromDate === filter.toDate ? filter.fromDate : undefined : filter?.fromDate || filter?.toDate;
    const input = {
        ...filter?.status ? {
            status: filter.status
        } : {},
        ...filter?.patientName ? {
            patientName: filter.patientName
        } : {},
        ...visitDate ? {
            visitDate
        } : {},
        ...filter?.fromDate && filter?.fromDate !== filter?.toDate ? {
            fromDate: filter.fromDate
        } : {},
        ...filter?.toDate && filter?.fromDate !== filter?.toDate ? {
            toDate: filter.toDate
        } : {},
        ...filter?.recentDays ? {
            recentDays: filter.recentDays
        } : {},
        ...filter?.activeOnly !== undefined ? {
            activeOnly: filter.activeOnly
        } : {},
        page: page ?? 0,
        size: size ?? 20
    };
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VISITS_QUERY"], {
        variables: {
            input
        },
        fetchPolicy: "cache-and-network"
    });
    const errorKind = error?.networkError ? "network" : error?.graphQLErrors?.length ? "graphql" : null;
    const errorMessage = error?.graphQLErrors?.[0]?.message || error?.networkError?.message || error?.message || null;
    const visits = (data?.visits?.data || []).map((v)=>{
        const mapped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitListItem"])(v);
        mapped.vitalSigns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$vital$2d$signs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeVisitVitalSigns"])(v.vitalSigns || []);
        return mapped;
    });
    return {
        visits,
        totalPages: data?.visits?.pagination?.totalPages || 0,
        totalElements: data?.visits?.pagination?.total || 0,
        loading,
        error: errorMessage,
        errorKind,
        refetch
    };
}
function useDashboardStats(days = 1, options) {
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DASHBOARD_STATS_QUERY"], {
        variables: {
            days
        },
        fetchPolicy: "cache-and-network",
        skip: options?.skip
    });
    const stats = data?.getDashboardStats?.data || null;
    return {
        stats: stats ? {
            totalVisits: Number(stats.totalVisits || 0),
            totalOpen: Number(stats.totalOpen || 0),
            totalCompleted: Number(stats.totalCompleted || 0),
            totalWaitingForBilling: Number(stats.totalWaitingForBilling || 0)
        } : null,
        loading,
        error: error?.message || null,
        refetch
    };
}
function useVisit(id) {
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_VISIT_QUERY"], {
        variables: {
            id
        },
        skip: !id,
        fetchPolicy: "cache-and-network"
    });
    const visitData = data?.visit?.data;
    const visit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!visitData) return undefined;
        const mapped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisit"])(visitData);
        mapped.vitalSigns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$vital$2d$signs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeVisitVitalSigns"])(visitData.vitalSigns || []);
        return mapped;
    }, [
        visitData
    ]);
    const errorMessage = error?.message || null;
    return {
        visit,
        loading,
        error: errorMessage,
        refetch
    };
}
function useLastPatientDepartmentVisit(visitId, departmentId, options) {
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAST_PATIENT_DEPARTMENT_VISIT_QUERY"], {
        variables: {
            visitId,
            departmentId
        },
        skip: !visitId || !departmentId || options?.skip,
        fetchPolicy: "cache-and-network"
    });
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlLastPatientDepartmentVisitOutput"])(data?.lastPatientDepartmentVisit?.data || null);
    }, [
        data
    ]);
    return {
        data: result,
        loading,
        error: error?.message || null,
        refetch
    };
}
}),
"[project]/hooks/visits/visit-mutations.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAddDepartmentNote",
    ()=>useAddDepartmentNote,
    "useAddDiagnosisToVisitDepartment",
    ()=>useAddDiagnosisToVisitDepartment,
    "useAddMedicationToVisitDepartment",
    ()=>useAddMedicationToVisitDepartment,
    "useAddVisitNote",
    ()=>useAddVisitNote,
    "useAddVisitVitalSigns",
    ()=>useAddVisitVitalSigns,
    "useCancelVisit",
    ()=>useCancelVisit,
    "useCompleteConsultationVisit",
    ()=>useCompleteConsultationVisit,
    "useCompleteVisit",
    ()=>useCompleteVisit,
    "useCreateVisit",
    ()=>useCreateVisit,
    "useGenerateConsultationPdf",
    ()=>useGenerateConsultationPdf,
    "useReopenVisit",
    ()=>useReopenVisit,
    "useUpdateVisitVitalSigns",
    ()=>useUpdateVisitVitalSigns,
    "useUpsertConsultationAnswers",
    ()=>useUpsertConsultationAnswers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/mutations/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/visits.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gql-mappers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$vital$2d$signs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/vital-signs.ts [app-ssr] (ecmascript)");
;
;
;
;
function useCreateVisit() {
    const [createVisitMutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CREATE_VISIT_MUTATION"]);
    const createVisit = async (input)=>{
        try {
            const departments = (input.departmentIds || []).map((departmentId)=>({
                    departmentId,
                    products: []
                }));
            const result = await createVisitMutation({
                variables: {
                    input: {
                        patientId: input.patientId,
                        linkedPatientInsuranceIds: input.insuranceIds || [],
                        departments
                    }
                }
            });
            const payload = result?.data?.createVisit;
            return {
                status: payload?.status || "ERROR",
                messages: payload?.message ? [
                    {
                        text: payload.message,
                        type: payload.status || "ERROR"
                    }
                ] : undefined,
                data: payload?.data ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisit"])(payload.data) : undefined
            };
        } catch (err) {
            console.error("Visit creation error:", err);
            throw err;
        }
    };
    return {
        createVisit,
        loading,
        error
    };
}
function useAddVisitNote() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ADD_VISIT_NOTE_MUTATION"]);
    const addVisitNote = async (visitId, type, text)=>{
        try {
            const result = await mutation({
                variables: {
                    visitId,
                    type,
                    text
                }
            });
            return result.data?.addVisitNote;
        } catch (err) {
            console.error("Add visit note error:", err);
            throw err;
        }
    };
    return {
        addVisitNote,
        loading,
        error
    };
}
function useAddVisitVitalSigns() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ADD_VISIT_VITAL_SIGNS_MUTATION"]);
    const addVisitVitalSigns = async (visitId, vitalSigns)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        visitId,
                        vitalSigns
                    }
                }
            });
            const payload = result.data?.addVisitVitalSigns;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message,
                messages: payload?.message ? [
                    {
                        text: payload.message,
                        type: payload.status || "ERROR"
                    }
                ] : undefined,
                data: payload?.data ? {
                    ...payload.data,
                    vitalSigns: (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$vital$2d$signs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeVisitVitalSigns"])(payload.data.vitalSigns || [])
                } : undefined
            };
        } catch (err) {
            console.error("Add visit vital signs error:", err);
            throw err;
        }
    };
    return {
        addVisitVitalSigns,
        loading,
        error
    };
}
function useUpdateVisitVitalSigns() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_VISIT_VITAL_SIGNS_MUTATION"]);
    const updateVisitVitalSigns = async (groupId, vitalSigns)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        groupId,
                        vitalSigns
                    }
                }
            });
            const payload = result.data?.updateVisitVitalSigns;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message,
                messages: payload?.message ? [
                    {
                        text: payload.message,
                        type: payload.status || "ERROR"
                    }
                ] : undefined,
                data: payload?.data ? {
                    ...payload.data,
                    vitalSigns: (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$vital$2d$signs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeVisitVitalSigns"])(payload.data.vitalSigns || [])
                } : undefined
            };
        } catch (err) {
            console.error("Update visit vital signs error:", err);
            throw err;
        }
    };
    return {
        updateVisitVitalSigns,
        loading,
        error
    };
}
function useAddDepartmentNote() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ADD_DEPARTMENT_NOTE_MUTATION"]);
    const addDepartmentNote = async (visitId, departmentId, type, text)=>{
        try {
            const result = await mutation({
                variables: {
                    visitId,
                    departmentId,
                    type,
                    text
                }
            });
            return result.data?.addDepartmentNote;
        } catch (err) {
            console.error("Add department note error:", err);
            throw err;
        }
    };
    return {
        addDepartmentNote,
        loading,
        error
    };
}
function useAddDiagnosisToVisitDepartment() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ADD_DIAGNOSIS_MUTATION"]);
    const addDiagnosis = async (visitDepartmentId, diagnosisName, icd11Code)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        visitDepartmentId,
                        diagnosisName,
                        icd11Code: icd11Code || undefined
                    }
                }
            });
            return result.data?.addDiagnosis;
        } catch (err) {
            console.error("Add diagnosis error:", err);
            throw err;
        }
    };
    return {
        addDiagnosis,
        loading,
        error
    };
}
function useAddMedicationToVisitDepartment() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ADD_MEDICATION_MUTATION"]);
    const addMedication = async (visitDepartmentId, medicationName, instructions)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        visitDepartmentId,
                        medicationName,
                        instructions
                    }
                }
            });
            return result.data?.addMedication;
        } catch (err) {
            console.error("Add medication error:", err);
            throw err;
        }
    };
    return {
        addMedication,
        loading,
        error
    };
}
function useUpsertConsultationAnswers() {
    const [upsertMutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPSERT_CONSULTATION_ANSWERS_MUTATION"]);
    const upsertConsultationAnswers = async (input)=>{
        try {
            const result = await upsertMutation({
                variables: {
                    input
                }
            });
            return result.data?.upsertConsultationAnswers;
        } catch (err) {
            console.error("Upsert consultation answers error:", err);
            throw err;
        }
    };
    return {
        upsertConsultationAnswers,
        loading,
        error
    };
}
function useGenerateConsultationPdf() {
    const [generatePdfMutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GENERATE_CONSULTATION_PDF_MUTATION"]);
    const generateConsultationPdf = async (input)=>{
        try {
            const result = await generatePdfMutation({
                variables: {
                    consultationId: input.consultationId,
                    departmentId: input.departmentId,
                    formId: input.formId
                }
            });
            return result.data?.generateConsultationPdf;
        } catch (err) {
            console.error("Generate consultation PDF error:", err);
            throw err;
        }
    };
    return {
        generateConsultationPdf,
        loading,
        error
    };
}
function useCompleteVisit() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMPLETE_VISIT_MUTATION"]);
    const completeVisit = async (visitId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitId
                }
            });
            return result.data.completeVisit;
        } catch (err) {
            console.error("Complete visit error:", err);
            throw err;
        }
    };
    return {
        completeVisit,
        loading,
        error
    };
}
function useCancelVisit() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CANCEL_VISIT_MUTATION"]);
    const cancelVisit = async (visitId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitId
                }
            });
            return result.data.cancelVisit;
        } catch (err) {
            console.error("Cancel visit error:", err);
            throw err;
        }
    };
    return {
        cancelVisit,
        loading,
        error
    };
}
function useReopenVisit() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REOPEN_VISIT_MUTATION"]);
    const reopenVisit = async (visitId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitId
                }
            });
            return result.data.reopenVisit;
        } catch (err) {
            console.error("Reopen visit error:", err);
            throw err;
        }
    };
    return {
        reopenVisit,
        loading,
        error
    };
}
function useCompleteConsultationVisit() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMPLETE_CONSULTATION_VISIT_MUTATION"]);
    const completeConsultationVisit = async (input, final)=>{
        try {
            const result = await mutation({
                variables: {
                    input,
                    final
                }
            });
            const payload = result.data?.completeConsultationVisit;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message,
                messages: payload?.message ? [
                    {
                        text: payload.message,
                        type: payload.status || "ERROR"
                    }
                ] : undefined,
                data: payload?.data
            };
        } catch (err) {
            console.error("Complete consultation visit error:", err);
            throw err;
        }
    };
    return {
        completeConsultationVisit,
        loading,
        error
    };
}
}),
"[project]/hooks/visits/department-mutations.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAddActionToVisitDepartment",
    ()=>useAddActionToVisitDepartment,
    "useAddChildVisitDepartment",
    ()=>useAddChildVisitDepartment,
    "useAddConsumableToVisitDepartment",
    ()=>useAddConsumableToVisitDepartment,
    "useAddDepartmentToVisit",
    ()=>useAddDepartmentToVisit,
    "useAddProductToVisitDepartment",
    ()=>useAddProductToVisitDepartment,
    "useChangeVisitDepartmentProfile",
    ()=>useChangeVisitDepartmentProfile,
    "useCompleteVisitDepartment",
    ()=>useCompleteVisitDepartment,
    "useConsultVisit",
    ()=>useConsultVisit,
    "useRemoveActionFromVisitDepartment",
    ()=>useRemoveActionFromVisitDepartment,
    "useRemoveConsumableFromVisitDepartment",
    ()=>useRemoveConsumableFromVisitDepartment,
    "useRemoveProductFromVisitDepartment",
    ()=>useRemoveProductFromVisitDepartment,
    "useRemoveVisitDepartment",
    ()=>useRemoveVisitDepartment,
    "useRemoveVisitDepartmentProfile",
    ()=>useRemoveVisitDepartmentProfile,
    "useUpdateActionQuantity",
    ()=>useUpdateActionQuantity,
    "useUpdateConsumableQuantity",
    ()=>useUpdateConsumableQuantity,
    "useUpdateProductProcessor",
    ()=>useUpdateProductProcessor,
    "useUpdateProductQuantity",
    ()=>useUpdateProductQuantity,
    "useUpdateProductStatus",
    ()=>useUpdateProductStatus,
    "useUpdateVisitDepartmentEncounterDate",
    ()=>useUpdateVisitDepartmentEncounterDate,
    "useUpdateVisitDepartmentEncounterType",
    ()=>useUpdateVisitDepartmentEncounterType,
    "useUpdateVisitDepartmentStatus",
    ()=>useUpdateVisitDepartmentStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/mutations/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/visits.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gql-mappers.ts [app-ssr] (ecmascript)");
;
;
;
;
const visitRefetchQueries = [
    "GetVisits",
    "GetVisit",
    "GetVisitBilling",
    "GetVisitBillingForSettings",
    "GetVisitDepartmentProfiles",
    "GetBillByVisit"
];
function useRemoveActionFromVisitDepartment() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const removeAction = async (visitId, departmentId, actionId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitDepartmentProductId: actionId
                }
            });
            return result.data.removeVisitDepartmentProduct;
        } catch (err) {
            console.error("Remove action error:", err);
            throw err;
        }
    };
    return {
        removeAction,
        loading,
        error
    };
}
function useRemoveConsumableFromVisitDepartment() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const removeConsumable = async (visitId, departmentId, consumableId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitDepartmentProductId: consumableId
                }
            });
            return result.data.removeVisitDepartmentProduct;
        } catch (err) {
            console.error("Remove consumable error:", err);
            throw err;
        }
    };
    return {
        removeConsumable,
        loading,
        error
    };
}
function useRemoveProductFromVisitDepartment() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const removeProduct = async (visitDepartmentProductId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitDepartmentProductId
                }
            });
            return result.data.removeVisitDepartmentProduct;
        } catch (err) {
            console.error("Remove product error:", err);
            throw err;
        }
    };
    return {
        removeProduct,
        loading,
        error
    };
}
function useUpdateActionQuantity() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_ACTION_QUANTITY_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const updateQuantity = async (visitId, departmentId, itemId, quantity)=>{
        try {
            const result = await mutation({
                variables: {
                    visitId,
                    departmentId,
                    itemId,
                    quantity
                }
            });
            const response = result.data.updateActionQuantity;
            if (response.status !== "SUCCESS") {
                const errorMsg = response.messages?.[0]?.text || `Update failed with status: ${response.status}`;
                console.error("Update action quantity failed:", errorMsg);
                throw new Error(errorMsg);
            }
            return response;
        } catch (err) {
            console.error("Update action quantity error:", err);
            throw err;
        }
    };
    return {
        updateQuantity,
        loading,
        error
    };
}
function useUpdateConsumableQuantity() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_CONSUMABLE_QUANTITY_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const updateQuantity = async (visitId, departmentId, itemId, quantity)=>{
        try {
            const result = await mutation({
                variables: {
                    visitId,
                    departmentId,
                    itemId,
                    quantity
                }
            });
            const response = result.data.updateConsumableQuantity;
            if (response.status !== "SUCCESS") {
                const errorMsg = response.messages?.[0]?.text || `Update failed with status: ${response.status}`;
                console.error("Update consumable quantity failed:", errorMsg);
                throw new Error(errorMsg);
            }
            return response;
        } catch (err) {
            console.error("Update consumable quantity error:", err);
            throw err;
        }
    };
    return {
        updateQuantity,
        loading,
        error
    };
}
function useAddActionToVisitDepartment() {
    const { doctor } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const addAction = async (visitId, departmentId, actionId, quantity, processorId)=>{
        try {
            const effectiveProcessorId = processorId || doctor?.id;
            const result = await mutation({
                variables: {
                    input: {
                        visitId,
                        departmentId,
                        productId: actionId,
                        quantity: quantity ?? 1,
                        status: "PENDING",
                        ...effectiveProcessorId ? {
                            processorId: effectiveProcessorId
                        } : {}
                    }
                }
            });
            const payload = result.data?.addVisitDepartmentProduct;
            return {
                status: payload?.status || "ERROR",
                messages: payload?.message ? [
                    {
                        text: payload.message,
                        type: payload.status || "ERROR"
                    }
                ] : undefined,
                data: payload?.data ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitDepartment"])(payload.data) : undefined
            };
        } catch (err) {
            console.error("Add action error:", err);
            throw err;
        }
    };
    return {
        addAction,
        loading,
        error
    };
}
function useAddChildVisitDepartment() {
    const { doctor } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ADD_CHILD_VISIT_DEPARTMENT_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const addChildVisitDepartment = async (input)=>{
        try {
            const effectiveProcessorId = input.processorId || doctor?.id;
            const result = await mutation({
                variables: {
                    input: {
                        parentVisitDepartmentId: input.parentVisitDepartmentId,
                        departmentId: input.departmentId,
                        products: input.products.map((item)=>({
                                productId: item.productId,
                                quantity: item.quantity
                            })),
                        ...effectiveProcessorId ? {
                            processorId: effectiveProcessorId
                        } : {}
                    }
                }
            });
            const payload = result.data?.addChildVisitDepartment;
            return {
                status: payload?.status || "ERROR",
                messages: payload?.message ? [
                    {
                        text: payload.message,
                        type: payload.status || "ERROR"
                    }
                ] : undefined,
                data: payload?.data ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitDepartment"])(payload.data) : undefined
            };
        } catch (err) {
            console.error("Add child visit department error:", err);
            throw err;
        }
    };
    return {
        addChildVisitDepartment,
        loading,
        error
    };
}
function useAddConsumableToVisitDepartment() {
    const { doctor } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const addConsumable = async (visitId, departmentId, consumableId, quantity, processorId)=>{
        try {
            const effectiveProcessorId = processorId || doctor?.id;
            const result = await mutation({
                variables: {
                    input: {
                        visitId,
                        departmentId,
                        productId: consumableId,
                        quantity: quantity ?? 1,
                        status: "PENDING",
                        ...effectiveProcessorId ? {
                            processorId: effectiveProcessorId
                        } : {}
                    }
                }
            });
            const payload = result.data?.addVisitDepartmentProduct;
            return {
                status: payload?.status || "ERROR",
                messages: payload?.message ? [
                    {
                        text: payload.message,
                        type: payload.status || "ERROR"
                    }
                ] : undefined,
                data: payload?.data ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitDepartment"])(payload.data) : undefined
            };
        } catch (err) {
            console.error("Add consumable error:", err);
            throw err;
        }
    };
    return {
        addConsumable,
        loading,
        error
    };
}
function useAddProductToVisitDepartment() {
    const { doctor } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const addProduct = async (visitId, departmentId, productId, quantity, processorId)=>{
        try {
            const effectiveProcessorId = processorId || doctor?.id;
            const result = await mutation({
                variables: {
                    input: {
                        visitId,
                        departmentId,
                        productId,
                        quantity: quantity ?? 1,
                        status: "PENDING",
                        ...effectiveProcessorId ? {
                            processorId: effectiveProcessorId
                        } : {}
                    }
                }
            });
            const payload = result.data?.addVisitDepartmentProduct;
            return {
                status: payload?.status || "ERROR",
                messages: payload?.message ? [
                    {
                        text: payload.message,
                        type: payload.status || "ERROR"
                    }
                ] : undefined,
                data: payload?.data ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitDepartment"])(payload.data) : undefined
            };
        } catch (err) {
            console.error("Add product error:", err);
            throw err;
        }
    };
    return {
        addProduct,
        loading,
        error
    };
}
function useCompleteVisitDepartment() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMPLETE_VISIT_DEPARTMENT_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const completeDepartment = async (visitId, departmentId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitId,
                    departmentId
                }
            });
            return result.data.completeVisitDepartment;
        } catch (err) {
            console.error("Complete department error:", err);
            throw err;
        }
    };
    return {
        completeDepartment,
        loading,
        error
    };
}
function useUpdateVisitDepartmentStatus() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const updateDepartmentStatus = async (visitDepartmentId, status)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        visitDepartmentId,
                        status
                    }
                }
            });
            return result.data.updateVisitDepartmentStatus;
        } catch (err) {
            console.error("Update visit department status error:", err);
            throw err;
        }
    };
    return {
        updateDepartmentStatus,
        loading,
        error
    };
}
function useAddDepartmentToVisit() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ADD_DEPARTMENT_TO_VISIT_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true,
        update (cache) {
            cache.evict({
                fieldName: "visits"
            });
            cache.gc();
        }
    });
    const addDepartmentToVisit = async (visitId, departmentId, processorId, profileId, encounterType)=>{
        try {
            const result = await mutation({
                variables: {
                    visitId,
                    departmentId,
                    processorId: processorId || null,
                    profileId: profileId || null,
                    encounterType: encounterType || null
                }
            });
            return result.data?.addVisitDepartment;
        } catch (err) {
            console.error("Add department to visit error:", err);
            throw err;
        }
    };
    return {
        addDepartmentToVisit,
        loading,
        error
    };
}
function useConsultVisit() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONSULT_VISIT_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const consultVisit = async (visitDepartmentId, profileId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitDepartmentId,
                    profileId: profileId || null
                }
            });
            const payload = result.data?.consultVisit;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message,
                data: payload?.data ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitDepartment"])(payload.data) : undefined
            };
        } catch (err) {
            console.error("Consult visit error:", err);
            throw err;
        }
    };
    return {
        consultVisit,
        loading,
        error
    };
}
function useChangeVisitDepartmentProfile() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHANGE_VISIT_DEPARTMENT_PROFILE_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const changeVisitDepartmentProfile = async (visitDepartmentId, profileId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitDepartmentId,
                    profileId: profileId || null
                }
            });
            const payload = result.data?.changeVisitDepartmentProfile;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message,
                data: payload?.data ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitDepartment"])(payload.data) : undefined
            };
        } catch (err) {
            console.error("Change visit department profile error:", err);
            throw err;
        }
    };
    return {
        changeVisitDepartmentProfile,
        loading,
        error
    };
}
function useRemoveVisitDepartmentProfile() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REMOVE_VISIT_DEPARTMENT_PROFILE_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const removeVisitDepartmentProfile = async (visitDepartmentId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitDepartmentId
                }
            });
            const payload = result.data?.removeVisitDepartmentProfile;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message,
                data: payload?.data ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitDepartment"])(payload.data) : undefined
            };
        } catch (err) {
            console.error("Remove visit department profile error:", err);
            throw err;
        }
    };
    return {
        removeVisitDepartmentProfile,
        loading,
        error
    };
}
function useUpdateVisitDepartmentEncounterType() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_VISIT_DEPARTMENT_ENCOUNTER_TYPE_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const updateEncounterType = async (visitDepartmentId, encounterType)=>{
        try {
            const result = await mutation({
                variables: {
                    visitDepartmentId,
                    encounterType
                }
            });
            const payload = result.data?.updateVisitDepartmentEncounterType;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message,
                data: payload?.data
            };
        } catch (err) {
            console.error("Update encounter type error:", err);
            throw err;
        }
    };
    return {
        updateEncounterType,
        loading,
        error
    };
}
function useUpdateProductQuantity() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_VISIT_DEPARTMENT_PRODUCT_QUANTITY_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const updateQuantity = async (visitDepartmentProductId, quantity)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        visitDepartmentProductId,
                        quantity: parseFloat(quantity.toString())
                    }
                }
            });
            const payload = result.data?.updateVisitDepartmentProductQuantity;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message,
                data: payload?.data
            };
        } catch (err) {
            console.error("Update product quantity error:", err);
            throw err;
        }
    };
    return {
        updateQuantity,
        loading,
        error
    };
}
function useUpdateProductStatus() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_VISIT_DEPARTMENT_PRODUCT_STATUS_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const updateStatus = async (visitDepartmentProductId, status)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        visitDepartmentProductId,
                        status
                    }
                }
            });
            const payload = result.data?.updateVisitDepartmentProductStatus;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message,
                data: payload?.data
            };
        } catch (err) {
            console.error("Update product status error:", err);
            throw err;
        }
    };
    return {
        updateStatus,
        loading,
        error
    };
}
function useUpdateProductProcessor() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_VISIT_DEPARTMENT_PRODUCT_PROCESSOR_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const updateProcessor = async (visitDepartmentProductId, processorId)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        visitDepartmentProductId,
                        processorId
                    }
                }
            });
            const payload = result.data?.updateVisitDepartmentProductProcessor;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message,
                data: payload?.data
            };
        } catch (err) {
            console.error("Update product processor error:", err);
            throw err;
        }
    };
    return {
        updateProcessor,
        loading,
        error
    };
}
function useRemoveVisitDepartment() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REMOVE_VISIT_DEPARTMENT_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const removeVisitDepartment = async (visitDepartmentId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitDepartmentId
                }
            });
            return result.data?.removeVisitDepartment;
        } catch (err) {
            console.error("Remove visit department error:", err);
            throw err;
        }
    };
    return {
        removeVisitDepartment,
        loading,
        error
    };
}
function useUpdateVisitDepartmentEncounterDate() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_VISIT_DEPARTMENT_ENCOUNTER_DATE_MUTATION"], {
        refetchQueries: visitRefetchQueries,
        awaitRefetchQueries: true
    });
    const updateEncounterDate = async (visitDepartmentId, encounterDate)=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        visitDepartmentId,
                        encounterDate
                    }
                }
            });
            const payload = result.data?.updateVisitDepartmentEncounterDate;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message,
                data: payload?.data
            };
        } catch (err) {
            console.error("Update department encounter date error:", err);
            throw err;
        }
    };
    return {
        updateEncounterDate,
        loading,
        error
    };
}
}),
"[project]/hooks/visits/insurance.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLinkVisitInsurances",
    ()=>useLinkVisitInsurances,
    "useUnlinkVisitInsurances",
    ()=>useUnlinkVisitInsurances
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/mutations/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/visits.ts [app-ssr] (ecmascript)");
;
;
function useLinkVisitInsurances() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LINK_VISIT_INSURANCES_MUTATION"]);
    const linkVisitInsurances = async (visitId, insuranceIds)=>{
        try {
            const result = await mutation({
                variables: {
                    visitId,
                    insuranceIds
                }
            });
            return result.data?.linkVisitInsurances;
        } catch (err) {
            console.error("Link visit insurances error:", err);
            throw err;
        }
    };
    return {
        linkVisitInsurances,
        loading,
        error
    };
}
function useUnlinkVisitInsurances() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UNLINK_VISIT_INSURANCES_MUTATION"]);
    const unlinkVisitInsurances = async (visitId, insuranceIds)=>{
        try {
            const result = await mutation({
                variables: {
                    visitId,
                    insuranceIds
                }
            });
            return result.data?.unlinkVisitInsurances;
        } catch (err) {
            console.error("Unlink visit insurances error:", err);
            throw err;
        }
    };
    return {
        unlinkVisitInsurances,
        loading,
        error
    };
}
}),
"[project]/hooks/visits/notes.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAddVisitDepartmentNote",
    ()=>useAddVisitDepartmentNote,
    "useMarkVisitDepartmentNoteViewed",
    ()=>useMarkVisitDepartmentNoteViewed,
    "useMarkVisitDepartmentNotesViewed",
    ()=>useMarkVisitDepartmentNotesViewed,
    "useVisitDepartmentNotes",
    ()=>useVisitDepartmentNotes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/queries/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/visits.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/mutations/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/visits.ts [app-ssr] (ecmascript)");
;
;
;
function useVisitDepartmentNotes(visitId, visitDepartmentId) {
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VISIT_DEPARTMENT_NOTES_QUERY"], {
        variables: {
            visitId,
            visitDepartmentId
        },
        // A null visitDepartmentId fetches all of the visit's notes so the
        // billing page can enforce the backend's whole-visit unread-notes gate.
        skip: !visitId,
        fetchPolicy: "cache-and-network"
    });
    const notes = data?.visitDepartmentNotes?.data || [];
    const errorMessage = error?.message || null;
    return {
        notes,
        loading,
        error: errorMessage,
        refetch
    };
}
function useAddVisitDepartmentNote() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ADD_VISIT_DEPARTMENT_NOTE_MUTATION"]);
    const addVisitDepartmentNote = async (visitDepartmentId, content, noteType, targetUserIds = [])=>{
        try {
            const result = await mutation({
                variables: {
                    input: {
                        visitDepartmentId,
                        content,
                        noteType,
                        targetUserId: targetUserIds
                    }
                }
            });
            return result.data?.addVisitDepartmentNote;
        } catch (err) {
            console.error("Add visit department note error:", err);
            throw err;
        }
    };
    return {
        addVisitDepartmentNote,
        loading,
        error
    };
}
function useMarkVisitDepartmentNoteViewed() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MARK_VISIT_DEPARTMENT_NOTE_VIEWED_MUTATION"]);
    const markNoteViewed = async (noteId)=>{
        try {
            const result = await mutation({
                variables: {
                    noteId
                }
            });
            return result.data?.markVisitDepartmentNoteViewed;
        } catch (err) {
            console.error("Mark note viewed error:", err);
            throw err;
        }
    };
    return {
        markNoteViewed,
        loading,
        error
    };
}
function useMarkVisitDepartmentNotesViewed() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MARK_VISIT_DEPARTMENT_NOTES_VIEWED_MUTATION"]);
    const markNotesViewed = async (visitDepartmentId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitDepartmentId
                }
            });
            return result.data?.markVisitDepartmentNotesViewed;
        } catch (err) {
            console.error("Mark notes viewed error:", err);
            throw err;
        }
    };
    return {
        markNotesViewed,
        loading,
        error
    };
}
}),
"[project]/hooks/visits/hooks.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Barrel re-export for the split visit hooks. Keeping this file so existing
// `@/hooks/visits/hooks` imports keep working unchanged.
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$vital$2d$signs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/vital-signs.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/queries.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$visit$2d$mutations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/visit-mutations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/department-mutations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$insurance$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/insurance.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$notes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/notes.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/hooks/visits/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/visits/hooks.ts [app-ssr] (ecmascript) <locals>");
;
}),
"[project]/lib/patient-display-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatPatientGender",
    ()=>formatPatientGender,
    "getPatientAge",
    ()=>getPatientAge,
    "getPatientDisplayName",
    ()=>getPatientDisplayName,
    "getPatientPhone",
    ()=>getPatientPhone,
    "splitFullName",
    ()=>splitFullName,
    "splitWorkerName",
    ()=>splitWorkerName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-types.ts [app-ssr] (ecmascript)");
;
function getPatientDisplayName(patient) {
    return [
        patient.firstName,
        patient.middleName,
        patient.lastName
    ].filter(Boolean).join(" ").trim();
}
function getPatientAge(patient) {
    if (!patient.dateOfBirth) return null;
    const dob = new Date(patient.dateOfBirth);
    if (Number.isNaN(dob.getTime())) return null;
    return new Date().getFullYear() - dob.getFullYear();
}
function formatPatientGender(gender) {
    if (gender === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Gender"].MALE) return "Male";
    if (gender === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Gender"].FEMALE) return "Female";
    return "Other";
}
function getPatientPhone(patient) {
    return patient.primaryPhoneNumber || patient.alternativePhone || "";
}
function splitFullName(fullName) {
    const trimmed = (fullName || "").trim().replace(/\s+/g, " ");
    if (!trimmed) {
        return {
            firstName: "",
            middleName: undefined,
            lastName: undefined
        };
    }
    const parts = trimmed.split(" ");
    if (parts.length === 1) {
        return {
            firstName: parts[0],
            middleName: undefined,
            lastName: undefined
        };
    }
    if (parts.length === 2) {
        return {
            firstName: parts[0],
            middleName: undefined,
            lastName: parts[1]
        };
    }
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const middleName = parts.slice(1, -1).join(" ");
    return {
        firstName,
        middleName: middleName || undefined,
        lastName: lastName || undefined
    };
}
function splitWorkerName(fullName) {
    const trimmed = (fullName || "").trim().replace(/\s+/g, " ");
    if (!trimmed) {
        return {
            firstName: "",
            lastName: undefined
        };
    }
    const parts = trimmed.split(" ");
    if (parts.length === 1) {
        return {
            firstName: parts[0],
            lastName: undefined
        };
    }
    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(" ")
    };
}
}),
"[project]/hooks/patients/hooks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCreatePatientInsurance",
    ()=>useCreatePatientInsurance,
    "useDeletePatientInsurance",
    ()=>useDeletePatientInsurance,
    "usePatient",
    ()=>usePatient,
    "usePatients",
    ()=>usePatients,
    "useRegisterPatient",
    ()=>useRegisterPatient,
    "useUpdatePatient",
    ()=>useUpdatePatient,
    "useUpdatePatientInsurance",
    ()=>useUpdatePatientInsurance
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/queries/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$patients$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/patients.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/mutations/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$patients$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/patients.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/patient-display-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gql-mappers.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const getDominantMemberPayload = (dominantMember, isSelf)=>{
    if (isSelf) {
        return {
            principalMember: true,
            principalMemberName: null,
            principalMemberPhoneNumber: null
        };
    }
    const rawName = dominantMember?.name?.trim();
    const resolvedNames = rawName ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["splitFullName"])(rawName) : {
        firstName: dominantMember?.firstName?.trim() || "",
        lastName: dominantMember?.lastName?.trim() || ""
    };
    const firstName = resolvedNames.firstName || dominantMember?.firstName?.trim() || "";
    const lastName = resolvedNames.lastName || dominantMember?.lastName?.trim() || "";
    const phone = dominantMember?.phone?.trim() || "";
    const hasDominantMemberData = Boolean(rawName || firstName || lastName || phone);
    const fullName = rawName || [
        firstName,
        lastName
    ].filter(Boolean).join(" ") || null;
    return {
        principalMember: !hasDominantMemberData,
        principalMemberName: hasDominantMemberData ? fullName : null,
        principalMemberPhoneNumber: hasDominantMemberData ? phone || null : null
    };
};
const attachLastVisit = (patient, _lastVisit)=>{
    // API no longer returns lastVisit; do nothing.
    return patient;
};
const mapInsuranceMutationResult = (insurance, insuranceProviderId, patientId)=>{
    const patient = {
        id: patientId || "",
        firstName: "",
        dateOfBirth: "",
        gender: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Gender"].OTHER,
        patientInsurances: [],
        createdAt: "",
        updatedAt: ""
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlPatientInsurance"])({
        ...insurance,
        insuranceProvider: {
            id: insuranceProviderId,
            insuranceName: ""
        }
    }, patient);
};
function useCreatePatientInsurance() {
    const [createPatientInsuranceMutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$patients$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CREATE_PATIENT_INSURANCE_MUTATION"]);
    const createPatientInsurance = async (input)=>{
        try {
            const result = await createPatientInsuranceMutation({
                variables: {
                    input: {
                        patientId: input.patientId,
                        insuranceProviderId: input.insuranceProviderId,
                        insuranceCardNumber: input.insuranceCardNumber,
                        providingCompanyOrEmployer: input.providingCompanyOrEmployer,
                        principalMember: !input.dominantMember?.firstName?.trim() && !input.dominantMember?.lastName?.trim() && !input.dominantMember?.phone?.trim(),
                        principalMemberName: [
                            input.dominantMember?.firstName,
                            input.dominantMember?.lastName
                        ].filter(Boolean).join(" ") || null,
                        principalMemberPhoneNumber: input.dominantMember?.phone?.trim() || null,
                        validFrom: input.validFrom,
                        validUntil: input.validUntil,
                        patientSharePercentage: input.patientSharePercentage ?? null
                    }
                }
            });
            const created = result.data?.createPatientInsurance;
            const createdData = created?.data;
            const insuranceProvider = input.insuranceProviderId;
            return {
                status: created?.status || "ERROR",
                message: created?.message,
                messages: created?.message ? [
                    {
                        text: created.message,
                        type: created.status || "ERROR"
                    }
                ] : undefined,
                data: createdData ? mapInsuranceMutationResult(createdData, insuranceProvider, input.patientId) : undefined
            };
        } catch (err) {
            console.error("Create patient insurance error:", err);
            throw err;
        }
    };
    return {
        createPatientInsurance,
        loading,
        error
    };
}
function useUpdatePatientInsurance() {
    const [updatePatientInsuranceMutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$patients$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_PATIENT_INSURANCE_MUTATION"]);
    const updatePatientInsurance = async (patientInsuranceId, input)=>{
        try {
            const result = await updatePatientInsuranceMutation({
                variables: {
                    patientInsuranceId,
                    input: {
                        patientId: input.patientId,
                        insuranceProviderId: input.insuranceProviderId,
                        insuranceCardNumber: input.insuranceCardNumber,
                        providingCompanyOrEmployer: input.providingCompanyOrEmployer,
                        principalMember: !input.dominantMember?.firstName?.trim() && !input.dominantMember?.lastName?.trim() && !input.dominantMember?.phone?.trim(),
                        principalMemberName: [
                            input.dominantMember?.firstName,
                            input.dominantMember?.lastName
                        ].filter(Boolean).join(" ") || null,
                        principalMemberPhoneNumber: input.dominantMember?.phone?.trim() || null,
                        validFrom: input.validFrom,
                        validUntil: input.validUntil,
                        patientSharePercentage: input.patientSharePercentage ?? null,
                        patientShareCoverageId: input.patientShareCoverageId ?? null
                    }
                }
            });
            const updated = result.data?.updatePatientInsurance;
            const updatedData = updated?.data;
            const insuranceProvider = input.insuranceProviderId;
            return {
                status: updated?.status || "ERROR",
                message: updated?.message,
                messages: updated?.message ? [
                    {
                        text: updated.message,
                        type: updated.status || "ERROR"
                    }
                ] : undefined,
                data: updatedData ? mapInsuranceMutationResult(updatedData, insuranceProvider, input.patientId) : undefined
            };
        } catch (err) {
            console.error("Update patient insurance error:", err);
            throw err;
        }
    };
    return {
        updatePatientInsurance,
        loading,
        error
    };
}
function useDeletePatientInsurance() {
    const [deletePatientInsuranceMutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$patients$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DELETE_PATIENT_INSURANCE_MUTATION"]);
    const deletePatientInsurance = async (patientInsuranceId)=>{
        try {
            const result = await deletePatientInsuranceMutation({
                variables: {
                    patientInsuranceId: String(patientInsuranceId)
                }
            });
            const response = result.data?.deletePatientInsurance;
            return {
                status: response?.status || "SUCCESS",
                message: response?.message,
                messages: response?.message ? [
                    {
                        text: response.message,
                        type: response.status || "SUCCESS"
                    }
                ] : undefined,
                data: Boolean(response?.data)
            };
        } catch (err) {
            console.error("Delete patient insurance error:", err);
            return {
                status: "ERROR",
                message: err?.message || "Failed to delete patient insurance",
                data: false
            };
        }
    };
    return {
        deletePatientInsurance,
        loading,
        error
    };
}
function usePatients(filter, page = 0, size = 20) {
    const shouldSkip = !filter || Object.keys(filter).length === 0;
    const input = {
        ...filter?.name ? {
            name: filter.name
        } : {},
        ...filter?.phoneNumber ? {
            phoneNumber: filter.phoneNumber
        } : {},
        ...filter?.insuranceCardNumber ? {
            insuranceCardNumber: filter.insuranceCardNumber
        } : {},
        ...filter?.insuranceProviderId ? {
            insuranceProviderId: filter.insuranceProviderId
        } : {},
        ...filter?.gender ? {
            gender: filter.gender
        } : {},
        ...filter?.age != null ? {
            age: filter.age
        } : {},
        ...filter?.minAge != null ? {
            minAge: filter.minAge
        } : {},
        ...filter?.maxAge != null ? {
            maxAge: filter.maxAge
        } : {},
        page,
        size
    };
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$patients$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_PATIENTS_QUERY"], {
        variables: {
            input
        },
        fetchPolicy: "cache-and-network",
        skip: shouldSkip
    });
    const patients = (data?.searchPatients?.data || []).map((gqlPatient)=>attachLastVisit((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlPatient"])(gqlPatient), gqlPatient.lastVisit));
    const totalPages = data?.searchPatients?.pagination?.totalPages || 0;
    const totalElements = data?.searchPatients?.pagination?.total || 0;
    return {
        patients,
        loading,
        error,
        totalPages,
        totalElements,
        refetch
    };
}
function usePatient(id) {
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$patients$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_PATIENT_QUERY"], {
        variables: {
            patientId: id
        },
        skip: !id,
        fetchPolicy: "cache-and-network"
    });
    const patientData = data?.patient?.data;
    const patientInsurances = data?.patientInsurances?.data || [];
    const patient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>{
        if (!patientData) {
            return undefined;
        }
        const gqlPatient = patientData;
        let mapped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlPatient"])(gqlPatient);
        mapped = {
            ...mapped,
            patientInsurances: patientInsurances.map((insurance)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlPatientInsurance"])(insurance, mapped))
        };
        return attachLastVisit(mapped, gqlPatient.lastVisit);
    }, [
        patientData,
        patientInsurances
    ]);
    return {
        patient,
        loading,
        error,
        refetch
    };
}
function useRegisterPatient() {
    const [registerPatientMutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$patients$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REGISTER_PATIENT_MUTATION"]);
    const registerPatient = async (input)=>{
        try {
            const resolvedNames = input.name ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["splitFullName"])(input.name) : {
                firstName: input.firstName,
                middleName: input.middleName,
                lastName: input.lastName
            };
            const patientInput = {
                firstName: resolvedNames.firstName,
                middleName: resolvedNames.middleName || null,
                lastName: resolvedNames.lastName || null,
                dateOfBirth: input.dateOfBirth,
                gender: input.gender === "M" ? "MALE" : input.gender === "F" ? "FEMALE" : input.gender || null,
                primaryPhoneNumber: input.contactInfo?.phone || null,
                alternativePhone: null,
                cell: input.contactInfo?.address?.cell || null,
                village: input.contactInfo?.address?.village || null,
                city: input.contactInfo?.address?.sector || null,
                district: input.contactInfo?.address?.district || null,
                postalAddress: input.contactInfo?.address?.country || null,
                nationalIdNumber: input.nationalIdNumber || null,
                passportNumber: null,
                emergencyContactName: input.emergencyContact?.name || null,
                emergencyContactRelationship: input.emergencyContact?.relation || null,
                emergencyContactPhoneNumber: input.emergencyContact?.phone || null
            };
            if (input.insurances && input.insurances.length > 0) {
                const now = new Date();
                const validFrom = now.toISOString().slice(0, 10);
                const validUntil = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString().slice(0, 10);
                patientInput.insurances = input.insurances.filter((insurance)=>insurance?.insuranceId && insurance?.insuranceCardNumber && insurance?.providingCompanyOrEmployer).map((insurance)=>({
                        insuranceProviderId: String(insurance.insuranceId),
                        insuranceCardNumber: insurance.insuranceCardNumber,
                        providingCompanyOrEmployer: insurance.providingCompanyOrEmployer,
                        ...getDominantMemberPayload(insurance.dominantMember, insurance.isSelf),
                        validFrom,
                        validUntil,
                        patientShareCoverageId: insurance.patientShareCoverageId || null,
                        patientSharePercentage: insurance.patientSharePercentage != null && insurance.patientSharePercentage !== "" ? Number(insurance.patientSharePercentage) : null
                    }));
            }
            const result = await registerPatientMutation({
                variables: {
                    input: patientInput
                }
            });
            const created = result?.data?.createPatient;
            const visitData = created?.data;
            return {
                status: created?.status || "ERROR",
                message: created?.message,
                messages: created?.message ? [
                    {
                        text: created.message,
                        type: created.status || "ERROR"
                    }
                ] : undefined,
                data: visitData ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisit"])({
                    id: visitData.id,
                    visitDate: visitData.visitDate,
                    status: visitData.status,
                    patient: visitData.patient,
                    linkedInsurances: visitData.linkedInsurances || [],
                    departments: [],
                    vitalSigns: []
                }) : undefined
            };
        } catch (err) {
            console.error("Patient registration error:", err);
            throw err;
        }
    };
    return {
        registerPatient,
        loading,
        error
    };
}
function useUpdatePatient() {
    const [updatePatientMutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$patients$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_PATIENT_MUTATION"]);
    const updatePatient = async (patientId, input)=>{
        try {
            const patientInput = {
                firstName: input.firstName,
                middleName: input.middleName ?? null,
                lastName: input.lastName ?? null,
                dateOfBirth: input.dateOfBirth,
                gender: input.gender ?? null,
                primaryPhoneNumber: input.primaryPhoneNumber ?? null,
                alternativePhone: input.alternativePhone ?? null,
                cell: input.cell ?? null,
                village: input.village ?? null,
                city: input.city ?? null,
                district: input.district ?? null,
                postalAddress: input.postalAddress ?? null,
                nationalIdNumber: input.nationalIdNumber ?? null,
                passportNumber: input.passportNumber ?? null,
                emergencyContactName: input.emergencyContactName ?? null,
                emergencyContactRelationship: input.emergencyContactRelationship ?? null,
                emergencyContactPhoneNumber: input.emergencyContactPhoneNumber ?? null
            };
            const result = await updatePatientMutation({
                variables: {
                    patientId,
                    input: patientInput
                }
            });
            const updated = result.data.updatePatient;
            const insuranceResults = [];
            return {
                status: updated?.status || "ERROR",
                message: updated?.message,
                messages: updated?.message ? [
                    {
                        text: updated.message,
                        type: updated.status || "ERROR"
                    }
                ] : undefined,
                data: updated?.data ? {
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlPatient"])(updated.data),
                    patientInsurances: insuranceResults.length > 0 ? insuranceResults : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlPatient"])(updated.data).patientInsurances
                } : undefined
            };
        } catch (err) {
            console.error("Patient update error:", err);
            throw err;
        }
    };
    return {
        updatePatient,
        loading,
        error
    };
}
}),
"[project]/hooks/patients/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/patients/hooks.ts [app-ssr] (ecmascript)");
;
}),
"[project]/hooks/insurances/hooks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCreateInsuranceProvider",
    ()=>useCreateInsuranceProvider,
    "useDeleteInsuranceProvider",
    ()=>useDeleteInsuranceProvider,
    "useInsuranceSearch",
    ()=>useInsuranceSearch,
    "useInsurances",
    ()=>useInsurances,
    "useUpdateInsuranceProvider",
    ()=>useUpdateInsuranceProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/mutations/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$insurances$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/insurances.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gql-mappers.ts [app-ssr] (ecmascript)");
;
;
;
;
const GET_INSURANCES_QUERY_LOCAL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetInsurances($input: SearchInsuranceProvidersInput) {
    insuranceProviders(input: $input) {
      status
      message
      data {
        id
        insuranceName
        acronym
        coverages {
          id
          insuranceProviderId
          insuranceProviderName
          departmentId
          departmentName
          encounterType
          patientSharePercentage
          createdAt
          updatedAt
        }
        supportedByClinic
        iconUrl
      }
    }
  }
`;
function useInsurances(input) {
    const insuranceInput = {
        page: input?.page ?? 0,
        size: input?.size ?? 200,
        ...input?.query ? {
            query: input.query
        } : {}
    };
    if (!input || !("supportedByClinic" in input)) {
        insuranceInput.supportedByClinic = true;
    } else if (typeof input.supportedByClinic === 'boolean') {
        insuranceInput.supportedByClinic = input.supportedByClinic;
    }
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(GET_INSURANCES_QUERY_LOCAL, {
        variables: {
            input: insuranceInput
        },
        fetchPolicy: 'cache-and-network'
    });
    const insurances = (data?.insuranceProviders?.data || []).map((insurance)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlInsuranceProvider"])(insurance));
    return {
        insurances,
        loading: loading || false,
        error: error?.message || null,
        refetch
    };
}
function useInsuranceSearch(searchQuery) {
    const { data, loading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(GET_INSURANCES_QUERY_LOCAL, {
        variables: {
            input: {
                query: searchQuery || undefined,
                supportedByClinic: true,
                page: 0,
                size: 20
            }
        },
        fetchPolicy: 'cache-and-network',
        skip: !searchQuery || searchQuery.length < 2
    });
    const insurances = (data?.insuranceProviders?.data || []).map((insurance)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlInsuranceProvider"])(insurance));
    return {
        insurances,
        loading,
        error: error?.message || null
    };
}
function useCreateInsuranceProvider() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$insurances$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CREATE_INSURANCE_PROVIDER_MUTATION"]);
    const createInsuranceProvider = async (input)=>{
        try {
            const { data } = await mutation({
                variables: {
                    input
                }
            });
            const payload = data?.createInsuranceProvider;
            const created = payload?.data;
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message,
                data: created ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlInsuranceProvider"])(created) : undefined
            };
        } catch (err) {
            console.error('Create insurance provider error:', err);
            throw err;
        }
    };
    return {
        createInsuranceProvider,
        loading,
        error: error?.message || null
    };
}
function useUpdateInsuranceProvider() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$insurances$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_INSURANCE_PROVIDER_MUTATION"]);
    const updateInsuranceProvider = async (insuranceProviderId, input)=>{
        try {
            const { data } = await mutation({
                variables: {
                    insuranceProviderId,
                    input
                }
            });
            const payload = data?.updateInsuranceProvider;
            const updated = payload?.data;
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message,
                data: updated ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlInsuranceProvider"])(updated) : undefined
            };
        } catch (err) {
            console.error('Update insurance provider error:', err);
            throw err;
        }
    };
    return {
        updateInsuranceProvider,
        loading,
        error: error?.message || null
    };
}
function useDeleteInsuranceProvider() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$insurances$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DELETE_INSURANCE_PROVIDER_MUTATION"]);
    const deleteInsuranceProvider = async (insuranceProviderId)=>{
        try {
            const { data } = await mutation({
                variables: {
                    insuranceProviderId
                }
            });
            const payload = data?.deleteInsuranceProvider;
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message,
                data: null
            };
        } catch (err) {
            console.error('Delete insurance provider error:', err);
            throw err;
        }
    };
    return {
        deleteInsuranceProvider,
        loading,
        error: error?.message || null
    };
}
}),
"[project]/hooks/mutations/coverage-rules.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CREATE_INSURANCE_COVERAGE_RULE_MUTATION",
    ()=>CREATE_INSURANCE_COVERAGE_RULE_MUTATION,
    "DELETE_INSURANCE_COVERAGE_RULE_MUTATION",
    ()=>DELETE_INSURANCE_COVERAGE_RULE_MUTATION,
    "GET_INSURANCE_COVERAGE_RULES",
    ()=>GET_INSURANCE_COVERAGE_RULES,
    "UPDATE_INSURANCE_COVERAGE_RULE_MUTATION",
    ()=>UPDATE_INSURANCE_COVERAGE_RULE_MUTATION
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const GET_INSURANCE_COVERAGE_RULES = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query GetInsuranceCoverages($input: SearchInsuranceCoveragesInput) {
    insuranceCoverages(input: $input) {
      status
      message
      data {
        id
        insuranceProviderId
        insuranceProviderName
        departmentId
        departmentName
        encounterType
        patientSharePercentage
        createdAt
        updatedAt
      }
    }
  }
`;
const CREATE_INSURANCE_COVERAGE_RULE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation CreateInsuranceCoverage($input: CreateInsuranceCoverageInput!) {
    createInsuranceCoverage(input: $input) {
      status
      message
      data {
        id
        insuranceProviderId
        insuranceProviderName
        departmentId
        departmentName
        encounterType
        patientSharePercentage
        createdAt
        updatedAt
      }
    }
  }
`;
const UPDATE_INSURANCE_COVERAGE_RULE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation UpdateInsuranceCoverage($ruleId: ID!, $input: UpdateInsuranceCoverageInput!) {
    updateInsuranceCoverage(ruleId: $ruleId, input: $input) {
      status
      message
      data {
        id
        insuranceProviderId
        insuranceProviderName
        departmentId
        departmentName
        encounterType
        patientSharePercentage
        createdAt
        updatedAt
      }
    }
  }
`;
const DELETE_INSURANCE_COVERAGE_RULE_MUTATION = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  mutation DeleteInsuranceCoverage($ruleId: ID!) {
    deleteInsuranceCoverage(ruleId: $ruleId) {
      status
      message
      data
    }
  }
`;
}),
"[project]/hooks/insurances/coverage-rules.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCreateInsuranceCoverage",
    ()=>useCreateInsuranceCoverage,
    "useDeleteInsuranceCoverage",
    ()=>useDeleteInsuranceCoverage,
    "useInsuranceCoverages",
    ()=>useInsuranceCoverages,
    "useUpdateInsuranceCoverage",
    ()=>useUpdateInsuranceCoverage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$coverage$2d$rules$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/coverage-rules.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gql-mappers.ts [app-ssr] (ecmascript)");
;
;
;
function useInsuranceCoverages(input) {
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$coverage$2d$rules$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_INSURANCE_COVERAGE_RULES"], {
        variables: {
            input: input || {}
        },
        fetchPolicy: 'cache-and-network',
        skip: !input?.insuranceProviderId
    });
    const rules = (data?.insuranceCoverages?.data || []).map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlInsuranceCoverage"]);
    return {
        rules,
        loading,
        error: error?.message || null,
        refetch
    };
}
function useCreateInsuranceCoverage() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$coverage$2d$rules$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CREATE_INSURANCE_COVERAGE_RULE_MUTATION"]);
    const createRule = async (input)=>{
        const { data } = await mutation({
            variables: {
                input
            }
        });
        const payload = data?.createInsuranceCoverage;
        return {
            status: payload?.status || 'ERROR',
            message: payload?.message,
            data: payload?.data ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlInsuranceCoverage"])(payload.data) : null
        };
    };
    return {
        createRule,
        loading,
        error: error?.message || null
    };
}
function useUpdateInsuranceCoverage() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$coverage$2d$rules$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_INSURANCE_COVERAGE_RULE_MUTATION"]);
    const updateRule = async (ruleId, input)=>{
        const { data } = await mutation({
            variables: {
                ruleId,
                input
            }
        });
        const payload = data?.updateInsuranceCoverage;
        return {
            status: payload?.status || 'ERROR',
            message: payload?.message,
            data: payload?.data ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlInsuranceCoverage"])(payload.data) : null
        };
    };
    return {
        updateRule,
        loading,
        error: error?.message || null
    };
}
function useDeleteInsuranceCoverage() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$coverage$2d$rules$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DELETE_INSURANCE_COVERAGE_RULE_MUTATION"]);
    const deleteRule = async (ruleId)=>{
        const { data } = await mutation({
            variables: {
                ruleId
            }
        });
        const payload = data?.deleteInsuranceCoverage;
        return {
            status: payload?.status || 'ERROR',
            message: payload?.message
        };
    };
    return {
        deleteRule,
        loading,
        error: error?.message || null
    };
}
}),
"[project]/hooks/insurances/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/insurances/hooks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$coverage$2d$rules$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/insurances/coverage-rules.ts [app-ssr] (ecmascript)");
;
;
}),
"[project]/lib/visit-billing-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Visit billing helpers aligned with user.graphqls VisitBilling → VisitDepartmentBilling → DepartmentInsuranceBilling.
 */ __turbopack_context__.s([
    "flattenDepartmentInsuranceBillings",
    ()=>flattenDepartmentInsuranceBillings,
    "flattenVisitBillingItems",
    ()=>flattenVisitBillingItems,
    "getLatestDepartmentInsuranceBilling",
    ()=>getLatestDepartmentInsuranceBilling,
    "getLatestDepartmentInsuranceBillingId",
    ()=>getLatestDepartmentInsuranceBillingId,
    "getVisitBillingTotals",
    ()=>getVisitBillingTotals,
    "isVisitBillingFullyPaid",
    ()=>isVisitBillingFullyPaid,
    "isVisitDepartmentProductBilled",
    ()=>isVisitDepartmentProductBilled,
    "mapGqlVisitBilling",
    ()=>mapGqlVisitBilling,
    "mapGqlVisitDepartmentBilling",
    ()=>mapGqlVisitDepartmentBilling,
    "visitBillingLineTotal",
    ()=>visitBillingLineTotal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-types.ts [app-ssr] (ecmascript)");
;
const EMPTY_TS = "";
/** Minimal visit department when billing query omits nested visitDepartment fields. */ function emptyVisitDepartmentStub(id = "", name) {
    return {
        id,
        department: {
            id: "",
            name: name || "",
            insurancePolicyMode: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DepartmentInsurancePolicyMode"].ALL,
            insurancePolicies: [],
            profiles: [],
            nursing: false,
            supportRequests: false,
            requestsProducts: false,
            createdAt: EMPTY_TS,
            updatedAt: EMPTY_TS
        },
        status: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VisitDepartmentStatus"].PENDING,
        encounterType: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EncounterType"].OUTPATIENT,
        processors: [],
        childVisitDepartments: [],
        products: [],
        preInstructions: [],
        createdAt: EMPTY_TS,
        updatedAt: EMPTY_TS
    };
}
function mapGqlVisitBillingItem(item) {
    return {
        id: item.id,
        visitDepartmentProductId: item.visitDepartmentProductId,
        productId: item.productId,
        productName: item.productName,
        unitPriceSnapshot: Number(item.unitPriceSnapshot ?? 0),
        quantitySnapshot: Number(item.quantitySnapshot ?? 0),
        insuranceCoveredAmount: Number(item.insuranceCoveredAmount ?? 0),
        patientPayableAmount: Number(item.patientPayableAmount ?? 0),
        appliedPatientSharePct: item.appliedPatientSharePct ?? null,
        patientShareSource: item.patientShareSource ?? null,
        createdAt: item.createdAt || EMPTY_TS,
        updatedAt: item.updatedAt || EMPTY_TS
    };
}
function mapGqlPatientInsuranceRef(insurance) {
    if (!insurance?.id) return null;
    const provider = insurance.insuranceProvider;
    return {
        id: insurance.id,
        insuranceCardNumber: insurance.insuranceCardNumber || "",
        providingCompanyOrEmployer: null,
        principalMember: false,
        principalMemberName: insurance.principalMemberName,
        principalMemberPhoneNumber: null,
        validFrom: "",
        validUntil: "",
        deactivated: Boolean(insurance.deactivated),
        insuranceProvider: {
            id: provider?.id || "",
            insuranceName: provider?.insuranceName || "",
            acronym: provider?.acronym,
            coverages: [],
            supportedByClinic: true,
            createdAt: EMPTY_TS,
            updatedAt: EMPTY_TS,
            name: provider?.insuranceName || ""
        },
        patient: {
            id: "",
            firstName: "",
            dateOfBirth: "",
            gender: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Gender"].OTHER,
            patientInsurances: [],
            createdAt: EMPTY_TS,
            updatedAt: EMPTY_TS
        },
        createdAt: EMPTY_TS,
        updatedAt: EMPTY_TS
    };
}
function mapGqlDepartmentInsuranceBilling(billing) {
    return {
        id: billing.id,
        patientInsurance: mapGqlPatientInsuranceRef(billing.patientInsurance),
        status: billing.status,
        totalAmount: Number(billing.totalAmount ?? 0),
        insuranceCoveredAmount: Number(billing.insuranceCoveredAmount ?? 0),
        patientPayableAmount: Number(billing.patientPayableAmount ?? 0),
        paidAmount: Number(billing.paidAmount ?? 0),
        outstandingAmount: Number(billing.outstandingAmount ?? 0),
        outstandingType: billing.outstandingType || null,
        outstandingReason: billing.outstandingReason || null,
        items: (billing.items || []).map(mapGqlVisitBillingItem),
        createdAt: billing.createdAt || EMPTY_TS,
        updatedAt: billing.updatedAt || EMPTY_TS
    };
}
function mapGqlVisitDepartmentBilling(department) {
    return {
        id: department.id,
        visitDepartment: emptyVisitDepartmentStub(department.visitDepartment?.id || department.id, department.visitDepartment?.department?.name),
        status: department.status,
        totalAmount: Number(department.totalAmount ?? 0),
        insuranceCoveredAmount: Number(department.insuranceCoveredAmount ?? 0),
        patientPayableAmount: Number(department.patientPayableAmount ?? 0),
        paidAmount: Number(department.paidAmount ?? 0),
        outstandingAmount: Number(department.outstandingAmount ?? 0),
        payments: (department.payments || []).map((payment)=>({
                id: payment.id,
                amount: Number(payment.amount ?? 0),
                paymentMethod: payment.paymentMethod,
                reference: payment.reference,
                createdAt: payment.createdAt || EMPTY_TS,
                updatedAt: payment.updatedAt || EMPTY_TS
            })),
        insuranceBillings: (department.insuranceBillings || []).map(mapGqlDepartmentInsuranceBilling),
        version: department.version ? {
            id: department.version.id,
            version: Number(department.version.version ?? 0)
        } : undefined,
        createdAt: department.createdAt || EMPTY_TS,
        updatedAt: department.updatedAt || EMPTY_TS
    };
}
function mapGqlVisitBilling(data) {
    return {
        id: data.id,
        visitId: data.visitId,
        version: data.version ? {
            id: data.version.id,
            version: Number(data.version.version ?? 0)
        } : undefined,
        departments: (data.departments || []).map(mapGqlVisitDepartmentBilling),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    };
}
function flattenDepartmentInsuranceBillings(visitBilling) {
    if (!visitBilling) return [];
    return (visitBilling.departments || []).flatMap((dept)=>dept.insuranceBillings || []);
}
function flattenVisitBillingItems(visitBilling) {
    return flattenDepartmentInsuranceBillings(visitBilling).flatMap((ib)=>ib.items || []);
}
function getLatestDepartmentInsuranceBilling(visitBilling) {
    const all = flattenDepartmentInsuranceBillings(visitBilling);
    return all.length > 0 ? all[all.length - 1] : undefined;
}
function getLatestDepartmentInsuranceBillingId(visitBilling) {
    return getLatestDepartmentInsuranceBilling(visitBilling)?.id;
}
function getVisitBillingTotals(visitBilling) {
    const insuranceBillings = flattenDepartmentInsuranceBillings(visitBilling);
    const totalAmount = insuranceBillings.reduce((sum, ib)=>sum + Number(ib.totalAmount || 0), 0);
    const insuranceCoveredAmount = insuranceBillings.reduce((sum, ib)=>sum + Number(ib.insuranceCoveredAmount || 0), 0);
    const patientPayableAmount = insuranceBillings.reduce((sum, ib)=>sum + Number(ib.patientPayableAmount || 0), 0);
    const paidAmount = insuranceBillings.reduce((sum, ib)=>sum + Number(ib.paidAmount || 0), 0);
    const outstandingAmount = insuranceBillings.reduce((sum, ib)=>sum + Number(ib.outstandingAmount || 0), 0);
    let waivedAmount = 0;
    for (const ib of insuranceBillings){
        for (const it of ib.items || []){
            if (it.patientShareSource === "EXEMPTED") {
                const lineTotal = Number(it.unitPriceSnapshot || 0) * Number(it.quantitySnapshot || 1);
                const insAmount = Number(it.insuranceCoveredAmount || 0);
                waivedAmount += Math.max(0, lineTotal - insAmount);
            }
        }
    }
    return {
        totalAmount,
        insuranceCoveredAmount,
        patientPayableAmount,
        paidAmount,
        // Outstanding is the patient's residual only (patient payable minus paid).
        // It must never include the insurance-contributed amount, so if the
        // backend's reported outstanding is missing/zero, derive it from the
        // patient payable rather than the service total.
        outstandingAmount: outstandingAmount || Math.max(0, patientPayableAmount - paidAmount),
        waivedAmount
    };
}
function isVisitDepartmentProductBilled(visitBilling, visitDepartmentProductId) {
    return flattenVisitBillingItems(visitBilling).some((item)=>item.visitDepartmentProductId === visitDepartmentProductId);
}
function visitBillingLineTotal(item) {
    return Number(item.unitPriceSnapshot || 0) * Number(item.quantitySnapshot || 0);
}
function isVisitBillingFullyPaid(visitBilling) {
    const totals = getVisitBillingTotals(visitBilling);
    return totals.totalAmount > 0 && totals.paidAmount >= totals.totalAmount;
}
}),
"[project]/hooks/billing/hooks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCancelBillEditing",
    ()=>useCancelBillEditing,
    "useCompleteBillEditing",
    ()=>useCompleteBillEditing,
    "useConfirmVisitDepartmentProduct",
    ()=>useConfirmVisitDepartmentProduct,
    "useCreateBill",
    ()=>useCreateBill,
    "useEditBill",
    ()=>useEditBill,
    "useGenerateInvoice",
    ()=>useGenerateInvoice,
    "useGetBillByVisit",
    ()=>useGetBillByVisit,
    "useGetVisitBilling",
    ()=>useGetVisitBilling,
    "useQuickBill",
    ()=>useQuickBill,
    "useRecordVisitBillingPayment",
    ()=>useRecordVisitBillingPayment,
    "useStartBillEditing",
    ()=>useStartBillEditing,
    "useVisitDepartmentBilling",
    ()=>useVisitDepartmentBilling
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/queries/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/billing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/mutations/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/billing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$billing$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visit-billing-utils.ts [app-ssr] (ecmascript)");
;
;
;
;
function useGetVisitBilling(visitId) {
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_BILL_BY_VISIT_QUERY"], {
        variables: {
            visitId
        },
        skip: !visitId,
        fetchPolicy: "cache-and-network"
    });
    const gqlData = data?.visitBilling?.data;
    const visitBilling = gqlData ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$billing$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitBilling"])(gqlData) : undefined;
    return {
        visitBilling,
        loading,
        error,
        refetch
    };
}
function useGetBillByVisit(visitId) {
    const result = useGetVisitBilling(visitId);
    return {
        ...result,
        bill: result.visitBilling
    };
}
function useCreateBill() {
    const [createBillMutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CREATE_BILL_MUTATION"]);
    const createBill = async (input)=>{
        try {
            const result = await createBillMutation({
                variables: {
                    input
                }
            });
            const payload = result?.data?.billVisit;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message,
                data: payload?.data ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$billing$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitBilling"])(payload.data) : undefined
            };
        } catch (err) {
            console.error("Create bill error:", err);
            throw err;
        }
    };
    return {
        createBill,
        loading,
        error
    };
}
const billingRefetchQueries = [
    "GetVisits",
    "GetVisit",
    "GetVisitBilling",
    "GetVisitBillingForSettings",
    "GetVisitDepartmentProfiles",
    "GetBillByVisit",
    "GetVisitDepartmentBilling"
];
function useEditBill() {
    const [editBillMutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EDIT_BILL_MUTATION"], {
        refetchQueries: billingRefetchQueries,
        awaitRefetchQueries: true
    });
    const editBill = async (input)=>{
        // Map the hook-level input to the GraphQL EditBillVisitInput shape.
        const gqlInput = {
            visitId: input.visitId,
            expectedBillingVersionId: input.expectedBillingVersionId,
            departments: input.departments.map((dept)=>({
                    visitDepartmentId: dept.visitDepartmentId,
                    addedProducts: dept.addedProducts?.map(({ processorId: _, ...rest })=>rest),
                    removedProductIds: dept.removedProductIds,
                    updatedProducts: dept.updatedProducts,
                    billProducts: dept.billProducts,
                    payments: dept.payments,
                    note: dept.note,
                    outstandingType: dept.outstandingType,
                    outstandingReason: dept.outstandingReason
                }))
        };
        try {
            const result = await editBillMutation({
                variables: {
                    input: gqlInput
                }
            });
            const payload = result?.data?.editBillVisit;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message,
                data: payload?.data ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$billing$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitBilling"])(payload.data) : undefined
            };
        } catch (err) {
            console.error("Edit bill error:", err);
            throw err;
        }
    };
    return {
        editBill,
        loading,
        error
    };
}
function useRecordVisitBillingPayment() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RECORD_VISIT_BILLING_PAYMENT_MUTATION"], {
        refetchQueries: billingRefetchQueries,
        awaitRefetchQueries: true
    });
    const recordPayment = async (input)=>{
        try {
            const result = await mutation({
                variables: {
                    input
                }
            });
            const payload = result?.data?.recordVisitBillingPayment;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message,
                data: payload?.data ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$billing$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitBilling"])(payload.data) : undefined
            };
        } catch (err) {
            console.error("Record billing payment error:", err);
            throw err;
        }
    };
    return {
        recordPayment,
        loading,
        error
    };
}
function useGenerateInvoice() {
    const [generateInvoiceMutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GENERATE_INVOICE_MUTATION"]);
    const generateInvoice = async (targetId, options)=>{
        try {
            const isVisitDept = options?.isVisitDepartmentId ?? false;
            const visitDepartmentId = options?.visitDepartmentId ?? (isVisitDept ? targetId : undefined);
            const departmentInsuranceBillingId = options?.departmentInsuranceBillingId ?? (!isVisitDept ? targetId : undefined);
            const copyType = options?.copyType;
            const result = await generateInvoiceMutation({
                variables: {
                    visitDepartmentId,
                    departmentInsuranceBillingId,
                    copyType
                }
            });
            return result?.data?.generateInvoice;
        } catch (err) {
            console.error("Generate invoice error:", err);
            throw err;
        }
    };
    return {
        generateInvoice,
        loading,
        error
    };
}
function useStartBillEditing() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["START_BILL_EDITING_MUTATION"], {
        refetchQueries: billingRefetchQueries,
        awaitRefetchQueries: true
    });
    const startBillEditing = async (visitDepartmentId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitDepartmentId
                }
            });
            const payload = result?.data?.startBillEditing;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message
            };
        } catch (err) {
            console.error("Start bill editing error:", err);
            throw err;
        }
    };
    return {
        startBillEditing,
        loading,
        error
    };
}
function useCompleteBillEditing() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMPLETE_BILL_EDITING_MUTATION"], {
        refetchQueries: billingRefetchQueries,
        awaitRefetchQueries: true
    });
    const completeBillEditing = async (visitDepartmentId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitDepartmentId
                }
            });
            const payload = result?.data?.completeBillEditing;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message
            };
        } catch (err) {
            console.error("Complete bill editing error:", err);
            throw err;
        }
    };
    return {
        completeBillEditing,
        loading,
        error
    };
}
function useCancelBillEditing() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CANCEL_BILL_EDITING_MUTATION"], {
        refetchQueries: billingRefetchQueries,
        awaitRefetchQueries: true
    });
    const cancelBillEditing = async (visitDepartmentId, addedProductIds)=>{
        try {
            const result = await mutation({
                variables: {
                    visitDepartmentId,
                    addedProductIds: addedProductIds || null
                }
            });
            const payload = result?.data?.cancelBillEditing;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message
            };
        } catch (err) {
            console.error("Cancel bill editing error:", err);
            throw err;
        }
    };
    return {
        cancelBillEditing,
        loading,
        error
    };
}
function useQuickBill() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QUICK_BILL_MUTATION"], {
        refetchQueries: billingRefetchQueries,
        awaitRefetchQueries: true
    });
    const quickBill = async (visitId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitId
                }
            });
            const payload = result?.data?.quickBill;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message
            };
        } catch (err) {
            console.error("Quick bill error:", err);
            throw err;
        }
    };
    return {
        quickBill,
        loading,
        error
    };
}
function useConfirmVisitDepartmentProduct() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONFIRM_VISIT_DEPARTMENT_PRODUCT_MUTATION"], {
        refetchQueries: billingRefetchQueries,
        awaitRefetchQueries: true
    });
    const confirmVisitDepartmentProduct = async (visitDepartmentProductId)=>{
        try {
            const result = await mutation({
                variables: {
                    visitDepartmentProductId
                }
            });
            const payload = result?.data?.confirmVisitDepartmentProduct;
            return {
                status: payload?.status || "ERROR",
                message: payload?.message
            };
        } catch (err) {
            console.error("Confirm visit department product error:", err);
            throw err;
        }
    };
    return {
        confirmVisitDepartmentProduct,
        loading,
        error
    };
}
function useVisitDepartmentBilling(visitDepartmentId, options) {
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_VISIT_DEPARTMENT_BILLING_QUERY"], {
        variables: {
            visitDepartmentId
        },
        skip: !visitDepartmentId || Boolean(options?.skip),
        fetchPolicy: "cache-and-network"
    });
    const gqlData = data?.getVisitDepartmentBilling?.data;
    const departmentBilling = gqlData ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$billing$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitDepartmentBilling"])(gqlData) : null;
    return {
        departmentBilling,
        loading,
        error,
        refetch
    };
}
}),
"[project]/hooks/billing/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$billing$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/billing/hooks.ts [app-ssr] (ecmascript)");
;
}),
"[project]/hooks/forms/normalize.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * normalize.ts - Canonical form-normalization functions shared by the forms
 * hooks (hooks/forms/hooks.ts) and the admin forms editor
 * (app/admin/forms/page.tsx). Single source of truth so backend shape changes
 * never drift between the data layer and the editor.
 */ __turbopack_context__.s([
    "normalizeFormAction",
    ()=>normalizeFormAction,
    "normalizeFormField",
    ()=>normalizeFormField,
    "normalizeFormSection",
    ()=>normalizeFormSection,
    "normalizeTableMode",
    ()=>normalizeTableMode,
    "toIntColumns",
    ()=>toIntColumns
]);
const normalizeTableMode = (mode)=>{
    const normalized = String(mode || "").toUpperCase();
    if (normalized === "DYNAMIC" || mode === "variableRows" || mode === "variableColumns") return "DYNAMIC";
    return "STATIC";
};
const toIntColumns = (value)=>{
    if (value === 1 || value === 2 || value === 3 || value === 4) return value;
    return 2;
};
const normalizeFormField = (field, index)=>({
        id: field?.id || `field_${Date.now()}_${index}`,
        label: field?.label || "Untitled",
        type: field?.type || "text",
        placeholder: field?.placeholder || undefined,
        required: Boolean(field?.required),
        hideLabel: Boolean(field?.hideLabel),
        boldLabel: Boolean(field?.boldLabel),
        centerLabel: Boolean(field?.centerLabel),
        italicLabel: Boolean(field?.italicLabel),
        underlineLabel: Boolean(field?.underlineLabel),
        options: Array.isArray(field?.options) ? field.options.filter(Boolean) : undefined,
        tableConfig: field?.tableConfig ? {
            mode: normalizeTableMode(field.tableConfig.mode),
            rows: Number(field.tableConfig.rows) || 3,
            columns: Number(field.tableConfig.columns) || 3,
            headerPlacement: field.tableConfig.headerPlacement || "none",
            columnHeaders: Array.isArray(field.tableConfig.columnHeaders) ? field.tableConfig.columnHeaders : [],
            rowHeaders: Array.isArray(field.tableConfig.rowHeaders) ? field.tableConfig.rowHeaders : []
        } : undefined,
        labRecordConfig: field?.labRecordConfig ? {
            layout: field.labRecordConfig.layout === "result" ? "result" : "valueUnit",
            rows: Array.isArray(field.labRecordConfig.rows) ? field.labRecordConfig.rows.map((row, rowIndex)=>({
                    id: row?.id || `lab_row_${Date.now()}_${rowIndex}`,
                    name: row?.name || `Row ${rowIndex + 1}`,
                    unitMode: row?.unitMode === "none" ? "none" : "dropdown",
                    unitOptions: Array.isArray(row?.unitOptions) ? row.unitOptions.filter(Boolean) : [],
                    defaultUnit: row?.defaultUnit || undefined,
                    resultOptions: Array.isArray(row?.resultOptions) ? row.resultOptions.filter(Boolean) : []
                })) : []
        } : undefined,
        conditionalRendering: field?.conditionalRendering ? {
            dependsOn: field.conditionalRendering.dependsOn,
            condition: field.conditionalRendering.condition,
            value: field.conditionalRendering.value || undefined,
            itemType: field.conditionalRendering.itemType || undefined
        } : undefined,
        order: typeof field?.order === "number" ? field.order : index
    });
const normalizeFormSection = (section, index)=>({
        id: section?.id || `section_${Date.now()}_${index}`,
        title: section?.title || "Untitled Section",
        boldTitle: Boolean(section?.boldTitle),
        italicTitle: Boolean(section?.italicTitle),
        underlineTitle: Boolean(section?.underlineTitle),
        centerTitle: Boolean(section?.centerTitle),
        columns: toIntColumns(Number(section?.columns)),
        order: typeof section?.order === "number" ? section.order : index,
        fields: Array.isArray(section?.fields) ? section.fields.map((field, fieldIndex)=>normalizeFormField(field, fieldIndex)) : []
    });
const normalizeFormAction = (action, index)=>({
        id: action?.id || `action_${Date.now()}_${index}`,
        name: action?.name || "Unnamed item",
        type: action?.type === "consumable" ? "consumable" : "action",
        quantity: Number(action?.quantity) || 1,
        price: Number(action?.price) || 0,
        isQuantifiable: action?.isQuantifiable !== false,
        backendId: action?.backendId ? String(action.backendId) : undefined
    });
}),
"[project]/hooks/forms/hooks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// @ts-nocheck Legacy form hooks — opted out of type-checking; to be re-typed.
__turbopack_context__.s([
    "useCreateForm",
    ()=>useCreateForm,
    "useFinalizeForm",
    ()=>useFinalizeForm,
    "useForm",
    ()=>useForm,
    "useFormVersionHistory",
    ()=>useFormVersionHistory,
    "useForms",
    ()=>useForms,
    "useUpdateForm",
    ()=>useUpdateForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useLazyQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useLazyQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/queries/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$forms$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/forms.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/mutations/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$forms$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/forms.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$forms$2f$normalize$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/forms/normalize.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const mapBackendForm = (form)=>({
        id: String(form?.id || ""),
        departmentId: String(form?.departmentId || ""),
        title: form?.title || "",
        description: form?.description || "",
        status: form?.status === "FINAL" ? "FINAL" : "DRAFT",
        version: String(form?.version || ""),
        fields: Array.isArray(form?.fields) ? form.fields.map((field, idx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$forms$2f$normalize$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeFormField"])(field, idx)) : [],
        sections: Array.isArray(form?.sections) ? form.sections.map((section, idx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$forms$2f$normalize$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeFormSection"])(section, idx)) : [],
        actions: Array.isArray(form?.actions) ? form.actions.map((action, idx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$forms$2f$normalize$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeFormAction"])(action, idx)) : [],
        createdAt: String(form?.createdAt || ""),
        updatedAt: String(form?.updatedAt || "")
    });
function useForms(departmentId) {
    const [loadForms, { loading, error, data }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useLazyQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLazyQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$forms$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_FORMS_QUERY"], {
        fetchPolicy: "network-only"
    });
    const forms = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>{
        const rawData = data?.getForms?.data || [];
        return rawData.map((form)=>mapBackendForm(form));
    }, [
        data
    ]);
    const load = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback((options)=>{
        const { fetchPolicy: _fetchPolicy, ...restOptions } = options || {};
        const nextDepartmentId = options?.variables?.departmentId || departmentId;
        if (!nextDepartmentId) {
            return Promise.resolve(undefined);
        }
        return loadForms({
            ...restOptions,
            variables: {
                ...restOptions.variables || {},
                departmentId: nextDepartmentId
            }
        });
    }, [
        departmentId,
        loadForms
    ]);
    return {
        forms,
        loading,
        error: error?.message || null,
        loadForms: load
    };
}
function useForm(departmentId, formId) {
    const [loadForm, { loading, error, data }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useLazyQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLazyQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$forms$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_FORM_QUERY"], {
        fetchPolicy: "network-only"
    });
    const form = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>{
        const rawData = data?.getForm?.data;
        return rawData ? mapBackendForm(rawData) : null;
    }, [
        data
    ]);
    const load = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback((options)=>{
        const { fetchPolicy: _fetchPolicy, ...restOptions } = options || {};
        const nextDepartmentId = options?.variables?.departmentId || departmentId;
        const nextFormId = options?.variables?.formId || formId;
        if (!nextDepartmentId || !nextFormId) {
            return Promise.resolve(undefined);
        }
        return loadForm({
            ...restOptions,
            variables: {
                ...restOptions.variables || {},
                departmentId: nextDepartmentId,
                formId: nextFormId
            }
        });
    }, [
        departmentId,
        formId,
        loadForm
    ]);
    return {
        form,
        loading,
        error: error?.message || null,
        loadForm: load
    };
}
function useFormVersionHistory(departmentId, formId) {
    const [loadVersionHistory, { loading, error, data }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useLazyQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLazyQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$forms$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_FORM_VERSION_HISTORY_QUERY"], {
        fetchPolicy: "network-only"
    });
    const versions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>{
        const rawData = data?.getFormVersionHistory?.data || [];
        return rawData.map((form)=>mapBackendForm(form));
    }, [
        data
    ]);
    const load = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback((options)=>{
        const { fetchPolicy: _fetchPolicy, ...restOptions } = options || {};
        const nextDepartmentId = options?.variables?.departmentId || departmentId;
        const nextFormId = options?.variables?.formId || formId;
        if (!nextDepartmentId || !nextFormId) {
            return Promise.resolve(undefined);
        }
        return loadVersionHistory({
            ...restOptions,
            variables: {
                ...restOptions.variables || {},
                departmentId: nextDepartmentId,
                formId: nextFormId
            }
        });
    }, [
        departmentId,
        formId,
        loadVersionHistory
    ]);
    return {
        versions,
        loading,
        error: error?.message || null,
        loadVersionHistory: load
    };
}
function useCreateForm() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$forms$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CREATE_FORM_MUTATION"]);
    const createForm = async (departmentId, input)=>{
        try {
            const result = await mutation({
                variables: {
                    departmentId,
                    input: {
                        title: input.title,
                        description: input.description,
                        fields: input.fields?.map((field)=>({
                                id: field.id,
                                label: field.label,
                                type: field.type,
                                placeholder: field.placeholder,
                                required: field.required,
                                order: field.order,
                                hideLabel: field.hideLabel,
                                boldLabel: field.boldLabel,
                                italicLabel: field.italicLabel,
                                underlineLabel: field.underlineLabel,
                                centerLabel: field.centerLabel,
                                options: field.options,
                                tableConfig: field.tableConfig,
                                conditionalRendering: field.conditionalRendering
                            })) || [],
                        sections: input.sections?.map((section)=>({
                                id: section.id,
                                title: section.title,
                                boldTitle: section.boldTitle,
                                italicTitle: section.italicTitle,
                                underlineTitle: section.underlineTitle,
                                centerTitle: section.centerTitle,
                                columns: section.columns,
                                order: section.order,
                                fields: section.fields.map((field)=>({
                                        id: field.id,
                                        label: field.label,
                                        type: field.type,
                                        placeholder: field.placeholder,
                                        required: field.required,
                                        order: field.order,
                                        hideLabel: field.hideLabel,
                                        boldLabel: field.boldLabel,
                                        italicLabel: field.italicLabel,
                                        underlineLabel: field.underlineLabel,
                                        centerLabel: field.centerLabel,
                                        options: field.options,
                                        tableConfig: field.tableConfig,
                                        conditionalRendering: field.conditionalRendering
                                    }))
                            })) || [],
                        actions: input.actions?.map((action)=>({
                                id: action.id,
                                name: action.name,
                                type: action.type,
                                quantity: action.quantity,
                                price: action.price,
                                isQuantifiable: action.isQuantifiable,
                                backendId: action.backendId
                            })) || []
                    }
                }
            });
            const rawData = result.data?.createForm?.data;
            return rawData ? mapBackendForm(rawData) : null;
        } catch (err) {
            console.error("Create form error:", err);
            throw err;
        }
    };
    return {
        createForm,
        loading,
        error: error?.message || null
    };
}
function useUpdateForm() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$forms$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_FORM_MUTATION"]);
    const updateForm = async (departmentId, formId, input)=>{
        try {
            const result = await mutation({
                variables: {
                    departmentId,
                    formId,
                    input: {
                        title: input.title,
                        description: input.description,
                        fields: input.fields?.map((field)=>({
                                id: field.id,
                                label: field.label,
                                type: field.type,
                                placeholder: field.placeholder,
                                required: field.required,
                                order: field.order,
                                hideLabel: field.hideLabel,
                                boldLabel: field.boldLabel,
                                italicLabel: field.italicLabel,
                                underlineLabel: field.underlineLabel,
                                centerLabel: field.centerLabel,
                                options: field.options,
                                tableConfig: field.tableConfig,
                                conditionalRendering: field.conditionalRendering
                            })) || [],
                        sections: input.sections?.map((section)=>({
                                id: section.id,
                                title: section.title,
                                boldTitle: section.boldTitle,
                                italicTitle: section.italicTitle,
                                underlineTitle: section.underlineTitle,
                                centerTitle: section.centerTitle,
                                columns: section.columns,
                                order: section.order,
                                fields: section.fields.map((field)=>({
                                        id: field.id,
                                        label: field.label,
                                        type: field.type,
                                        placeholder: field.placeholder,
                                        required: field.required,
                                        order: field.order,
                                        hideLabel: field.hideLabel,
                                        boldLabel: field.boldLabel,
                                        italicLabel: field.italicLabel,
                                        underlineLabel: field.underlineLabel,
                                        centerLabel: field.centerLabel,
                                        options: field.options,
                                        tableConfig: field.tableConfig,
                                        conditionalRendering: field.conditionalRendering
                                    }))
                            })) || [],
                        actions: input.actions?.map((action)=>({
                                id: action.id,
                                name: action.name,
                                type: action.type,
                                quantity: action.quantity,
                                price: action.price,
                                isQuantifiable: action.isQuantifiable,
                                backendId: action.backendId
                            })) || []
                    }
                }
            });
            const rawData = result.data?.updateForm?.data;
            return rawData ? mapBackendForm(rawData) : null;
        } catch (err) {
            console.error("Update form error:", err);
            throw err;
        }
    };
    return {
        updateForm,
        loading,
        error: error?.message || null
    };
}
function useFinalizeForm() {
    const [mutation, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$forms$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FINALIZE_FORM_MUTATION"]);
    const finalizeForm = async (departmentId, formId)=>{
        try {
            const result = await mutation({
                variables: {
                    departmentId,
                    formId
                }
            });
            const rawData = result.data?.finalizeForm?.data;
            return rawData ? mapBackendForm(rawData) : null;
        } catch (err) {
            console.error("Finalize form error:", err);
            throw err;
        }
    };
    return {
        finalizeForm,
        loading,
        error: error?.message || null
    };
}
}),
"[project]/hooks/forms/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$forms$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/forms/hooks.ts [app-ssr] (ecmascript)");
;
}),
"[project]/hooks/products/hooks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAddProductInsuranceCoverage",
    ()=>useAddProductInsuranceCoverage,
    "useCreateProduct",
    ()=>useCreateProduct,
    "useDeleteProduct",
    ()=>useDeleteProduct,
    "useProductSearch",
    ()=>useProductSearch,
    "useProducts",
    ()=>useProducts,
    "useProductsPaginated",
    ()=>useProductsPaginated,
    "useRemoveProductInsuranceCoverage",
    ()=>useRemoveProductInsuranceCoverage,
    "useUpdateProduct",
    ()=>useUpdateProduct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/queries/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/products.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/mutations/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/products.ts [app-ssr] (ecmascript)");
;
;
;
function useProducts() {
    const { data, loading, error, refetch: refetchQuery } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_PRODUCTS_QUERY"], {
        variables: {
            input: {
                page: 0,
                size: 200
            }
        },
        fetchPolicy: 'cache-and-network'
    });
    const products = data?.products?.data || [];
    const refetch = ()=>refetchQuery({
            input: {
                page: 0,
                size: 200
            }
        });
    return {
        products,
        loading,
        error: error?.message || null,
        refetch
    };
}
function useProductsPaginated(options) {
    const pageSize = options?.size ?? 30;
    const typeFilter = options?.type && options.type !== 'ALL' ? options.type : undefined;
    const searchQuery = options?.name;
    const visitDepartmentId = options?.visitDepartmentId;
    const { data, loading, error, fetchMore, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_PRODUCTS_QUERY"], {
        variables: {
            input: {
                name: searchQuery || undefined,
                type: typeFilter,
                page: 0,
                size: pageSize,
                visitDepartmentId: visitDepartmentId || undefined
            }
        },
        fetchPolicy: 'cache-and-network'
    });
    const products = data?.products?.data || [];
    const pagination = data?.products?.pagination;
    const hasMore = Boolean(pagination && typeof pagination.currentPage === 'number' && typeof pagination.totalPages === 'number' && pagination.currentPage + 1 < pagination.totalPages);
    const loadMore = async ()=>{
        if (!hasMore || !pagination || loading) return false;
        const nextPage = pagination.currentPage + 1;
        await fetchMore({
            variables: {
                input: {
                    name: searchQuery || undefined,
                    type: typeFilter,
                    page: nextPage,
                    size: pageSize,
                    visitDepartmentId: visitDepartmentId || undefined
                }
            },
            updateQuery: (previousResult, { fetchMoreResult })=>{
                if (!fetchMoreResult?.products) return previousResult;
                const previousData = previousResult?.products?.data || [];
                const nextData = fetchMoreResult.products.data || [];
                const merged = [
                    ...previousData
                ];
                for (const item of nextData){
                    if (!merged.some((existing)=>String(existing.id) === String(item.id))) {
                        merged.push(item);
                    }
                }
                return {
                    ...fetchMoreResult,
                    products: {
                        ...fetchMoreResult.products,
                        data: merged
                    }
                };
            }
        });
        return true;
    };
    const refresh = ()=>refetch({
            input: {
                name: searchQuery || undefined,
                type: typeFilter,
                page: 0,
                size: pageSize,
                visitDepartmentId: visitDepartmentId || undefined
            }
        });
    return {
        products,
        loading,
        error: error?.message || null,
        hasMore,
        loadMore,
        refresh,
        pagination
    };
}
function useProductSearch(searchQuery, options) {
    const pageSize = options?.size ?? 20;
    const typeFilter = options?.type && options.type !== 'ALL' ? options.type : undefined;
    const visitDepartmentId = options?.visitDepartmentId;
    const { data, loading, error, fetchMore, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_PRODUCTS_QUERY"], {
        variables: {
            input: {
                name: searchQuery || undefined,
                type: typeFilter,
                page: 0,
                size: pageSize,
                visitDepartmentId: visitDepartmentId || undefined
            }
        },
        fetchPolicy: 'cache-and-network',
        skip: !searchQuery || searchQuery.length < 2
    });
    const products = data?.products?.data || [];
    const pagination = data?.products?.pagination;
    const hasMore = Boolean(pagination && typeof pagination.currentPage === 'number' && typeof pagination.totalPages === 'number' && pagination.currentPage + 1 < pagination.totalPages);
    const loadMore = async ()=>{
        if (!hasMore || !pagination) return false;
        const nextPage = pagination.currentPage + 1;
        await fetchMore({
            variables: {
                input: {
                    name: searchQuery || undefined,
                    type: typeFilter,
                    page: nextPage,
                    size: pageSize,
                    visitDepartmentId: visitDepartmentId || undefined
                }
            },
            updateQuery: (previousResult, { fetchMoreResult })=>{
                if (!fetchMoreResult?.products) return previousResult;
                const previousData = previousResult?.products?.data || [];
                const nextData = fetchMoreResult.products.data || [];
                const merged = [
                    ...previousData
                ];
                for (const item of nextData){
                    if (!merged.some((existing)=>String(existing.id) === String(item.id))) {
                        merged.push(item);
                    }
                }
                return {
                    ...fetchMoreResult,
                    products: {
                        ...fetchMoreResult.products,
                        data: merged
                    }
                };
            }
        });
        return true;
    };
    const refresh = ()=>refetch({
            input: {
                name: searchQuery || undefined,
                type: typeFilter,
                page: 0,
                size: pageSize,
                visitDepartmentId: visitDepartmentId || undefined
            }
        });
    return {
        products,
        loading,
        error: error?.message || null,
        hasMore,
        loadMore,
        refresh,
        pagination
    };
}
function useCreateProduct() {
    const [mutate, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CREATE_PRODUCT_MUTATION"]);
    const createProduct = async (input)=>{
        try {
            const { data } = await mutate({
                variables: {
                    input
                }
            });
            const payload = data?.createProduct;
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message,
                data: payload?.data || undefined
            };
        } catch (err) {
            console.error('Create product error:', err);
            throw err;
        }
    };
    return {
        createProduct,
        loading,
        error: error?.message || null
    };
}
function useUpdateProduct() {
    const [mutate, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPDATE_PRODUCT_MUTATION"]);
    const updateProduct = async (productId, input)=>{
        try {
            const { data } = await mutate({
                variables: {
                    productId,
                    input
                }
            });
            const payload = data?.updateProduct;
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message,
                data: payload?.data || undefined
            };
        } catch (err) {
            console.error('Update product error:', err);
            throw err;
        }
    };
    return {
        updateProduct,
        loading,
        error: error?.message || null
    };
}
function useDeleteProduct() {
    const [mutate, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DELETE_PRODUCT_MUTATION"]);
    const deleteProduct = async (productId)=>{
        try {
            const { data } = await mutate({
                variables: {
                    productId
                }
            });
            const payload = data?.deleteProduct;
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message
            };
        } catch (err) {
            console.error('Delete product error:', err);
            throw err;
        }
    };
    return {
        deleteProduct,
        loading,
        error: error?.message || null
    };
}
function useAddProductInsuranceCoverage() {
    const [mutate, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ADD_PRODUCT_INSURANCE_COVERAGE_MUTATION"]);
    const addCoverage = async (productId, insuranceProviderId, cost)=>{
        try {
            const { data } = await mutate({
                variables: {
                    productId,
                    input: {
                        insuranceProviderId,
                        cost
                    }
                }
            });
            const payload = data?.createProductInsuranceCoverage || data?.addProductInsuranceCoverage;
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message,
                data: payload?.data || undefined
            };
        } catch (err) {
            console.error('Add product coverage error:', err);
            throw err;
        }
    };
    return {
        addCoverage,
        loading,
        error: error?.message || null
    };
}
function useRemoveProductInsuranceCoverage() {
    const [mutate, { loading, error }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REMOVE_PRODUCT_INSURANCE_COVERAGE_MUTATION"]);
    const removeCoverage = async (productInsuranceCoverageId)=>{
        try {
            const { data } = await mutate({
                variables: {
                    productInsuranceCoverageId
                }
            });
            const payload = data?.deleteProductInsuranceCoverage || data?.removeProductInsuranceCoverage;
            return {
                status: payload?.status || 'ERROR',
                message: payload?.message
            };
        } catch (err) {
            console.error('Remove product coverage error:', err);
            throw err;
        }
    };
    return {
        removeCoverage,
        loading,
        error: error?.message || null
    };
}
}),
"[project]/hooks/products/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$products$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/products/hooks.ts [app-ssr] (ecmascript)");
;
}),
"[project]/hooks/queries/workers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SEARCH_WORKERS_QUERY",
    ()=>SEARCH_WORKERS_QUERY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-tag/lib/index.js [app-ssr] (ecmascript)");
;
const SEARCH_WORKERS_QUERY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$tag$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gql"]`
  query SearchWorkers(
    $name: String
    $role: RoleName
    $activeOnly: Boolean
    $departmentId: ID
  ) {
    searchWorkers(
      name: $name
      role: $role
      activeOnly: $activeOnly
      departmentId: $departmentId
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
}),
"[project]/hooks/workers/hooks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSearchWorkers",
    ()=>useSearchWorkers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$workers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/workers.ts [app-ssr] (ecmascript)");
;
;
;
function useSearchWorkers(variables) {
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$workers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SEARCH_WORKERS_QUERY"], {
        variables,
        skip: !variables?.name || String(variables.name).trim().length < 2,
        fetchPolicy: "network-only"
    });
    const workers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const list = data?.searchWorkers?.data;
        return Array.isArray(list) ? list : [];
    }, [
        data
    ]);
    return {
        workers,
        loading,
        error,
        refetch
    };
}
}),
"[project]/hooks/workers/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$workers$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/workers/hooks.ts [app-ssr] (ecmascript)");
;
}),
"[project]/hooks/auth-hooks.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Compatibility layer - re-export everything from the new modular structure
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/auth/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$departments$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/departments/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/visits/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/patients/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/insurances/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$billing$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/billing/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$forms$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/forms/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$products$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/products/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$workers$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/workers/index.ts [app-ssr] (ecmascript) <locals>");
;
;
;
;
;
;
;
;
;
;
}),
"[project]/lib/media-url.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Resolves a stored media URL into a fetchable browser URL.
 *
 * Two storage modes:
 * - **LOCAL** (supabase.storage-type=LOCAL): the backend stores files on disk and
 *   serves them at /api/media/{bucket}/{path}. The upload service returns URLs like
 *   "/api/media/uploads-public/uuid.png", which are served directly by the backend.
 * - **SUPABASE** (supabase.storage-type=SUPABASE): files are uploaded to Supabase
 *   Storage and returned as "/storage/v1/object/public/{bucket}/{path}". The Next.js
 *   proxy rewrites these to /supa/storage/v1/object/public/{bucket}/{path} which
 *   hits the self-hosted Supabase instance.
 */ __turbopack_context__.s([
    "getMediaUrl",
    ()=>getMediaUrl
]);
function getMediaUrl(url) {
    if (!url) return '';
    // file:// URLs are not fetchable in the browser — strip the protocol
    // and treat as a local backend media path to prevent SecurityError.
    if (url.startsWith('file:///')) {
        const localPath = url.replace('file://', '');
        return localPath.startsWith('/') ? `/api/media${localPath}` : `/api/media/${localPath}`;
    }
    // Absolute URLs — pass through as-is
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    // Already a local backend URL — pass through
    if (url.startsWith('/api/media/')) {
        return url;
    }
    // Already a Supabase proxy URL — pass through
    if (url.startsWith('/supa/')) {
        return url;
    }
    // Relative paths that aren't storage-related — pass through (e.g. /dashboard)
    if (url.startsWith('/') && !url.startsWith('/storage/')) {
        return url;
    }
    // Supabase storage URLs: /storage/v1/object/public/{bucket}/{path}
    // Rewrite to /supa/storage/v1/object/public/{bucket}/{path} for the Next.js proxy
    const supabasePrefix = '/storage/v1/object/public/';
    if (url.startsWith(supabasePrefix)) {
        return `/supa/${url.slice(supabasePrefix.length)}`;
    }
    // Signed Supabase URLs: /storage/v1/object/sign/{bucket}/{path}?token=...
    // These are returned by the backend's signedUrl() method
    const signedPrefix = '/storage/v1/object/sign/';
    if (url.startsWith(signedPrefix)) {
        return `/storage/sign/${url.slice(signedPrefix.length)}`;
    }
    // Fallback: treat as relative Supabase path
    return `/supa/${url}`;
}
}),
"[project]/lib/clinic-profile.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CLINIC_PROFILE_STORAGE_KEY",
    ()=>CLINIC_PROFILE_STORAGE_KEY,
    "DEFAULT_CLINIC_LOGO_URL",
    ()=>DEFAULT_CLINIC_LOGO_URL,
    "DEFAULT_CLINIC_NAME",
    ()=>DEFAULT_CLINIC_NAME,
    "getClinicDisplayName",
    ()=>getClinicDisplayName,
    "getClinicLogoUrl",
    ()=>getClinicLogoUrl,
    "getStoredClinicProfile",
    ()=>getStoredClinicProfile,
    "normalizeClinicProfile",
    ()=>normalizeClinicProfile,
    "setStoredClinicProfile",
    ()=>setStoredClinicProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/media-url.ts [app-ssr] (ecmascript)");
;
const DEFAULT_CLINIC_NAME = "med";
const DEFAULT_CLINIC_LOGO_URL = "/FullLogo.png";
const CLINIC_PROFILE_STORAGE_KEY = "clinicProfile";
function normalizeClinicProfile(profile) {
    if (!profile) return null;
    const normalizedName = typeof profile.name === "string" ? profile.name.trim() : "";
    const normalizedUsername = typeof profile.username === "string" ? profile.username.trim() : "";
    const normalizedAddress = typeof profile.address === "string" ? profile.address.trim() : "";
    const normalizedTinNumber = typeof profile.tinNumber === "string" ? profile.tinNumber.trim() : "";
    const normalizedLogoUrl = typeof profile.logoUrl === "string" ? profile.logoUrl.trim() : "";
    return {
        id: String(profile.id || ""),
        name: normalizedName || undefined,
        username: normalizedUsername || undefined,
        address: normalizedAddress || undefined,
        contacts: profile.contacts ?? [],
        tinNumber: normalizedTinNumber || undefined,
        logoUrl: normalizedLogoUrl || undefined,
        metadata: profile.metadata ?? undefined,
        createdAt: profile.createdAt || "",
        updatedAt: profile.updatedAt || ""
    };
}
function getStoredClinicProfile() {
    if ("TURBOPACK compile-time truthy", 1) {
        return null;
    }
    //TURBOPACK unreachable
    ;
    const storedClinicProfile = undefined;
}
function setStoredClinicProfile(profile) {
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
}
function getClinicDisplayName(profile) {
    return profile?.username?.trim() || profile?.name?.trim() || DEFAULT_CLINIC_NAME;
}
function getClinicLogoUrl(profile) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMediaUrl"])(profile?.logoUrl?.trim()) || DEFAULT_CLINIC_LOGO_URL;
}
}),
"[project]/lib/runtime-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRuntimeConfig",
    ()=>getRuntimeConfig
]);
function getRuntimeConfig() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return {
        API_BASE_URL: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || ''
    };
}
}),
"[project]/lib/apollo-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getApolloClient",
    ()=>getApolloClient,
    "pruneApolloCache",
    ()=>pruneApolloCache,
    "resetApolloCache",
    ()=>resetApolloCache
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$core$2f$ApolloClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/core/ApolloClient.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$cache$2f$inmemory$2f$inMemoryCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/cache/inmemory/inMemoryCache.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$http$2f$HttpLink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/link/http/HttpLink.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$core$2f$ApolloLink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/link/core/ApolloLink.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$error$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/link/error/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$response$2d$handler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/response-handler.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$runtime$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/runtime-config.ts [app-ssr] (ecmascript)");
;
;
;
;
function getUri() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$runtime$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRuntimeConfig"])().API_BASE_URL || '';
    return `${base}/graphql`;
}
function createHttpLink() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$http$2f$HttpLink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HttpLink"]({
        uri: getUri(),
        fetch
    });
}
const notifyUnauthorized = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
};
const handleResetPassword = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
};
const extractStatusFromPayload = (payload)=>{
    if (!payload || typeof payload !== 'object') {
        return undefined;
    }
    const maybeStatus = payload.status;
    return typeof maybeStatus === 'string' ? maybeStatus : undefined;
};
const statusLink = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$core$2f$ApolloLink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApolloLink"]((operation, forward)=>{
    return forward(operation).map((result)=>{
        const data = result?.data;
        if (!data || typeof data !== 'object') {
            return result;
        }
        // Most operations return one top-level field e.g. { listUsers: { status, ... } }
        const topLevelResults = Object.values(data);
        const statuses = topLevelResults.map(extractStatusFromPayload).filter((status)=>Boolean(status));
        if (statuses.includes('UNAUTHENTICATED')) {
            // Only treat as session expiry if the user had a token (i.e. was logged in).
            // If there is no token, the query fired before auth resolved — ignore it.
            const hasToken = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && Boolean(localStorage.getItem('authToken'));
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return result;
        }
        if (statuses.includes('UNAUTHORISED') || statuses.includes('UNAUTHORIZED')) {
            notifyUnauthorized();
        }
        if (statuses.includes('RESET_PASSWORD')) {
            handleResetPassword();
        }
        return result;
    });
});
const authMiddleware = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$core$2f$ApolloLink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApolloLink"]((operation, forward)=>{
    // Get the authentication token from local storage if it exists
    const token = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
    // Never send a token for auth operations — a stale/expired token in
    // localStorage would cause the backend to reject with 401 before the
    // mutation can execute (login, register, refresh, logout).
    const opName = operation.operationName || '';
    const isAuthOp = /^Login$|^Register$|^RefreshToken$|^Logout$/i.test(opName);
    const shouldAttach = token && !isAuthOp;
    // Add the authorization header to the request
    // Only set the header when a token exists — sending an empty string
    // causes some backends to treat the request as unauthenticated even
    // though the header is technically present.
    operation.setContext(({ headers = {} })=>({
            headers: {
                ...headers,
                ...("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : {}
            }
        }));
    return forward(operation);
});
const errorLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$error$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onError"])(({ graphQLErrors, networkError })=>{
    // Handle network errors (CORS, server down, offline, etc.)
    if (networkError) {
        const ne = networkError;
        const message = ne?.message || '';
        // Dispatch network error event for UI to listen
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Check auth-related network errors
        const unauthenticatedFromNetworkError = (()=>{
            const status = ne?.statusCode ?? ne?.status;
            return status === 401;
        })();
        const unauthorizedFromNetworkError = (()=>{
            const status = ne?.statusCode ?? ne?.status;
            return status === 403;
        })();
        if (unauthenticatedFromNetworkError) {
            const hasToken = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && Boolean(localStorage.getItem('authToken'));
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return;
        }
        if (unauthorizedFromNetworkError) {
            notifyUnauthorized();
            return;
        }
        // For CORS/connection errors, don't spam toasts - let the NetworkStatusIndicator handle it
        return;
    }
    // Handle GraphQL errors
    const hasUnauthenticatedGraphQLError = Array.isArray(graphQLErrors) && graphQLErrors.some((err)=>{
        const message = (err?.message || '').toLowerCase();
        const code = err?.extensions?.code;
        return code === 'UNAUTHENTICATED' || message.includes('unauthenticated');
    });
    const hasUnauthorizedGraphQLError = Array.isArray(graphQLErrors) && graphQLErrors.some((err)=>{
        const message = (err?.message || '').toLowerCase();
        const code = err?.extensions?.code;
        return code === 'UNAUTHORIZED' || code === 'UNAUTHORISED' || message.includes('unauthorized') || message.includes('unauthorised');
    });
    if (hasUnauthenticatedGraphQLError) {
        const hasToken = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && Boolean(localStorage.getItem('authToken'));
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return;
    }
    if (hasUnauthorizedGraphQLError) {
        notifyUnauthorized();
    }
});
let client = null;
function getApolloClient() {
    if (!client) {
        client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$core$2f$ApolloClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ApolloClient"]({
            link: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$core$2f$ApolloLink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApolloLink"].from([
                errorLink,
                authMiddleware,
                statusLink,
                createHttpLink()
            ]),
            cache: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$cache$2f$inmemory$2f$inMemoryCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InMemoryCache"]({
                typePolicies: {
                    Query: {
                        fields: {
                            // Merge paginated lists and list queries so refetches update the cache properly
                            visitBillings: {
                                keyArgs: [
                                    "visitId"
                                ],
                                merge (_existing, incoming) {
                                    return incoming;
                                }
                            },
                            // Single-object queries: always replace with latest
                            visitBilling: {
                                keyArgs: [
                                    "visitId"
                                ],
                                merge (_existing, incoming) {
                                    return incoming;
                                }
                            },
                            visit: {
                                keyArgs: [
                                    "id"
                                ],
                                merge (_existing, incoming) {
                                    return incoming;
                                }
                            },
                            visits: {
                                keyArgs: [
                                    "input"
                                ],
                                merge (_existing, incoming) {
                                    return incoming;
                                }
                            },
                            products: {
                                keyArgs: [
                                    "input"
                                ],
                                merge (_existing, incoming) {
                                    return incoming;
                                }
                            },
                            product: {
                                keyArgs: [
                                    "id"
                                ],
                                merge (_existing, incoming) {
                                    return incoming;
                                }
                            },
                            patients: {
                                keyArgs: [
                                    "input"
                                ],
                                merge (_existing, incoming) {
                                    return incoming;
                                }
                            },
                            patient: {
                                keyArgs: [
                                    "id"
                                ],
                                merge (_existing, incoming) {
                                    return incoming;
                                }
                            },
                            workers: {
                                keyArgs: [
                                    "input"
                                ],
                                merge (_existing, incoming) {
                                    return incoming;
                                }
                            },
                            departments: {
                                keyArgs: false,
                                merge (_existing, incoming) {
                                    return incoming;
                                }
                            },
                            insurances: {
                                keyArgs: [
                                    "input"
                                ],
                                merge (_existing, incoming) {
                                    return incoming;
                                }
                            }
                        }
                    },
                    // Use the natural 'id' field for cache normalization
                    VisitBilling: {
                        keyFields: [
                            "id"
                        ]
                    },
                    VisitDepartmentBilling: {
                        keyFields: [
                            "id"
                        ]
                    },
                    DepartmentInsuranceBilling: {
                        keyFields: [
                            "id"
                        ]
                    },
                    VisitBillingItem: {
                        keyFields: [
                            "id"
                        ]
                    },
                    Visit: {
                        keyFields: [
                            "id"
                        ]
                    },
                    Patient: {
                        keyFields: [
                            "id"
                        ]
                    },
                    PatientInsurance: {
                        keyFields: [
                            "id"
                        ]
                    },
                    Product: {
                        keyFields: [
                            "id"
                        ]
                    },
                    Worker: {
                        keyFields: [
                            "id"
                        ]
                    },
                    Department: {
                        keyFields: [
                            "id"
                        ]
                    }
                }
            })
        });
    }
    return client;
}
function pruneApolloCache() {
    if (client) {
        try {
            client.cache.gc();
        } catch  {
        // noop
        }
    }
}
async function resetApolloCache() {
    if (client) {
        try {
            await client.clearStore();
        } catch  {
            try {
                client.cache.reset();
            } catch  {
            // noop
            }
        }
    }
}
}),
"[project]/lib/response-handler.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility functions for handling API responses from mutations and queries
 * Ensures consistent handling of status, messages, and errors across the application
 */ __turbopack_context__.s([
    "executeWithHandler",
    ()=>executeWithHandler,
    "extractMessage",
    ()=>extractMessage,
    "getStatusToastMessage",
    ()=>getStatusToastMessage,
    "getUserFriendlyError",
    ()=>getUserFriendlyError,
    "handleResponse",
    ()=>handleResponse,
    "handleUnauthenticatedSession",
    ()=>handleUnauthenticatedSession,
    "toastResponseStatus",
    ()=>toastResponseStatus,
    "withToastHandler",
    ()=>withToastHandler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apollo$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/apollo-client.ts [app-ssr] (ecmascript)");
;
;
const TOAST_STYLES = {
    SUCCESS: {
        background: '#16a34a',
        color: '#ffffff'
    },
    ERROR: {
        background: '#dc2626',
        color: '#ffffff'
    },
    UNAUTHORISED: {
        background: '#f59e0b',
        color: '#111827'
    },
    UNAUTHORIZED: {
        background: '#f59e0b',
        color: '#111827'
    },
    UNAUTHENTICATED: {
        background: '#7c3aed',
        color: '#ffffff'
    },
    PARTIAL_SUCCESS: {
        background: '#2563eb',
        color: '#ffffff'
    }
};
function getStatusToastMessage(status, message) {
    switch(status){
        case 'UNAUTHENTICATED':
            return message || 'Your session has expired. Please login again.';
        case 'UNAUTHORISED':
        case 'UNAUTHORIZED':
            return message || 'You do not have permission to perform this action.';
        case 'PARTIAL_SUCCESS':
            return message || 'Operation completed with some issues.';
        case 'ERROR':
            return message || 'An error occurred. Please try again.';
        case 'SUCCESS':
            return message || 'Operation completed successfully.';
        default:
            return message || 'Operation failed. Please try again.';
    }
}
function toastResponseStatus(status, message) {
    const resolvedMessage = getStatusToastMessage(status, message);
    const toastOptions = {
        style: TOAST_STYLES[status || 'ERROR'] || TOAST_STYLES.ERROR
    };
    switch(status){
        case 'SUCCESS':
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(resolvedMessage, toastOptions);
            return;
        case 'UNAUTHENTICATED':
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info(resolvedMessage, toastOptions);
            return;
        case 'UNAUTHORISED':
        case 'UNAUTHORIZED':
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].warn(resolvedMessage, toastOptions);
            return;
        case 'PARTIAL_SUCCESS':
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].warn(resolvedMessage, toastOptions);
            return;
        case 'ERROR':
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(resolvedMessage, toastOptions);
            return;
        default:
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(resolvedMessage, toastOptions);
    }
}
function handleUnauthenticatedSession(message) {
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
}
function extractMessage(response, fallback = '') {
    if (!response) return fallback;
    // Check for direct message
    if (response.message && typeof response.message === 'string') {
        return response.message;
    }
    // Check for messages array
    if (Array.isArray(response.messages) && response.messages.length > 0) {
        return response.messages[0].text || fallback;
    }
    // Check for nested message in data
    if (response.data?.message && typeof response.data.message === 'string') {
        return response.data.message;
    }
    return fallback;
}
async function handleResponse(response, options = {}) {
    const { successMessage = true, errorMessage = true, onSuccess, onError, showDetailedError = true } = options;
    const isSuccess = response?.status === 'SUCCESS';
    if (isSuccess) {
        if (successMessage !== false) {
            const message = typeof successMessage === 'string' ? successMessage : extractMessage(response, 'Operation completed successfully');
            toastResponseStatus('SUCCESS', message);
        }
        if (onSuccess) {
            await onSuccess(response?.data);
        }
        return true;
    } else {
        if (errorMessage !== false) {
            const status = response?.status;
            const message = typeof errorMessage === 'string' ? errorMessage : showDetailedError ? extractMessage(response, 'Operation failed') : 'Operation failed';
            if (status === 'UNAUTHENTICATED') {
                handleUnauthenticatedSession(message);
            } else {
                toastResponseStatus(status, message);
            }
        }
        if (onError) {
            await onError(extractMessage(response, 'Operation failed'), response?.data);
        }
        return false;
    }
}
async function executeWithHandler(promise, options = {}) {
    try {
        const response = await promise;
        const success = await handleResponse(response, options);
        return success ? response?.data : null;
    } catch (error) {
        const errorMessage = typeof options.errorMessage === 'string' ? options.errorMessage : error?.message || 'An unexpected error occurred';
        if (options.errorMessage !== false) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(errorMessage);
        }
        if (options.onError) {
            await options.onError(errorMessage);
        }
        return null;
    }
}
function withToastHandler(fn, options = {}) {
    return async (...args)=>{
        try {
            const response = await fn(...args);
            await handleResponse(response, options);
        } catch (error) {
            if (options.errorMessage !== false) {
                const message = typeof options.errorMessage === 'string' ? options.errorMessage : error?.message || 'An unexpected error occurred';
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(message);
            }
            if (options.onError) {
                await options.onError(error?.message || 'An unexpected error occurred');
            }
        }
    };
}
function getUserFriendlyError(status, message) {
    return getStatusToastMessage(status, message);
}
}),
"[project]/lib/auth-session-manager.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACTIVITY_THROTTLE_MS",
    ()=>ACTIVITY_THROTTLE_MS,
    "CHECK_INTERVAL_MS",
    ()=>CHECK_INTERVAL_MS,
    "MAX_INACTIVITY_MS",
    ()=>MAX_INACTIVITY_MS,
    "STORAGE_KEY_AUTH_TOKEN",
    ()=>STORAGE_KEY_AUTH_TOKEN,
    "STORAGE_KEY_DOCTOR",
    ()=>STORAGE_KEY_DOCTOR,
    "STORAGE_KEY_LAST_ACTIVITY",
    ()=>STORAGE_KEY_LAST_ACTIVITY,
    "STORAGE_KEY_REFRESH_TOKEN",
    ()=>STORAGE_KEY_REFRESH_TOKEN,
    "TOKEN_REFRESH_THRESHOLD_MS",
    ()=>TOKEN_REFRESH_THRESHOLD_MS,
    "checkSessionAndRefreshToken",
    ()=>checkSessionAndRefreshToken,
    "executeSilentTokenRefresh",
    ()=>executeSilentTokenRefresh,
    "getLastActivityTimestamp",
    ()=>getLastActivityTimestamp,
    "initAuthSessionManager",
    ()=>initAuthSessionManager,
    "isUserInactiveFor",
    ()=>isUserInactiveFor,
    "parseJwtExp",
    ()=>parseJwtExp,
    "recordUserActivity",
    ()=>recordUserActivity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$response$2d$handler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/response-handler.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apollo$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/apollo-client.ts [app-ssr] (ecmascript)");
"use client";
;
;
const MAX_INACTIVITY_MS = 2 * 60 * 60 * 1000 // 2 hours (120 minutes)
;
const TOKEN_REFRESH_THRESHOLD_MS = 20 * 60 * 1000 // Refresh when <= 20 minutes left
;
const ACTIVITY_THROTTLE_MS = 30 * 1000 // Throttle storage writes to once per 30 seconds
;
const CHECK_INTERVAL_MS = 30 * 1000 // Check session state every 30 seconds
;
const STORAGE_KEY_LAST_ACTIVITY = "auth_last_activity";
const STORAGE_KEY_AUTH_TOKEN = "authToken";
const STORAGE_KEY_REFRESH_TOKEN = "refreshToken";
const STORAGE_KEY_DOCTOR = "doctor";
let isRefreshing = false;
let lastActivityLocal = Date.now();
let lastRecordedWrite = 0;
function parseJwtExp(token) {
    if (!token || typeof token !== "string") return null;
    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(atob(base64).split("").map((c)=>"%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
        const parsed = JSON.parse(jsonPayload);
        if (typeof parsed.exp === "number") {
            return parsed.exp * 1000;
        }
        return null;
    } catch  {
        return null;
    }
}
function getLastActivityTimestamp() {
    if ("TURBOPACK compile-time truthy", 1) return Date.now();
    //TURBOPACK unreachable
    ;
}
function recordUserActivity(force = false) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const now = undefined;
}
function isUserInactiveFor(durationMs = MAX_INACTIVITY_MS) {
    const lastActivity = getLastActivityTimestamp();
    return Date.now() - lastActivity >= durationMs;
}
async function executeSilentTokenRefresh() {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
    const refreshToken = undefined;
    const query = undefined;
}
function checkSessionAndRefreshToken() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const token = undefined;
    const now = undefined;
    const lastActivity = undefined;
    const inactiveMs = undefined;
    // Rule 2: User is active. Check token expiration.
    const expMs = undefined;
    const timeRemainingMs = undefined;
}
function initAuthSessionManager() {
    if ("TURBOPACK compile-time truthy", 1) return ()=>{};
    //TURBOPACK unreachable
    ;
    const handleActivity = undefined;
    const activityEvents = undefined;
    // Periodic heartbeat timer
    const intervalId = undefined;
    // Listen to visibility change: when tab becomes visible after sleep, check immediately
    const handleVisibilityChange = undefined;
}
}),
"[project]/lib/auth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2d$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/auth-hooks.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/auth/hooks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clinic$2d$profile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/clinic-profile.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$session$2d$manager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-session-manager.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apollo$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/apollo-client.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function getStoredDoctor() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const token = undefined;
    const storedWorker = undefined;
}
function AuthProvider({ children }) {
    const [doctor, setDoctor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [clinicProfile, setClinicProfileState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const { login: loginMutation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLogin"])();
    const { register: registerMutation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRegister"])();
    /* ------------------------------------------------------------------- */ /* Restore state from localStorage on mount                            */ /* ------------------------------------------------------------------- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setDoctor(getStoredDoctor());
        setClinicProfileState((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clinic$2d$profile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoredClinicProfile"])());
        setIsLoading(false);
    }, []);
    /* ------------------------------------------------------------------- */ /* Auth helpers                                                         */ /* ------------------------------------------------------------------- */ const login = async (email, password)=>{
        try {
            const response = await loginMutation(email, password);
            if (response.status === "SUCCESS" && response.data) {
                const { token, user } = response.data;
                if (!token || !user) {
                    return {
                        success: false,
                        message: response.message || "Login failed"
                    };
                }
                // Persist tokens & user
                localStorage.removeItem("pendingResetIdentifier");
                localStorage.setItem("authToken", token);
                if (response.data.refreshToken) {
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                }
                localStorage.setItem("doctor", JSON.stringify(user));
                // Store clinic profile if it came back in the login payload
                const clinicProfileFromLogin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clinic$2d$profile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeClinicProfile"])(response.data.clinicProfile);
                if (clinicProfileFromLogin) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clinic$2d$profile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setStoredClinicProfile"])(clinicProfileFromLogin);
                    setClinicProfileState(clinicProfileFromLogin);
                }
                setDoctor(user);
                return {
                    success: true
                };
            } else if (response.status === "PARTIAL_SUCCESS" || response.status === "RESET_PASSWORD" || response.data?.needsPasswordSetup) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("doctor");
                localStorage.setItem("pendingResetIdentifier", email);
                setDoctor(null);
                return {
                    success: false,
                    message: response.messages?.[0]?.text ?? response.message ?? "Password reset required. Complete password setup to continue.",
                    requiresPasswordSetup: true
                };
            }
            // Generic error
            return {
                success: false,
                message: response.message || "Login failed"
            };
        } catch  {
            return {
                success: false,
                message: "Network error occurred"
            };
        }
    };
    const register = async (name, email, password, phoneNumber, gender, title)=>{
        try {
            const response = await registerMutation(name, email, password, phoneNumber, gender, title);
            if (response.status === "SUCCESS") {
                return {
                    success: true,
                    message: "Registration successful! Please contact admin to activate your account."
                };
            }
            return {
                success: false,
                message: response.message || "Registration failed"
            };
        } catch  {
            return {
                success: false,
                message: "Network error occurred"
            };
        }
    };
    const logout = ()=>{
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("doctor");
        localStorage.removeItem("dashboard_viewMode");
        localStorage.removeItem("dashboard_showMetrics");
        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apollo$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resetApolloCache"])();
        setDoctor(null);
    };
    /* ------------------------------------------------------------------- */ /* Stable setter for clinicProfile (prevents infinite loop)           */ /* ------------------------------------------------------------------- */ const setClinicProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((nextClinicProfile)=>{
        const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clinic$2d$profile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeClinicProfile"])(nextClinicProfile);
        setClinicProfileState(normalized);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clinic$2d$profile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setStoredClinicProfile"])(normalized);
    }, [] // stable – no internal deps
    );
    /* ------------------------------------------------------------------- */ /* Listen for global logout / user‑update events & session manager     */ /* ------------------------------------------------------------------- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleExternalLogout = ()=>logout();
        const handleExternalProfileUpdate = ()=>setDoctor(getStoredDoctor());
        const handleTokenRefreshed = (e)=>{
            const customEvent = e;
            if (customEvent?.detail?.user) {
                setDoctor(customEvent.detail.user);
            } else {
                setDoctor(getStoredDoctor());
            }
        };
        // Initialize session activity monitoring and automatic silent refresh
        const cleanupSessionManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$session$2d$manager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initAuthSessionManager"])();
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return ()=>{
            cleanupSessionManager();
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            doctor,
            clinicProfile,
            isAuthenticated: !!doctor,
            isLoading,
            login,
            register,
            logout,
            setClinicProfile
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth-context.tsx",
        lineNumber: 224,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (ctx === undefined) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
}),
"[project]/components/apollo-wrapper.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApolloWrapper",
    ()=>ApolloWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$context$2f$ApolloProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/context/ApolloProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apollo$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/apollo-client.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function ApolloWrapper({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$context$2f$ApolloProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApolloProvider"], {
        client: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apollo$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApolloClient"])(),
        children: children
    }, void 0, false, {
        fileName: "[project]/components/apollo-wrapper.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, this);
}
}),
"[project]/lib/role-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ADMIN_ROLE",
    ()=>ADMIN_ROLE,
    "MANAGER_ROLE",
    ()=>MANAGER_ROLE,
    "canAccessBilling",
    ()=>canAccessBilling,
    "canManageAdminUsers",
    ()=>canManageAdminUsers,
    "canManagerAccessAdminPath",
    ()=>canManagerAccessAdminPath,
    "getPostLoginPath",
    ()=>getPostLoginPath,
    "hasAdminAccess",
    ()=>hasAdminAccess,
    "hasRole",
    ()=>hasRole,
    "isManagerOnly",
    ()=>isManagerOnly,
    "isManagerWithoutAdmin",
    ()=>isManagerWithoutAdmin
]);
const ADMIN_ROLE = "ADMIN";
const MANAGER_ROLE = "MANAGER";
const ROLE_ALIASES = {
    ADMIN: [
        "ADMIN",
        "CLINIC_ADMIN"
    ],
    CLINIC_ADMIN: [
        "CLINIC_ADMIN",
        "ADMIN"
    ],
    RECEPTIONIST: [
        "RECEPTIONIST",
        "RECEPTION"
    ],
    RECEPTION: [
        "RECEPTION",
        "RECEPTIONIST"
    ],
    DOCTOR: [
        "DOCTOR",
        "CLINICIAN"
    ],
    CLINICIAN: [
        "CLINICIAN",
        "DOCTOR"
    ],
    OPHTHALMOLOGIST: [
        "OPHTHALMOLOGIST",
        "CLINICIAN"
    ],
    SPECIALIST: [
        "SPECIALIST",
        "CLINICIAN"
    ]
};
const normalizeRole = (role)=>role.trim().toUpperCase();
const hasRole = (roles, role)=>{
    const normalizedRole = normalizeRole(role);
    const equivalentRoles = ROLE_ALIASES[normalizedRole] || [
        normalizedRole
    ];
    const normalizedUserRoles = roles.map(normalizeRole);
    return normalizedUserRoles.some((userRole)=>equivalentRoles.includes(userRole));
};
const hasAdminAccess = (roles)=>hasRole(roles, ADMIN_ROLE);
const isManagerOnly = (roles)=>hasRole(roles, MANAGER_ROLE) && roles.length === 1;
const isManagerWithoutAdmin = (roles)=>hasRole(roles, MANAGER_ROLE) && !hasRole(roles, ADMIN_ROLE);
const canManageAdminUsers = (roles)=>hasRole(roles, ADMIN_ROLE);
const canManagerAccessAdminPath = (_pathname)=>false;
const getPostLoginPath = (roles)=>"/";
const canAccessBilling = (roles)=>{
    // Only users with FINANCE or CASHIER roles can access billing
    return hasRole(roles, "FINANCE") || hasRole(roles, "CASHIER");
};
}),
"[project]/components/auth-gate.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthGate",
    ()=>AuthGate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$role$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/role-utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const publicRoutes = new Set([
    "/auth",
    "/create-password"
]);
function AuthGate({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isAuthenticated, isLoading, doctor } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const isPublicRoute = pathname ? publicRoutes.has(pathname) : false;
    const roles = doctor?.roles || [];
    const isAdminRoute = pathname?.startsWith("/admin") || false;
    const canAccessAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$role$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasAdminAccess"])(roles);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isLoading) {
            return;
        }
        if (!isPublicRoute && !isAuthenticated) {
            router.replace("/auth");
            return;
        }
        // Admin paths are restricted to ADMIN role only
        if (isAuthenticated && isAdminRoute && !canAccessAdmin) {
            router.replace("/");
            return;
        }
        if ((pathname === "/auth" || pathname === "/create-password") && isAuthenticated) {
            router.replace((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$role$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPostLoginPath"])(roles));
        }
    }, [
        canAccessAdmin,
        isAdminRoute,
        isAuthenticated,
        isLoading,
        isPublicRoute,
        pathname,
        roles,
        router
    ]);
    if (isPublicRoute) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    if (isLoading || !isAuthenticated) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[project]/lib/theme-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const systemThemeQuery = "(prefers-color-scheme: dark)";
function getSystemTheme() {
    if ("TURBOPACK compile-time truthy", 1) {
        return "light";
    }
    //TURBOPACK unreachable
    ;
}
function ThemeProvider({ children }) {
    const [preference, setPreference] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("system");
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("light");
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
        const savedPreference = localStorage.getItem("theme");
        if (savedPreference === "light" || savedPreference === "dark" || savedPreference === "system") {
            setPreference(savedPreference);
            return;
        }
        setPreference("system");
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!mounted) return;
        if (preference === "system") {
            const mediaQuery = window.matchMedia(systemThemeQuery);
            const applySystemTheme = ()=>{
                setTheme(mediaQuery.matches ? "dark" : "light");
            };
            applySystemTheme();
            mediaQuery.addEventListener("change", applySystemTheme);
            return ()=>{
                mediaQuery.removeEventListener("change", applySystemTheme);
            };
        }
        setTheme(preference);
    }, [
        mounted,
        preference
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!mounted) return;
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        root.style.colorScheme = theme;
    }, [
        theme,
        mounted
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!mounted) return;
        localStorage.setItem("theme", preference);
    }, [
        mounted,
        preference
    ]);
    const toggleTheme = ()=>{
        setPreference((prev)=>{
            const resolvedTheme = prev === "system" ? getSystemTheme() : prev;
            return resolvedTheme === "dark" ? "light" : "dark";
        });
    };
    if (!mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    const setThemePreference = (pref)=>{
        setPreference(pref);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            theme,
            preference,
            toggleTheme,
            setThemePreference,
            setPreference
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/theme-context.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
function useTheme() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (!context) {
        // Return default theme context if not wrapped in provider
        return {
            theme: "light",
            preference: "system",
            toggleTheme: ()=>{},
            setThemePreference: ()=>{},
            setPreference: ()=>{}
        };
    }
    return context;
}
}),
"[project]/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatDate",
    ()=>formatDate,
    "formatDateOnly",
    ()=>formatDateOnly,
    "formatRWF",
    ()=>formatRWF
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(d);
}
function formatDateOnly(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(d);
}
function formatRWF(amount) {
    const value = Number(amount) || 0;
    return `${new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2
    }).format(value)} RWF`;
}
}),
"[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function Dialog({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "dialog",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
function DialogTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "dialog-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 16,
        columnNumber: 10
    }, this);
}
function DialogPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"], {
        "data-slot": "dialog-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, this);
}
function DialogClose({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"], {
        "data-slot": "dialog-close",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 28,
        columnNumber: 10
    }, this);
}
function DialogOverlay({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Overlay"], {
        "data-slot": "dialog-overlay",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('fixed inset-0 z-[100] bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function DialogContent({ className, children, showCloseButton = true, overlayClassName, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        "data-slot": "dialog-portal",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Overlay"], {
                "data-slot": "dialog-overlay",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('fixed inset-0 z-[100] bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', overlayClassName)
            }, void 0, false, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
                "data-slot": "dialog-content",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('fixed top-[50%] left-[50%] z-[100] grid w-full max-w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg bg-background', className),
                ...props,
                children: [
                    children,
                    showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"], {
                        "data-slot": "dialog-close",
                        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {}, void 0, false, {
                                fileName: "[project]/components/ui/dialog.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/dialog.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/dialog.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
function DialogHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-2 text-center sm:text-left', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
function DialogFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
function DialogTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
        "data-slot": "dialog-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-lg leading-none font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 114,
        columnNumber: 5
    }, this);
}
function DialogDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"], {
        "data-slot": "dialog-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-10 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-11 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-10',
            'icon-sm': 'size-9',
            'icon-lg': 'size-11'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/lib/invoice-viewer.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "closeInvoiceViewer",
    ()=>closeInvoiceViewer,
    "openInvoiceViewer",
    ()=>openInvoiceViewer,
    "subscribeInvoiceViewer",
    ()=>subscribeInvoiceViewer
]);
let state = {
    open: false
};
const listeners = new Set();
function emit() {
    for (const listener of listeners)listener(state);
}
function openInvoiceViewer(url, fileName) {
    state = {
        open: true,
        url,
        fileName
    };
    emit();
}
function closeInvoiceViewer() {
    state = {
        open: false
    };
    emit();
}
function subscribeInvoiceViewer(listener) {
    listeners.add(listener);
    listener(state);
    return ()=>{
        listeners.delete(listener);
    };
}
}),
"[project]/components/ui/invoice-viewer-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InvoiceViewerDialog",
    ()=>InvoiceViewerDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-ssr] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoice$2d$viewer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/invoice-viewer.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function InvoiceViewerDialog() {
    const [viewer, setViewer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        open: false
    });
    const [objectUrl, setObjectUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const iframeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const blobUrlRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoice$2d$viewer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["subscribeInvoiceViewer"])(setViewer), []);
    const url = viewer.url;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!viewer.open || !url) {
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
            }
            setObjectUrl(null);
            setLoading(false);
            setError(null);
            return;
        }
        let cancelled = false;
        const load = async ()=>{
            if (url.startsWith("data:") || url.startsWith("blob:")) {
                setObjectUrl(url);
                setLoading(false);
                setError(null);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`Failed to load the invoice (HTTP ${res.status}).`);
                }
                const blob = await res.blob();
                if (cancelled) return;
                if (blobUrlRef.current) {
                    URL.revokeObjectURL(blobUrlRef.current);
                }
                const createdUrl = URL.createObjectURL(blob);
                blobUrlRef.current = createdUrl;
                setObjectUrl(createdUrl);
                setLoading(false);
            } catch (err) {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : "Failed to load the invoice.");
                setLoading(false);
            }
        };
        void load();
        return ()=>{
            cancelled = true;
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
            }
        };
    }, [
        viewer.open,
        url
    ]);
    const handleClose = ()=>{
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
        setObjectUrl(null);
        setLoading(false);
        setError(null);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoice$2d$viewer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["closeInvoiceViewer"])();
    };
    const handlePrint = ()=>{
        const frame = iframeRef.current;
        if (frame?.contentWindow) {
            frame.contentWindow.focus();
            frame.contentWindow.print();
        }
    };
    const handleDownload = ()=>{
        if (!objectUrl) return;
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = viewer.fileName || "invoice.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
        open: viewer.open,
        onOpenChange: (open)=>{
            if (!open) handleClose();
        },
        modal: false,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "sm:max-w-4xl z-[100]",
            overlayClassName: "z-[100] pointer-events-none",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: "Invoice"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
                            lineNumber: 141,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: viewer.fileName || "Billing invoice"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-[70vh] overflow-hidden rounded-md border border-border bg-muted/30",
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-full items-center justify-center gap-2 text-sm text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "h-4 w-4 animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
                                lineNumber: 150,
                                columnNumber: 15
                            }, this),
                            "Loading invoice…"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
                        lineNumber: 149,
                        columnNumber: 13
                    }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-full items-center justify-center gap-2 text-sm text-destructive",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
                                lineNumber: 155,
                                columnNumber: 15
                            }, this),
                            error
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
                        lineNumber: 154,
                        columnNumber: 13
                    }, this) : viewer.open && objectUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                        ref: iframeRef,
                        src: objectUrl,
                        title: "Invoice PDF",
                        className: "h-full w-full"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
                        lineNumber: 159,
                        columnNumber: 13
                    }, this) : null
                }, void 0, false, {
                    fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
                    lineNumber: 147,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: handleDownload,
                            disabled: !objectUrl,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    className: "h-4 w-4 mr-1.5"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this),
                                "Download"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handlePrint,
                            disabled: !objectUrl,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                    className: "h-4 w-4 mr-1.5"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this),
                                "Print"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
                    lineNumber: 168,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
            lineNumber: 136,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/invoice-viewer-dialog.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/tooltip.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tooltip",
    ()=>Tooltip,
    "TooltipContent",
    ()=>TooltipContent,
    "TooltipProvider",
    ()=>TooltipProvider,
    "TooltipTrigger",
    ()=>TooltipTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-tooltip/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function TooltipProvider({ delayDuration = 0, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"], {
        "data-slot": "tooltip-provider",
        delayDuration: delayDuration,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tooltip.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
function Tooltip({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "tooltip",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tooltip.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
function TooltipTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "tooltip-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tooltip.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
function TooltipContent({ className, sideOffset = 0, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
            "data-slot": "tooltip-content",
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('bg-popover text-popover-foreground border border-border/80 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-[150] w-fit max-h-(--radix-tooltip-content-available-height) overflow-y-auto origin-(--radix-tooltip-content-transform-origin) rounded-xl px-3 py-2 text-xs text-balance', className),
            ...props,
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Arrow"], {
                    className: "fill-popover z-[150] size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
                }, void 0, false, {
                    fileName: "[project]/components/ui/tooltip.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/tooltip.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/tooltip.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tooltip.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function Providers({ children }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleChunkError = (event)=>{
            const errorMsg = "message" in event ? event.message : event.reason?.message || event.reason || "";
            const strMsg = typeof errorMsg === "string" ? errorMsg : "";
            const isChunkError = /Loading chunk .* failed/i.test(strMsg) || /Failed to load chunk/i.test(strMsg) || /ChunkLoadError/i.test(strMsg) || /CSS chunk .* failed/i.test(strMsg) || /Failed to fetch dynamically imported module/i.test(strMsg) || /error loading dynamically imported module/i.test(strMsg);
            if (isChunkError) {
                const reloadKey = "chunk_failed_reload_timestamp";
                const lastReload = Number(sessionStorage.getItem(reloadKey) || "0");
                const now = Date.now();
                // Reload once within a 15-second window to fetch the new build HTML
                if (!lastReload || now - lastReload > 15000) {
                    sessionStorage.setItem(reloadKey, String(now));
                    window.location.reload();
                }
            }
        };
        window.addEventListener("error", handleChunkError);
        window.addEventListener("unhandledrejection", handleChunkError);
        return ()=>{
            window.removeEventListener("error", handleChunkError);
            window.removeEventListener("unhandledrejection", handleChunkError);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipProvider"], {
        delayDuration: 0,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/providers.tsx",
        lineNumber: 45,
        columnNumber: 10
    }, this);
}
}),
"[project]/hooks/use-clinic-sse.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useClinicSse",
    ()=>useClinicSse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useApolloClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useApolloClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$runtime$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/runtime-config.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function useClinicSse() {
    const { doctor, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const apolloClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useApolloClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useApolloClient"])();
    const eventSourceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const reconnectTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const reconnectAttemptsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
            return;
        }
        //TURBOPACK unreachable
        ;
        let isUnmounted;
        const connectSse = undefined;
    }, [
        isAuthenticated,
        doctor,
        apolloClient
    ]);
}
}),
"[project]/components/clinic-sse-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClinicSseProvider",
    ()=>ClinicSseProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$clinic$2d$sse$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-clinic-sse.ts [app-ssr] (ecmascript)");
"use client";
;
;
function ClinicSseProvider({ children }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$clinic$2d$sse$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClinicSse"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5e2fb35a._.js.map