-- Reuses community sessions; never accepts a client-supplied user id.
create table if not exists public.rejstream_library (
 user_id uuid not null references public.community_users(id) on delete cascade,
 kind text not null check (kind in ('progress','favorite','watched')),
 item_key text not null check (length(item_key) between 1 and 500),
 payload jsonb not null check (octet_length(payload::text) <= 8192),
 updated_at timestamptz not null default now(),
 primary key(user_id,kind,item_key)
);
alter table public.rejstream_library enable row level security;
revoke all on public.rejstream_library from public, anon, authenticated;
create or replace function public.rejstream_read(p_token text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare u uuid; result jsonb;
begin
 select user_id into strict u from public.community_session_user(p_token);
 select coalesce(jsonb_agg(jsonb_build_object('kind',kind,'key',item_key,'payload',payload)), '[]'::jsonb) into result from public.rejstream_library where user_id=u;
 return result;
end $$;
create or replace function public.rejstream_write(p_token text,p_kind text,p_key text,p_payload jsonb) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare u uuid;
begin
 select user_id into strict u from public.community_session_user(p_token);
 if p_kind not in ('progress','favorite','watched') or length(p_key) not between 1 and 500 then raise exception 'Nieprawidłowy wpis'; end if;
 if p_payload is null then
  delete from public.rejstream_library where user_id=u and kind=p_kind and item_key=p_key;
 else
  if p_kind='progress' and (jsonb_typeof(p_payload) <> 'object' or not (p_payload ?& array['position','duration','seconds','updated'])) then raise exception 'Nieprawidłowy postęp'; end if;
  insert into public.rejstream_library(user_id,kind,item_key,payload) values(u,p_kind,p_key,p_payload)
  on conflict(user_id,kind,item_key) do update set payload=excluded.payload,updated_at=now();
 end if;
end $$;
revoke all on function public.rejstream_read(text) from public;
revoke all on function public.rejstream_write(text,text,text,jsonb) from public;
grant execute on function public.rejstream_read(text) to anon, authenticated;
grant execute on function public.rejstream_write(text,text,text,jsonb) to anon, authenticated;
