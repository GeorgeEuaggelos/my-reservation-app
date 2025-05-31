import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import axios from '../api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('/restaurants');
      setRestaurants(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
    const results = restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(lowerQuery) ||
        r.location.toLowerCase().includes(lowerQuery)
    );
    setFiltered(results);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    Alert.alert('Logged out');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>{item.location}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity
        style={styles.reserveButton}
        onPress={() =>
          navigation.navigate('Reservation', { restaurantId: item.restaurant_id, restaurantName: item.name })
        }>
        <Text style={styles.reserveButtonText}>Reserve</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground source={require('../assets/reservation_bg2.jpg')} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Restaurants</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyReservations')}>
              <Text style={styles.buttonText}>My Reservations</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
              <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or location"
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#555"
          backgroundColor="#f2f2f2"
        />

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.restaurant_id.toString()}
            renderItem={renderItem}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 15,
    paddingBottom: 50,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#cc0000',
  },
  logoutText: {
    color: '#fff',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  card: {
    padding: 12,
    backgroundColor: '#f2e6d9',
    marginBottom: 10,
    borderRadius: 8,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  description: { fontStyle: 'italic', marginTop: 4 },
  reserveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  reserveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
