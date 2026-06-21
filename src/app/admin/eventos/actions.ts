'use server'

import {
  adminListEvents,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent,
  isAdminApiConfigured,
  type CreateAdminEventBody,
} from '@/lib/admin-api/client'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')
}

export async function fetchAdminEventsAction() {
  await assertAdmin()
  if (!isAdminApiConfigured()) return { items: [], useFallback: true }
  try {
    const items = await adminListEvents()
    return { items, useFallback: false }
  } catch (e) {
    console.error('[admin/eventos]', e)
    return { items: [], useFallback: true, error: String(e) }
  }
}

export async function createEventAction(body: CreateAdminEventBody) {
  await assertAdmin()
  const event = await adminCreateEvent(body)
  revalidatePath('/admin/eventos')
  revalidatePath('/')
  return event
}

export async function updateEventAction(id: string, body: Partial<CreateAdminEventBody>) {
  await assertAdmin()
  const event = await adminUpdateEvent(id, body)
  revalidatePath('/admin/eventos')
  revalidatePath('/')
  return event
}

export async function deleteEventAction(id: string) {
  await assertAdmin()
  await adminDeleteEvent(id)
  revalidatePath('/admin/eventos')
  revalidatePath('/')
}
