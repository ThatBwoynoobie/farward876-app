import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBHsrhP2IZqgb2e1x6UZVZx4JhAqDFWi7k",
  authDomain: "farward876.firebaseapp.com",
  projectId: "farward876",
  storageBucket: "farward876.appspot.com",
  messagingSenderId: "879360512154",
  appId: "1:879360512154:web:f9c34b6415f79436070f23",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function ManageTicketsTest() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleSaveTicket = async () => {
    if (!name || !price || !description || !date) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const docRef = doc(db, 'tickets', name);
      await setDoc(docRef, {
        name,
        price: parseFloat(price),
        description,
        date
      });
      Alert.alert('Success', 'Ticket saved successfully.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Tickets</Text>
      <TextInput style={styles.input} placeholder="Ticket Name" placeholderTextColor="#ccc" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Ticket Price" placeholderTextColor="#ccc" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Description" placeholderTextColor="#ccc" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Date" placeholderTextColor="#ccc" value={date} onChangeText={setDate} />
      <TouchableOpacity style={styles.button} onPress={handleSaveTicket}>
        <Text style={styles.buttonText}>Save Ticket</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, color: '#fff', marginBottom: 20 },
  input: { width: '100%', backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: '#0f0', padding: 12, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#000', fontWeight: 'bold' },
});
