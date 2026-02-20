'use client'

import { useState } from 'react'
import { RefreshCw, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RevalidateYoutubeButton() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const handleRevalidate = async () => {
        setStatus('loading')
        try {
            // Chamamos a rota de revalidação
            const res = await fetch('/api/revalidate-youtube')
            if (res.ok) {
                setStatus('success')
                setTimeout(() => setStatus('idle'), 3000)
            } else {
                setStatus('error')
                setTimeout(() => setStatus('idle'), 3000)
            }
        } catch (error) {
            setStatus('error')
            setTimeout(() => setStatus('idle'), 3000)
        }
    }

    return (
        <Button
            onClick={handleRevalidate}
            disabled={status === 'loading'}
            variant="outline"
            className="bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl px-6 py-5 flex items-center gap-3 transition-all"
        >
            {status === 'loading' ? (
                <RefreshCw size={18} className="animate-spin" />
            ) : status === 'success' ? (
                <Check size={18} className="text-emerald-500" />
            ) : status === 'error' ? (
                <AlertCircle size={18} className="text-red-500" />
            ) : (
                <RefreshCw size={18} />
            )}
            
            <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">YouTube API</p>
                <p className="text-xs font-bold leading-none">Atualizar Cache</p>
            </div>
        </Button>
    )
}
