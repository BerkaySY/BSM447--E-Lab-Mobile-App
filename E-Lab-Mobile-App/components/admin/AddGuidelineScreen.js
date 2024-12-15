import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, Switch,TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import { auth, firestore } from '../../firebase';
import { Picker } from '@react-native-picker/picker';


const AddGuidelineScreen = () => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const navigation = useNavigation(); 

  const [ageRange, setAgeRange] = useState('');
  const [selectedValueName, setSelectedValueName] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const valueNames = ['Değer 1', 'Değer 2', 'Değer 3'];

  const toggleSideMenu = () => {
    if (isProfileMenuVisible) {
      setProfileMenuVisible(false); 
    }
    setSideMenuVisible(!isSideMenuVisible);
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

  const handleModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userRef = firestore.collection('users').doc(userId);
      userRef.get().then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          setUserName(userData.fullName);
        }
      });
    }
  }, []);

  const handleAddData = () => {
    if (!ageRange || !selectedValueName || !minValue || !maxValue) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun!');
      return;
    }
    Alert.alert('Başarı', 'Veri başarıyla eklendi!');
  };

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

  return (
    <TouchableWithoutFeedback onPress={closeMenus}>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        {/* Üst Bar */}
        <View style={[styles.topBar]}>
          <TouchableOpacity onPress={toggleSideMenu}>
            <Ionicons name="menu" size={24} color={isDarkMode ? 'black' : 'white'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleProfileMenu}>
            <Ionicons name="person-circle" size={24} color={isDarkMode ? 'black' : 'white'} />
          </TouchableOpacity>
        </View>

        {/* Profil Menüsü */}
        {isProfileMenuVisible && (
          <View style={[styles.sideMenuProfile, isDarkMode && styles.darkSideMenu]}>
            <View style={styles.profileHeader}>
              <Ionicons name="person-circle" size={40} color="#007BFF" />
              <Text style={[styles.profileName, isDarkMode && styles.darkText]}>{userName || 'Admin'}</Text>
            </View>
            <TouchableOpacity style={styles.sideMenuItem} onPress={handleLogOut}>
              <Text style={[styles.sideMenuText, isDarkMode && styles.darkText]}>Çıkış Yap</Text>
            </TouchableOpacity>
            <View style={styles.modeToggleContainer}>
              <Text style={[styles.modeToggleText, isDarkMode && styles.darkText]}>
                {isDarkMode ? 'Karanlık Mod' : 'Aydınlık Mod'}
              </Text>
              <Switch 
                value={isDarkMode} 
                onValueChange={handleModeToggle} 
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
          </View>
        )}

        {/* Yan Menü */}
        {isSideMenuVisible && (
          <View style={[styles.sideMenu, isDarkMode && styles.darkSideMenu]}>
            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('AdminHomeScreen')}>
              <Ionicons name="stats-chart" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={[styles.sideMenuText, isDarkMode && styles.darkText]}>İstatistikler</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('PatientTrackingScreen')}>
              <Ionicons name="people" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={[styles.sideMenuText, isDarkMode && styles.darkText]}>Hasta Takibi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('GuidelinesScreen')}>
              <Ionicons name="book" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={[styles.sideMenuText, isDarkMode && styles.darkText]}>Kılavuzlar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ana İçerik */}
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={[styles.card, isDarkMode && styles.cardDark]}>
              <Text style={[styles.label, isDarkMode && styles.darkText]}>Yaş Aralığı</Text>
              <TextInput
                style={[styles.input, isDarkMode && styles.inputDark]}
                value={ageRange}
                onChangeText={setAgeRange}
                placeholder="Örn: 18-25"
                placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              />

              <Text style={[styles.label, isDarkMode && styles.darkText]}>Değer Adı</Text>
              <View style={[styles.pickerContainer, isDarkMode && styles.pickerDark]}>
                <Picker
                  selectedValue={selectedValueName}
                  onValueChange={(itemValue) => setSelectedValueName(itemValue)}
                >
                  <Picker.Item label="Seçiniz" value="" />
                  {valueNames.map((valueName, index) => (
                    <Picker.Item key={index} label={valueName} value={valueName} />
                  ))}
                </Picker>
              </View>

              <Text style={[styles.label, isDarkMode && styles.darkText]}>Minimum Değer</Text>
              <TextInput
                style={[styles.input, isDarkMode && styles.inputDark]}
                value={minValue}
                onChangeText={setMinValue}
                keyboardType="numeric"
                placeholder="Min değer"
                placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              />

              <Text style={[styles.label, isDarkMode && styles.darkText]}>Maksimum Değer</Text>
              <TextInput
                style={[styles.input, isDarkMode && styles.inputDark]}
                value={maxValue}
                onChangeText={setMaxValue}
                keyboardType="numeric"
                placeholder="Max değer"
                placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              />
              <TouchableOpacity style={styles.button} onPress={handleAddData}>
                <Text style={styles.buttonText}>Veriyi Ekle</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007BFF',
    paddingHorizontal: 15,
    paddingTop: 50,
    height: 100,
  },
  sideMenuProfile: {
    position: 'absolute',
    top: 100,
    right: 0,
    width: 220,
    height: '100%',
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
  darkSideMenu: {
    backgroundColor: '#444',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  sideMenu: {
    position: 'absolute',
    top: 100,
    left: 0,
    width: 220,
    height: '100%',
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
  sideMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sideMenuIcon: {
    marginRight: 10,
  },
  sideMenuText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  modeToggleText: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  mainContent: {
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputDark: {
    backgroundColor: '#555',
    borderColor: '#777',
    color: '#fff',
  },
  pickerContainer: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  pickerDark: {
    backgroundColor: '#555',
    borderColor: '#777',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardDark: {
    backgroundColor: '#333',
  },
});

export default AddGuidelineScreen;