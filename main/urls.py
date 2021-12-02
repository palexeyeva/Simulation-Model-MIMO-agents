from django.views.generic.base import RedirectView
from django.urls import path
from django.conf.urls import include, url


from . import views
# from Mimo import riddles

app_name = 'main'

urlpatterns = [
    path('', views.index)
    
]