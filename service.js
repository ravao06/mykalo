import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from 'react-native-track-player';

module.exports = async function () {
  // Initialiser TrackPlayer
  await TrackPlayer.setupPlayer();

  // Mettre à jour les options de TrackPlayer
  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
    ],
    progressUpdateEventInterval: 2,
  });

  // Gérer les événements de lecture
  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
  TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
  TrackPlayer.addEventListener('remote-next', () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener('remote-previous', () => TrackPlayer.skipToPrevious());
  TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.destroy());
};