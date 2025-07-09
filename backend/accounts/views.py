from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from management.models import Teacher
from .models import User
from django.contrib.auth.hashers import make_password, check_password

class LoginView(APIView):
    def post(self, request):
        print("--- Login attempt ---")
        username = request.data.get('username')
        password = request.data.get('password')
        role = request.data.get('role')
        print(f"Request data: username={username}, password=****, role={role}")
        user = None

        if role == 'teacher':
            print("Attempting teacher login.")
            user = authenticate(request, username=username, password=password)

            if user is None:
                try:
                    teacher = Teacher.objects.get(teacher_id=username)
                    print(f"Found teacher: {teacher.teacher_name}")
                    if teacher.passwd == password:
                        user, created = User.objects.get_or_create(
                            username=teacher.teacher_id,
                            defaults={'role': 'teacher', 'first_name': teacher.teacher_name}
                        )
                        user.set_password(password)
                        user.save()
                        print("Created/Updated Django user and set password.")

                        user = authenticate(request, username=username, password=password)
                        if user is None:
                            print("Re-authentication failed after setting password for teacher user.")
                            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
                        print(f"Django auth user: {user.username} authenticated successfully after update.")
                    else:
                        print("Teacher password does NOT match.")
                        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
                except Teacher.DoesNotExist:
                    print(f"Teacher with teacher_id={username} not found.")
                    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                print(f"Django auth user: {user.username} authenticated successfully directly.")

        elif role == 'admin':
            print("Attempting admin login.")
            user = authenticate(username=username, password=password)
            if user is None or user.role != 'admin':
                print("Admin authentication failed.")
                return Response({'detail': 'Invalid credentials or not an admin'}, status=status.HTTP_401_UNAUTHORIZED)
            print(f"Admin user {user.username} authenticated successfully.")

        if user is not None:
            print(f"Generating token for user: {user.username}")
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'name': user.username,
                    'position': user.role.capitalize(),
                }
            }, status=status.HTTP_200_OK)

        print("Login failed: Invalid request or role not specified.")
        return Response({'detail': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)