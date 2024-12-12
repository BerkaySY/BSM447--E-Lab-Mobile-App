import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // React Navigation'dan import
import { auth, firestore } from '../../firebase';

const AdminDashboard = () => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const navigation = useNavigation(); // Navigation hook

  const toggleSideMenu = () => setSideMenuVisible(!isSideMenuVisible);
  const toggleProfileMenu = () => setProfileMenuVisible(!isProfileMenuVisible);

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

  const statsData = [
    { id: '1', icon: 'person', label: 'Kullanıcılar', value: '2500' },
    { id: '2', icon: 'medkit', label: 'Tahliller', value: '123.50 dk' },
  ];

  const handleLogOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('WelcomeScreen'); // Kullanıcıyı yönlendir
        setTimeout(() => {
          Alert.alert("Çıkış Yap", "Başarıyla çıkış yapıldı!", [{ text: "Tamam" }]); // Yönlendirme sonrası mesaj göster
        }, 100);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };
  return (
    <View style={styles.container}>
      {/* Üst Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuIcon} onPress={toggleSideMenu}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profileTouchable} onPress={toggleProfileMenu}>
            <Ionicons name="person-circle" size={24} color="white" />
            <Text style={styles.adminName}>{userName || 'Admin'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profil Menüsü */}
      {isProfileMenuVisible && (
        <View style={styles.profileMenu}>
          <TouchableOpacity style={styles.profileMenuItem}>
            <Text style={styles.profileMenuText}>Profil Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileMenuItem} onPress={handleLogOut}>
            <Text style={styles.profileMenuText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Yan Menü */}
      {isSideMenuVisible && (
        <View style={styles.sideMenu}>
          <TouchableOpacity style={styles.sideMenuItem}>
            <Ionicons name="stats-chart" size={20} color="#007BFF" style={styles.sideMenuIcon} />
            <Text style={styles.sideMenuText}>İstatistikler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideMenuItem}>
            <Ionicons name="people" size={20} color="#007BFF" style={styles.sideMenuIcon} />
            <Text style={styles.sideMenuText}>Hasta Takibi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideMenuItem}>
            <Ionicons name="book" size={20} color="#007BFF" style={styles.sideMenuIcon} />
            <Text style={styles.sideMenuText}>Kılavuzlar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Ana İçerik */}
      <View style={styles.mainContent}>
        <Image source={require('../../assets/labLogo.png')} style={styles.labLogo} />

        {statsData.map((item) => (
          <View key={item.id} style={styles.statCard}>
            <Ionicons name={item.icon} size={40} color="#007BFF" />
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
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
  menuIcon: {
    padding: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  adminName: {
    color: 'white',
    marginLeft: 10,
    fontSize: 18,
  },
  profileMenu: {
    position: 'absolute',
    top: 90,
    right: 0,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
  profileMenuItem: {
    paddingVertical: 10,
  },
  profileMenuText: {
    fontSize: 16,
    color: '#007BFF',
  },
  profileTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideMenu: {
    position: 'absolute',
    top: 100,
    left: 0,
    width: 250,
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
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sideMenuIcon: {
    marginRight: 15,
  },
  sideMenuText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
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

export default AdminDashboard;
