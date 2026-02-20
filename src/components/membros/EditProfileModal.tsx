'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Loader2, Camera } from "lucide-react"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation';

export default function EditProfileModal({ user }: { user: any }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fullName, setFullName] = useState<string>(user.user_metadata.full_name || '');
    const [avatarUrl, setAvatarUrl] = useState<string>(user.user_metadata.avatar_url || '');
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => setAvatarUrl(e.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const supabase = createClient();

        let uploadedAvatarUrl = user.user_metadata.avatar_url;

        try {
            // 1. Upload Avatar if changed
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, file);

                if (uploadError) {
                    console.error('Error uploading avatar:', uploadError);
                    // Continue anyway for name update, or handle error
                } else if (data) {
                    // Get Public URL
                    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
                    uploadedAvatarUrl = publicUrl;
                }
            }

            // 2. Update User Metadata
            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    avatar_url: uploadedAvatarUrl
                }
            });

            if (updateError) {
                console.error('Error updating user:', updateError);
                alert('Erro ao atualizar perfil.');
            } else {
                setOpen(false);
                router.refresh(); // Refresh server components to show new data
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="inline-flex items-center text-xs font-black uppercase tracking-widest text-paraiso-blue hover:text-paraiso-green transition-colors cursor-pointer bg-transparent border-0 p-0">
                    Editar <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                    <DialogDescription>
                        Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <User size={40} />
                                        </div>
                                    )}
                                </div>

                                {/* Hover Overlay with Camera Icon */}
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={24} />
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <span className="text-xs text-slate-500">Clique na foto para alterar</span>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nome
                            </Label>
                            <Input
                                id="name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="bg-paraiso-green hover:bg-paraiso-blue text-white">
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                            Salvar alterações
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
