from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Todo, Report
from management.models import Class, Student, Fixture, Teacher
from .serializers import TodoSerializer, ReportSerializer
from management.serializers import ClassSerializer, StudentSerializer, FixtureSerializer, TeacherSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class TeacherClassViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ClassSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        print("--- TeacherClassViewSet.get_queryset ---")
        if self.request.user.is_authenticated:
            username = self.request.user.username
            print(f"Authenticated user: {username}")
            try:
                teacher_instance = Teacher.objects.get(teacher_id=username)
                print(f"Teacher instance found for {username}: {teacher_instance.teacher_name} (ID: {teacher_instance.id})")
                
                queryset = Class.objects.filter(teacher=teacher_instance)
                print(f"Number of classes found for {teacher_instance.teacher_name}: {queryset.count()}")
                
                return queryset
            except Teacher.DoesNotExist:
                print(f"Teacher instance NOT found for username: {username}")
                return Class.objects.none()
        else:
            print("User is not authenticated.")
        return Class.objects.none()

class StudentByClassIdViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def list(self, request, class_id=None, *args, **kwargs):
        if class_id:
            queryset = self.queryset.filter(class_obj__id=class_id)
        else:
            queryset = self.queryset.none()
        serializer = self.get_serializer(queryset, many=True)
        return Response({'students': serializer.data})

class SendReportView(APIView):
    def post(self, request):
        common_data = request.data.get('common', {})
        recipients = request.data.get('recipients', [])

        sent_common = False
        sent_individual = 0

        # For simplicity, we'll just log and return success for now
        # In a real application, you would process common_data and send individual messages
        print(f"Received common report: {common_data}")

        for recipient in recipients:
            student_id = recipient.get('studentId')
            personal_message = recipient.get('personalMessage')
            print(f"Sending individual message to student {student_id}: {personal_message}")
            # Here you would save to Report model or send actual messages
            try:
                student = Student.objects.get(id=student_id) # Use id instead of student_id
                Report.objects.create(
                    student=student,
                    common_subject=common_data.get('subject'),
                    common_content=common_data.get('content'),
                    personal_message=personal_message
                )
                sent_individual += 1
            except Student.DoesNotExist:
                print(f"Student with ID {student_id} not found.")

        if common_data.get('subject') or common_data.get('content'):
            sent_common = True

        return Response({
            'status': 'success',
            'sentCommon': sent_common,
            'sentIndividual': sent_individual
        }, status=status.HTTP_200_OK)

# teacher/views.py  (또는 TodoByClassIdAndMonthViewSet 정의 파일)

class TodoByClassIdAndMonthViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    def list(self, request, class_id=None, *args, **kwargs):
        """
        year, month 쿼리 파라미터가 없으면
        → 해당 반(class_id)의 모든 Todo 반환
        선택적으로 year·month가 들어오면 필터링
        """
        year  = request.query_params.get('year')
        month = request.query_params.get('month')

        if class_id:
            qs = self.queryset.filter(class_obj__id=class_id)

            if year:
                qs = qs.filter(date__year=year)
            if month:
                qs = qs.filter(date__month=month)
        else:
            qs = self.queryset.none()

        serializer = self.get_serializer(qs, many=True)
        return Response({'todos': serializer.data})


class TeacherFixtureViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Fixture.objects.all()
    serializer_class = FixtureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({'fixtures': serializer.data})


class TeacherProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            teacher = Teacher.objects.get(teacher_id=request.user.username)
            serializer = TeacherSerializer(teacher)
            return Response(serializer.data)
        except Teacher.DoesNotExist:
            return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)
