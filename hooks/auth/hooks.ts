import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import { getErrorMessage } from '@/lib/error-utils'
import { LOGIN_MUTATION, SET_INITIAL_PASSWORD_MUTATION, REGISTER_MUTATION, ADMIN_CREATE_USER_MUTATION, ADMIN_UPDATE_USER_MUTATION, ACTIVATE_USER_MUTATION, DEACTIVATE_USER_MUTATION, UPDATE_USER_ROLES_MUTATION, UPDATE_MY_PROFILE_MUTATION, CHANGE_PASSWORD_MUTATION, DELETE_USER_PASSWORD_MUTATION, UPDATE_CLINIC_PROFILE_MUTATION } from '../mutations'
import { ME_QUERY, GET_USERS_QUERY, CLINIC_PROFILE_QUERY } from '../queries'
import type { LoginResponse, UserAccount, UserResponse, RegisterResponse, Worker } from '../types'
import type { ClinicContact, ClinicProfile } from '@/lib/api-types'
import { mapGqlWorker } from '@/lib/gql-mappers'

interface ClinicProfileResponseData {
  clinicProfile: {
    status: string
    message?: string
    data?: ClinicProfile | null
  }
}

interface UpdateClinicProfileResponseData {
  updateClinicProfile: {
    status: string
    message?: string
    data?: ClinicProfile | null
  }
}

const mapClinicProfile = (profile?: ClinicProfile | null): ClinicProfile | null => {
  if (!profile) return null
  return {
    id: String(profile.id || ''),
    name: profile.name?.trim() || undefined,
    address: profile.address?.trim() || undefined,
    contacts: profile.contacts ?? [],
    tinNumber: profile.tinNumber?.trim() || undefined,
    logoUrl: profile.logoUrl?.trim() || undefined,
    metadata: profile.metadata ?? null,
    createdAt: profile.createdAt || '',
    updatedAt: profile.updatedAt || '',
  }
}

export function useLogin() {
  const client = useApolloClient()
  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION)

  const login = async (identifier: string, password: string) => {
    try {
      const result = await loginMutation({
        variables: { input: { identifier, password } }
      })
      const payload = result?.data?.login as LoginResponse | undefined

      // Log mutation result
      console.log('=== LOGIN MUTATION RESULT ===', {
        status: payload?.status,
        user: payload?.data?.user,
        accessToken: payload?.data?.accessToken ? '***' : undefined,
      })

      const buildUser = (profile?: Parameters<typeof mapGqlWorker>[0]): Worker => {
        const user = mapGqlWorker(profile)
        if (!profile?.id && !profile?.firstName) {
          return {
            ...user,
            name: user.name || identifier,
          }
        }
        return user
      }

      if (payload?.status === 'SUCCESS' && payload.data?.accessToken) {
        const token = payload.data.accessToken
        const loginUser = payload.data.user
        let user = loginUser ? buildUser(loginUser as Parameters<typeof mapGqlWorker>[0]) : buildUser()
        let clinicProfile: ClinicProfile | null = null

        if (!loginUser) {
          try {
            const meResult = await client.query({
              query: ME_QUERY,
              fetchPolicy: 'no-cache',
              context: { headers: { Authorization: `Bearer ${token}` } },
            })
            const me = meResult?.data?.me?.data
            if (me) {
              user = buildUser(me)
            }
          } catch {
            // Continue with token if profile hydration fails.
          }
        }

        try {
          const clinicProfileResult = await client.query({
            query: CLINIC_PROFILE_QUERY,
            fetchPolicy: 'no-cache',
            context: { headers: { Authorization: `Bearer ${token}` } },
          })
          clinicProfile = mapClinicProfile(clinicProfileResult?.data?.clinicProfile?.data)
        } catch {
          clinicProfile = null
        }

        // Log what will be stored
        console.log('=== BUILT USER (before storage) ===', user)
        console.log('=== STORING TO LOCALSTORAGE ===', JSON.stringify(user))

        return {
          status: 'SUCCESS',
          data: {
            token,
            accessToken: token,
            refreshToken: payload.data.refreshToken,
            user,
            clinicProfile,
          },
          messages: payload.message ? [{ text: payload.message, type: 'SUCCESS' }] : undefined,
        } as LoginResponse
      }

      if (payload?.status === 'PARTIAL_SUCCESS' && payload.data) {
        const loginUser = payload.data.user
        let user = loginUser ? buildUser(loginUser as Parameters<typeof mapGqlWorker>[0]) : buildUser()

        return {
          status: 'PARTIAL_SUCCESS',
          data: {
            token: undefined,
            accessToken: undefined,
            refreshToken: undefined,
            user,
            needsPasswordSetup: true,
          },
          messages: payload.message ? [{ text: payload.message, type: 'INFO' }] : undefined,
        } as LoginResponse
      }

      const fallbackMessage = payload?.message || 'Login failed'
      return {
        status: payload?.status || 'ERROR',
        message: payload?.message,
        messages: [{ text: fallbackMessage, type: 'ERROR' }],
      } as LoginResponse
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Network error occurred'
      return {
        status: 'ERROR',
        messages: [{ text: errorMessage, type: 'ERROR' }],
      } as LoginResponse
    }
  }

  return { login, loading, error }
}

export function useSetInitialPassword() {
  const [mutation, { loading, error }] = useMutation(SET_INITIAL_PASSWORD_MUTATION)

  const setInitialPassword = async (identifier: string, newPassword: string) => {
    try {
      const result = await mutation({
        variables: { input: { identifier, newPassword } }
      })
      const payload = result.data?.setInitialPassword
      return {
        status: payload?.status || 'ERROR',
        message: payload?.message,
        messages: payload?.message ? [{ text: payload.message, type: payload.status || 'ERROR' }] : undefined,
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Network error occurred'
      return {
        status: 'ERROR',
        message: errorMessage,
        messages: [{ text: errorMessage, type: 'ERROR' }],
      }
    }
  }

  return { setInitialPassword, loading, error }
}

export function useRegister() {
  const [registerMutation, { loading, error }] = useMutation(REGISTER_MUTATION)

  const register = async (name: string, email: string, password: string, phoneNumber: string, title?: string) => {
    try {
      const [firstName, ...lastNameParts] = name.trim().split(/\s+/).filter(Boolean)
      const lastName = lastNameParts.length > 0 ? lastNameParts.join(' ') : null
      const username = email?.split('@')?.[0] || phoneNumber || null
      const result = await registerMutation({
        variables: {
          input: {
            firstName: firstName || name,
            lastName,
            email,
            password,
            phoneNumber,
            username,
          }
        }
      })
      const payload = result?.data?.selfRegister
      return {
        status: payload?.status || 'ERROR',
        message: payload?.message,
        data: payload?.data ? mapGqlWorker(payload.data) : undefined,
        messages: payload?.message ? [{ text: payload.message, type: payload?.status || 'ERROR' }] : undefined,
      } as RegisterResponse
    } catch (err) {
      console.error('Register error:', err)
      throw err
    }
  }

  return { register, loading, error }
}

export function useClinicProfile() {
  const { data, loading, error, refetch } = useQuery<ClinicProfileResponseData>(CLINIC_PROFILE_QUERY, {
    fetchPolicy: 'cache-and-network',
  })

  return {
    clinicProfile: mapClinicProfile(data?.clinicProfile?.data),
    loading,
    error: error?.message || null,
    refetch,
  }
}

export function useUpsertClinicProfile() {
  const [mutate, { loading, error }] = useMutation<UpdateClinicProfileResponseData>(UPDATE_CLINIC_PROFILE_MUTATION)

  const upsertClinicProfile = async (input: {
    name?: string
    address?: string
    contacts?: ClinicContact[] | null
    tinNumber?: string
    logoUrl?: string
    metadata?: { [key: string]: string } | null
  }) => {
    const { data } = await mutate({
      variables: {
        input: {
          name: input.name,
          address: input.address,
          contacts: input.contacts,
          tinNumber: input.tinNumber,
          logoUrl: input.logoUrl,
          metadata: input.metadata,
        },
      },
    })

    const payload = data?.updateClinicProfile
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
      data: mapClinicProfile(payload?.data),
    }
  }

  return { upsertClinicProfile, loading, error: error?.message || null }
}

export function useUsers() {
  const { data, loading, error, refetch } = useQuery(GET_USERS_QUERY, {
    fetchPolicy: 'cache-and-network'
  })

  const errorMessage = error?.message || null

  return {
    users: ((data?.listUsers?.data || []) as Parameters<typeof mapGqlWorker>[0][]).map(mapGqlWorker) as UserAccount[],
    loading,
    error: errorMessage,
    refetch,
  }
}

export function useAdminCreateUser() {
  const [mutation, { loading, error }] = useMutation(ADMIN_CREATE_USER_MUTATION)

  const adminCreateUser = async (input: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    username: string
    roles: string[]
    departmentIds?: string[]
    gender?: string
    dateOfBirth?: string
    profilePhotoUrl?: string
    workerDocProfile?: any
  }) => {
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
          workerDocProfile: input.workerDocProfile || null,
        }
      }
      const result = await mutation({ variables })
      return result.data?.adminCreateUser as UserResponse
    } catch (err) {
      console.error('Admin create user error:', err)
      throw err
    }
  }

  return { adminCreateUser, loading, error }
}

export function useAdminUpdateUser() {
  const [mutation, { loading, error }] = useMutation(ADMIN_UPDATE_USER_MUTATION)

  const adminUpdateUser = async (userId: string, input: {
    firstName?: string
    lastName?: string
    email?: string
    phoneNumber?: string
    username?: string
    gender?: string
    dateOfBirth?: string
    profilePhotoUrl?: string
    departmentIds?: string[]
    roles?: string[]
    workerDocProfile?: any
  }) => {
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
          workerDocProfile: input.workerDocProfile || undefined,
        }
      }
      const result = await mutation({ variables })
      return result.data?.adminUpdateUser as UserResponse
    } catch (err) {
      console.error('Admin update user error:', err)
      throw err
    }
  }

  return { adminUpdateUser, loading, error }
}

export function useActivateUser() {
  const [mutation, { loading, error }] = useMutation(ACTIVATE_USER_MUTATION)

  const activateUser = async (userId: string, roles: string[]) => {
    try {
      const result = await mutation({ 
        variables: { input: { userId, roles } }
      })
      return result.data?.activateUser as UserResponse
    } catch (err) {
      console.error('Activate user error:', err)
      throw err
    }
  }

  return { activateUser, loading, error }
}

export function useDeactivateUser() {
  const [mutation, { loading, error }] = useMutation(DEACTIVATE_USER_MUTATION)

  const deactivateUser = async (userId: string, revokeSessions: boolean = false) => {
    try {
      const result = await mutation({ 
        variables: { input: { userId, revokeSessions } }
      })
      return result.data?.deactivateUser as UserResponse
    } catch (err) {
      console.error('Deactivate user error:', err)
      throw err
    }
  }

  return { deactivateUser, loading, error }
}

export function useUpdateUserRoles() {
  const [mutation, { loading, error }] = useMutation(UPDATE_USER_ROLES_MUTATION)

  const updateUserRoles = async (userId: string, roles: string[]) => {
    try {
      const result = await mutation({ variables: { input: { userId, roles } } })
      return result.data?.activateUser as UserResponse
    } catch (err) {
      console.error('Update user roles error:', err)
      throw err
    }
  }

  return { updateUserRoles, loading, error }
}

export function useUpdateMyProfile() {
  const [mutation, { loading, error }] = useMutation(UPDATE_MY_PROFILE_MUTATION)

  const updateMyProfile = async (input: {
    name?: string
    email?: string
    phoneNumber?: string
    title?: string
  }) => {
    try {
      const [firstName, ...lastNameParts] = (input.name || '').trim().split(/\s+/).filter(Boolean)
      const lastName = lastNameParts.length > 0 ? lastNameParts.join(' ') : undefined
      const result = await mutation({
        variables: {
          input: {
            firstName: firstName || undefined,
            lastName,
            email: input.email || undefined,
            phoneNumber: input.phoneNumber || undefined,
          },
        },
      })

      const payload = result.data?.updateMyProfile
      const worker = payload?.data

      return {
        status: payload?.status || 'ERROR',
        message: payload?.message,
        messages: payload?.message ? [{ text: payload.message, type: payload?.status || 'ERROR' }] : undefined,
        data: worker ? mapGqlWorker(worker) : undefined,
      } as UserResponse
    } catch (err) {
      console.error('Update my profile error:', err)
      throw err
    }
  }

  return { updateMyProfile, loading, error }
}

export function useChangePassword() {
  const [mutation, { loading, error }] = useMutation(CHANGE_PASSWORD_MUTATION)

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const result = await mutation({ variables: { input: { currentPassword, newPassword } } })
      const payload = result.data?.changeMyPassword
      return {
        status: payload?.status || 'ERROR',
        message: payload?.message,
        messages: payload?.message ? [{ text: payload.message, type: payload.status || 'ERROR' }] : undefined,
        data: payload?.data ? { id: String(payload.data) } : undefined,
      } as UserResponse
    } catch (err) {
      console.error('Change password error:', err)
      throw err
    }
  }

  return { changePassword, loading, error }
}

export function useCreatePassword() {
  const [mutation, { loading, error }] = useMutation(SET_INITIAL_PASSWORD_MUTATION)

  const createPassword = async (identifier: string, password: string) => {
    try {
      const result = await mutation({ variables: { input: { identifier, newPassword: password } } })
      return result.data?.setInitialPassword as UserResponse
    } catch (err) {
      console.error('Create password error:', err)
      throw err
    }
  }

  return { createPassword, loading, error }
}

export function useDeleteUserPassword() {
  const [mutation, { loading, error }] = useMutation(DELETE_USER_PASSWORD_MUTATION)

  const deleteUserPassword = async (userId: string) => {
    try {
      const result = await mutation({ variables: { input: { userId, revokeSessions: true } } })
      return result.data?.adminTriggerPasswordReset as UserResponse
    } catch (err) {
      console.error('Delete user password error:', err)
      throw err
    }
  }

  return { deleteUserPassword, loading, error }
}
