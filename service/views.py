# -*- coding: utf-8 -*-
from django.http.response import HttpResponse, HttpResponseNotFound
from django.shortcuts import render_to_response
from header.models import Logo, Contact, ModalContact
from service.models import Service, UServices, Cooperation, History
from slider.models import SlideHead, SlideReview
from PanelTabs.models import TabItem
from django.core.context_processors import csrf
from django.db import connection
from django.core.mail import send_mail
import smsru


# Create your views here.

def home(request):
    args = {}
    args['logo'] = Logo.objects.all()
    args['contacts'] = Contact.objects.all()
    args['contacts_modal'] = ModalContact.objects.all()
    args['services'] = Service.objects.all()
    args['cooperation'] = Cooperation.objects.all()
    args['slides_head'] = SlideHead.objects.all()
    args['slides_review'] = SlideReview.objects.all()
    args['tabs'] = TabItem.objects.all()
    args['uservices'] = UServices.objects.all()

    uservices = connection.cursor()
    uservices.execute("""
        SELECT *
        FROM uservices, services
        WHERE uservices.service_id = services.id;
    """)
    args['uservices_list'] = uservices.fetchall()

    tabs = connection.cursor()
    tabs.execute("""
        SELECT *
        FROM tab_item_list, tab_item
        WHERE tab_item_list.tab_id = tab_item.id;
    """)
    args['tabs_item'] = tabs.fetchall()


    slide_list = connection.cursor()
    slide_list.execute("""
        SELECT *
        FROM slider_list, slider_head
        WHERE slider_list.slide_id = slider_head.id;
    """)
    args['all_slides_list'] = slide_list.fetchall()
    return render_to_response('index.html', args)


def submit(request):
    args = {}
    args.update((csrf(request)))

    if request.is_ajax():
        if request.method == 'POST':
            uservice = request.POST.get('service', '')
            email = request.POST.get('inputEmail', '')
            phone = request.POST.get('inputPhone', '')
            service = Service.objects.get(unnumber=uservice)
            service_uni = service.title
            lists = dict(request.POST)

            sms_msg = uservice + ';'
            stroka = ""

            list = []
            for key, value in lists.items():
                if value == ['on']:
                    list.append(key)
                    sms_msg = sms_msg + key + ';'

            service_title = UServices.objects.filter(unnumber__in=list)

            for item in service_title:
                stroka = stroka + item.title + '; '

            service_title = stroka

            # формируем данные для почты и для sms
            subject = u"Заявка на услугу %s" % service_uni
            msg = u"Были заказаны услуги: %s" % service_title
            msg = msg + u'\n' + u'Клиент: телефон = ' + phone + u'; email = ' + email
            sms_msg = sms_msg + phone + ';' + email

            # Отправка email и sms сообщения
            send_mail(subject, msg, 'taksenov@gmail.com', ['taksenov@gmail.com', 'servicecenter86@bk.ru'])

            # указан номер телефона владельца бизнеса, он же регистрируется на sms.ru и платит за смс сообщения
            cli = smsru.Client()
            cli.send("+79088892071", sms_msg)

            # записываем данные в таблицу с историей заявок
            history = History(
                service=service_uni,
                uservice=service_title,
                phone=request.POST.get('inputPhone', ''),
                email=request.POST.get('inputEmail', ''),
            )
            history.save()

            return HttpResponse("POST")
        else:
            return HttpResponseNotFound('<h1>Page not found</h1>')


# Форма зазать обратный звонок
def callback(request):
    if request.is_ajax() and request.method == 'POST':
        phone = request.POST.get('inputPhoneCallBack', '')
        sender = 'servicecenter86@bk.ru'

        subject = u"Заказ обратного звонка %s" % phone
        msg = u"Перезвоните мне пожалуйста на номер: %s" % phone
        sms_msg = u"Please contact me: %s" % phone

        send_mail(subject, msg, 'taksenov@gmail.com', [sender])

        cli = smsru.Client()
        cli.send("+79088892071", sms_msg)

        return HttpResponse("POST")
    else:
        return HttpResponseNotFound('<h1>Page not found</h1>')


# здесь только отправка электронной почты на мой ящик taksenov@gmail.com
def ip34(request):
    args = {}
    args.update((csrf(request)))

    if request.is_ajax():
        if request.method == 'POST':
            email = request.POST.get('inputEmail', '')
            phone = request.POST.get('inputPhone', '')

            # формируем данные для почты и для sms
            subject = u"Заявка на IT-автоматизацию"
            msg = u"Прошу вас связаться со мной, я хочу заказать услуги по IT-автоматизации. "
            msg = msg + u'\n' + u'Клиент: телефон = ' + phone + u'; email = ' + email

            # Отправка email и sms сообщения
            send_mail(subject, msg, 'taksenov@gmail.com', ['taksenov@gmail.com'])

            return HttpResponse("POST")
        else:
            return HttpResponseNotFound('<h1>Page not found</h1>')

