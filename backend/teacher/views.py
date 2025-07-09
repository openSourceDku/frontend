from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Todo, Report
from management.models import Class, Student, Fixture
from .serializers import TodoSerializer, ReportSerializer
from management.serializers import ClassSerializer, StudentSerializer, FixtureSerializer

class TeacherClassViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

    # def list(self, request, *args, **kwargs):
    #     # Mock data for teacher classes as per frontend expectation
    #     mock_classes = [
    #         {"id": 1, "name": "월수 반"},
    #         {"id": 2, "name": "화목 반"},
    #         {"id": 3, "name": "특강 반"},
    #     ]
    #     return Response(mock_classes)

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

class TodoByClassIdAndMonthViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    def list(self, request, class_id=None, year=None, month=None, *args, **kwargs):
        if class_id and year and month:
            # Filter todos by class and date range
            # Note: This assumes `date` field in Todo model is a DateField
            # and you want todos for the entire month.
            queryset = self.queryset.filter(
                class_obj__id=class_id,
                date__year=year,
                date__month=month
            )
        else:
            queryset = self.queryset.none()
        serializer = self.get_serializer(queryset, many=True)
        return Response({'todos': serializer.data})

class TeacherFixtureViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Fixture.objects.all()
    serializer_class = FixtureSerializer

    # def list(self, request, *args, **kwargs):
    #     # Mock data for teacher fixtures as per frontend expectation
    #     mock_fixtures = [
    #         {"name": "화이트보드 마커", "price": 1200, "quantity": 15},
    #         {"name": "칠판 지우개", "price": 3000, "quantity": 5},
    #         {"name": "분필", "price": 500, "quantity": 50},
    #         {"name": "빔 프로젝터", "price": 500000, "quantity": 1},
    #         {"name": "교탁", "price": 150000, "quantity": 2},
    #     ]
    #     return Response({'fixtures': mock_fixtures})
