import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { usePlayerStore } from '@/store/playerStore'; // Assurez-vous que ce store existe
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react-native';

// Configurer les notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function MusicNotification() {
  const { currentSong, isPlaying, playSound, pauseSound, playNext, playPrevious } = usePlayerStore();

  // Fonction pour afficher la notification
  const showNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: currentSong?.title || 'No song playing',
        body: 'Contrôlez la lecture depuis la notification',
        sound: false,
        data: { action: 'music_control' }, // Données supplémentaires pour identifier la notification
      },
      trigger: null, // Afficher immédiatement
    });
  };

  // Fonction pour mettre à jour la notification
  const updateNotification = async () => {
    await Notifications.dismissAllNotificationsAsync(); // Supprimer les notifications existantes
    await showNotification(); // Afficher une nouvelle notification
  };

  // Effet pour mettre à jour la notification lorsque la chanson change
  useEffect(() => {
    if (currentSong) {
      updateNotification();
    }
  }, [currentSong, isPlaying]);

  // Gérer les actions de la notification
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const { actionIdentifier } = response;
      switch (actionIdentifier) {
        case 'previous':
          playPrevious();
          break;
        case 'play_pause':
          if (isPlaying) {
            pauseSound();
          } else {
            playSound(currentSong);
          }
          break;
        case 'next':
          playNext();
          break;
        default:
          break;
      }
    });

    return () => subscription.remove();
  }, [currentSong, isPlaying]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contrôle de lecture</Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={playPrevious}>
          <SkipBack size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={isPlaying ? pauseSound : () => playSound(currentSong)}>
          {isPlaying ? <Pause size={40} color="#fff" /> : <Play size={40} color="#fff" />}
        </TouchableOpacity>
        <TouchableOpacity onPress={playNext}>
          <SkipForward size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },
});