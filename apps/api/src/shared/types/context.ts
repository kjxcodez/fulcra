export interface Principal {
  userId: string
  email: string
  name?: string
  isAnonymous?: boolean
}

export interface AppVariables {
  requestId: string
  startTime: number
  principal: Principal
}

export interface AppEnv {
  Variables: AppVariables
}
