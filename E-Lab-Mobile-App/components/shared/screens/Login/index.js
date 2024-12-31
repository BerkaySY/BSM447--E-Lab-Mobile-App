import { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, KeyboardAvoidingView, 
         TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../../../firebase';
import styles from './styles';

const auth = getAuth(app);
const firestore = getFirestore(app);

const Login = ({ navigation }) => {
  const [tcId, setTCId] = useState('');
  const [password, setPassword] = useState('');

  const validateTCId = (tc) => {
    // TC Kimlik Number validation
    if (tc.length === 11) return true;
    
  };

  const handleLogin = async () => {
    if (!tcId) {
      Alert.alert('Hata', 'TC Kimlik Numarası boş bırakılamaz.');
      return;
    }

    if (!validateTCId(tcId)) {
      Alert.alert('Hata', 'Geçersiz TC Kimlik Numarası.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    try {
      const emailLikeTcId = `${tcId}@tc.com`;
      const userCredential = await signInWithEmailAndPassword(auth, emailLikeTcId, password);
      const user = userCredential.user;

      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;

          if (role === 'admin') {
            Alert.alert('Başarılı', 'Yönetici paneline hoş geldiniz.');
            navigation.navigate('AdminHomeScreen');
          } else if (role === 'user') {
            Alert.alert('Başarılı', `Hoş geldiniz, ${userData.fullName}`);
            navigation.navigate('UserHomeScreen');
          } else {
            Alert.alert('Hata', 'Kullanıcı rolü tanımlanamadı.');
          }
        } else {
          Alert.alert('Hata', 'Kullanıcı verileri bulunamadı.');
        }
      } catch (firestoreError) {
        Alert.alert('Hata', 'Veritabanındaki verilere erişilemedi.');
        console.error(firestoreError);
      }
    } catch (authError) {
      console.log("Hata kodu:", authError.code, "Mesaj:", authError.message);
      switch (authError.code) {
        case 'auth/user-not-found':
          Alert.alert('Hata', 'Bu TC Kimlik No ile kayıtlı bir kullanıcı bulunamadı.');
          break;
        case 'auth/wrong-password':
          Alert.alert('Hata', 'Yanlış şifre. Lütfen tekrar deneyin.');
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
      <LinearGradient colors={['#ff8000', '#ffd872']} style={styles.container}>
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
          <Image source={require('../../../../assets/labLogo.png')} style={styles.logo} />
          <Text style={styles.title}>Berkay-LAB</Text>
          {/* TC Kimlik Numarası */}
          <View style={styles.inputContainer}>
            <Ionicons name="card" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="TC Kimlik Numarası"
              placeholderTextColor="#aaa"
              value={tcId}
              onChangeText={(text) => {
                const filteredText = text.replace(/[^0-9]/g, '');
                setTCId(filteredText.slice(0, 11));
              }}
              keyboardType="numeric"
              maxLength={11}
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
            <LinearGradient colors={['#d32f2f', '#ff5252']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </LinearGradient>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default Login;