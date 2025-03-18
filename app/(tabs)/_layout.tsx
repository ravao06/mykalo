import { Tabs } from 'expo-router';
import { ListMusic,Play, Settings, FolderPlus } from 'lucide-react-native'; // Importer l'icône FolderPlus

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Now Playing',
          tabBarIcon: ({ size, color }) => (
            <Play size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ size, color }) => (
            <ListMusic size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="playlist" 
        options={{
          title: 'Playlist',
          tabBarIcon: ({ size, color }) => (
            <FolderPlus size={size} color={color} /> 
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}