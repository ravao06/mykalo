import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform } from 'react-native';
import { usePlayerStore } from '@/store/playerStore';

export default function Settings() {
  const { isShuffled, repeatMode, toggleShuffle, toggleRepeat } = usePlayerStore();

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Playback</Text>
        
        <View style={styles.setting}>
          <Text style={styles.settingText}>Shuffle</Text>
          <Switch
            value={isShuffled}
            onValueChange={toggleShuffle}
            trackColor={{ false: '#767577', true: '#1DB954' }}
            thumbColor={Platform.OS === 'ios' ? '#fff' : isShuffled ? '#fff' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.setting} onPress={toggleRepeat}>
          <Text style={styles.settingText}>Repeat Mode</Text>
          <Text style={styles.repeatMode}>
            {repeatMode === 'off' ? 'Off' : 
             repeatMode === 'one' ? 'Repeat One' : 'Repeat All'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  section: {
    marginBottom: 32,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
  },
  repeatMode: {
    color: '#1DB954',
    fontSize: 16,
  },
  version: {
    color: '#888',
    fontSize: 14,
  },
});