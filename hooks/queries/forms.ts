import { gql } from '@apollo/client'

export const GET_FORMS_QUERY = gql`
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
`

export const GET_FORM_QUERY = gql`
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
`

export const GET_FORM_VERSION_HISTORY_QUERY = gql`
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
`

export const GET_LATEST_FORM_QUERY = gql`
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
`

export const GET_CONSULTATION_ANSWERS_QUERY = gql`
  query ConsultationGetAnswers($visitDepartmentId: ID, $visitId: ID) {
    getConsultationAnswers(visitDepartmentId: $visitDepartmentId, visitId: $visitId) {
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
  }
`
