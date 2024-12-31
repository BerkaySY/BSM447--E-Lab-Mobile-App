import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import AddTest from '../../modals/AddTest';
import { auth, firestore } from '../../../../firebase';
import TestDetail from '../../modals/TestDetail';
import HeartBeatLoader from '../../../shared/animations/HeartBeatLoader';
import styles from './styles';


const PatientDetail = () => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [patientDetails, setPatientDetails] = useState([]);
  const [patientTests, setPatientTests] = useState([]);
  const [isTestModalVisible, setTestModalVisible] = useState(false);
  const [isTestDetailModalVisible, setTestDetailModalVisible] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  
  const { patientId } = route.params;

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
          setUserName(userData.fullName);
        }
      });
    }
  }, []);
  const fetchPatientDetails = async () => {
    setIsLoading(true);
    try {
      const patientRef = firestore.collection('users').doc(patientId);
        
      const doc = await patientRef.get();
      if (doc.exists) {
        setPatientDetails(doc.data());
      } else {
        console.error("Hasta bulunamadı");
        Alert.alert('Hata', 'Hasta bilgileri getirilemedi.');
      }
    } catch (error) {
      console.error("Hasta detayları çekilirken hata:", error);
      Alert.alert('Hata', 'Hasta bilgileri yüklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (route.params?.patientId) {
      fetchPatientDetails();
      fetchPatientTests();
    }
  }, [route.params]);
  const fetchPatientTests = async () => {
    setIsLoading(true);
    try {
      const { patientId } = route.params; 
      const testsRef = firestore
        .collection('users')
        .doc(patientId)
        .collection('tests'); 
      
      const snapshot = await testsRef.orderBy('createdAt', 'desc').get();
      const tests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() 
      }));
      
      setPatientTests(tests);
    } catch (error) {
      console.error("Hasta testlerini çekerken hata:", error);
      Alert.alert('Hata', 'Test bilgileri yüklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
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

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
  
    const birthDateObj = new Date(birthDate);
    const today = new Date();
  
    const totalMonths = 
      (today.getFullYear() - birthDateObj.getFullYear()) * 12 + 
      (today.getMonth() - birthDateObj.getMonth());
    const dayDiff = today.getDate() - birthDateObj.getDate();
  
    const effectiveMonths = dayDiff < 0 ? totalMonths - 1 : totalMonths;
  
    if (effectiveMonths < 12) {
      return `${effectiveMonths} ay`;
    }
  
    const years = Math.floor(effectiveMonths / 12);
    return `${years} yıl`;
  };
  const renderAddTestModal = () => (
    <AddTest
      isVisible={isTestModalVisible}
      onClose={() => setTestModalVisible(false)}
      onSubmit={() => {
        fetchPatientTests();
      }}
      patientId={route.params.patientId}
    />
  );

  const formatBirthDate = (birthDate) => {
    if (!birthDate) return '';

    const dateParts = birthDate.split('T')[0].split('-');
    const reversedDate = dateParts.reverse().join('-');
    
    return reversedDate;
  };
  
  const patientAge = calculateAge(patientDetails.birthDate);
  
  const renderTestsSection = () => (
    <View style={styles.testsSection}>
      <View style={styles.testsSectionHeader}>
        <Text style={styles.testsSectionTitle}>Tahliller</Text>
        <TouchableOpacity 
          style={styles.addTestButton}
          onPress={() => setTestModalVisible(true)}
        >
          <Text style={styles.addTestButtonText}>Tahlil Oluştur</Text>
        </TouchableOpacity>
      </View>
  
      {patientTests.length === 0 ? (
        <View style={styles.emptyTestsContainer}>
          <Text style={styles.emptyTestsText}>Henüz tahlil bulunmuyor.</Text>
        </View>
      ) : (
        <ScrollView>
          {patientTests.map((test) => (
            <View 
              key={test.id} 
              style={styles.testItem}
            >
              <View style={styles.testItemContent}>
                <Text style={styles.testName}>
                  Protokol No: {test.protokolNo}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.testDetailsButton}
                onPress={() => {
                  setSelectedTest(test); 
                  setTestDetailModalVisible(true);
                }}
              >
                <Text style={styles.testDetailsButtonText}>Detaylar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );


  return (
    <TouchableWithoutFeedback onPress={closeMenus}>
      <View style={styles.container}>
      {isLoading && (<HeartBeatLoader/>)}
        {/* Modal Tanımı */}
        {selectedTest && (
          <TestDetail
            isVisible={isTestDetailModalVisible}
            onClose={() => setTestDetailModalVisible(false)}
            testDetails={selectedTest}
            patientAge={patientAge}
            patientId={patientId}
          />
        )}
        {/* Üst Bar */}
        <View style={[styles.topBar]}>
          <TouchableOpacity onPress={toggleSideMenu}>
            <Ionicons name="menu" size={24} color='white'/>
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
        <ScrollView style={styles.mainContent}>
        {patientDetails && (
            <View style={styles.patientCard}>
              <View style={styles.patientCardContent}>
                <View style={styles.patientIconContainer}>
                  <Ionicons name="person-circle" size={50} color="#007BFF" />
                </View>
                <View style={styles.patientInfoContainer}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.patientName}>
                      {patientDetails.fullName}
                    </Text>
                  </View>

                  <View style={styles.patientDetailsSection}>
                    <Text style={styles.patientDetail}>
                      <Text style={styles.detailLabel}>TC Kimlik No:</Text> {patientDetails.tcId}
                    </Text>
                    {patientDetails.birthDate && (
                      <Text style={styles.patientDetail}>
                        <Text style={styles.detailLabel}>Doğum Tarihi:</Text> {formatBirthDate(patientDetails.birthDate)}
                      </Text>
                    )}
                    {patientDetails.phoneNumber && (
                      <Text style={styles.patientDetail}>
                        <Text style={styles.detailLabel}>Telefon:</Text> {patientDetails.phoneNumber}
                      </Text>
                    )}
                    {patientDetails.birthPlace && (
                      <Text style={styles.patientDetail}>
                        <Text style={styles.detailLabel}>Doğum Yeri:</Text> {patientDetails.birthPlace}
                      </Text>
                    )}
                  </View>
                  {patientDetails.birthDate && (
                    <Text style={styles.patientDetail}>
                      <Text style={styles.detailLabel}>Yaş:</Text> {patientAge}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
          {patientDetails && renderTestsSection()}
        </ScrollView>
        {renderAddTestModal()}
        
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PatientDetail;