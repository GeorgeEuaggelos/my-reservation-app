import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/axiosInstance';

export default function EditReservationScreen({ route, navigation }) {
  const { reservation } = route.params;

  const [date, setDate] = useState(new Date(reservation.date));
  const [time, setTime] = useState(new Date(`1970-01-01T${reservation.time}`));
  const [people, setPeople] = useState(String(reservation.people_count));

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      await axios.put(
        `/reservations/${reservation.reservation_id}`,
        {
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

      Alert.alert('Reservation updated');
      navigation.goBack();
    } catch (error) {
      console.error('Edit error:', error.response?.data || error.message);
      Alert.alert('Error', 'Could not update reservation');
    }
  };

  return (
    <ImageBackground source={require('../assets/reservation_bg2.jpg')} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
          <Text>{date.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
        )}

        <Text style={styles.label}>Time</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
          <Text>{time.toTimeString().substring(0, 5)}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker value={time} mode="time" display="default" onChange={handleTimeChange} />
        )}

        <Text style={styles.label}>People</Text>
        <TextInput
          value={people}
          onChangeText={setPeople}
          style={styles.input}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.submitButtonText}>Update Reservation</Text>
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
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 20,
  },
  label: { marginTop: 10, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  pickerButton: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
