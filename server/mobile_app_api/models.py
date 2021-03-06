from django.db import models

class User(models.Model):
    name = models.CharField(max_length=30)
    user_name = models.CharField(max_length=30)
    company = models.CharField(max_length=30)
    phone = models.CharField(max_length=30)
    email = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=100,)
    user_authority = models.CharField(max_length=100,)
    active = models.CharField(max_length=100,)
    technical_authority = models.CharField(max_length=1000,)
    reset_time = models.DateTimeField(null=True,blank=True)
    reset_id = models.CharField(max_length=100,)
    
class MetaData_Main(models.Model):
    technical_category = models.CharField(max_length=100, null=True, blank=True)
    equipment_name = models.CharField(max_length=100, null=True, blank=True)
    nfc_tag = models.CharField(max_length=100, null=True, blank=True)
    service_interval = models.CharField(max_length=100, null=True, blank=True)
    legit = models.CharField(max_length=100, null=True, blank=True)
    expected_service = models.DateTimeField(null=True,blank=True)
    latest_service = models.DateTimeField(null=True,blank=True)
    contacts = models.CharField(max_length=1000, null=True, blank=True)
    longitude = models.CharField(max_length=100, null=True, blank=True)
    latitude = models.CharField(max_length=100, null=True, blank=True)
    reminder_month = models.CharField(max_length=100, null=True, blank=True)
    reminder_week = models.CharField(max_length=100, null=True, blank=True)
    reminder_flag = models.CharField(max_length=100, null=True, blank=True)
    meta_data_picture = models.ImageField(max_length=100, null=True, blank=True, upload_to='') 

class MetaData_Archive(models.Model):
    technical_category = models.CharField(max_length=100, null=True, blank=True)
    equipment_name = models.CharField(max_length=100, null=True, blank=True)
    nfc_tag = models.CharField(max_length=100, null=True, blank=True)
    service_interval = models.CharField(max_length=100, null=True, blank=True)
    legit = models.CharField(max_length=100, null=True, blank=True)
    expected_service = models.DateTimeField(null=True,blank=True)
    latest_service = models.DateTimeField(null=True,blank=True)
    contacts = models.CharField(max_length=1000, null=True, blank=True)
    longitude = models.CharField(max_length=100, null=True, blank=True)
    latitude = models.CharField(max_length=100, null=True, blank=True)
    active_id = models.CharField(max_length=100, null=True, blank=True)
    meta_data_picture = models.ImageField(max_length=100, null=True, blank=True, upload_to='')

class TechnicalCatergory(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)

class MetaData_Activity(models.Model):
    equipment_name = models.CharField(max_length=100, null=True, blank=True)
    service_repair = models.CharField(max_length=100, null=True, blank=True)
    latest_service = models.DateTimeField(null=True,blank=True)
    due_time = models.CharField(max_length=100, null=True, blank=True)
    serviced_by = models.CharField(max_length=100, null=True, blank=True)
    comment = models.CharField(max_length=1000, null=True, blank=True)

class ActiveLog(models.Model):
    page = models.CharField(max_length=100, null=True, blank=True)
    column_name = models.CharField(max_length=100, null=True, blank=True)
    column_id = models.CharField(max_length=100, null=True, blank=True)
    from_by = models.CharField(max_length=100, null=True, blank=True)
    to_by = models.CharField(max_length=100, null=True, blank=True)
    user_by = models.CharField(max_length=100, null=True, blank=True)
    modify_date = models.DateTimeField(max_length=100, null=True, blank=True)

class ReportFile(models.Model):
    equipment_name = models.CharField(max_length=1000, null=True, blank=True)
    equipment_id = models.CharField(max_length=1000, null=True, blank=True)
    service_repair = models.CharField(max_length=100, null=True, blank=True)
    active_flag = models.CharField(max_length=100, null=True, blank=True)
    created_date = models.DateTimeField(null=True,blank=True)
    update_date = models.DateTimeField(null=True,blank=True)
    report_data = models.ImageField(max_length=100, null=True, blank=True, upload_to='') 



