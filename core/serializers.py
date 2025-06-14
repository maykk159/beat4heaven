from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Artist, Album, Review, Like

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ['id', 'name', 'genre', 'bio', 'image', 'created_at', 'updated_at']

class AlbumSerializer(serializers.ModelSerializer):
    artist_name = serializers.ReadOnlyField(source='artist.name', read_only=True)
    artist_bio = serializers.ReadOnlyField(source='artist.bio', read_only=True)
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()

    class Meta:
        model = Album
        fields = ['id', 'artist', 'artist_name', 'artist_bio', 'title', 'release_year', 'cover_image', 'genre', 
                 'average_rating', 'review_count', 'created_at', 'updated_at']

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    album_title = serializers.ReadOnlyField(source='album.title')
    like_count = serializers.SerializerMethodField()
    user_liked = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user', 'username', 'album', 'album_title', 'rating', 'review_text', 
                 'like_count', 'user_liked', 'created_at', 'updated_at']  
        read_only_fields = ['user']

    def get_like_count(self, obj):
        return obj.like_set.count()
    
    def get_user_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.like_set.filter(user=request.user, review=obj).exists()
        return False

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class LikeSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Like
        fields = ['id', 'user', 'username', 'review', 'created_at']