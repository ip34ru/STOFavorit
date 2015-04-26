__author__ = 'User'
# -*- coding: utf-8 -*-
from django.db import models

# Create your models here.

# Модель услуги
class Service(models.Model):
    class Meta():
        db_table = "services"
        verbose_name = "Услуга"
        verbose_name_plural = "Услуги"


    title = models.CharField(max_length=255, verbose_name="Название")
    unnumber = models.CharField(max_length=20, verbose_name="Уникальный идентификатор", null=True)
    description = models.TextField(verbose_name="Описание")
    photo = models.CharField(max_length=255, verbose_name="Изображение", null=True)

    def __unicode__(self):
        return self.title

# Модель подуслуги
class UServices(models.Model):
    class Meta():
        db_table = "uservices"
        verbose_name = "Список услуг"
        verbose_name_plural = "Список услуг"



    MEASURE_CHOICES = (
        (None, 'нет'),
        ('HOUR', 'час'),
        ('FLOOR', 'этаж'),
        ('SMETR', 'кв.метр'),
        ('DOT', 'точка'),
        ('ITEM', 'шт.'),
        ('KG', 'кг.'),
        ('L', 'литр'),
        ('LMETR', 'метр'),
    )

    title = models.CharField(max_length=255, verbose_name="Название")
    unnumber = models.CharField(max_length=20, verbose_name="Уникальный идентификатор", null=True)
    price = models.CharField(max_length=20, verbose_name="Цена")
    measure = models.CharField(max_length=10, choices=MEASURE_CHOICES, default=None, verbose_name="Ед. измерения", null=True, blank=True)
    note = models.CharField(max_length="255", verbose_name="Примечание", null=True, blank=True)
    changed = models.BooleanField(default=False, verbose_name="Выбрать услугу")
    service = models.ForeignKey(Service)

    def __unicode__(self):
        return self.title

# Модель для блока Сотрудничество
class Cooperation(models.Model):
    class Meta():
        db_table = 'cooperation'
        verbose_name = "Сотрудничество"
        verbose_name_plural = "Сотрудничество"

    text = models.TextField(verbose_name="Ваш текст")


class History(models.Model):
    class Meta():
        db_table = 'history'
        verbose_name = 'История заказов'
        verbose_name_plural = 'История заказов'

    service = models.CharField(max_length=255, verbose_name="Услуга")
    uservice = models.CharField(max_length=255, verbose_name="Выбранные подуслуги")
    phone = models.CharField(max_length=15, verbose_name="Телефон")
    email = models.EmailField(verbose_name="E-mail", null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True, verbose_name="Дата заказа")
    complete = models.BooleanField(default=False, verbose_name="Выполнен?")

    def __unicode__(self):
        return self.service