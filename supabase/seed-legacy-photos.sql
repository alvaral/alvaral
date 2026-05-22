begin;

with legacy_photos (
  image_path,
  image_url,
  alt_es,
  alt_en,
  visible,
  sort_order
) as (
  values
    (
      'legacy-home/1.webp',
      '/assets/images/1.webp',
      'Foto de la galeria de inicio',
      'Homepage gallery photo',
      true,
      10
    ),
    (
      'legacy-home/4.webp',
      '/assets/images/4.webp',
      'Foto de la galeria de inicio',
      'Homepage gallery photo',
      true,
      20
    ),
    (
      'legacy-home/3.webp',
      '/assets/images/3.webp',
      'Foto de la galeria de inicio',
      'Homepage gallery photo',
      true,
      30
    ),
    (
      'legacy-home/2.webp',
      '/assets/images/2.webp',
      'Foto de la galeria de inicio',
      'Homepage gallery photo',
      true,
      40
    ),
    (
      'legacy-home/8.webp',
      '/assets/images/8.webp',
      'Foto de la galeria de inicio',
      'Homepage gallery photo',
      true,
      50
    ),
    (
      'legacy-home/5.webp',
      '/assets/images/5.webp',
      'Foto de la galeria de inicio',
      'Homepage gallery photo',
      true,
      60
    ),
    (
      'legacy-home/6.webp',
      '/assets/images/6.webp',
      'Foto de la galeria de inicio',
      'Homepage gallery photo',
      true,
      70
    ),
    (
      'legacy-home/7.webp',
      '/assets/images/7.webp',
      'Foto de la galeria de inicio',
      'Homepage gallery photo',
      true,
      80
    )
)
insert into public.photos (
  image_path,
  image_url,
  alt_es,
  alt_en,
  visible,
  sort_order
)
select
  legacy_photos.image_path,
  legacy_photos.image_url,
  legacy_photos.alt_es,
  legacy_photos.alt_en,
  legacy_photos.visible,
  legacy_photos.sort_order
from legacy_photos
where not exists (
  select 1
  from public.photos
  where photos.image_path = legacy_photos.image_path
);

commit;
