import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import TrackPlayer from 'react-native-track-player';

const MusicNotification = () => {
  // Ajouter des chansons à la file d'attente
  const addTracks = async () => {
    await TrackPlayer.add([
      {
        id: '1',
        url: require('./path/to/song1.mp3'), // Remplacez par le chemin de votre fichier audio
        title: 'Song 1',
        artist: 'Artist 1',
        artwork: require('./path/to/artwork1.png'), // Remplacez par le chemin de votre image
      },
      {
        id: '2',
        url: require('./path/to/song2.mp3'),
        title: 'Song 2',
        artist: 'Artist 2',
        artwork: require('./path/to/artwork2.png'),
      },
    ]);
  };

  // Charger les chansons au démarrage du composant
  useEffect(() => {
    addTracks();
  }, []);

  return (
    <View>
      <Text>Music Player</Text>
      <Button title="Play" onPress={() => TrackPlayer.play()} />
      <Button title="Pause" onPress={() => TrackPlayer.pause()} />
      <Button title="Next" onPress={() => TrackPlayer.skipToNext()} />
      <Button title="Previous" onPress={() => TrackPlayer.skipToPrevious()} />
    </View>
  );
};

export default MusicNotification;