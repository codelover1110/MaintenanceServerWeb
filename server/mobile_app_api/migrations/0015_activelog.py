# Generated by Django 2.1.15 on 2020-12-01 01:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mobile_app_api', '0014_auto_20201127_1929'),
    ]

    operations = [
        migrations.CreateModel(
            name='ActiveLog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('page', models.CharField(blank=True, max_length=100, null=True)),
                ('column_name', models.CharField(blank=True, max_length=100, null=True)),
                ('column_id', models.CharField(blank=True, max_length=100, null=True)),
                ('from_by', models.CharField(blank=True, max_length=100, null=True)),
                ('to_by', models.CharField(blank=True, max_length=100, null=True)),
                ('user_by', models.CharField(blank=True, max_length=100, null=True)),
                ('modify_date', models.DateTimeField(blank=True, max_length=100, null=True)),
            ],
        ),
    ]
