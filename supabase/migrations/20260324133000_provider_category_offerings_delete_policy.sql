grant delete on public.provider_category_offerings to authenticated;

create policy "provider_category_offerings_delete_own"
on public.provider_category_offerings
for delete
to authenticated
using (
  (select auth.uid()) = provider_id
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'provider'
  )
);
