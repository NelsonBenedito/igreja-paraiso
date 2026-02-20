-- 1. Create the 'avatars' bucket (SAFE TO RUN)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- NOTE: We removed the 'alter table' command which caused the error. 
-- RLS is already enabled on storage.objects by default.

-- 2. Create Policies for the 'avatars' bucket

-- Allow Public Read Access (Images are public)
create policy "Public Access Avatars"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Allow Authenticated Users to Upload
create policy "Authenticated Users Insert Avatars"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Allow Users to Update their own files
create policy "Users Update Own Avatars"
on storage.objects for update
to authenticated
using ( bucket_id = 'avatars' AND owner = auth.uid() );

-- Allow Users to Delete their own files
create policy "Users Delete Own Avatars"
on storage.objects for delete
to authenticated
using ( bucket_id = 'avatars' AND owner = auth.uid() );
