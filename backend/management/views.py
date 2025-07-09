from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Fixture, Class, Student, Teacher
from teacher.models import Todo # Import Todo model
from .serializers import FixtureSerializer, ClassSerializer, StudentSerializer, TeacherSerializer
from teacher.serializers import TodoSerializer # Import TodoSerializer
from collections import defaultdict

class FixtureViewSet(viewsets.ModelViewSet):
    queryset = Fixture.objects.all()
    serializer_class = FixtureSerializer

    def list(self, request, *args, **kwargs):
        page = int(request.query_params.get('page', 1))
        size = int(request.query_params.get('size', 10))
        start_index = (page - 1) * size
        end_index = start_index + size
        queryset = self.filter_queryset(self.get_queryset())
        total_count = queryset.count()
        paginated_queryset = queryset[start_index:end_index]
        serializer = self.get_serializer(paginated_queryset, many=True)
        return Response({
            'data': serializer.data,
            'totalPage': (total_count + size - 1) // size  # Calculate total pages
        })

class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

    def create(self, request, *args, **kwargs):
        print("Incoming class creation request data:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Serializer Errors (detailed - create):")
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "Class added successfully"}, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        print("--- ClassViewSet.update ---")
        print("Incoming class update request data:", request.data)
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        print(f"Updating instance: {instance.id}")
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        try:
            if not serializer.is_valid(raise_exception=True):
                print("Serializer Errors (detailed - update):")
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            self.perform_update(serializer)
            print("Class update successful.")
            return Response(serializer.data)
        except Exception as e:
            print(f"Error during class update: {e}")
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def create(self, request, *args, **kwargs):
        print("Incoming student creation request data:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Serializer Errors (detailed - create):")
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            print(f"Error during student creation: {e}")
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request, *args, **kwargs):
        print("--- StudentViewSet.list ---")
        queryset = self.filter_queryset(self.get_queryset())
        print(f"Queryset count: {queryset.count()}")
        try:
            serializer = self.get_serializer(queryset, many=True)
            print("Serialization successful.")
            return Response({
                'total_counts': queryset.count(),
                'students': serializer.data
            })
        except Exception as e:
            print(f"Error during student list serialization: {e}")
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'total_counts': queryset.count(),
            'teachers': serializer.data
        })

    def update(self, request, *args, **kwargs):
        print("Incoming class update request data:", request.data)
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        try:
            if not serializer.is_valid():
                print("Serializer Errors (detailed):")
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Exception during serializer validation:", e)
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.perform_update(serializer)
        return Response(serializer.data)

class ClassroomListView(APIView):
    def get(self, request, *args, **kwargs):
        classes = Class.objects.all().select_related('teacher').prefetch_related('students', 'todos')
        serializer = ClassSerializer(classes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
