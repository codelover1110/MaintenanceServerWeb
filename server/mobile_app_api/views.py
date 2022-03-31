from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import User, TechnicalCatergory, MetaData_Main, MetaData_Activity, MetaData_Archive, ActiveLog, ReportFile
from django.http import JsonResponse
from django.forms.models import model_to_dict
import json
from django.core import serializers

from datetime import datetime
from dateutil.parser import parse
import pandas as pd

from django.core.mail import send_mail

from django.template import Context
from django.template.loader import render_to_string, get_template
from django.core.mail import EmailMessage
import random
import string
import threading
import time
from django.utils import timezone

# Create your views here.


def getUser(request, email, password):
    try:
        user = get_object_or_404(User, email=email)
        if user.password == password:
            if user.active == 'Active':
                data = {
                    'email': user.email,
                    'password': user.password
                }
            else:
                return JsonResponse({'active': 'Inactive'})

        else:
            data = {
                'email': user.email,
                'password': ''
            }
    except:
        data = {
            'email': '',
            'password': ''
        }
    return JsonResponse(data)


def getAdminUser(request):
    userInfor = json.loads(request.body.decode('utf-8'))
    username = userInfor['username']
    try:
        user = get_object_or_404(User, user_name=username)
        if user.password == userInfor['password']:
            if user.user_authority == 'Admin' and user.active == 'Active':
                data = {
                    'user_name': user.user_name,
                    'password': user.password
                }
            else:
                return JsonResponse({'Authority': 'false'})
        else:
            data = {
                'user_name': user.user_name,
                'password': ''
            }
    except:
        data = {
            'user_name': '',
            'password': ''
        }

    return JsonResponse(data)

def getUserMobile(request, user_name, password):
    try:
        user = get_object_or_404(User, user_name=user_name)
        if user.password == password:
            if user.active == 'Active':
                data = {
                    'user_name': user.user_name,
                    'password': user.password,
                    'autherity': user.user_authority,
                    'user_email': user.email
                }
                print(data)

            else:
                return JsonResponse({'Authority': 'false'})
        else:
            data = {
                'user_name': user.user_name,
                'password': ''
            }
    except:
        data = {
            'user_name': '',
            'password': ''
        }

    return JsonResponse(data)


def getAdminUsers(request):
    users = User.objects.all()
    user_list = []
    for user in users:
        item = model_to_dict(user)
        user_list.append(item)

    return JsonResponse(user_list, safe=False)


def addUser(request):
    try:
        User.objects.create(
            name=request.POST['name'],
            email=request.POST['email'],
            password=request.POST['password'],
            active="Inactive",
            authority="Mobile"
        )
        data = {"success": "true"}
    except:
        data = {"success": "false"}

    return JsonResponse(data)


def addAdminUser(request):
    if request.method == "POST":
        details = json.loads(request.body.decode('utf-8'))
    try:
        User.objects.create(
            email=details['email'],
            password=details['password'],
            user_name=details['username']
        )
        data = {"success": "true"}
    except:
        data = {"success": "false"}

    return JsonResponse(data)


# CRUD user at Web page
def createUser(request):
    content = json.loads(request.POST.get('content'))
    print(content)
    try:
        test = model_to_dict(User.objects.get(user_name=content['user_name']))
        if test['user_name'] != '':
            return JsonResponse({"success": "false"})
        email_test = model_to_dict(User.objects.get(email=content['email']))
        if email_test['email'] != '':
            return JsonResponse({"success": "email_false"})
    except:
        print("ok")
    # try:
    user_object = User.objects.create(
        user_name=content['user_name'],
        name=content['name'],
        email=content['email'],
        password=content['password'],
        company=content['company'],
        phone=content['phone'],
        user_authority=content['user_authority'],
        active=content['active'],
        technical_authority=content['technical_authority']
    )
    newDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    for userDataItem in content:
        if content[userDataItem] == "":
            continue
        if  userDataItem == "technical_authority":
            convertJsonOld = json.loads(content[userDataItem])
            newString = ''
            for item in convertJsonOld:
                newString = newString + (item['label']) + ' '
            ActiveLog.objects.create(
                page = 'AdminPage',
                column_name = userDataItem,
                column_id = user_object.id,
                from_by = '',
                to_by = newString,
                user_by = content['by_user'],
                modify_date = newDate
            )
            continue

        if userDataItem == "password":
            ActiveLog.objects.create(
                page = 'AdminPage',
                column_name = userDataItem,
                column_id = user_object.id,
                from_by = "",
                to_by = "*****",
                user_by = content['by_user'],
                modify_date = newDate
            )
            continue
        ActiveLog.objects.create(
        page = 'AdminPage',
        column_name = userDataItem,
        column_id = user_object.id,
        from_by = "",
        to_by = content[userDataItem],
        user_by = content['by_user'],
        modify_date = newDate
        )
    data = {"success": "true"}
    # except:
    #     data = {"success": "email_false"}
    return JsonResponse(data)


def editUser(request, id):
    user = model_to_dict(User.objects.get(id = id))
    activeLogs = ActiveLog.objects.filter(column_id = id, page = 'AdminPage').all()
    if len(activeLogs) > 0:
        serialized_obj = serializers.serialize('json', [ activeLogs[(len(activeLogs) - 1)], ])
    else:
        serialized_obj = '[]'
    user['active_log'] = serialized_obj
    return JsonResponse(user)


def updateUser(request, id):
    content = json.loads(request.POST.get('content'))
    try:
        test = model_to_dict(User.objects.get(user_name=content['user_name']))
        if test["id"] != int(id):
            return JsonResponse({"success": "false"})
        email_test = model_to_dict(User.objects.get(email=content['email']))
        if email_test['email'] != content['email']:
            return JsonResponse({"success": "email_false"})
    except:
        print("ok")
    metaData = User.objects.get(id=id)
    convertUserData = model_to_dict(User.objects.get(id = id))
    for userDataItem in convertUserData:
        if userDataItem == 'id' or userDataItem == "reset_time" or userDataItem == "reset_id":
            continue
        if convertUserData[userDataItem] != content[userDataItem]:
            newDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            if userDataItem == 'password':
                ActiveLog.objects.create(
                    page = 'AdminPage',
                    column_name = userDataItem,
                    column_id = id,
                    to_by = "*****",
                    from_by = "****",
                    user_by = content['by_user'],
                    modify_date = newDate
                )
                continue
            if  userDataItem == "technical_authority":
                convertJsonOld = json.loads(content[userDataItem])
                convertJsonNew = json.loads(convertUserData[userDataItem])
                newString = ''
                oldString = ''
                print(type(convertJsonOld))
                if type(convertJsonOld) == 'NoneType' or type(convertJsonNew) == 'NoneType':
                    continue
                for item in convertJsonOld:
                    newString = newString + (item['label']) + ' '
                for item in convertJsonNew:
                    oldString = oldString + (item['label']) + ' '
                ActiveLog.objects.create(
                    page = 'AdminPage',
                    column_name = userDataItem,
                    column_id = id,
                    to_by = newString,
                    from_by = oldString,
                    user_by = content['by_user'],
                    modify_date = newDate
                )
                continue
            ActiveLog.objects.create(
                page = 'AdminPage',
                column_name = userDataItem,
                column_id = id,
                to_by = content[userDataItem],
                from_by = convertUserData[userDataItem],
                user_by = content['by_user'],
                modify_date = newDate
            )
    try:
        user = User.objects.get(id=id)
        user.name = content['name']
        user.user_name = content['user_name']
        user.phone = content['phone']
        user.password = content['password']
        user.email = content['email']
        user.user_authority = content['user_authority']
        user.active = content['active']
        user.company = content['company']
        user.technical_authority = content['technical_authority']
        user.save()
        data = {"success": "true"}
        if (metaData.email).strip() != (content['email']).strip():
            metaDatas = MetaData_Main.objects.all()
            for metaDataItem in metaDatas:
                item = model_to_dict(metaDataItem)
                convertJsons = (item.get('contacts')).replace(metaData.email, content['email'])
                updateMetaData = MetaData_Main.objects.get(id=item.get('id'))
                updateMetaData.contacts = convertJsons
                updateMetaData.save()
                continue
    except:
        print("final_except")
        data = {"success": "email_false"}
    return JsonResponse(data)


def home(request):
    return HttpResponse('Hello, Server!')


def deleteAdminUser(request, id):
    user = User.objects.get(id=id)
    if user:
        user.delete()
        return JsonResponse({'success': 'true'})
    else:
        return JsonResponse({'success': 'false'})


def deleteCustomerUser(request, id):
    user = VoteData.objects.get(id=id)
    if user:
        user.delete()
        return JsonResponse({'success': 'true'})
    else:
        return JsonResponse({'success': 'false'})


# CRUD metamain data
def createMetaMainData(request):
    try:
        metaImage = (request.FILES['cover'])
    except:
        metaImage = {}
    content = json.loads(request.POST.get('content'))
    check_nfc1 = MetaData_Archive.objects.filter(nfc_tag=content['nfc_tag']).all()
    check_nfc = MetaData_Main.objects.filter(nfc_tag=content['nfc_tag']).all()
    check_equipment1 = MetaData_Archive.objects.filter(equipment_name=content['equipment_name']).all()
    check_equipment = MetaData_Main.objects.filter(equipment_name=content['equipment_name']).all()
    if len(check_equipment) > 0 or len(check_equipment1) > 0:
        return  JsonResponse({"success": "equipment", "equipment_name": content['equipment_name']})
    if len(check_nfc) > 0 or len(check_nfc1) > 0:
        return JsonResponse({"success": "nfc", "nfc_tag": content['nfc_tag']})
    metaData_object = MetaData_Main.objects.create(
        meta_data_picture=metaImage,
        technical_category=content['technical_category'],
        equipment_name=content['equipment_name'],
        nfc_tag=content['nfc_tag'],
        service_interval=content['service_interval'],
        legit=content['legit'],
        expected_service=content['expected_service'],
        latest_service=content['latest_service'],
        contacts=content['contacts'],
        reminder_month=content['reminder_month'],
        reminder_week=content['reminder_week'],
        reminder_flag='0',
        longitude=content['longitude'],
        latitude=content['latitude'],
    )
    newDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
   
    for userDataItem in content:
        if content[userDataItem] == "" or userDataItem == "contacts" or userDataItem == "latest_service" or userDataItem == "by_user":
            continue
        if userDataItem == "legit":
            ActiveLog.objects.create(
            page = 'MetadataPage',
            column_name = 'legal',
            column_id = metaData_object.nfc_tag,
            from_by = "",
            to_by = content[userDataItem],
            user_by = content['by_user'],
            modify_date = newDate
            )
            continue
        ActiveLog.objects.create(
            page = 'MetadataPage',
            column_name = userDataItem,
            column_id = metaData_object.nfc_tag,
            from_by = "",
            to_by = content[userDataItem],
            user_by = content['by_user'],
            modify_date = newDate
        )
    data = {"success": "true", "data": metaData_object.id}

    return JsonResponse(data)

def uploadReport(request):
    try:
        metaImage = (request.FILES['cover'])
    except:
        metaImage = {}
    content = json.loads(request.POST.get('content'))
    newDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(newDate)
    print(content)
    reportData_object = ReportFile.objects.create(
        report_data = metaImage,
        equipment_name = content['equipment_name'],
        equipment_id = content['equipment_id'],
        service_repair = content['service_repair'],
        active_flag = 'true',
        created_date = newDate,
        update_date = newDate,
    )
    data = {"success": "true", "data": reportData_object.id}

    return JsonResponse(data)

def getMetaMaindatas(request):
    metaDatas = MetaData_Main.objects.all()
    data_list = []
    x = threading.Thread(target=thread_func, args=("AnJongHyok",))
    x.start()
    for metaData in metaDatas:
        item = model_to_dict(metaData)
        if (item.get('meta_data_picture')):
            item['meta_data_picture'] = str(item.get('meta_data_picture'))
        data_list.append(item)
    return JsonResponse(data_list, safe=False)


def getAllReport(request):
    metaDatas = ReportFile.objects.all()
    data_list = []
    for metaData in metaDatas:
        item = model_to_dict(metaData)
        if (item.get('report_data')):
            item['report_data'] = str(item.get('report_data'))
        data_list.append(item)
    return JsonResponse(data_list, safe=False)


def thread_func(arg1):
    while True:
        metaDatas = MetaData_Main.objects.all()
        for metaData in metaDatas:
            item = model_to_dict(metaData)
            if ((item["reminder_month"] == None) or item["reminder_month"] == ""):
                reminderMonth = 0
            else:
                reminderMonth = int(item["reminder_month"])
            if (item["reminder_week"] == None or item["reminder_week"] == ""):
                reminderWeek = 0
            else:
                reminderWeek = int(item["reminder_week"])

            diff = (((item["expected_service"]).replace(tzinfo=None) - (datetime.now())).total_seconds())/3600
            reminderTime = (reminderMonth * 30 * 24) + (reminderWeek * 7 * 24)
            nowDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            if ((diff < reminderTime)):
              if(item["reminder_flag"] != '1'):
                convertJsons = json.loads(item["contacts"])
                for convertJson in convertJsons:
                    contact_email = (convertJson['label'])
                    user_name = (model_to_dict(User.objects.get(email=contact_email)))["user_name"]
                    sendmailReminder(user_name, contact_email, nowDate, item["expected_service"], item["equipment_name"], item["technical_category"])
                main_data = get_object_or_404(MetaData_Main, id=item["id"])
                main_data.reminder_flag = "1"
                main_data.save()
        time.sleep(10)

def sendmailReminder(user_name, user_email, reset_time, expected_date, equipment_name, technical_category):
    print(user_name, user_email, reset_time, expected_date, equipment_name)
    ctx = {
        'user': user_name,
        'reset_time': reset_time,
        'expected_date' : expected_date,
        'equipment_name' : equipment_name,
        'technical_catetory' : technical_category
    }
    message = get_template('reminder.html').render(ctx)
    msg = EmailMessage(
        'Subject',
        message,
        'norepleymaintenance@hotmail.com',
        [user_email],
    )
    msg.content_subtype = "html"  # Main content is now text/html
    msg.send()
    return HttpResponse('Mail successfully sent')

def getMetaMainData(request, id):
    metadata = model_to_dict(MetaData_Main.objects.get(id=id))
    metadata['meta_data_picture'] = str(metadata.get('meta_data_picture'))
    activeLogs = ActiveLog.objects.filter(column_id = id, page = 'MetadataPage').all()
    if len(activeLogs) > 0:
        serialized_obj = serializers.serialize('json', [ activeLogs[(len(activeLogs) - 1)], ])
    else:
        serialized_obj = '[]'
    metadata['active_log'] = serialized_obj
    return JsonResponse(metadata)

def getMetaMainDataTag(request, id):
    metadata = model_to_dict(MetaData_Main.objects.get(nfc_tag=id))
    metadata['meta_data_picture'] = str(metadata.get('meta_data_picture'))
    return JsonResponse(metadata)


def updateMetaMainData(request, id):
    try:
        metaData = MetaData_Main.objects.get(id=id)
        content = json.loads(request.POST.get('content'))
        convertMetaData = model_to_dict(MetaData_Main.objects.get(id = id))
        newDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        for metaDataItem in convertMetaData:
            if metaDataItem == 'id' or metaDataItem == 'meta_data_picture' or metaDataItem == 'reminder_flag' or metaDataItem == 'contacts':
                continue
            if metaDataItem == 'expected_service' or metaDataItem == 'latest_service':
                if (str(convertMetaData[metaDataItem]).split(' ')[0]).strip() != (content[metaDataItem]).strip(): 
                    ActiveLog.objects.create(
                        page = 'MetadataPage',
                        column_name = metaDataItem,
                        column_id = id,
                        to_by = content[metaDataItem],
                        from_by = str(convertMetaData[metaDataItem]).split(' ')[0],
                        user_by = content['by_user'],
                        modify_date = newDate
                    )
                    continue
                continue
            if metaDataItem == 'legit':
                ActiveLog.objects.create(
                    page = 'MetadataPage',
                    column_name = "legal",
                    column_id = id,
                    to_by = content[metaDataItem],
                    from_by = convertMetaData[metaDataItem],
                    user_by = content['by_user'],
                    modify_date = newDate
                )
                continue
            if convertMetaData[metaDataItem] != content[metaDataItem]:
                ActiveLog.objects.create(
                    page = 'MetadataPage',
                    column_name = metaDataItem,
                    column_id = id,
                    to_by = content[metaDataItem],
                    from_by = convertMetaData[metaDataItem],
                    user_by = content['by_user'],
                    modify_date = newDate
                )

        metaData.contacts = content['contacts']
        metaData.equipment_name = content['equipment_name']
        metaData.expected_service = content['expected_service']
        metaData.latest_service = content['latest_service']
        metaData.latitude = content['latitude']
        metaData.legit = content['legit']
        metaData.longitude = content['longitude']
        metaData.nfc_tag = content['nfc_tag']
        metaData.service_interval = content['service_interval']
        metaData.technical_category = content['technical_category']
        metaData.reminder_month = content['reminder_month']
        metaData.reminder_week = content['reminder_week']
        metaData.reminder_flag = '0'
        metaData.save()
        metaData.meta_data_picture.save(
        str(metaData.meta_data_picture), request.FILES['cover'])
        data = {"success": "false"}
    except:
        data = {"success": "true"}
    return JsonResponse(data)

def updateMetaMainDataLocation(request):
    print(request)
    id = request.POST["id"]
    metaData = MetaData_Main.objects.get(id=id)
    metaData.latitude = request.POST['latitude']
    metaData.longitude = request.POST['longitude']
    metaData.save()
    changedData = request.POST
    newDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    ActiveLog.objects.create(
        page = 'MetadataPage',
        column_name = 'latitude',
        column_id = id,
        to_by = changedData['latitude'],
        from_by = metaData.latitude,
        user_by = changedData['user_by'],
        modify_date = newDate
    )
    ActiveLog.objects.create(
        page = 'MetadataPage',
        column_name = 'longitude',
        column_id = id,
        to_by = changedData['longitude'],
        from_by = metaData.longitude,
        user_by = changedData['user_by'],
        modify_date = newDate
    )
    data = {"success": "true"}
    return JsonResponse(data)


def deleteMetaMainData(request, id, by_user):
    metaData = MetaData_Main.objects.get(id=id)
    if metaData:
        # metaData.delete()
        MetaData_Archive.objects.create(
            meta_data_picture=metaData.meta_data_picture,
            technical_category=metaData.technical_category,
            equipment_name=metaData.equipment_name,
            nfc_tag=metaData.nfc_tag,
            service_interval=metaData.service_interval,
            legit=metaData.legit,
            expected_service=metaData.expected_service,
            latest_service=metaData.latest_service,
            contacts=metaData.contacts,
            longitude=metaData.longitude,
            latitude=metaData.latitude,
            active_id=str(metaData.id)
        )
        convertMetaData = model_to_dict(MetaData_Main.objects.get(id=id))
        newDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        for metaDataItem in convertMetaData:
            if metaDataItem == 'id' or metaDataItem == 'meta_data_picture' or metaDataItem == 'reminder_flag' or metaDataItem == 'contacts':
                continue
            if metaDataItem == 'expected_service' or metaDataItem == 'latest_service':
                ActiveLog.objects.create(
                    page = 'MetadataPage',
                    column_name = metaDataItem,
                    column_id = id,
                    to_by = "",
                    from_by = str(convertMetaData[metaDataItem]).split(' ')[0],
                    user_by = by_user,
                    modify_date = newDate
                )
                continue
            ActiveLog.objects.create(
                page = 'MetadataPage',
                column_name = metaDataItem,
                column_id = id,
                to_by = "",
                from_by = convertMetaData[metaDataItem],
                user_by = by_user,
                modify_date = newDate
            )
        metaData.delete()
        return JsonResponse({'success': 'true'})
    else:
        return JsonResponse({'success': 'false'})

def deleteReportdata(request, id, flag):
    report_data = ReportFile.objects.get(id=id)
    if flag == 'true':
        active_flag = 'false'
    else:
        active_flag = 'true'
    report_data.active_flag = active_flag
    report_data.save()
    return JsonResponse({'success': 'true'})

def getMetaActivity(request, id):
    try:
        datas = MetaData_Activity.objects.filter(equipment_name=id).all()
        serialized_obj = serializers.serialize('json', datas)
        print(serialized_obj)
        return JsonResponse(serialized_obj, safe=False)
    except:
        return JsonResponse({'success': 'false'})


def getMetaActivityService(request, id):
    try:
        datas = (MetaData_Activity.objects.filter(equipment_name=id).all()).filter(service_repair='Service').all()
        serialized_obj = serializers.serialize('json', datas)
        return JsonResponse(serialized_obj, safe=False)
    except:
        return JsonResponse({'success': 'false'})


def getMetaArchiveDatas(request):
    metaDatas = MetaData_Archive.objects.all()
    data_list = []
    for metaData in metaDatas:
        item = model_to_dict(metaData)
        if (item.get('meta_data_picture')):
            item['meta_data_picture'] = str(item.get('meta_data_picture'))
        data_list.append(item)

    return JsonResponse(data_list, safe=False)


def getUserByID(request, id):
    user = model_to_dict(User.objects.get(user_name=id))
    return JsonResponse(user)

##################### Finish MetaMainData #############################

###### Maintenance start ###############

def getMaintenance(request):
    metaDatas = MetaData_Activity.objects.all()
    data_list = []
    for metaData in metaDatas:
        item = model_to_dict(metaData)
        data_list.append(item)

    return JsonResponse(data_list, safe=False)


def addMataArchive(request):
    newObj = MetaData_Activity.objects.create(
        equipment_name=request.POST['equipment_name'],
        service_repair=request.POST['service_repair'],
        latest_service=request.POST['latest_service'],
        due_time=request.POST['due_time'],
        serviced_by=request.POST['serviced_by'],
        comment=request.POST['comment'],
    )
    meta_id = request.POST['nfc_id']
    if (request.POST['service_repair'] == "Service"):
        metaData = MetaData_Main.objects.get(id=meta_id)
        metaData.expected_service = request.POST['expected_date']
        metaData.latest_service = request.POST['latest_service']
        metaData.save()
    metaArchive = request.POST
    
    newDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    for metaDataItem in metaArchive:
        if metaDataItem == 'id':
            continue
        ActiveLog.objects.create(
            page = 'Maintenance',
            column_name = metaDataItem,
            column_id = newObj.id,
            from_by = "",
            to_by = metaArchive[metaDataItem],
            user_by = request.POST['serviced_by'],
            modify_date = newDate
        )

    data = {"success": "true"}
    return JsonResponse(data)

# Technical Category


def getTechnicalCategory(request):
    categories = TechnicalCatergory.objects.all()
    data_list = []
    for category in categories:
        item = model_to_dict(category)
        data_list.append(item)

    return JsonResponse(data_list, safe=False)


def sendmail(user_name, user_email, reset_time, reset_id):
    routing_url = "http://cbmetervapp.ngrok.io/resetpassword?id=" + reset_id
    ctx = {
        'user': user_name,
        'reset_time': reset_time,
        'reset_url': routing_url
    }
    message = get_template('mail.html').render(ctx)
    msg = EmailMessage(
        'Subject',
        message,
        'norepleymaintenance@hotmail.com',
        [user_email],
    )
    msg.content_subtype = "html"  # Main content is now text/html
    msg.send()
    return HttpResponse('Mail successfully sent')

# Email Reset


def resetEmail(request):
    if request.method == "POST":
        email = json.loads(request.body.decode('utf-8'))
    try:
        user = get_object_or_404(User, email=email)
        newDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        newDate = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(20))
        user.reset_time = newDate
        user.reset_id = result_str
        user.save()
        sendmail(user.name, user.email, newDate, result_str)
        data = {
            'email': user.email
        }
    except:
        data = {
            'email': '',
        }

    return JsonResponse(data)


def checkResetID(request):
    if request.method == "POST":
        reset_id = json.loads(request.body.decode('utf-8'))
    try:
        user = get_object_or_404(User, reset_id=reset_id)
        current = datetime.now().timestamp()
        history = datetime.timestamp(user.reset_time)
        difference = (current - history)/3600
        if (difference < 24):
            data = {
                'reset_id': user.reset_id
            }
        else:
            data = {
                'reset_id': '',
            }

    except:
        data = {
            'reset_id': '',
        }

    return JsonResponse(data)


def resetPassword(request):
    if request.method == "POST":
        userInfor = json.loads(request.body.decode('utf-8'))
        password = userInfor['user_email']
        reset_id = userInfor['reset_id']
    try:
        user = get_object_or_404(User, reset_id=reset_id)
        user.password = password
        user.save()
        data = {
            'reset_id': reset_id,
        }
    except:
        data = {
            'reset_id': '',
        }

    return JsonResponse(data)


def resetEmailMobile(request):
    email = request.POST['email']
    try:
        user = get_object_or_404(User, email=email)
        newDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        newDate = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(20))
        user.reset_time = newDate
        user.reset_id = result_str
        user.save()
        sendmail(user.name, user.email, newDate, result_str)
        data = {
            'email': user.email
        }
    except:
        data = {
            'email': '',
        }
    return JsonResponse(data)

def getActiveLog(request, id):
    content = request.POST.get('content')
    print(content)
    activeLogs = ActiveLog.objects.filter(column_id = id, page = content).all()
    if len(activeLogs) > 0:
      serialized_obj = serializers.serialize('json', activeLogs)
    else:
      serialized_obj = '[]'
    return JsonResponse(serialized_obj, safe=False)

def getActiveDataAll(request):
  activeDatas = ActiveLog.objects.all()
  data_list = []
  for activeData in activeDatas:
    item = model_to_dict(activeData)
    data_list.append(item)

  return JsonResponse(data_list, safe=False)