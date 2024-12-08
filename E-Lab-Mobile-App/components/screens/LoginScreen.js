import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../firebase'; // Firebase app tanımını import ediyoruz

const auth = getAuth(app);
const firestore = getFirestore(app);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;

          if (role === 'admin') {
            Alert.alert('Başarılı', 'Yönetici paneline hoş geldiniz.');
            navigation.navigate('WelcomeScreen');
          } else if (role === 'user') {
            Alert.alert('Başarılı', `Hoş geldiniz, ${user.email}`);
            navigation.navigate('UserDashboard');
          } else {
            Alert.alert('Hata', 'Kullanıcı rolü tanımlanamadı.');
          }
        } else {
          Alert.alert('Hata', 'Kullanıcı verileri Firestore\'da bulunamadı.');
        }
      } catch (firestoreError) {
        Alert.alert('Hata', 'Firestore verilerine erişilemedi.');
        console.error(firestoreError);
      }
    } catch (authError) {
      console.log("Hata kodu:", authError.code, "Mesaj:", authError.message);
      switch (authError.code) {
        case 'auth/user-not-found':
          Alert.alert('Hata', 'Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı.');
          break;
        case 'auth/wrong-password':
          Alert.alert('Hata', 'Yanlış şifre. Lütfen tekrar deneyin.');
          break;
        case 'auth/invalid-email':
          Alert.alert('Hata', 'Geçersiz e-posta adresi.');
          break;
        default:
          Alert.alert('Hata', 'Giriş sırasında bir hata oluştu.');
      }
    }
  };

  const dismissKeyboard = () => {
    if (Platform.OS !== 'web') Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      <LinearGradient colors={['#d32f2f', '#ff5252']} style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('WelcomeScreen')}
          >
            <Ionicons name="arrow-back-outline" size={40} color="#fff" />
          </TouchableOpacity>
          <Image source={require('../../assets/labLogo.png')} style={styles.logo} />
          <Text style={styles.title}>Berkay-LAB</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="E-posta Adresi"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              maxLength={16}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <LinearGradient colors={['#42a5f5', '#90caf9']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation?.navigate('Register')}>
            <Text style={styles.registerText}>
              Hesabım Yok?{' '}
              <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
                Kayıt Ol
              </Text>
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    color: '#333',
    fontSize: 16,
    borderRadius: 25,
  },
  icon: {
    marginRight: 10,
    color: '#42a5f5',
  },
  button: {
    width: '80%',
    height: 50,
    marginBottom: 15,
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  registerText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
});

export default LoginScreen;
