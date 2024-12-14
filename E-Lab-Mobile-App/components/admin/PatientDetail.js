import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TouchableWithoutFeedback, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import { auth, firestore } from '../../firebase';

const PatientDetail = () => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation(); 

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
          setUserName(`${userData.fullName}`);
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
            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('AdminDashboard')}>
              <Ionicons name="stats-chart" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={[styles.sideMenuText, isDarkMode && styles.darkText]}>İstatistikler</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('PatientTracking')}>
              <Ionicons name="people" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={[styles.sideMenuText, isDarkMode && styles.darkText]}>Hasta Takibi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('GuideCreation')}>
              <Ionicons name="book" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={[styles.sideMenuText, isDarkMode && styles.darkText]}>Kılavuzlar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ana İçerik */}
        <View style={styles.mainContent}>
          
        </View>
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
  labLogo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  statCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  darkStatCard: {
    backgroundColor: '#555',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#007BFF',
  },
});

export default PatientDetail;
