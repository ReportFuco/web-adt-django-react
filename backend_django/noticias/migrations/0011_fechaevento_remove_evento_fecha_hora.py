import django.db.models.deletion
from django.db import migrations, models


def migrar_fecha_hora_a_fechas(apps, schema_editor):
    Evento = apps.get_model('noticias', 'Evento')
    FechaEvento = apps.get_model('noticias', 'FechaEvento')

    fechas = [
        FechaEvento(evento_id=evento.id, inicio=evento.fecha_hora, orden=0)
        for evento in Evento.objects.exclude(fecha_hora__isnull=True).only('id', 'fecha_hora')
    ]
    FechaEvento.objects.bulk_create(fechas)


class Migration(migrations.Migration):

    dependencies = [
        ('noticias', '0010_fotonoticia_fotoevento_fotoentrevista'),
    ]

    operations = [
        migrations.CreateModel(
            name='FechaEvento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('inicio', models.DateTimeField()),
                ('fin', models.DateTimeField(blank=True, null=True)),
                ('descripcion', models.CharField(blank=True, max_length=255, null=True)),
                ('orden', models.PositiveIntegerField(default=0)),
                ('evento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fechas', to='noticias.evento')),
            ],
            options={
                'verbose_name': 'Fecha de evento',
                'verbose_name_plural': 'Fechas de eventos',
                'ordering': ['orden', 'inicio', 'id'],
            },
        ),
        migrations.RunPython(migrar_fecha_hora_a_fechas, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name='evento',
            name='fecha_hora',
        ),
    ]
