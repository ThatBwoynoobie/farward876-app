import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth, db } from './firebase/firebase';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        navigation.replace('Drawer', { userEmail: user.email });
      })
      .catch(error => {
        Alert.alert('Login Failed', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Farward876</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#ccc" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#ccc" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeScreen({ route }) {
  const { userEmail } = route.params || { userEmail: 'Guest' };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Farward876 🎉</Text>
      <Text style={styles.subtitle}>Logged in as {userEmail}</Text>
    </View>
  );
}

function TicketsScreen({ navigation }) {
  const [tickets, setTickets] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const snapshot = await db.collection('tickets').get();
      setTickets(snapshot.docs.map(doc => doc.data()));
    };
    fetchTickets();
  }, []);

  const addToCart = (ticket) => {
    setCart([...cart, ticket]);
    Alert.alert('Added to Cart', `${ticket.name} added to your cart.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Tickets</Text>
      {tickets.map((ticket, index) => (
        <View key={index} style={styles.ticketItem}>
          <Text style={styles.ticketText}>{ticket.name} - ${ticket.price}</Text>
          <TouchableOpacity style={styles.button} onPress={() => addToCart(ticket)}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cart', { cart })}>
        <Text style={styles.buttonText}>View Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

function CartScreen({ route }) {
  const cart = route.params?.cart || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cart.length === 0 ? (
        <Text style={styles.subtitle}>Your cart is empty.</Text>
      ) : (
        cart.map((item, index) => (
          <View key={index} style={styles.ticketItem}>
            <Text style={styles.ticketText}>{item.name} - ${item.price}</Text>
          </View>
        ))
      )}
      {cart.length > 0 && (
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Order placed', 'Thank you for your purchase!')}>
          <Text style={styles.buttonText}>Checkout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function DrawerMenu({ route, navigation }) {
  const userEmail = route.params?.userEmail || 'Guest';
  const handleLogout = () => Alert.alert('Confirm Logout', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Yes', onPress: () => navigation.replace('Login') }]);

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home">{() => <HomeScreen route={{ params: { userEmail } }} />}</Drawer.Screen>
      <Drawer.Screen name="Tickets" component={TicketsScreen} />
      <Drawer.Screen name="Cart" component={CartScreen} />
      <Drawer.Screen name="Logout" component={() => handleLogout()} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Drawer" component={DrawerMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, color: '#fff', marginBottom: 20 },
  subtitle: { fontSize: 18, color: '#fff' },
  input: { width: '100%', backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: '#0f0', padding: 12, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#000', fontWeight: 'bold' },
  ticketItem: { backgroundColor: '#222', padding: 15, borderRadius: 8, marginVertical: 5, width: '100%', alignItems: 'center' },
  ticketText: { color: '#fff', fontSize: 16 },
});