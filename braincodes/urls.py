from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$' , views.index),
    url(r'^compile-and-run/$', views.compile_and_run)
    ]
