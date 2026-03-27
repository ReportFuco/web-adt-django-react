# Generated manually for gallery support

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('noticias', '0009_anuncio_activo_anuncio_clicks_anuncio_cta_text_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='FotoNoticia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imagen', models.ImageField(upload_to='noticias/galeria/')),
                ('titulo', models.CharField(blank=True, max_length=255, null=True)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('orden', models.PositiveIntegerField(default=0)),
                ('destacada', models.BooleanField(default=False)),
                ('creada_en', models.DateTimeField(auto_now_add=True)),
                ('noticia', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fotos', to='noticias.noticia')),
            ],
            options={
                'verbose_name': 'Foto de noticia',
                'verbose_name_plural': 'Fotos de noticias',
                'ordering': ['orden', 'id'],
            },
        ),
        migrations.CreateModel(
            name='FotoEvento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imagen', models.ImageField(upload_to='eventos/galeria/')),
                ('titulo', models.CharField(blank=True, max_length=255, null=True)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('orden', models.PositiveIntegerField(default=0)),
                ('destacada', models.BooleanField(default=False)),
                ('creada_en', models.DateTimeField(auto_now_add=True)),
                ('evento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fotos', to='noticias.evento')),
            ],
            options={
                'verbose_name': 'Foto de evento',
                'verbose_name_plural': 'Fotos de eventos',
                'ordering': ['orden', 'id'],
            },
        ),
        migrations.CreateModel(
            name='FotoEntrevista',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imagen', models.ImageField(upload_to='entrevistas/galeria/')),
                ('titulo', models.CharField(blank=True, max_length=255, null=True)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('orden', models.PositiveIntegerField(default=0)),
                ('destacada', models.BooleanField(default=False)),
                ('creada_en', models.DateTimeField(auto_now_add=True)),
                ('entrevista', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fotos', to='noticias.entrevista')),
            ],
            options={
                'verbose_name': 'Foto de entrevista',
                'verbose_name_plural': 'Fotos de entrevistas',
                'ordering': ['orden', 'id'],
            },
        ),
    ]
