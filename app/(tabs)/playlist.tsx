import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoreVertical, Trash2, Plus, Play } from 'lucide-react-native';
import * as MediaLibrary from 'expo-media-library';
import { usePlayerStore } from '@/store/playerStore';

interface Playlist {
  id: string;
  name: string;
  songs: MediaLibrary.Asset[];
}

interface Song extends MediaLibrary.Asset {}

export default function Playlist() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isAddSongsVisible, setIsAddSongsVisible] = useState(false);
  const [localSongs, setLocalSongs] = useState<Song[]>([]);
  const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState<Song[]>([]);
  const { playSound } = usePlayerStore();

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
        if (!playlist.songs.some((s) => s.id === song.id)) {
          return { ...playlist, songs: [...playlist.songs, song] };
        }
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
      <TouchableOpacity
        onPress={() => {
          setSelectedPlaylistId(item.id);
          setIsMenuVisible(true);
        }}
      >
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
        ListEmptyComponent={
          <Text style={styles.message}>No playlists found.</Text>
        }
      />

      <TextInput
        style={styles.input}
        placeholder="New Playlist Name"
        placeholderTextColor="#888"
        value={newPlaylistName}
        onChangeText={setNewPlaylistName}
      />

      <TouchableOpacity
        style={[
          styles.addButton,
          newPlaylistName.trim() === '' && styles.disabledButton,
        ]}
        onPress={addPlaylist}
        disabled={newPlaylistName.trim() === ''}
      >
        <Text style={styles.addButtonText}>Add Playlist</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                setIsAddSongsVisible(true);
                setIsMenuVisible(false);
              }}
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
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsMenuVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => addSongToPlaylist(item)}
                >
                  <Text style={styles.menuButtonText}>{item.filename}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.message}>No songs found.</Text>
              }
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsAddSongsVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal pour afficher les chansons d'une playlist */}
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
              renderItem={renderSongItem} // Utilisation de renderSongItem ici
              ListEmptyComponent={
                <Text style={styles.message}>No songs in playlist.</Text>
              }
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSelectedPlaylistSongs([])}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#121212' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  playlistItem: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playlistText: { color: '#fff', fontSize: 16, flex: 1 },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#555' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  menuOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '70%',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuButtonText: { color: '#fff', marginLeft: 10, fontSize: 16 },
  cancelButton: {
    marginTop: 20,
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#fff', fontWeight: 'bold' },
  message: { color: '#888', textAlign: 'center', marginTop: 20 },
  songItem: {
    padding: 15,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  songText: { color: '#fff' },
});