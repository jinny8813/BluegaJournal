from django.urls import path
from . import views

app_name = 'planner'

urlpatterns = [
    path('configs', views.get_configs, name='get_configs'),
    path('generate-pdf', views.generate_pdf, name='generate-pdf'),
]
