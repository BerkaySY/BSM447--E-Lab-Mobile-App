import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, TouchableWithoutFeedback, TextInput, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import { auth, firestore } from '../../../../firebase';
import firebase from 'firebase/compat/app';
import HeartBeatLoader from '../../../shared/animations/HeartBeatLoader';
import styles from './styles';

const EditUserProfile = () => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [tcId, setTCId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const navigation = useNavigation();

  const formatPhoneNumber = (text) => {
    // Remove non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Limit to 11 digits
    const limited = cleaned.slice(0, 11);
    
    setPhoneNumber(limited);
  };

  const toggleProfileMenu = () => {
    if (isSideMenuVisible) {
      setSideMenuVisible(false); 
    }
    setProfileMenuVisible(!isProfileMenuVisible); 
  };

  const closeMenus = () => {
    setSideMenuVisible(false);
    setProfileMenuVisible(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userRef = firestore.collection('users').doc(userId);
      userRef.get().then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          setUserName(userData.fullName || '');
          setEmail(userData.email || '');
          setBirthDate(userData.birthDate || '');
          setGender(userData.gender || '');
          setTCId(userData.tcId || '');
          setPhoneNumber(userData.phoneNumber || '');
        } else {
          Alert.alert("Hata", "Kullanıcı bilgileri bulunamadı.");
        }
      }).catch((error) => {
        console.error("Kullanıcı verisi çekilirken hata:", error);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, []);
  
  const handleLogOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('WelcomeScreen'); 
        setTimeout(() => {
          Alert.alert("Çıkış Yap", "Başarıyla çıkış yapıldı!", [{ text: "Tamam" }]);
        }, 100);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const handleProfileUpdate = async () => {
    const user = auth.currentUser; // Mevcut kullanıcıyı al
    if (user) {
      const userId = user.uid; // Kullanıcının UID'sini al
      const userRef = firestore.collection('users').doc(userId); // Kullanıcı dokümanına referans

      try {
        // Güncelleme verilerini oluştur
        const updateData = {
          fullName: userName,
          gender: gender,
          birthDate: birthDate,
          role: 'user', // Sabit bir role atanıyor, gerekirse özelleştirin
          tcId: tcId,
          email: email, // Sadece Firestore'daki email alanını güncelliyoruz
          phoneNumber: phoneNumber,
        };

        // Geçersiz e-posta kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) && email) {
          Alert.alert('Hata', 'Geçersiz e-posta adresi. Lütfen geçerli bir e-posta adresi giriniz.');
          return;
        }

        // Firestore dokümanını güncelle
        await userRef.update(updateData);

        Alert.alert('Başarılı', 'Profil bilgileri güncellendi.');
      } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
      }
    } else {
      Alert.alert('Hata', 'Kullanıcı oturumu yok. Lütfen tekrar giriş yapın.');
    }
  };

  const handlePasswordChange = async () => {
    if (oldPassword === newPassword) {
      Alert.alert('Hata', 'Eski şifre ile yeni şifre aynı olamaz.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Hata', 'Yeni şifre ve tekrarı eşleşmiyor.');
      return;
    }
  
    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Yeni şifre en az 6 karakter uzunluğunda olmalıdır.');
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı.');
        return;
      }

      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        oldPassword
      );
  
      // Kullanıcının kimlik doğrulamasını yap
      await user.reauthenticateWithCredential(credential);
  
      // Şifreyi güncelle
      await user.updatePassword(newPassword);
  
      // State'leri temizle
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
  
      Alert.alert('Başarılı', 'Şifreniz başarıyla güncellendi.');
    } catch (error) {
      Alert.alert('Hata', 'Eski Şifre Yanlış Girildi! Tekrar Deneyiniz!');
    }
  };
  return (
    <TouchableWithoutFeedback onPress={closeMenus}>
      <View style={styles.container}>
        {isLoading && <HeartBeatLoader />}
        {/* Üst Bar */}
        <View style={[styles.topBar]}>
          <TouchableOpacity onPress={() => navigation.navigate('UserHomeScreen')}>
            <Ionicons name="home" size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleProfileMenu}>
            <Ionicons name="person-circle" size={24} color='white'/>
          </TouchableOpacity>
        </View>

        {/* Profil Menüsü */}
        {isProfileMenuVisible && (
          <View style={styles.sideMenuProfile}>
            <View style={styles.profileHeader}>
              <Ionicons name="person-circle" size={40} color="#007BFF" />
              <Text style={styles.profileName}>{userName}</Text>
            </View>
            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('EditUserProfileScreen')}>
              <Text style={styles.sideMenuText}>Profili Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideMenuItem} onPress={handleLogOut}>
              <Text style={styles.sideMenuText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Ana İçerik */}
        <ScrollView style={styles.mainContent}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-circle" size={24} color="#007BFF" style={styles.cardHeaderIcon} />
              <Text style={styles.cardTitle}>Profili Düzenle</Text>
            </View>
            <View style={styles.cardContent}>
              {/* Telefon Numarası */}
              <View style={styles.inputContainer}>
                <Ionicons name="call" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Telefon Numarası (05XXXXXXXXX)"
                  placeholderTextColor="#aaa"
                  value={phoneNumber}
                  onChangeText={formatPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={11}
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
                  maxLength={35} // Maksimum 50 karakter
                />
              </View>
              <TouchableOpacity 
                style={styles.updateButton} 
                onPress={handleProfileUpdate}
              >
                <Text style={styles.updateButtonText}>
                  Profili Güncelle
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="lock-closed" size={24} color="#007BFF" style={styles.cardHeaderIcon} />
              <Text style={styles.cardTitle}>Şifreyi Değiştir</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Eski Şifre"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={oldPassword}
                  onChangeText={setOldPassword}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Yeni Şifre"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Yeni Şifre Tekrar"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                />
              </View>
              <TouchableOpacity 
                style={styles.updateButton} 
                onPress={handlePasswordChange}
              >
                <Text style={styles.updateButtonText}>
                  Şifreyi Değiştir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditUserProfile;