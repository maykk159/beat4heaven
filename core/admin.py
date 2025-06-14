from django.contrib import admin
from .models import Artist, Album, Review, Like

@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('name', 'genre', 'created_at')
    search_fields = ('name', 'genre')
    list_filter = ('genre',)

@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'release_year', 'genre')
    search_fields = ('title', 'artist__name', 'genre')
    list_filter = ('genre', 'release_year')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('album', 'user', 'rating', 'created_at')
    search_fields = ('album__title', 'user__username')
    list_filter = ('rating', 'created_at')

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'review', 'created_at')