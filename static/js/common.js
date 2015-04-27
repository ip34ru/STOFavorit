/**
 * Created by admin on 12.03.2015.
 */





(function() {

    var app = {

        // -- инициализация при загрузке js
        initialize : function () {
            var _this = this;

            _this.setUpListeners();

            app.checkValue = 0;
        },
         // -- инициализация при загрузке js

        // -- обработчик событий над DOM элементами на странице
        setUpListeners: function () {

            // -- слайдер к блоку с контактами
            $('.scroll-services__link').on('click', app.scrollToServices);
            // -- слайдер к блоку с контактами

            // -- слайдер к блоку о сотрудничестве
            $('.scroll-cooperartion__link').on('click', app.scrollToCooperation);
            // -- слайдер к блоку о сотрудничестве

            // -- слайдер к блоку с инфой о компании
            $('.scroll-about_company__link').on('click', app.scrollToSlider);
            // -- слайдер к блоку с инфой о компании

            // -- открыть модалку с контактами
            $('.scroll-contacts__link').on('click', app.showContactsModal);
            // -- открыть модалку с контактами

            // -- открыть модалку с заказом обратного звонка
            $('.call-back-order').on('click', app.showCallBackModal);
            // -- открыть модалку с заказом обратного звонка

            // -- нажата кнопка заказа услуги
            $('.do-order-btn').on('click', app.sendOrderData);
            // -- нажата кнопка заказа услуги

            // -- нажата кнопка заказа обратного звонка
            $('.do-call-btn').on('click', app.sendCallBack);
            // -- нажата кнопка заказа обратного звонка

            // -- когда закрывается модальное окно
            $('.modal').on('hide.bs.modal', function (e) {
                $('.modal').find('#error-div').removeClass('bg-success').removeClass('bg-danger').text('');
                $('.form-control').val('');
                $('.modal').find(".checkbox-userv").removeAttr("checked");
                app.checkValue = 0;
            });
            // -- когда закрывается модальное окно

        },
        // -- обработчик событий над DOM элементами на странице

        // -- функции вызываемые из setUpListeners ===============

         // -- отправка данных из модальной формы обратного звонка
        sendCallBack: function (e) {
            e.preventDefault();

            var form = $(this).parents('.modal-content').find('.form_callback'),
                str = '',
                valPhone = $(this).parents('.modal-content').find('#inputPhoneCallBack').val(),
                rePhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
                submitBtn =  $(this).parents('.modal-content').find('.do-call-btn');

            if(valPhone.length === 0){
                $(this).parents('.modal-content').find('#error-div').removeClass('bg-success').addClass('bg-danger').text('Необходимо ввести номер телефона!');
                return false;
            } else {
                var validPhone = rePhone.test(valPhone);
                if (!validPhone) {
                    $(this).parents('.modal-content').find('#error-div').removeClass('bg-success').addClass('bg-danger').text('Необходимо ввести правильный номер телефона!');
                    return false;
                }
            }
            valPhone = valPhone.replace(/[+()-]/g, "");

            submitBtn.attr({disabled: 'disabled'}); // защита от повторного нажатия + показываем загрузчик
            str = form.serialize();
            str = str + 'inputPhoneCallBack=' + valPhone;

            $.ajax({
                type: "POST",
                url: "/callback",
                dataType: 'json',
                data: str
            }).done(
                $(this).parents('.modal-content').find('#error-div').removeClass('bg-danger').addClass('bg-success').text('Ваша заявка принята! В ближайшее время с вами свяжется наш менеджер.')
            ).always(function(){
                submitBtn.removeAttr('disabled');
            });

        },
        // -- отправка данных из модальной формы обратного звонка

        // -- отправка данных из модальной формы
        sendOrderData: function (e) {
            e.preventDefault();

            var form = $(this).parents('.modal-content').find('.send-order-data-form'),
                str = '',
                submitBtn = $(this).parents('.modal-content').find('.do-order-btn'),
                checkBoxes = $(this).parents('.modal-content').find(".checkbox-userv"),
                valPhone = $(this).parents('.modal-content').find('#inputPhone').val(),
                rePhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
                valEmail =  $(this).parents('.modal-content').find('#inputEmail').val(),
                reEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
                theActiveId = $(this).parents('.bs-example-modal-lg').attr('id'); // выбираем id активного элемента;

            console.log( theActiveId );

            $.each( checkBoxes , function(index, val) {
                var currentItem = $(val);
                    if (currentItem.prop("checked")) {
                        app.checkValue = app.checkValue + 1
                    }
            });

            if ( app.checkValue === 0 ) {
                $(this).parents('.modal-content').find('#error-div').removeClass('bg-success').addClass('bg-danger').text('Для заказа нужно выбрать хотя бы одну услугу!');
                return false
            }

            if(valPhone.length === 0){
                $(this).parents('.modal-content').find('#error-div').removeClass('bg-success').addClass('bg-danger').text('Необходимо ввести номер телефона!');
                return false;
            } else {
                var validPhone = rePhone.test(valPhone);
                if (!validPhone) {
                    $(this).parents('.modal-content').find('#error-div').removeClass('bg-success').addClass('bg-danger').text('Необходимо ввести правильный номер телефона!');
                    return false;
                }
            }
            valPhone = valPhone.replace(/[+()-]/g, "");

            if (valEmail.length != 0) {
                var validEmail = reEmail.test(valEmail);
                if (!validEmail) {
                    $(this).parents('.modal-content').find('#error-div').removeClass('bg-success').addClass('bg-danger').text('Адрес электронной почты не соотвествует формату. Введите правильный email!');
                    return false;
                }
            }

            submitBtn.attr({disabled: 'disabled'}); // защита от повторного нажатия + показываем загрузчик
            str = form.serialize();
            str = str + '&inputPhone=' + valPhone;

            app.checkValue = 0;

            if ( theActiveId === 'modalOrder10' ) {

                $.ajax({
                    type: "POST",
                    url: "/submitip34",
                    dataType: 'json',
                    data: str
                }).done(
                    $(this).parents('.modal-content').find('#error-div').removeClass('bg-danger').addClass('bg-success').text('Ваша заявка принята! В ближайшее время с вами свяжется наш менеджер.')
                ).always(function(){
                    submitBtn.removeAttr('disabled');
                });

            } else {

                $.ajax({
                    type: "POST",
                    url: "/submit",
                    dataType: 'json',
                    data: str
                }).done(
                    $(this).parents('.modal-content').find('#error-div').removeClass('bg-danger').addClass('bg-success').text('Ваша заявка принята! В ближайшее время с вами свяжется наш менеджер.')
                ).always(function(){
                    submitBtn.removeAttr('disabled');
                });

            }

        },
        // -- отправка данных из модальной формы

        // -- открыть модалку с заказом обратного звонка
        showCallBackModal: function (e) {
            e.preventDefault();

            $('#modalCallBack').modal(
                'show'
            )
        },
        // -- открыть модалку с заказом обратного звонка

        // -- открыть модалку с контактами
        showContactsModal: function (e) {
            e.preventDefault();

            $('#modalContacts').modal(
                'show'
            )
        },
        // -- открыть модалку с контактами


        // -- функция скролла к слайдеру о компании
        scrollToSlider: function (e) {
            e.preventDefault();

            var offset = $('.slider-block').offset().top;

            $('html, body').animate({scrollTop: (offset -0)},800);

        },
        // -- функция скролла к слайдеру о компании

        // -- функция скролла к сотрудничеству
        scrollToCooperation: function (e) {
            e.preventDefault();

            var offset = $('.cooperation-block').offset().top;

            $('html, body').animate({scrollTop: (offset -0)},800);

        },
        // -- функция скролла к сотрудничеству

        // -- функция скролла к услугам
        scrollToServices: function (e) {
            e.preventDefault();

            var offset = $('.service-block').offset().top;

            $('html, body').animate({scrollTop: (offset -0)},800);

        },
        // -- функция скролла к услугам

        // -- пустая функция чтоб не было ошибки с запятой у сетаплистенеров
        someFunction: function () {}
        // -- пустая функция чтоб не было ошибки с запятой у сетаплистенеров

        // -- функции вызываемые из setUpListeners ===============

    }

    app.initialize();




}());






























