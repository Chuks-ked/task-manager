from django.contrib import admin
from .models import Category, Task, CustomUser
# Register your models here.

# admin.site.register(CustomUser)
admin.site.register(Category)
admin.site.register(Task)