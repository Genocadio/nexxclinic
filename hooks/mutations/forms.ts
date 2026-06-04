import { gql } from '@apollo/client'

export const CREATE_FORM_MUTATION = gql`
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
`

export const UPDATE_FORM_MUTATION = gql`
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
`

export const FINALIZE_FORM_MUTATION = gql`
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
`
