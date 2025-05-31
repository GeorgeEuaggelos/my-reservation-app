import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from '../api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReservationScreen({ route, navigation }) {
  const { restaurantId, restaurantName } = route.params;

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [people, setPeople] = useState('');
  const [token, setToken] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      setToken(savedToken);
    };
    loadToken();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleSubmit = async () => {
    if (!token || !date || !time || !people) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await axios.post(
        '/reservations',
        {
          restaurant_id: restaurantId,
          date: date.toISOString().split('T')[0],
          time: time.toTimeString().substring(0, 8),
          people_count: parseInt(people),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Reservation successful');
      navigation.goBack();
    } catch (error) {
      console.error('Reservation error:', error.response?.data || error.message);
      Alert.alert('Error', 'Could not create reservation');
    }
  };

  return (
    <ImageBackground source={require('../assets/reservation_bg2.jpg')} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.restaurantTitle}>{restaurantName}</Text>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
          <Text>{date ? date.toDateString() : 'Select Date'}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Time</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
          <Text>{time ? time.toTimeString().substring(0, 5) : 'Select Time'}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time || new Date()}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        <Text style={styles.label}>People</Text>
        <TextInput
          value={people}
          onChangeText={setPeople}
          style={styles.input}
          keyboardType="numeric"
          placeholder="Number of people"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Book Reservation</Text>
        </TouchableOpacity>
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
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 20,
  },
  restaurantTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  label: { marginTop: 10, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  pickerButton: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
