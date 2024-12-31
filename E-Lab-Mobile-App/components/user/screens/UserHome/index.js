import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, Modal, FlatList, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../../../../firebase';
import TestDetail from '../../../admin/modals/TestDetail';
import HeartBeatLoader from '../../../shared/animations/HeartBeatLoader';
import styles from './styles';

const UserHome = () => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tests, setTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTests, setFilteredTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [patientAge, setPatientAge] = useState(null);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [availableTests, setAvailableTests] = useState([]);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedTestName, setSelectedTestName] = useState('');
  const [referenceValues, setReferenceValues] = useState({});
  const [isSearchActive, setIsSearchActive] = useState(false);
  const navigation = useNavigation();


  const extractTestNames = (testsData) => {
    const testNamesSet = new Set();
    testsData.forEach(test => {
      if (test.immunoglobulinValues) {
        Object.keys(test.immunoglobulinValues).forEach(name => {
          testNamesSet.add(name);
        });
      }
    });
    return Array.from(testNamesSet).sort();
  };
  
  const convertGuidelineRangeToMonths = (rangeString) => {
    const [min, max] = rangeString.split('-').map(part => part.trim());
    
    const convertPart = (part) => {
      const value = parseInt(part.match(/\d+/)[0], 10);
      
      if (rangeString.includes('yıl')) return value * 12;
      if (rangeString.includes('ay')) return value;
      if (rangeString.includes('gün')) return 0;
      return value;
    };
  
    return {
      minAge: convertPart(min),
      maxAge: convertPart(max),
    };
  };

  const convertAgeToMonths = (ageString) => {
    const [value, unit] = ageString.toLowerCase().split(' ');
    const numValue = parseInt(value);
    
    if (unit.startsWith('gün')) return 0;
    if (unit.startsWith('ay')) return numValue;
    if (unit.startsWith('yıl')) return numValue * 12;
    return 0;
  };

  const formatNumberValue = (value) => {
    if (typeof value === 'string') {
      // Virgüllü değeri noktaya çevir
      return parseFloat(value.replace(',', '.'));
    }
    return value;
  };

  const getStatusIcon = (value, referenceRange) => {
    if (!referenceRange || referenceRange === "Referans aralığı bulunamadı") {
      return null;
    }

    const [minRef, maxRef] = referenceRange.split('-').map(val => formatNumberValue(val.trim()));
    value = formatNumberValue(value); 
    // Mevcut değeri noktalı formata çevir
    
    if (isNaN(value) || isNaN(minRef) || isNaN(maxRef)) {
      return null;
    }
    
    if (value > maxRef) {
      return <Ionicons name="arrow-up" size={20} color="#ff0000" />;
    } else if (value < minRef) {
      return <Ionicons name="arrow-down" size={20} color="#4dff00" />;
    } else {
      return <Ionicons name="arrow-forward" size={20} color="#00a6ff" />;
    }
  };

  const getComparisonIcon = (currentValue, previousValue) => {
    const current = formatNumberValue(currentValue);
    const previous = formatNumberValue(previousValue);
  
    if (current > previous) {
      return <Ionicons name="arrow-up" size={20} color="#ff0000" />;
    } else if (current < previous) {
      return <Ionicons name="arrow-down" size={20} color="#4dff00" />;
    } else {
      return <Ionicons name="arrow-forward" size={20} color="#00a6ff" />;
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setIsSearchActive(query.trim() !== '');
    
    if (query.trim() === '') {
      setFilteredTests(tests);
      setReferenceValues({});
      return;
    }
    
    setIsLoading(true); // Tüm loading işlemlerini tek state ile yönetiyoruz
    
    const filtered = tests.filter(test => {
      const testNames = Object.keys(test.immunoglobulinValues || {});
      return testNames.some(name => name.toLowerCase() === query.toLowerCase());
    });
    
    // Fetch reference values for the searched test
    const newReferenceValues = {};
    try {
      for (const test of filtered) {
        for (const [testName, value] of Object.entries(test.immunoglobulinValues || {})) {
          if (testName.toLowerCase() === query.toLowerCase()) {
            if (!newReferenceValues[testName]) {
              const refValue = await fetchReferenceValues(testName, patientAge);
              newReferenceValues[testName] = refValue;
            }
          }
        }
      }
      
      setReferenceValues(newReferenceValues);
      setFilteredTests(filtered);
    } catch (error) {
      console.error('Veri çekilirken hata:', error);
      Alert.alert('Hata', 'Veriler yüklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchActive(false);
    setFilteredTests(tests);
    setReferenceValues({});
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


  const fetchPatientTests = async (uid) => {
    setIsLoading(true);
    try {
      const testsRef = firestore
        .collection('users')
        .doc(uid)
        .collection('tests');

      const snapshot = await testsRef.orderBy('createdAt', 'desc').get();
      const testsData = snapshot.docs.map(doc => {
        const data = doc.data();
        const date = data.createdAt?.toDate();
        const formattedDate = date
          ? date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : 'Tarih yok';
        return {
          id: doc.id,
          ...data,
          formattedDate,
        };
      });

      setTests(testsData);
      setFilteredTests(testsData);
      const uniqueTestNames = extractTestNames(testsData);
      setAvailableTests(uniqueTestNames);
    } catch (error) {
      console.error('Hasta testlerini çekerken hata:', error);
      Alert.alert('Hata', 'Test bilgileri yüklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const showDetails = (test) => {
    setSelectedTest(test);
    setDetailModalVisible(true);
  };

  const findPreviousValue = (testName, currentTest, allTests) => {
    // Convert current test's date to timestamp for comparison
    const currentDate = new Date(currentTest.createdAt.toDate());
    
    // Filter tests that are older than current test
    const olderTests = allTests.filter(test => {
      const testDate = new Date(test.createdAt.toDate());
      return testDate < currentDate;
    });
    
    // Sort older tests by date in descending order
    const sortedOlderTests = olderTests.sort((a, b) => 
      new Date(b.createdAt.toDate()) - new Date(a.createdAt.toDate())
    );
    
    // Find the most recent test that has the same test name
    const previousTest = sortedOlderTests.find(test => 
      test.immunoglobulinValues && 
      test.immunoglobulinValues[testName]
    );
    
    return previousTest ? previousTest.immunoglobulinValues[testName] : null;
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
  
    const birthDateObj = new Date(birthDate);
    const today = new Date();
  
    // Farklı yılları kapsayan tarih farkını hesaplamak için ay ve gün farkını hesaba kat
    const totalMonths = 
      (today.getFullYear() - birthDateObj.getFullYear()) * 12 + 
      (today.getMonth() - birthDateObj.getMonth());
    const dayDiff = today.getDate() - birthDateObj.getDate();
  
    // Eğer gün farkı negatifse, bir ay eksilt
    const effectiveMonths = dayDiff < 0 ? totalMonths - 1 : totalMonths;
  
    // Eğer yaş 1 yıldan küçükse
    if (effectiveMonths < 12) {
      return `${effectiveMonths} ay`;
    }
  
    // Yaş 1 yıl veya daha fazlaysa
    const years = Math.floor(effectiveMonths / 12);
    return `${years} yıl`;
  };

  const fetchReferenceValues = async (testName, patientAge) => {
    setIsLoading(true);
    if (!patientAge) return null;
    
    try {
      const testsSnapshot = await firestore
        .collection('guidelines')
        .get();
      
      for (const guidelineDoc of testsSnapshot.docs) {
        const testDoc = await guidelineDoc
          .ref
          .collection('datas')
          .doc(testName)
          .get();

        if (testDoc.exists) {
          const ageRangesSnapshot = await testDoc.ref.collection('ageRanges').get();
          const patientAgeInMonths = convertAgeToMonths(patientAge);

          for (const rangeDoc of ageRangesSnapshot.docs) {
            const { minAge, maxAge } = convertGuidelineRangeToMonths(rangeDoc.id);
            
            if (patientAgeInMonths >= minAge && patientAgeInMonths <= maxAge) {
              const data = rangeDoc.data();
              return `${data.minValue}-${data.maxValue}`;
            }
          }
        }
      }
      return "Referans aralığı bulunamadı";
    } catch (error) {
      console.error('Error fetching reference values:', error);
      return null;
    }
  };


  useEffect(() => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userRef = firestore.collection('users').doc(userId);
      
      Promise.all([
        fetchPatientTests(user.uid),
        userRef.get().then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            setUserName(userData.fullName);
            setPatientAge(calculateAge(userData.birthDate));
          }
        })
      ]).finally(() => {
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

  const TestPicker = () => (
    <Modal
      visible={isPickerVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setPickerVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
        <View style={styles.pickerModalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.pickerModalContent}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Tetkik Seçin</Text>
                <TouchableOpacity onPress={() => setPickerVisible(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={availableTests}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickerItem}
                    onPress={() => {
                      setSelectedTestName(item);
                      handleSearch(item);
                      setPickerVisible(false);
                    }}
                  >
                    <Text style={styles.pickerItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const SearchContainer = () => (
    <View style={styles.searchContainer}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setPickerVisible(true)}
      >
        <Ionicons name="list" size={20} color="#007BFF" />
        <Text style={styles.pickerButtonText}>
          {selectedTestName || 'Tetkik seçin'}
        </Text>
      </TouchableOpacity>
      {isSearchActive && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearSearch}
        >
          <Ionicons name="close-circle" size={24} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderTestItem = ({ item }) => {
    if (searchQuery.trim() !== '') {
      return (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.modernTestCard}>
            {Object.entries(item.immunoglobulinValues || {}).map(([testName, value]) => {
              if (testName.toLowerCase() === searchQuery.toLowerCase()) {
                const testValue = typeof value === 'object' ? value.value : value;
                const referenceRange = referenceValues[testName];
                const previousValue = findPreviousValue(testName, item, tests);
                
                return (
                  <View key={testName} style={styles.modernTestDetail}>
                    <View style={styles.testHeader}>
                      <Text style={styles.modernTestName}>{testName}</Text>
                      <Text style={styles.modernTestDate}>{item.formattedDate}</Text>
                    </View>
                    
                    <View style={styles.resultContainer}>
                      <View style={styles.valueContainer}>
                        <Text style={styles.valueLabel}>Sonuç</Text>
                        <Text style={styles.valueText}>{testValue}</Text>
                      </View>
                      
                      <View style={styles.referenceContainer}>
                        <Text style={styles.referenceLabel}>Referans Aralığı</Text>
                        <Text style={styles.referenceText}>{referenceRange || 'Yükleniyor...'}</Text>
                      </View>

                      <View style={styles.statusContainer}>
                        <Text style={styles.statusLabel}>Durum</Text>
                        {getStatusIcon(testValue, referenceRange)}
                      </View>

                      {previousValue !== null && (
                        <View style={styles.comparisonContainer}>
                          <Text style={styles.comparisonLabel}>Değişim</Text>
                          {getComparisonIcon(testValue, previousValue)}
                        </View>
                      )}
                    </View>
                  </View>
                );
              }
              return null;
            })}
          </View>
        </ScrollView>
      );
    }

    // Normal görünüm
    return (
      <TouchableOpacity 
        style={styles.testCard} 
        onPress={() => showDetails(item)}
      >
        <View style={styles.testHeaderRow}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={20} color="#007BFF" />
            <Text style={styles.dateText}>{item.formattedDate}</Text>
          </View>
        </View>

        <View style={styles.protocolContainer}>
          <Text style={styles.protocolLabel}>Protokol No:</Text>
          <Text style={styles.protocolNumber}>{item.protokolNo}</Text>
        </View>

        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => showDetails(item)}
        >
          <Text style={styles.detailsButtonText}>Detayları Gör</Text>
          <Ionicons name="chevron-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };


  return (
    <TouchableWithoutFeedback onPress={closeMenus}>
      <View style={styles.container}>
        {isLoading && (<HeartBeatLoader/>)}
        {/* Üst Bar */}
        <View style={[styles.topBar]}>
          <TouchableOpacity onPress={() => navigation.navigate('UserHomeScreen')}>
            <Ionicons name="home" size={24} color='white' />
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
        <View style={styles.mainContent}>
          <View style={styles.testsSection}>
            <Text style={styles.testsSectionTitle}>
              Tahlil Sonuçlarım
            </Text>

            <SearchContainer />
            <TestPicker />

            {filteredTests.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="document-text-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>
                  Henüz tahlil sonucu bulunmuyor
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredTests}
                keyExtractor={(item) => item.id}
                renderItem={renderTestItem}
                contentContainerStyle={styles.testList}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              />
            )}
          </View>
        </View>

        {selectedTest && (
          <TestDetail
            isVisible={isDetailModalVisible}
            onClose={() => setDetailModalVisible(false)}
            testDetails={selectedTest}
            patientAge={patientAge}
            patientId={auth.currentUser?.uid}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UserHome;