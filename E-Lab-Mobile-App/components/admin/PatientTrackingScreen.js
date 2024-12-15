import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, Switch, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import { auth, firestore } from '../../firebase';

const PatientTrackingScreen = () => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
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

  const handleSearchChange = (text) => {
    setSearchQuery(text);
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

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const usersRef = firestore.collection('users')
          .where('role', '==', 'user');
        
        const snapshot = await usersRef.get();
        const patientsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPatients(patientsList);
        setFilteredPatients(patientsList);
      } catch (error) {
        console.error("Error fetching patients: ", error);
        Alert.alert("Hata", "Hastalar yüklenirken bir sorun oluştu.");
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = patients.filter(patient => 
        patient.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

  const renderPatientItem = ({ item }) => (
    <View 
      style={[
        styles.patientItem, 
        isDarkMode && styles.darkPatientItem
      ]}
    >
      <View style={styles.patientItemContent}>
        <Text style={[
          styles.patientName, 
          isDarkMode && styles.darkText
        ]}>
          {item.fullName}
        </Text>
        <Text style={[
          styles.patientEmail, 
          isDarkMode && styles.darkText
        ]}>
          {item.email}
        </Text>
      </View>
      <TouchableOpacity 
        style={[
          styles.detailsButton, 
          isDarkMode && styles.darkDetailsButton
        ]}
        onPress={() => {
          navigation.navigate('PatientDetailScreen', { patientId: item.id });
        }}
      >
        <Text style={[
          styles.detailsButtonText, 
          isDarkMode && styles.darkDetailsButtonText
        ]}>
          Detaylar
        </Text>
      </TouchableOpacity>
    </View>
  );
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
        <View style={styles.mainContent}>
          {/* Arama Kutusu */}
          <View style={styles.searchBarContainer}>
            <TextInput
              style={[styles.searchBar, isDarkMode && styles.darkSearchBar]}
              placeholder="Hasta Ara..."
              placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              maxLength={20}
            />
            <Ionicons 
              name="search" 
              size={24} 
              color={isDarkMode ? '#ccc' : '#888'} 
              style={styles.searchIcon} 
            />
          </View>
          {/* Hasta Listesi */}
          <FlatList
            data={filteredPatients}
            renderItem={renderPatientItem}
            keyExtractor={(item) => item.id}
            style={[styles.patientList, isDarkMode && styles.darkPatientList]}
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Text style={[styles.emptyListText, isDarkMode && styles.darkText]}>
                  {searchQuery 
                    ? 'Arama kriterlerine uyan hasta bulunamadı.' 
                    : 'Henüz hasta kaydı bulunmuyor.'}
                </Text>
              </View>
            }
          />
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
    flex: 1,
  },
  searchBarContainer: {
    width: '70%', 
    alignItems: 'center',
    flexDirection: 'row', 
  },
  searchBar: {
    width: '100%',
    padding: 10,
    borderRadius: 25, 
    borderWidth: 1,
    borderColor: '#007BFF',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  darkSearchBar: {
    backgroundColor: '#444',
    borderColor: '#555',
    color: 'white',
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  patientList: {
    width: '100%',
    marginTop: 20,
  },
  darkPatientList: {
    backgroundColor: '#333',
  },
  patientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkPatientItem: {
    backgroundColor: '#444',
    borderBottomColor: '#555',
  },
  patientItemContent: {
    flex: 1,
    marginRight: 10,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  patientEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  emptyListContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyListText: {
    fontSize: 16,
    color: '#888',
  },
  detailsButton: {
    backgroundColor: '#007BFF', 
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkDetailsButton: {
    backgroundColor: '#0056b3',
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  darkDetailsButtonText: {
    color: 'white',
  },
});

export default PatientTrackingScreen;
