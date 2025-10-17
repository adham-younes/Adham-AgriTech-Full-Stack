-- Add insert policy for weather_data to allow owners to insert
create policy if not exists "Users can insert weather data for their farms"
  on public.weather_data for insert
  with check (
    exists (
      select 1 from public.farms
      where farms.id = farm_id
      and farms.owner_id = auth.uid()
    )
  );
