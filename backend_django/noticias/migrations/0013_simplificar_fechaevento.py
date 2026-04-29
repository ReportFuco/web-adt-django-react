from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('noticias', '0012_alter_fechaevento_fin_alter_fechaevento_inicio'),
    ]

    operations = [
        migrations.RenameField(
            model_name='fechaevento',
            old_name='inicio',
            new_name='fecha',
        ),
        migrations.RemoveField(
            model_name='fechaevento',
            name='fin',
        ),
        migrations.RemoveField(
            model_name='fechaevento',
            name='descripcion',
        ),
        migrations.AlterModelOptions(
            name='fechaevento',
            options={
                'ordering': ['orden', 'fecha', 'id'],
                'verbose_name': 'Fecha de evento',
                'verbose_name_plural': 'Fechas de eventos',
            },
        ),
    ]
