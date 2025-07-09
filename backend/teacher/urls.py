from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeacherClassViewSet, StudentByClassIdViewSet, SendReportView, TodoByClassIdAndMonthViewSet, TeacherFixtureViewSet, TeacherProfileView

router = DefaultRouter()
router.register(r'classes', TeacherClassViewSet, basename='teacher-classes')
router.register(r'fixtures', TeacherFixtureViewSet, basename='teacher-fixtures')

urlpatterns = [
    path('', include(router.urls)),
    path('me/', TeacherProfileView.as_view(), name='teacher-profile'),
    path('classes/<int:class_id>', StudentByClassIdViewSet.as_view({'get': 'list'}), name='students-by-class'),
    path('reports', SendReportView.as_view(), name='send-report'),
    path('classes/<int:class_id>/todos/', TodoByClassIdAndMonthViewSet.as_view({'get': 'list'}), name='todos-by-class-month'),
]
