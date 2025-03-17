import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { usePlayerStore } from '@/store/playerStore';
import { Play, Pause } from 'lucide-react-native';

export default function Library() {
  const [permission, setPermission] = useState<boolean>(false);
  const { songs, setSongs, currentSong, isPlaying, playSound, pauseSound } = usePlayerStore();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setPermission(status === 'granted');
        
        if (status === 'granted') {
          const media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
          });
          
          const formattedSongs = media.assets.map(asset => ({
            id: asset.id,
            title: asset.filename.replace(/\.[^/.]+$/, ''),
            artist: 'Unknown Artist',
            uri: asset.uri,
            duration: asset.duration * 1000, // Convert to milliseconds
          }));
          
          setSongs(formattedSongs);
        }
      }
    })();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.songItem,
        currentSong?.id === item.id && styles.currentSong
      ]}
      onPress={() => {
        if (currentSong?.id === item.id && isPlaying) {
          pauseSound();
        } else {
          playSound(item);
        }
      }}
    >
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
      
      {currentSong?.id === item.id && (
        <View style={styles.playingIndicator}>
          {isPlaying ? (
            <Pause size={20} color="#1DB954" />
          ) : (
            <Play size={20} color="#1DB954" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Music library access is not available on web platforms.
        </Text>
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Please grant permission to access your music library.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  list: {
    padding: 16,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    marginBottom: 8,
    borderRadius: 8,
  },
  currentSong: {
    backgroundColor: '#282828',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  songArtist: {
    color: '#888',
    fontSize: 14,
  },
  playingIndicator: {
    marginLeft: 16,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});