from django.urls import path
from . import views

app_name = 'planner'

urlpatterns = [
    path('configs', views.get_configs, name='get_configs'),
    path('generate-pdf', views.generate_pdf, name='generate-pdf'),
    path('test-pdf', views.test_generate_pdf, name='test-generate-pdf'),
]
