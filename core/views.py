from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action, api_view, permission_classes
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Artist, Album, Review, Like
from .serializers import (
    UserSerializer, ArtistSerializer, AlbumSerializer, 
    ReviewSerializer, LikeSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email']

class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'genre']

class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'artist__name', 'genre']
    ordering_fields = ['title', 'release_year']

    def get_queryset(self):
        queryset = Album.objects.all()
        genre = self.request.query_params.get('genre')
        artist_id = self.request.query_params.get('artist_id')
        
        if genre:
            queryset = queryset.filter(genre__icontains=genre)
        if artist_id:
            queryset = queryset.filter(artist_id=artist_id)
            
        return queryset

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        album = self.get_object()
        reviews = Review.objects.filter(album=album)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'rating']

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Review.objects.all()
        album_id = self.request.query_params.get('album_id')
        user_id = self.request.query_params.get('user_id')
        print(f"Filtering reviews for album_id: {album_id}")
        
        if album_id:
            queryset = queryset.filter(album_id=album_id)
            print(f"Found {queryset.count()} reviews")
        if user_id:
            queryset = queryset.filter(user_id=user_id)
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        if not request.data.get('album'):
            return Response(
                {'message': 'Album ID is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if not request.data.get('review_text'):
            return Response(
                {'message': 'Review text is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if not request.data.get('rating'):
            return Response(
                {'message': 'Rating is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        existing_review = Review.objects.filter(
            user=request.user,
            album_id=request.data.get('album')
        ).first()
        
        if existing_review:
            return Response(
                {'message': 'You have already reviewed this album'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=['POST'], permission_classes=[IsAuthenticated])
    def toggle_like(self, request, pk=None):
        review = self.get_object()
        like, created = Like.objects.get_or_create(user=request.user, review=review)
        
        if not created:
            like.delete()
            status_str = 'unliked'
        else:
            status_str = 'liked'
            
        like_count = Like.objects.filter(review=review).count()
        
        print(f"Review {review.id} {status_str} by {request.user.username} - new count: {like_count}")
        return Response({
            'status': status_str,
            'like_count': like_count
        })

    @action(detail=True, methods=['GET'])
    def like_status(self, request, pk=None):
        review = self.get_object()
        like_count = Like.objects.filter(review=review).count()
        is_liked = False
        
        if request.user.is_authenticated:
            is_liked = Like.objects.filter(
                review=review,
                user=request.user
            ).exists()
        
        return Response({
            'like_count': like_count,
            'is_liked': is_liked
        })

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    
    def get_queryset(self):
        queryset = Like.objects.all()
        review_id = self.request.query_params.get('review_id')
        user_id = self.request.query_params.get('user_id')
        
        if review_id:
            queryset = queryset.filter(review_id=review_id)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
            
        return queryset
    
    @action(detail=True, methods=['POST'])
    def like(self, request, pk=None):
        try:
            review = self.get_object()
            like, created = Like.objects.get_or_create(
                user=request.user,
                review=review
            )
            
            if not created:
                like.delete()
                return Response({'status': 'unliked', 'like_count': review.like_set.count()})
            
            return Response({'status': 'liked', 'like_count': review.like_set.count()})
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
    @action(detail=True, methods=['GET'])
    def like_status(self, request, pk=None):
        """
        Get the like status and count for a review.
        Returns:
            - like_count: Total number of likes
            - is_liked: Whether the current user has liked this review
        """
        review = self.get_object()
        like_count = Like.objects.filter(review=review).count()
        is_liked = Like.objects.filter(
            review=review,
            user=request.user
        ).exists() if request.user.is_authenticated else False
        
        return Response({
            'like_count': like_count,
            'is_liked': is_liked
        })

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'message': 'Username and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(username=username).exists():
            return Response(
                {'message': 'Username already taken'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = User.objects.create_user(username=username, password=password)
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'Account created successfully',
            'token': token.key,
            'username': user.username,
            'userId': user.id
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'message': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'message': 'Username and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
                'userId': user.id
            })
        else:
            return Response(
                {'message': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
    except Exception as e:
        return Response(
            {'message': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, review_id):
    """Review'ı beğen/beğenmekten vazgeç"""
    try:
        review = get_object_or_404(Review, id=review_id)
        like, created = Like.objects.get_or_create(
            user=request.user,
            review=review
        )
        
        if not created:
            like.delete()
            liked = False
        else:
            liked = True
            
        return Response({
            'liked': liked,
            'likes_count': review.like.count()
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_like_status(request, review_id):
    """Kullanıcının bu review'ı beğenip beğenmediğini kontrol et"""
    try:
        review = get_object_or_404(Review, id=review_id)
        liked = Like.objects.filter(
            user=request.user,
            review=review
        ).exists()
        
        return Response({
            'liked': liked,
            'likes_count': review.like_set.count()
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )