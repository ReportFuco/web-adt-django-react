from django.db import migrations

# Siembra los valores que hoy están hardcodeados en el frontend
# (src/components/ui/SocialIcons.jsx y src/config/communityStats.js),
# para que el paso a backend no cambie nada visualmente.
REDES = [
    {
        'red': 'instagram',
        'label': 'Instagram',
        'url': 'https://www.instagram.com/adictos_al_techno/',
        'contador': 169986,
        'orden': 0,
    },
    {
        'red': 'whatsapp',
        'label': 'Comunidad de WhatsApp',
        'url': 'https://chat.whatsapp.com/HGiCQbH6KOdKE1VKbxpKgV?s=sh&p=i&ilr=4',
        'contador': 157,
        'orden': 1,
    },
    {
        'red': 'spotify',
        'label': 'Spotify',
        'url': 'https://open.spotify.com/playlist/4uDeR4NrQHknGI4XMVEwRH?si=65BaoIh9RC-JPxE7NokKdQ',
        'contador': 229,
        'orden': 2,
    },
    {
        'red': 'tiktok',
        'label': 'TikTok',
        'url': 'https://www.tiktok.com/@adictos.al.techno?_t=ZM-8vv8jszOOKz&_r=1',
        'contador': 280,
        'orden': 3,
    },
]


def seed_redes_sociales(apps, schema_editor):
    RedSocial = apps.get_model('noticias', 'RedSocial')
    for data in REDES:
        RedSocial.objects.update_or_create(red=data['red'], defaults=data)


def remove_redes_sociales(apps, schema_editor):
    RedSocial = apps.get_model('noticias', 'RedSocial')
    RedSocial.objects.filter(red__in=[r['red'] for r in REDES]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('noticias', '0017_redsocial'),
    ]

    operations = [
        migrations.RunPython(seed_redes_sociales, remove_redes_sociales),
    ]
