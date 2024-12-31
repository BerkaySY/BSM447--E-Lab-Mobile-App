import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import { auth, firestore } from '../../../../firebase';
import HeartBeatLoader from '../../../shared/animations/HeartBeatLoader';
import styles from './styles';

const AdminHome = () => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userCount, setUserCount] = useState(0); 
  const [testsCount, setTestsCount] = useState(0);  
  const [guidelinesCount, setGuidelinesCount] = useState(0);
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
    
    fetchUserCount();
    fetchTestCount();
    fetchGuidelinesCount();
  }, []);

  const fetchUserCount = async () => {
    try {
      const snapshot = await firestore
        .collection('users')
        .where('role', '==', 'user')  // Filter by role
        .get();
      setUserCount(snapshot.size);  // Set the count of users
    } catch (error) {
      console.error('Error fetching user count: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestCount = async () => {
    setIsLoading(true);
    firestore.collection('users')
      .where('role', '==', 'user')  // User rolündeki kullanıcıları filtrele
      .get()
      .then(querySnapshot => {
        let totalTests = 0;

        querySnapshot.forEach(doc => {
          // Her kullanıcı için 'tests' koleksiyonundaki doküman sayısını al
          firestore.collection('users')
            .doc(doc.id)
            .collection('tests')
            .get()
            .then(testSnapshot => {
              totalTests += testSnapshot.size;  // Toplam tahlil sayısını artır
              setTestsCount(totalTests);  // Sonucu state'e kaydet
            });
        });
      });
      setIsLoading(false);
  };

  const fetchGuidelinesCount = async () => {
    setIsLoading(true);
    try {
      const snapshot = await firestore.collection('guidelines').get();  // Fetch guidelines collection
      setGuidelinesCount(snapshot.size);  // Set the count of guidelines
    } catch (error) {
      console.error('Error fetching guidelines count: ', error);
    } 
  };

  const statsData = [
    { id: '1', icon: 'person', label: 'Hastalar', value: userCount.toString() },
    { id: '2', icon: 'medkit', label: 'Tahliller', value: testsCount.toString() },
    { id: '3', icon: 'book', label: 'Kılavuzlar', value: guidelinesCount.toString() },
  ];

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
      <View style={styles.container}>
      {isLoading && (<HeartBeatLoader/>)}
        {/* Üst Bar */}
        <View style={[styles.topBar]}>
          <TouchableOpacity onPress={toggleSideMenu}>
            <Ionicons name="menu" size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleProfileMenu}>
            <Ionicons name="person-circle" size={24} color='white' />
          </TouchableOpacity>
        </View>

        {/* Profil Menüsü */}
        {isProfileMenuVisible && (
          <View style={styles.sideMenuProfile}>
            <View style={styles.profileHeader}>
              <Ionicons name="person-circle" size={40} color="#007BFF" />
              <Text style={styles.profileName}>{userName || 'Admin'}</Text>
            </View>
            <TouchableOpacity style={styles.sideMenuItem} onPress={handleLogOut}>
              <Text style={styles.sideMenuText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Yan Menü */}
        {isSideMenuVisible && (
          <View style={styles.sideMenu}>
            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('AdminHomeScreen')}>
              <Ionicons name="stats-chart" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={styles.sideMenuText}>İstatistikler</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('PatientTrackingScreen')}>
              <Ionicons name="people" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={styles.sideMenuText}>Hasta Takibi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('GuidelinesScreen')}>
              <Ionicons name="book" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={styles.sideMenuText}>Kılavuzlar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ana İçerik */}
        <View style={styles.mainContent}>
          {statsData.map((item) => (
            <View key={item.id} style={styles.statCard}>
              <Ionicons name={item.icon} size={40} color="#007BFF" />
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AdminHome;