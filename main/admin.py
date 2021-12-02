from django.contrib import admin

# Register your models here.

from .models import Option, Riddle, Values

admin.site.register(Riddle)
admin.site.register(Option)
admin.site.register(Values) 