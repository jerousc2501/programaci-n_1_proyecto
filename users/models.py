from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    class Rol(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        CLIENTE = 'cliente', 'Cliente'
        VENDEDOR = 'vendedor', 'Vendedor'

    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    altura = models.FloatField(null=True, blank=True, help_text="Altura en cm")
    peso = models.FloatField(null=True, blank=True, help_text="Peso en kg")
    rol = models.CharField(max_length=15, choices=Rol.choices, default=Rol.CLIENTE)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.get_full_name() or self.email
