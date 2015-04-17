__author__ = 'User'
from django.conf.urls import patterns, include, url
from service import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'blog.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    # url(r'^service/(?P<service_id>\d+)/$', views.more, name='more'),
    url(r'^callback$', views.callback, name='callback'),
    url(r'^submit$', views.submit, name='submit'),
    url(r'^$', views.home)
)
