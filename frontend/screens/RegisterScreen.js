import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from '../api/axiosInstance';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await axios.post('/register', { name, email, password });
      Alert.alert('Success', 'Account created! You can now log in.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      Alert.alert('Registration failed', error.response?.data?.message || 'Server error');
    }
  };

  return (
    <ImageBackground source={require('../assets/reservation_bg2.jpg')} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.logoText}>ReserveMe</Text>
        <Text style={styles.title}>Register</Text>

        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#555"
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#f2f2f2',
  },
  registerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  backButton: {
    backgroundColor: '#737373',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
