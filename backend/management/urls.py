from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FixtureViewSet, ClassViewSet, StudentViewSet, TeacherViewSet

router = DefaultRouter()
router.register(r'fixtures', FixtureViewSet)
router.register(r'classes', ClassViewSet)
router.register(r'students', StudentViewSet)
router.register(r'teachers', TeacherViewSet)

from .views import ClassroomListView

urlpatterns = [
    path('', include(router.urls)),
    path('classrooms/', ClassroomListView.as_view(), name='classrooms-list'),
]
