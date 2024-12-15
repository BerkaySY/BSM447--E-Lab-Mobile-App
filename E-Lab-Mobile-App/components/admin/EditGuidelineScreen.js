import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, TouchableWithoutFeedback, Switch, Button, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import { auth, firestore } from '../../firebase';

const EditGuidelineScreen = () => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const navigation = useNavigation(); 

  const [guideName, setGuideName] = useState('');
  const [valueNames, setValueNames] = useState(['']);

  const addValueField = () => {
    setValueNames([...valueNames, '']);
  };

  const updateValueName = (text, index) => {
    const updatedValues = [...valueNames];
    updatedValues[index] = text;
    setValueNames(updatedValues);
  };


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
        <ScrollView style={styles.mainContent}>
          <View style={styles.card}>
            <Text style={styles.label}>Kılavuz Adı:</Text>
            <TextInput
              style={styles.input}
              placeholder="Kılavuz adı giriniz"
              value={guideName}
              onChangeText={setGuideName}
            />

            <Text style={styles.label}>Değer Adları:</Text>
            {valueNames.map((value, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder={`Değer ${index + 1}`}
                value={value}
                onChangeText={(text) => updateValueName(text, index)}
              />
            ))}

            <TouchableOpacity style={styles.addButton} onPress={addValueField}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            <Button title="Kılavuzu Oluştur" />
          </View>
        </ScrollView>
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
  
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditGuidelineScreen;