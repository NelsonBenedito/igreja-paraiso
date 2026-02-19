
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '@/app/auth/actions'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar, User, BookOpen, LogOut } from "lucide-react"

export default async function MembersPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Área de Membros</h1>
                    <p className="text-muted-foreground">Bem-vindo, {user.user_metadata.full_name || user.email}</p>
                </div>
                <form action={signout}>
                    <Button variant="outline" className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
                        <LogOut className="w-4 h-4" />
                        Sair
                    </Button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Meu Perfil
                        </CardTitle>
                        <CardDescription>Gerencie seus dados e informações.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" className="w-full">Editar Perfil</Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Inscrições em Eventos
                        </CardTitle>
                        <CardDescription>Veja seus eventos e faça novas inscrições.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" className="w-full">Ver Eventos</Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            Meus Cursos
                        </CardTitle>
                        <CardDescription>Acesse materiais de estudo e treinamentos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" className="w-full">Acessar Cursos</Button>
                    </CardContent>
                </Card>
            </div>

            {/* SQL Instruction Placeholder for User */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-blue-800">
                <h3 className="font-bold text-lg mb-2">Configuração do Banco de Dados Necessária!</h3>
                <p className="mb-4">
                    Para que o sistema de inscrições funcione, você precisa criar as tabelas no seu Supabase.
                    Copie o código SQL abaixo e execute no <strong>SQL Editor</strong> do seu painel Supabase.
                </p>
                <pre className="bg-slate-900 text-slate-50 p-4 rounded-md overflow-x-auto text-sm">
                    {`-- 1. Create a table for public profiles
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  
  primary key (id)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 2. Create a table for Events/Courses
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date timestamp with time zone,
  location text,
  max_capacity integer,
  type text check (type in ('event', 'course')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.events enable row level security;
create policy "Events are viewable by everyone" on public.events for select using (true);


-- 3. Create a table for Registrations
create table public.registrations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  event_id uuid references public.events not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'confirmed',
  
  unique(user_id, event_id)
);

alter table public.registrations enable row level security;

create policy "Users can see their own registrations" 
  on public.registrations for select 
  using (auth.uid() = user_id);

create policy "Users can register themselves" 
  on public.registrations for insert 
  with check (auth.uid() = user_id);

-- 4. Trigger to create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
`}
                </pre>
            </div>
        </div>
    )
}
