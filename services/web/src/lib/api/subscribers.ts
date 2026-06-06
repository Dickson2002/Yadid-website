import { api } from './client'
import type { SubscriberResponse } from './types'

export async function subscribeToNewsletter(email: string): Promise<void> {
  return api.post('/subscribe', { email })
}

export async function fetchSubscribers(): Promise<SubscriberResponse[]> {
  return api.get<SubscriberResponse[]>('/subscribe')
}
