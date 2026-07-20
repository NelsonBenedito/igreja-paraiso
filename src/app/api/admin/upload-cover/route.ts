import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  // Verificar autenticação Supabase
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const adminToken = process.env.CHURCHMANAGER_ADMIN_TOKEN
  const apiBase = process.env.NEXT_PUBLIC_DONATIONS_API_BASE

  if (!adminToken || !apiBase) {
    return NextResponse.json(
      { error: 'CHURCHMANAGER_ADMIN_TOKEN ou NEXT_PUBLIC_DONATIONS_API_BASE não configurados' },
      { status: 503 }
    )
  }

  // Repassar o multipart/form-data para o ChurchManager
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Formulário inválido' }, { status: 400 })
  }

  const uploadUrl = `${apiBase.replace(/\/+$/, '')}/api/admin/tenants/me/events/upload-cover`

  let upstream: Response
  try {
    upstream = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      body: formData,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Falha de rede'
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  const body = await upstream.json().catch(() => ({}))
  return NextResponse.json(body, { status: upstream.status })
}
