from django.db import migrations
from django.contrib.auth.hashers import make_password


def crear_superusuario(apps, schema_editor):
    Usuario = apps.get_model('users', 'Usuario')

    USERNAME = 'admin'
    EMAIL = 'admin@admin.com'
    PASSWORD = 'Soy_yo321'

    # Verificar si ya existe un superusuario o un usuario con ese email/username
    if (
        not Usuario.objects.filter(is_superuser=True).exists()
        and not Usuario.objects.filter(email=EMAIL).exists()
        and not Usuario.objects.filter(username=USERNAME).exists()
    ):
        Usuario.objects.create(
            username=USERNAME,
            email=EMAIL,
            password=make_password(PASSWORD),
            is_superuser=True,
            is_staff=True,
            is_active=True,
            rol='admin',
        )


def revertir_superusuario(apps, schema_editor):
    Usuario = apps.get_model('users', 'Usuario')
    Usuario.objects.filter(email='TU_EMAIL', is_superuser=True).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(crear_superusuario, reverse_code=revertir_superusuario),
    ]
