# Generated by Django 4.2.20 on 2025-06-12 17:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='like',
            name='review',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.review'),
        ),
    ]
