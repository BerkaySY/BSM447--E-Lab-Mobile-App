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

const LoginScreen = ({ navigation }) => {
  const [tc, setTC] = useState('');
  const [password, setPassword] = useState('');

  const validateTC = (tc) => {
    if (tc.length !== 11 || isNaN(tc) || tc[0] === '0') {
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (!validateTC(tc)) {
      Alert.alert('Hata', 'Geçerli bir T.C. kimlik numarası girin.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }
    Alert.alert('Başarılı', 'Giriş başarılı!');
  };

  // Ekranın dışına dokunulduğunda klavyeyi kapatma işlevi
  const dismissKeyboard = () => {
    if (Platform.OS !== 'web') Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      <LinearGradient
        colors={['#42a5f5', '#90caf9']}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <Image source={require('../assets/labLogo.png')} style={styles.logo} />
          <Text style={styles.title}>Berkay-LAB</Text>

          {/* T.C. Kimlik Girişi */}
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="T.C. Kimlik No"
              placeholderTextColor="#aaa"
              value={tc}
              onChangeText={setTC}
              keyboardType="number-pad"
              maxLength={11}
            />
          </View>

          {/* Şifre Girişi */}
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

          {/* Giriş Yap Butonu */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
          >
            <LinearGradient
              colors={['#d32f2f', '#ff5252']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </LinearGradient>
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
    color: '#d32f2f',
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
  
});

export default LoginScreen;
