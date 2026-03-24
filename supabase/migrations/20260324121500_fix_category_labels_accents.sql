update public.service_categories
set name = case slug
  when 'menage' then 'Ménage'
  when 'electricite' then 'Électricité'
  when 'demenagement' then 'Déménagement'
  else name
end
where slug in ('menage', 'electricite', 'demenagement');
