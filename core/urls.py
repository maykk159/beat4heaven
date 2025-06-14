from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, ArtistViewSet, AlbumViewSet, 
    ReviewViewSet, LikeViewSet, register_user, login_user
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'artists', ArtistViewSet)
router.register(r'albums', AlbumViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'likes', LikeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'), 
]