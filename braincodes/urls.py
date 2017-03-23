from django.conf.urls import url
from django.contrib import admin
from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$' , views.index),
    url(r'^compile-and-run/$', views.compile_and_run)
    ]
