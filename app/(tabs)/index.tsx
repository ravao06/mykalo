import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Slider from '@react-native-community/slider'; // Importez le composant Slider
import { MusicControls } from '@/components/MusicControls';
import { usePlayerStore } from '@/store/playerStore';
import { LinearGradient } from 'expo-linear-gradient';


const DEFAULT_ARTWORK = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D';

export default function NowPlaying() {
  
  const {
    currentSong,
    playbackPosition,
    playbackDuration,
    seekToPosition, 
  } = usePlayerStore();

  const progress = playbackDuration ? (playbackPosition / playbackDuration) * 100 : 0;

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fonction pour mettre à jour la position de lecture
  const handleSliderValueChange = (value: number) => {
    if (playbackDuration) {
      const newPosition = (value / 100) * playbackDuration;
      seekToPosition(newPosition); // Met à jour la position de lecture dans le store
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#121212']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Image
          source={{ uri: DEFAULT_ARTWORK }}
          style={styles.artwork}
        />

        <View style={styles.songInfo}>
          <Text style={styles.title}>
            {currentSong?.title || 'No song playing'}
          </Text>
          <Text style={styles.artist}>
            {currentSong?.artist || 'Select a song from your library'}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          {/* Remplacez la barre de progression statique par un Slider interactif */}
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={progress}
            onSlidingComplete={handleSliderValueChange}
            minimumTrackTintColor="#1DB954" // Couleur de la partie remplie
            maximumTrackTintColor="#444" // Couleur de la partie vide
            thumbTintColor="#1DB954" // Couleur du curseur
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {formatTime(playbackPosition)}
            </Text>
            <Text style={styles.timeText}>
              {formatTime(playbackDuration)}
            </Text>
          </View>
        </View>

        <MusicControls />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  artwork: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginBottom: 40,
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  artist: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 30,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: '#888',
    fontSize: 12,
  },
});