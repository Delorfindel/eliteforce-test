alter table public.task_bookings
add column if not exists client_rating numeric(2,1) check (client_rating >= 0 and client_rating <= 5),
add column if not exists client_rated_at timestamptz;

grant update on public.task_bookings to authenticated;

drop policy if exists "task_bookings_update_client_own"
on public.task_bookings;

create policy "task_bookings_update_client_own"
on public.task_bookings
for update
to authenticated
using (
  (select auth.uid()) = client_id
)
with check (
  (select auth.uid()) = client_id
);
