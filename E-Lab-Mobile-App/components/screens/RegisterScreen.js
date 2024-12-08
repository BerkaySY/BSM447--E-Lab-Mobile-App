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
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from '../../firebase';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [birthDateError, setBirthDateError] = useState(false);  

  const handleRegister = async () => {
    if (!fullName || !email || !birthDate || !password || !confirmPassword || !gender) {
      Alert.alert('Hata', 'Tüm alanları doldurun.');
      return;
    }
  
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/; // DD.MM.YYYY format
    if (!dateRegex.test(birthDate)) {
      setBirthDateError(true);
      Alert.alert('Hata', 'Doğum tarihi formatı hatalı. Lütfen DD.MM.YYYY formatında giriniz.');
      return;
    }
  
    // Convert birthDate from DD.MM.YYYY to a Date object
    const [day, month, year] = birthDate.split('.').map(Number);
  
    // Validate day, month, and year ranges
    if (month < 1 || month > 12) {
      setBirthDateError(true);
      Alert.alert('Hata', 'Geçersiz ay. 01 ile 12 arasında bir değer giriniz.');
      return;
    }
  
    if (day < 1 || day > 31) {
      setBirthDateError(true);
      Alert.alert('Hata', 'Geçersiz gün. 01 ile 31 arasında bir değer giriniz.');
      return;
    }
  
    // Check for month-day validity (e.g., February 30th is not valid)
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
      setBirthDateError(true);
      Alert.alert('Hata', `${month} ayında ${day} günü geçerli değil.`);
      return;
    }
  
    const birthDateObject = new Date(year, month - 1, day); // months are 0-indexed in JavaScript
  
    // Check if the date is valid
    if (isNaN(birthDateObject.getTime())) {
      setBirthDateError(true);
      Alert.alert('Hata', 'Geçersiz doğum tarihi. Lütfen geçerli bir tarih giriniz.');
      return;
    }
  
    // Check if birthdate is valid (not in the future or too young)
    const currentDate = new Date();
    if (birthDateObject > currentDate) {
      setBirthDateError(true);
      Alert.alert('Hata', 'Geçerli bir tarih giriniz. Gelecek tarih kabul edilemez.');
      return;
    }
  
    // Check if the user is under 13 years old (born after 2011)
    const minBirthYear = currentDate.getFullYear() - 13; // Get the minimum year for 13 years old
    if (year > minBirthYear || (year === minBirthYear && month > currentDate.getMonth() + 1) || (year === minBirthYear && month === currentDate.getMonth() + 1 && day > currentDate.getDate())) {
      Alert.alert('Hata', '13 yaşından küçükler bu uygulamayı kullanamaz.');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }
  
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }
  
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const formattedDate = new Date(birthDate.split('.').reverse().join('-')).toISOString();
  
      await firestore.collection('users').doc(user.uid).set({
        fullName,
        email,
        birthDate: formattedDate,
        gender,
        role: 'user',
      });
  
      Alert.alert('Başarılı', 'Kayıt işlemi başarılı!', [
        { text: 'Tamam', onPress: () => navigation.navigate('WelcomeScreen') },
      ]);
    } catch (error) {
      Alert.alert('Hata', error.message);
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
          <Image source={require('../../assets/labLogo.png')} style={styles.logo} />
          <Text style={styles.title}>Berkay-LAB</Text>

          {/* Ad Soyad */}
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ad Soyad"
              placeholderTextColor="#aaa"
              value={fullName}
              onChangeText={(text) => setFullName(text.slice(0, 30))}
              maxLength={30} // Maksimum 30 karakter
            />
          </View>

          {/* E-posta */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="E-posta Adresi"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={(text) => setEmail(text.slice(0, 50))}
              keyboardType="email-address"
              maxLength={50} // Maksimum 50 karakter
            />
          </View>

          {/* Doğum Tarihi */}
          <View style={styles.inputContainer}>
            <Ionicons name="calendar" size={20} style={styles.icon} />
            <TextInput
              style={[styles.input, birthDateError && { borderColor: 'red' }]} // Show red border on error
              placeholder="Doğum Tarihi (GG.AA.YYYY)"
              placeholderTextColor="#aaa"
              value={birthDate}
              onChangeText={(text) => {
                // Yalnızca sayı ve noktaya izin ver
                const filteredText = text.replace(/[^0-9.]/g, ''); // Sadece rakamlar ve nokta
                setBirthDate(filteredText);
                setBirthDateError(false); // Reset error when user starts typing
              }}
              maxLength={10} // Only 10 characters allowed (DD.MM.YYYY)
              keyboardType="numeric" // Sayı tuş takımı açmak için
            />
          </View>

          {/* Cinsiyet */}
          <View style={styles.pickerContainer}>
            <Ionicons name="male-female" size={20} style={styles.icon} />
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Cinsiyet Seçiniz" value="" />
              <Picker.Item label="Erkek" value="Erkek" />
              <Picker.Item label="Kadın" value="Kadın" />
            </Picker>
          </View>

          {/* Şifre */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={(text) => setPassword(text.slice(0, 20))}
              secureTextEntry={true}
              maxLength={20} // Maksimum 20 karakter
            />
          </View>

          {/* Şifre Tekrar */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Şifre Tekrar"
              placeholderTextColor="#aaa"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text.slice(0, 20))}
              secureTextEntry={true}
              maxLength={20} // Maksimum 20 karakter
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <LinearGradient colors={['#d32f2f', '#ff5252']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Kayıt Ol</Text>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  pickerContainer: {
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
  picker: {
    flex: 1,
    height: 50,
    color: '#333',
  },
});

export default RegisterScreen;
