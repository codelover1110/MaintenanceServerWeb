# Generated by Django 3.1.1 on 2021-03-04 09:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mobile_app_api', '0017_reportfile'),
    ]

    operations = [
        migrations.AddField(
            model_name='reportfile',
            name='equipment_id',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
