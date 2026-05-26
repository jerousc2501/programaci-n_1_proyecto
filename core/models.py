# core/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser


# ==================== USER MANAGEMENT ====================

class Usuario(AbstractUser):
    """Usuario/cliente de la plataforma"""
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    altura = models.FloatField(null=True, blank=True, help_text="Altura en cm")
    peso = models.FloatField(null=True, blank=True, help_text="Peso en kg")
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def str(self):
        return self.get_full_name() or self.email


class Profesional(models.Model):
    """Entrenadores y nutricionistas"""
    ESPECIALIDAD_CHOICES = [
        ('entrenador', 'Entrenador Personal'),
        ('nutricionista', 'Nutricionista'),
        ('fisioterapeuta', 'Fisioterapeuta'),
        ('medico', 'Médico Deportivo'),
    ]
    
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    especialidad = models.CharField(max_length=20, choices=ESPECIALIDAD_CHOICES)
    numero_licencia = models.CharField(max_length=50, blank=True, null=True)
    biografia = models.TextField(blank=True, null=True)
    precio_consulta = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    def str(self):
        return f"{self.usuario.get_full_name()} - {self.get_especialidad_display()}"


# ==================== PLANES ====================

class Objetivo(models.Model):
    """Objetivos del usuario (perder peso, ganar músculo, etc.)"""
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='objetivos')
    nombre = models.CharField(max_length=100)  # ej: "Perder 5kg", "Ganar músculo"
    descripcion = models.TextField(blank=True, null=True)
    peso_objetivo = models.FloatField(null=True, blank=True)
    fecha_inicio = models.DateField()
    fecha_objetivo = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=20, default='activo')  # activo, completado, abandonado
    
    def str(self):
        return f"{self.usuario.get_full_name()} - {self.nombre}"


class PlanNutricional(models.Model):
    """Planes de nutrición personalizados"""
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='planes_nutricionales')
    profesional = models.ForeignKey(Profesional, on_delete=models.SET_NULL, null=True, blank=True)
    
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    objetivo_calorico = models.PositiveIntegerField(help_text="Calorías diarias objetivo")
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    
    def str(self):
        return f"Plan Nutricional: {self.nombre} - {self.usuario.get_full_name()}"


class Comida(models.Model):
    """Comidas dentro de un plan nutricional"""
    TIPOS_COMIDA = [
        ('desayuno', 'Desayuno'),
        ('almuerzo', 'Almuerzo'),
        ('merienda', 'Merienda'),
        ('cena', 'Cena'),
        ('snack', 'Snack'),
    ]
    
    plan_nutricional = models.ForeignKey(PlanNutricional, on_delete=models.CASCADE, related_name='comidas')
    tipo = models.CharField(max_length=15, choices=TIPOS_COMIDA)
    nombre = models.CharField(max_length=200)
    hora = models.TimeField(null=True, blank=True)
    kcal = models.PositiveIntegerField()
    proteinas = models.FloatField(null=True, blank=True, help_text="gramos")
    carbohidratos = models.FloatField(null=True, blank=True, help_text="gramos")
    grasas = models.FloatField(null=True, blank=True, help_text="gramos")
    descripcion = models.TextField(blank=True, null=True)
    
    def str(self):
        return f"{self.tipo}: {self.nombre}"


class PlanEntrenamiento(models.Model):
    """Planes de entrenamiento personalizados"""
    TIPOS_ENTRENAMIENTO = [
        ('fuerza', 'Entrenamiento de Fuerza'),
        ('cardio', 'Cardio'),
        ('hiit', 'HIIT'),
        ('flexibilidad', 'Flexibilidad'),
        ('mixto', 'Entrenamiento Mixto'),
    ]
    
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='planes_entrenamiento')
    profesional = models.ForeignKey(Profesional, on_delete=models.SET_NULL, null=True, blank=True)
    
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    tipo = models.CharField(max_length=15, choices=TIPOS_ENTRENAMIENTO)
    duracion_semanas = models.PositiveIntegerField()
    frecuencia_semanal = models.PositiveIntegerField(help_text="Días por semana")
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    
    def str(self):
        return f"Plan Entrenamiento: {self.nombre} - {self.usuario.get_full_name()}"


class Ejercicio(models.Model):
    """Ejercicios dentro de un plan de entrenamiento"""
    MUSCULOS = [
        ('pecho', 'Pecho'),
        ('espalda', 'Espalda'),
        ('piernas', 'Piernas'),
        ('hombros', 'Hombros'),
        ('brazos', 'Brazos'),
        ('abdomen', 'Abdomen'),
        ('completo', 'Cuerpo Completo'),
    ]
    
    plan_entrenamiento = models.ForeignKey(PlanEntrenamiento, on_delete=models.CASCADE, related_name='ejercicios')
    nombre = models.CharField(max_length=200)
    serie = models.PositiveIntegerField(help_text="Número de series")
    repeticiones = models.CharField(max_length=50, help_text="Repeticiones por serie")
    descanso_segundos = models.PositiveIntegerField(default=60)
    musculo = models.CharField(max_length=15, choices=MUSCULOS)
    explicacion = models.TextField(blank=True, null=True)
    
    def str(self):
        return f"{self.nombre} - {self.serie}x{self.repeticiones}"


# ==================== SEGUIMIENTO ====================

class Medicion(models.Model):
    """Registros de progreso del usuario"""
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='mediciones')
    fecha = models.DateField()
    
    peso = models.FloatField(null=True, blank=True)
    altura = models.FloatField(null=True, blank=True)
    imc = models.FloatField(null=True, blank=True, help_text="Índice de Masa Corporal")
    grasa_corporal = models.FloatField(null=True, blank=True, help_text="Porcentaje")
    masa_muscular = models.FloatField(null=True, blank=True, help_text="kg")
    
    # Medidas
    pecho = models.FloatField(null=True, blank=True, help_text="cm")
    cintura = models.FloatField(null=True, blank=True)
    cadera = models.FloatField(null=True, blank=True)
    biceps = models.FloatField(null=True, blank=True)
    
    notas = models.TextField(blank=True, null=True)
    
    def str(self):
        return f"Medición {self.fecha} - {self.usuario.get_full_name()}"
    
    def save(self, *args, **kwargs):
        if self.peso and self.altura:
            self.imc = self.peso / ((self.altura / 100) ** 2)
        super().save(*args, **kwargs)


class ProgresoEntrenamiento(models.Model):
    """Seguimiento de entrenos completados"""
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    ejercicio = models.ForeignKey(Ejercicio, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    peso_usado = models.FloatField(null=True, blank=True)
    reps_completadas = models.PositiveIntegerField()
    completado = models.BooleanField(default=False)
    
    def str(self):
        return f"{self.ejercicio.nombre} - {self.usuario.get_full_name()}"


# ==================== E-COMMERCE ====================

class Producto(models.Model):
    """Productos en venta (suplementos, equipos)"""
    CATEGORIAS = [
        ('suplemento', 'Suplemento'),
        ('equipamiento', 'Equipamiento'),
        ('accesorio', 'Accesorio'),
        ('ropa', 'Ropa Deportiva'),
    ]
    
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    categoria = models.CharField(max_length=15, choices=CATEGORIAS)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)
    activo = models.BooleanField(default=True)
    
    def str(self):
        return self.nombre


class Carrito(models.Model):
    """Items en carrito de compras"""
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    
    def str(self):
        return f"{self.cantidad} x {self.producto.nombre}"


class Pedido(models.Model):
    """Pedidos de productos o suscripciones"""
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('pagado', 'Pagado'),
        ('procesando', 'Procesando'),
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]
    
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='pedidos')
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='pendiente')
    notas = models.TextField(blank=True, null=True)
    
    def str(self):
        return f"Pedido #{self.id} - {self.usuario.get_full_name()}"


class PedidoItem(models.Model):
    """Items dentro de un pedido"""
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='items')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    
    def str(self):
        return f"{self.cantidad}x {self.producto.nombre}"


class Pago(models.Model):
    """Pagos de pedidos"""
    METODO_CHOICES = [
        ('tarjeta', 'Tarjeta de Crédito/Débito'),
        ('transferencia', 'Transferencia Bancaria'),
        ('mercadopago', 'MercadoPago'),
        ('paypal', 'PayPal'),
    ]
    
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
        ('reembolsado', 'Reembolsado'),
    ]
    
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='pagos')
    metodo = models.CharField(max_length=20, choices=METODO_CHOICES)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='pendiente')
    fecha_pago = models.DateTimeField(null=True, blank=True)
    referencia_externa = models.CharField(max_length=100, blank=True, null=True)
    
    def str(self):
        return f"Pago #{self.id} - {self.pedido.id} ({self.estado})"


# ==================== SUSCRIPCIONES ====================

class Suscripcion(models.Model):
    """Suscripciones de usuarios a planes premium"""
    TIPO_CHOICES = [
        ('basico', 'Básico'),
        ('premium', 'Premium'),
        ('pro', 'Pro'),
    ]
    
    ESTADO_CHOICES = [
        ('activa', 'Activa'),
        ('vencida', 'Vencida'),
        ('cancelada', 'Cancelada'),
    ]
    
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='suscripciones')
    tipo = models.CharField(max_length=15, choices=TIPO_CHOICES)
    precio_mensual = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_inicio = models.DateField()
    fecha_renovacion = models.DateField()
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='activa')
    
    def str(self):
        return f"{self.usuario.get_full_name()} - {self.get_tipo_display()}"