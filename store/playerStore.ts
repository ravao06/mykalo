import { create } from 'zustand';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

interface Song {
  id: string;
  title: string;
  artist: string;
  uri: string;
  duration: number;
}

interface PlayerState {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  sound: Audio.Sound | null;
  isLoading: boolean;
  isShuffled: boolean;
  repeatMode: 'off' | 'one' | 'all';
  playbackPosition: number;
  playbackDuration: number;
  setSongs: (songs: Song[]) => void;
  setCurrentSong: (song: Song) => void;
  playSound: (song: Song) => Promise<void>;
  pauseSound: () => Promise<void>;
  resumeSound: () => Promise<void>;
  stopSound: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  updatePlaybackStatus: (status: Audio.PlaybackStatus) => void;
  seekToPosition: (position: number) => void; // Ajoutez cette ligne
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  songs: [],
  currentSong: null,
  isPlaying: false,
  sound: null,
  isLoading: false,
  isShuffled: false,
  repeatMode: 'off',
  playbackPosition: 0,
  playbackDuration: 0,

  setSongs: (songs) => set({ songs }),

  setCurrentSong: (song) => set({ currentSong: song }),

  playSound: async (song) => {
    const { sound: currentSound } = get();
    set({ isLoading: true });

    try {
      if (currentSound) {
        await currentSound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: song.uri },
        { shouldPlay: true },
        (status) => get().updatePlaybackStatus(status)
      );

      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      }

      set({ 
        sound,
        currentSong: song,
        isPlaying: true,
        isLoading: false
      });
    } catch (error) {
      console.error('Error playing sound:', error);
      set({ isLoading: false });
    }
  },

  pauseSound: async () => {
    const { sound } = get();
    if (sound) {
      await sound.pauseAsync();
      set({ isPlaying: false });
    }
  },

  resumeSound: async () => {
    const { sound } = get();
    if (sound) {
      await sound.playAsync();
      set({ isPlaying: true });
    }
  },

  stopSound: async () => {
    const { sound } = get();
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      set({ 
        sound: null,
        isPlaying: false,
        playbackPosition: 0
      });
    }
  },

  playNext: async () => {
    const { songs, currentSong, isShuffled, repeatMode } = get();
    if (!currentSong || songs.length === 0) return;

    let nextIndex: number;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      nextIndex = currentIndex + 1;
      if (nextIndex >= songs.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          return;
        }
      }
    }

    await get().playSound(songs[nextIndex]);
  },

  playPrevious: async () => {
    const { songs, currentSong, isShuffled } = get();
    if (!currentSong || songs.length === 0) return;

    let prevIndex: number;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * songs.length);
    } else {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) prevIndex = songs.length - 1;
    }

    await get().playSound(songs[prevIndex]);
  },

  toggleShuffle: () => set(state => ({ isShuffled: !state.isShuffled })),

  toggleRepeat: () => set(state => ({
    repeatMode: state.repeatMode === 'off' ? 'one' : 
                state.repeatMode === 'one' ? 'all' : 'off'
  })),

  updatePlaybackStatus: (status) => {
    if (!status.isLoaded) return;

    set({
      playbackPosition: status.positionMillis,
      playbackDuration: status.durationMillis || 0,
      isPlaying: status.isPlaying
    });

    if (status.didJustFinish) {
      const { repeatMode } = get();
      if (repeatMode === 'one') {
        const { currentSong } = get();
        if (currentSong) {
          get().playSound(currentSong);
        }
      } else if (repeatMode === 'all') {
        get().playNext();
      }
    }
  },

  seekToPosition: (position: number) => {
    const { sound } = get();
    if (sound) {
      sound.setPositionAsync(position); // Met à jour la position de lecture
      set({ playbackPosition: position }); // Met à jour l'état du store
    }
  }
}));