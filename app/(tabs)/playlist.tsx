import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoreVertical, Trash2, Plus, Play } from 'lucide-react-native';
import * as MediaLibrary from 'expo-media-library';
import { usePlayerStore } from '@/store/playerStore'; // Assurez-vous que ce store existe

interface Playlist {
  id: string;
  name: string;
  songs: MediaLibrary.Asset[]; // Utilisez le type de vos chansons
}

interface Song extends MediaLibrary.Asset {
  // Vous pouvez étendre cette interface si nécessaire
}

export default function Playlist() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isAddSongsVisible, setIsAddSongsVisible] = useState(false);
  const [localSongs, setLocalSongs] = useState<Song[]>([]);
  const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState<Song[]>([]);
  const { playSound } = usePlayerStore(); // Utilisez votre store pour la lecture

  useEffect(() => {
    loadPlaylists();
    loadLocalSongs();
  }, []);

  const loadPlaylists = async () => {
    const storedPlaylists = await AsyncStorage.getItem('playlists');
    if (storedPlaylists) {
      setPlaylists(JSON.parse(storedPlaylists));
    }
  };

  const loadLocalSongs = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
      setLocalSongs(media.assets);
    }
  };

  const addPlaylist = async () => {
    if (newPlaylistName.trim() === '') return;

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      songs: [],
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    setNewPlaylistName('');
    await AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
  };

  const deletePlaylist = async (id: string) => {
    const updatedPlaylists = playlists.filter((playlist) => playlist.id !== id);
    setPlaylists(updatedPlaylists);
    await AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
    setIsMenuVisible(false);
  };

  const addSongToPlaylist = async (song: Song) => {
    const updatedPlaylists = playlists.map((playlist) => {
      if (playlist.id === selectedPlaylistId) {
        return { ...playlist, songs: [...playlist.songs, song] };
      }
      return playlist;
    });
    setPlaylists(updatedPlaylists);
    await AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
    setIsAddSongsVisible(false);
  };

  const openPlaylistSongs = (playlist: Playlist) => {
    setSelectedPlaylistSongs(playlist.songs);
    setIsMenuVisible(false);
  };

  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <View style={styles.playlistItem}>
      <Text style={styles.playlistText}>{item.name}</Text>
      <TouchableOpacity onPress={() => openPlaylistSongs(item)}>
        <Play size={20} color="#1DB954" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setSelectedPlaylistId(item.id); setIsMenuVisible(true); }}>
        <MoreVertical size={20} color="#888" />
      </TouchableOpacity>
    </View>
  );

  const renderSongItem = ({ item }: { item: Song }) => (
    <TouchableOpacity style={styles.songItem} onPress={() => playSound(item)}>
      <Text style={styles.songText}>{item.filename}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Playlists</Text>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={renderPlaylistItem}
      />
      <TextInput
        style={styles.input}
        placeholder="New Playlist Name"
        placeholderTextColor="#888"
        value={newPlaylistName}
        onChangeText={setNewPlaylistName}
      />
      <TouchableOpacity style={styles.addButton} onPress={addPlaylist}>
        <Text style={styles.addButtonText}>Add Playlist</Text>
      </TouchableOpacity>

      {/* Menu contextuel */}
      <Modal
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => { setIsAddSongsVisible(true); setIsMenuVisible(false); }}
            >
              <Plus size={20} color="#1DB954" />
              <Text style={styles.menuButtonText}>Add Songs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                if (selectedPlaylistId) {
                  deletePlaylist(selectedPlaylistId);
                }
              }}
            >
              <Trash2 size={20} color="#ff4444" />
              <Text style={styles.menuButtonText}>Delete Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsMenuVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal pour ajouter des chansons */}
      <Modal
        transparent={true}
        visible={isAddSongsVisible}
        onRequestClose={() => setIsAddSongsVisible(false)}
      >
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <FlatList
              data={localSongs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.menuButton} onPress={() => addSongToPlaylist(item)}>
                  <Text style={styles.menuButtonText}>{item.filename}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddSongsVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Afficher les chansons de la playlist sélectionnée */}
      <Modal
        transparent={true}
        visible={selectedPlaylistSongs.length > 0}
        onRequestClose={() => setSelectedPlaylistSongs([])}
      >
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <FlatList
              data={selectedPlaylistSongs}
              keyExtractor={(item) => item.id}
              renderItem={renderSongItem}
            />
            <TouchableOpacity style={styles.cancelButton} onPress={() => setSelectedPlaylistSongs([])}>
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  playlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    marginBottom: 8,
    borderRadius: 8,
  },
  playlistText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  addButton: {
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    width: '80%',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  cancelButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  songItem: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    marginBottom: 8,
    borderRadius: 8,
  },
  songText: {
    color: '#fff',
    fontSize: 16,
  },
});