import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth, db } from './firebase'; // ✅ Using shared firebase.js
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ Login Screen with Login & Register Support
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.replace('Drawer', { userEmail: user.email });
      })
      .catch((error) => {
        Alert.alert('Login Failed', error.message);
      });
  };

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.replace('Drawer', { userEmail: user.email });
      })
      .catch((error) => {
        Alert.alert('Registration Failed', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login or Register to Farward876</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#ccc" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#ccc" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}><Text style={styles.buttonText}>Log In</Text></TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRegister}><Text style={styles.buttonText}>Register</Text></TouchableOpacity>
    </View>
  );
}

// ✅ Remaining Screens (no changes needed)
function HomeScreen({ route }) { const { userEmail } = route.params || { userEmail: 'Guest' }; return (<View style={styles.container}><Text style={styles.title}>Welcome to Farward876 🎉</Text><Text style={styles.subtitle}>Logged in as {userEmail}</Text></View>); }

function TicketsScreen({ navigation }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const querySnapshot = await getDocs(collection(db, "tickets"));
      const fetchedTickets = querySnapshot.docs.map(doc => doc.data());
      setTickets(fetchedTickets);
    };
    fetchTickets();
  }, []);

  const showDescription = (description) => Alert.alert('Ticket Description', description);
  const handleBuyNow = (ticketName) => {
    setCartCount(cartCount + 1);
    setCartItems([...cartItems, ticketName]);
    Alert.alert('Added to Cart', `${ticketName} added to your cart.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Tickets</Text>
      <Text style={styles.cart}>🛒 Cart: {cartCount} item(s)</Text>
      {tickets.map((ticket, index) => (
        <View key={index} style={styles.ticketItem}>
          <Text style={styles.ticketText}>{ticket.name} - ${ticket.price}</Text>
          <Text style={styles.ticketText}>{ticket.date}</Text>
          <TouchableOpacity style={styles.descButton} onPress={() => showDescription(ticket.description)}><Text style={styles.buttonText}>Description</Text></TouchableOpacity>
          <TouchableOpacity style={styles.buyButton} onPress={() => handleBuyNow(ticket.name)}><Text style={styles.buyButtonText}>Buy Now</Text></TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.buyButton} onPress={() => navigation.navigate('View Cart', { cartItems })}><Text style={styles.buyButtonText}>View Cart</Text></TouchableOpacity>
    </View>
  );
}

function ViewCartScreen({ route, navigation }) { const { cartItems = [] } = route.params || {}; return (<View style={styles.container}><Text style={styles.title}>🛒 Your Cart</Text>{cartItems.length === 0 ? (<Text style={styles.ticketText}>Your cart is empty.</Text>) : (<>{cartItems.map((item, index) => (<View key={index} style={styles.ticketItem}><Text style={styles.ticketText}>{item}</Text></View>))}<TouchableOpacity style={styles.buyButton} onPress={() => navigation.navigate('Checkout', { cartItems })}><Text style={styles.buyButtonText}>Go to Checkout</Text></TouchableOpacity></>)}</View>); }

function CheckoutScreen({ route, navigation }) {
  const { cartItems = [] } = route.params || {};
  const handleManualPayment = () => Alert.alert('Bank Transfer Instructions', 'Please send payment to:\n\nBank: ABC Bank\nAccount: 123456789\nName: Farward876\n\nAfter payment, contact us on WhatsApp to confirm.');
  const handleCardPayment = () => Alert.alert('Card Payment Unavailable', 'Credit/Debit Card payments will be available soon.');
  const handleConfirmPurchase = () => navigation.navigate('Order Confirmation');

  return (<View style={styles.container}><Text style={styles.title}>Checkout</Text>{cartItems.map((item, index) => (<View key={index} style={styles.ticketItem}><Text style={styles.ticketText}>{item}</Text></View>))}<TouchableOpacity style={styles.buyButton} onPress={handleCardPayment}><Text style={styles.buyButtonText}>Pay with Card</Text></TouchableOpacity><TouchableOpacity style={styles.buyButton} onPress={handleManualPayment}><Text style={styles.buyButtonText}>Pay by Bank Transfer</Text></TouchableOpacity><TouchableOpacity style={styles.buyButton} onPress={handleConfirmPurchase}><Text style={styles.buyButtonText}>Confirm Purchase</Text></TouchableOpacity></View>);
}

function OrderConfirmationScreen({ navigation }) { return (<View style={styles.container}><Text style={styles.thankYouTitle}>🎉 Thank You!</Text><Text style={styles.subtitle}>Your purchase was successful.</Text><TouchableOpacity style={styles.buyButton} onPress={() => navigation.replace('Home')}><Text style={styles.buyButtonText}>Return to Home</Text></TouchableOpacity></View>); }

function ContactScreen() {
  const handleCall = () => Linking.openURL('tel:+18761234567');
  const handleWhatsApp = () => Linking.openURL('https://wa.me/18761234567');
  const handleEmail = () => Linking.openURL('mailto:support@farward876.com');
  return (<View style={styles.container}><Text style={styles.title}>Contact Us</Text><TouchableOpacity style={styles.buyButton} onPress={handleCall}><Text style={styles.buyButtonText}>Call Us</Text></TouchableOpacity><TouchableOpacity style={styles.buyButton} onPress={handleWhatsApp}><Text style={styles.buyButtonText}>Message on WhatsApp</Text></TouchableOpacity><TouchableOpacity style={styles.buyButton} onPress={handleEmail}><Text style={styles.buyButtonText}>Send Email</Text></TouchableOpacity></View>);
}

function ManageTicketsScreen() {
  const [name, setName] = useState(''), [price, setPrice] = useState(''), [description, setDescription] = useState(''), [date, setDate] = useState('');
  const handleSaveTicket = async () => { if (!name || !price || !description || !date) { Alert.alert('Error', 'All fields are required.'); return; } try { await setDoc(doc(db, 'tickets', name), { name, price: parseFloat(price), description, date }); Alert.alert('Success', 'Ticket saved successfully.'); } catch (error) { Alert.alert('Error', error.message); } };
  return (<View style={styles.container}><Text style={styles.title}>Manage Tickets</Text><TextInput style={styles.input} placeholder="Ticket Name" placeholderTextColor="#ccc" value={name} onChangeText={setName} /><TextInput style={styles.input} placeholder="Ticket Price" placeholderTextColor="#ccc" value={price} onChangeText={setPrice} keyboardType="numeric" /><TextInput style={styles.input} placeholder="Description" placeholderTextColor="#ccc" value={description} onChangeText={setDescription} /><TextInput style={styles.input} placeholder="Date" placeholderTextColor="#ccc" value={date} onChangeText={setDate} /><TouchableOpacity style={styles.buyButton} onPress={handleSaveTicket}><Text style={styles.buyButtonText}>Save Ticket</Text></TouchableOpacity></View>);
}

// ✅ Drawer Navigation
function DrawerMenu({ route, navigation }) {
  const userEmail = route.params?.userEmail || 'Guest';
  const handleLogout = () => Alert.alert('Confirm Logout', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Yes', onPress: () => navigation.replace('Login') }]);
  return (<Drawer.Navigator initialRouteName="Home"><Drawer.Screen name="Home">{() => <HomeScreen route={{ params: { userEmail } }} />}</Drawer.Screen><Drawer.Screen name="Tickets" component={TicketsScreen} /><Drawer.Screen name="View Cart" component={ViewCartScreen} /><Drawer.Screen name="Checkout" component={CheckoutScreen} /><Drawer.Screen name="Order Confirmation" component={OrderConfirmationScreen} /><Drawer.Screen name="Contact Us" component={ContactScreen} /><Drawer.Screen name="Manage Tickets" component={ManageTicketsScreen} /><Drawer.Screen name="Logout" component={() => handleLogout()} /></Drawer.Navigator>);
}

// ✅ App Entry Point
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

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, color: '#fff', marginBottom: 20 },
  subtitle: { fontSize: 18, color: '#fff' },
  input: { width: '100%', backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: '#0f0', padding: 12, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#000', fontWeight: 'bold' },
  buyButtonText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  thankYouTitle: { fontSize: 32, color: '#0f0', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  cart: { color: '#fff', fontSize: 16, marginBottom: 10 },
  ticketItem: { backgroundColor: '#222', padding: 15, borderRadius: 8, marginVertical: 5, width: '100%' },
  ticketText: { color: '#fff', fontSize: 16 },
  descButton: { backgroundColor: '#f00', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' },
  buyButton: { backgroundColor: '#0f0', padding: 16, borderRadius: 5, marginTop: 10, alignItems: 'center' },
});
