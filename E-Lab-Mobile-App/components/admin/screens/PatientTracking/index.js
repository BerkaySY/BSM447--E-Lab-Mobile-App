import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, TouchableWithoutFeedback, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import { auth, firestore } from '../../../../firebase';
import PatientRegistration from '../../modals/PatientRegistration';
import HeartBeatLoader from '../../../shared/animations/HeartBeatLoader';
import styles from './styles';

const PatientTracking = () => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isRegistrationModalVisible, setRegistrationModalVisible] = useState(false);
  const [birthDateError, setBirthDateError] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    gender: '',
    tcId: '',
  });
  const navigation = useNavigation(); 

  const validateFormData = () => {
    if (!formData.fullName || !formData.tcId || !formData.birthDate || !formData.password || !formData.confirmPassword || !formData.gender) {
      Alert.alert('Hata', 'Tüm alanları doldurun.');
      return false;
    }
    
    if (!formData.tcId) {
      Alert.alert('Hata', 'TC Kimlik Numarası boş bırakılamaz.');
      return false;
    }

    if (formData.tcId.length !== 11) {
      Alert.alert('Hata', 'Geçersiz TC Kimlik Numarası.');
      return false;
    }

    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dateRegex.test(formData.birthDate)) {
      setBirthDateError(true);
      Alert.alert('Hata', 'Doğum tarihi formatı hatalı. Lütfen GG.AA.YYYY formatında giriniz.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateFormData()) return;
    const adminUser = auth.currentUser;
    setIsLoading(true);
    try {
      const emailLikeTcId = `${formData.tcId}@tc.com`;
      const userCredential = await auth.createUserWithEmailAndPassword(emailLikeTcId, formData.password);
      const user = userCredential.user;
  
      const [day, month, year] = formData.birthDate.split('.');
      const formattedDate = new Date(year, month - 1, day).toISOString();
  
      await firestore.collection('users').doc(user.uid).set({
        fullName: formData.fullName,
        birthDate: formattedDate,
        gender: formData.gender,
        tcId: formData.tcId,
        phoneNumber: '',
        email: '',
        role: 'user',
      });
  
      Alert.alert('Başarılı', 'Hasta kaydı başarıyla oluşturuldu!', [
        {
          text: 'Tamam',
          onPress: () => {
            setRegistrationModalVisible(false);
            setFormData({
              fullName: '',
              birthDate: '',
              password: '',
              confirmPassword: '',
              gender: '',
              tcId: '',
            });
            if (adminUser) {
              auth.updateCurrentUser(adminUser);
            }
            fetchPatients();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Hata', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getGenderIcon = (gender) => {
    // Validate and map gender to specific icons
    switch (gender?.toLowerCase()) {
      case 'erkek':
        return { 
          name: 'man', 
          color: '#007BFF',
          label: 'Erkek'
        };
      case 'kadın':
        return { 
          name: 'woman', 
          color: '#FF1493',
          label: 'Kadın'
        };
      default:
        return { 
          name: 'help-circle', 
          color: '#808080',
          label: 'Bilinmiyor'
        };
    }
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

  useEffect(() => {
    const admin = auth.currentUser;
    if (admin) {
      const adminId = admin.uid;
      const adminRef = firestore.collection('users').doc(adminId);
      adminRef.get().then((doc) => {
        if (doc.exists) {
          const adminData = doc.data();
          setUserName(`${adminData.fullName}`);
        }
      });
    }

    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  

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

  const renderPatientItem = ({ item }) => {
    const genderIcon = getGenderIcon(item.gender);

    return (
      <View style={styles.patientItem}>
        <View style={styles.genderIconContainer}>
          <Ionicons 
            name={genderIcon.name}
            size={28} 
            color={genderIcon.color} 
          />
          <Text style={[styles.genderLabel, { color: genderIcon.color }]}>
            {genderIcon.label}
          </Text>
        </View>

        <View style={styles.patientItemContent}>
          <Text style={styles.patientName}>
            {item.fullName}
          </Text>
          <Text style={styles.patientTc}>
            {item.tcId}
          </Text>
        </View>
        <TouchableOpacity 
          style={ styles.detailsButton }
          onPress={() => {
            navigation.navigate('PatientDetailScreen', { patientId: item.id });
          }}
        >
          <Text style={ styles.detailsButtonText }>
            Detaylar
          </Text>
        </TouchableOpacity>
      </View>
    );
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
      <View style={styles.container}>
        {/* Üst Bar */}
        <View style={[styles.topBar]}>
          <TouchableOpacity onPress={toggleSideMenu}>
            <Ionicons name="menu" size={24} color='white' />
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
              <Text style={styles.profileName}>{userName || 'Admin'}</Text>
            </View>
            <TouchableOpacity style={styles.sideMenuItem} onPress={handleLogOut}>
              <Text style={ styles.sideMenuText }>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Yan Menü */}
        {isSideMenuVisible && (
          <View style={ styles.sideMenu }>
            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('AdminHomeScreen')}>
              <Ionicons name="stats-chart" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={ styles.sideMenuText }>İstatistikler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ styles.sideMenuItem } onPress={() => navigation.navigate('PatientTrackingScreen')}>
              <Ionicons name="people" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={ styles.sideMenuText }>Hasta Takibi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('GuidelinesScreen')}>
              <Ionicons name="book" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={ styles.sideMenuText }>Kılavuzlar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ana İçerik */}
        <View style={styles.mainContent}>
        {isLoading && (<HeartBeatLoader/>)}
          <View style={styles.searchAndRegisterContainer}>
            <View style={[styles.searchBarContainer, { flex: 1 }]}>
              <TextInput
                style={ styles.searchBar }
                placeholder="Hasta Ara..."
                placeholderTextColor={'#888'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                maxLength={20}
              />
              <Ionicons 
                name="search" 
                size={24} 
                color={'#888'} 
                style={styles.searchIcon} 
              />
            </View>
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={() => setRegistrationModalVisible(true)}
            >
              <Ionicons name="person-add" size={24} color="#fff" />
              <Text style={styles.registerButtonText}>Hasta Kayıt</Text>
            </TouchableOpacity>
          </View>
          {/* Hasta Listesi */}
          <FlatList
            data={filteredPatients}
            renderItem={renderPatientItem}
            keyExtractor={(item) => item.id}
            style={ styles.patientList }
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Text style={styles.emptyListText}>
                  {searchQuery 
                    ? 'Arama kriterlerine uyan hasta bulunamadı.' 
                    : 'Henüz hasta kaydı bulunmuyor.'}
                </Text>
              </View>
            }
          />
        </View>
        {isRegistrationModalVisible && (
          <PatientRegistration
            formData={formData}
            setFormData={setFormData}
            onClose={() => setRegistrationModalVisible(false)}
            onRegister={handleRegister}
          />
        )}

      </View>
    </TouchableWithoutFeedback>
  );
};

export default PatientTracking;