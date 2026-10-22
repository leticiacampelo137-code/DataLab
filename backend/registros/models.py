from django.db import models


class Registro(models.Model):
    nome = models.CharField(max_length=150)
    categoria = models.CharField(max_length=100)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

