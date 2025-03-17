import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SkipBack, Play, Pause, SkipForward, Shuffle, Repeat, Repeat1 } from 'lucide-react-native';
import { usePlayerStore } from '@/store/playerStore';

export function MusicControls() {
  const { 
    isPlaying,
    isShuffled,
    repeatMode,
    pauseSound,
    resumeSound,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat
  } = usePlayerStore();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity 
          onPress={toggleShuffle}
          style={[styles.button, isShuffled && styles.activeButton]}
        >
          <Shuffle size={24} color={isShuffled ? '#1DB954' : '#fff'} />
        </TouchableOpacity>

        <View style={styles.mainControls}>
          <TouchableOpacity onPress={playPrevious} style={styles.button}>
            <SkipBack size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={isPlaying ? pauseSound : resumeSound}
            style={[styles.button, styles.playButton]}
          >
            {isPlaying ? (
              <Pause size={40} color="#fff" />
            ) : (
              <Play size={40} color="#fff" />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={playNext} style={styles.button}>
            <SkipForward size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={toggleRepeat}
          style={[styles.button, repeatMode !== 'off' && styles.activeButton]}
        >
          {repeatMode === 'one' ? (
            <Repeat1 size={24} color="#1DB954" />
          ) : (
            <Repeat 
              size={24} 
              color={repeatMode === 'all' ? '#1DB954' : '#fff'} 
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#1a1a1a',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  button: {
    padding: 8,
    borderRadius: 50,
  },
  playButton: {
    backgroundColor: '#1DB954',
    padding: 16,
  },
  activeButton: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
  },
});