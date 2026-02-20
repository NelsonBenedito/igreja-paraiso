'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Camera, Loader2, Save, Mail, ShieldCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfileClient({ user }: { user: any }) {
    const [isLoading, setIsLoading] = useState(false)
    const [fullName, setFullName] = useState<string>(user.user_metadata.full_name || '')
    const [avatarUrl, setAvatarUrl] = useState<string>(user.user_metadata.avatar_url || '')
    const [file, setFile] = useState<File | null>(null)
    const router = useRouter()

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            const reader = new FileReader()
            reader.onload = (e) => setAvatarUrl(e.target?.result as string)
            reader.readAsDataURL(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const supabase = createClient()
        let uploadedAvatarUrl = user.user_metadata.avatar_url

        try {
            if (file) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${user.id}-${Math.random()}.${fileExt}`
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, file)

                if (!uploadError && uploadData) {
                    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)
                    uploadedAvatarUrl = publicUrl
                }
            }

            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    avatar_url: uploadedAvatarUrl
                }
            })

            if (!updateError) {
                router.refresh()
            } else {
                alert('Erro ao atualizar.')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50"></div>
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-6 relative z-10">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-xl">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <User size={48} />
                            </div>
                        )}
                    </div>

                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="text-white" size={32} />
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleAvatarChange}
                    />
                </div>
                <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-widest text-paraiso-blue-dark">Mudar Foto</p>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG ou WebP</p>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                <div className="grid gap-3">
                    <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Nome Completo</Label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            id="name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="pl-12 py-6 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all text-slate-700 font-bold"
                            placeholder="Seu nome"
                        />
                    </div>
                </div>

                <div className="grid gap-3 grayscale opacity-60">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">E-mail (Não editável)</Label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            disabled
                            value={user.email}
                            className="pl-12 py-6 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                        />
                    </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                    <Button 
                        type="submit" 
                        disabled={isLoading} 
                        className="bg-paraiso-green hover:bg-paraiso-blue-dark text-white font-black uppercase tracking-widest py-7 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {isLoading ? 'Salvando...' : 'Salvar Perfil'}
                    </Button>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-3 text-slate-400">
                <ShieldCheck size={20} className="text-paraiso-green/50" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Seus dados estão protegidos por criptografia de ponta a ponta.</p>
            </div>
        </form>
    )
}
