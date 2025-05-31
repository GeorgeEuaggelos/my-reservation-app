import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  ImageBackground,
} from 'react-native';
import axios from '../api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

export default function MyReservationsScreen({ navigation }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchReservations();
    }, [])
  );

  const fetchReservations = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const res = await axios.get('/user/reservations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReservations(res.data);
    } catch (error) {
      console.error('Error loading reservations:', error.message);
      Alert.alert('Error', 'Could not load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reservationId) => {
    try {
      const token = await AsyncStorage.getItem('token');

      await axios.delete(`/reservations/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Deleted', 'Reservation was deleted');
      fetchReservations();
    } catch (error) {
      console.error('Delete error:', error.message);
      Alert.alert('Error', 'Could not delete reservation');
    }
  };

  const formatDateTime = (date, time) => {
    const formattedDate = new Date(date).toLocaleDateString();
    const formattedTime = time.slice(0, 5);
    return `${formattedDate} at ${formattedTime}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.restaurant_name}</Text>
      <Text style={styles.datetime}>{formatDateTime(item.date, item.time)}</Text>
      <Text>People: {item.people_count}</Text>
      <Text style={styles.location}>{item.location}</Text>

      <View style={styles.actionsInline}>
        <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditReservation', { reservation: item })}
        >
            <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.reservation_id)}
        >
            <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

    </View>
  );

  return (
    <ImageBackground source={require('../assets/reservation_bg2.jpg')} style={styles.background}>
        <View style={styles.overlay}>
        <Text style={styles.header}>My Reservations</Text>
        {loading ? (
            <ActivityIndicator size="large" />
        ) : reservations.length === 0 ? (
            <Text style={styles.noReservations}>You have no reservations yet.</Text>
        ) : (
            <FlatList
            data={reservations}
            keyExtractor={(item) => item.reservation_id.toString()}
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
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    padding: 12,
    backgroundColor: '#e6f2ff',
    marginBottom: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noReservations: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#444',
  },
  datetime: {
    marginVertical: 4,
  },
  location: {
    marginTop: 4,
  },
  actionsInline: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#cc0000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});