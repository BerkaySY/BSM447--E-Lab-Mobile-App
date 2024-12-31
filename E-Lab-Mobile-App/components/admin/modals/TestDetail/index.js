import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firestore } from '../../../../firebase';
import HeartBeatLoader from '../../../shared/animations/HeartBeatLoader';
import styles from './styles';

const TestDetail = ({ isVisible, onClose, testDetails, patientAge, patientId }) => {
  const [guidelines, setGuidelines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [guidelineName, setGuidelineName] = useState("");
  const [referenceValues, setReferenceValues] = useState({});
  const [previousTests, setPreviousTests] = useState([]);
  const [showPreviousTests, setShowPreviousTests] = useState(false);
  const [selectedTestName, setSelectedTestName] = useState(null);

  const convertAgeToMonths = (ageString) => {
    const [value, unit] = ageString.toLowerCase().split(' ');
    const numValue = parseInt(value);
    
    if (unit.startsWith('gün')) return 0;
    if (unit.startsWith('ay')) return numValue;
    if (unit.startsWith('yıl')) return numValue * 12;
    return 0;
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

  const formatNumberValue = (value) => {
    if (typeof value === 'string') {
      // Virgüllü değeri noktaya çevir
      return parseFloat(value.replace(',', '.'));
    }
    return value;
  };

  const getComparisonIcon = (currentValue, referenceRange) => {
  // Referans değeri yoksa karşılaştırma yapma
  if (!referenceRange || referenceRange === "Yükleniyor..." || 
      referenceRange === "Uygun referans aralığı bulunamadı" || 
      referenceRange === "Test verisi bulunamadı") {
    return null;
  }

  // Referans aralığını parçala ve noktalı formata çevir
  const [minRef, maxRef] = referenceRange.split('-').map(val => formatNumberValue(val.trim()));
  
  // Mevcut değeri noktalı formata çevir
  const value = formatNumberValue(currentValue);

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


const getHistoricalComparisonIcon = (currentValue, previousValue) => {
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
  useEffect(() => {
    const fetchGuidelines = async () => {
      setIsLoading(true);
      try {
        const guidelinesSnapshot = await firestore.collection('guidelines').get();
        const guidelinesData = [];
        guidelinesSnapshot.forEach((doc) => {
          guidelinesData.push({
            id: doc.id,
            name: doc.data().name
          });
        });
        setGuidelines(guidelinesData);
      } catch (error) {
        console.error('Error fetching guidelines:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuidelines();
  }, []);

  useEffect(() => {
    const fetchGuidelineAndReferences = async () => {
      if (!testDetails?.selectedGuideline || !patientAge) {
        console.log("Missing required data:", { 
          selectedGuideline: testDetails?.selectedGuideline, 
          patientAge 
        });
        return;
      }
      setIsLoading(true);
      try {
        // Fetch guideline name
        const guidelineDoc = await firestore
          .collection('guidelines')
          .doc(testDetails.selectedGuideline)
          .get();

        if (guidelineDoc.exists) {
          setGuidelineName(guidelineDoc.data().name);
        }

        // Convert patient age to months
        const patientAgeInMonths = convertAgeToMonths(patientAge);
        const referenceValuesMap = {};

        // Fetch reference values for each test
        for (const testName of Object.keys(testDetails.immunoglobulinValues)) {
          // Önce test dokümanını al
          const testDoc = await firestore
            .collection('guidelines')
            .doc(testDetails.selectedGuideline)
            .collection('datas')
            .doc(testName)
            .get();

          if (testDoc.exists) {
            // Age ranges koleksiyonunu al
            const ageRangesSnapshot = await testDoc.ref.collection('ageRanges').get();
            let foundRange = false;

            ageRangesSnapshot.forEach(rangeDoc => {
              const { minAge, maxAge } = convertGuidelineRangeToMonths(rangeDoc.id);
              
              if (patientAgeInMonths >= minAge && patientAgeInMonths <= maxAge) {
                const data = rangeDoc.data();
                referenceValuesMap[testName] = `${data.minValue}-${data.maxValue}`;
                foundRange = true;
              }
            });

            if (!foundRange) {
              referenceValuesMap[testName] = "Uygun referans aralığı bulunamadı";
            }
          } else {
            referenceValuesMap[testName] = "Test verisi bulunamadı";
          }
        }
        setReferenceValues(referenceValuesMap);
      } catch (error) {
        console.error('Error fetching guideline and references:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuidelineAndReferences();
  }, [testDetails, patientAge]);


  const fetchPreviousTests = async (testName, patientId) => {
    setIsLoading(true);
    try {
      const testsSnapshot = await firestore
        .collection('users')
        .doc(patientId)
        .collection('tests')
        .where('createdAt', '<', testDetails.createdAt)
        .orderBy('createdAt', 'desc')
        .get();
  
      const tests = [];
      testsSnapshot.forEach((doc) => {
        const testData = doc.data();
        const testValue = testData.immunoglobulinValues[testName];
        const value = typeof testValue === 'object' ? testValue.value : testValue;
  
        if (value !== null && value !== undefined) {
          const date = testData.createdAt?.toDate(); // Firestore tarihini `Date` objesine çevir
          const formattedDate = date
            ? date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : 'Tarih yok';
          
          tests.push({
            id: doc.id,
            date: formattedDate,
            value: value,
          });
        }
      });
  
      setSelectedTestName(testName);
      setPreviousTests(tests);
      setShowPreviousTests(true);
    } catch (error) {
      //console.error('Error fetching previous tests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTestRows = () => {
    if (!testDetails?.immunoglobulinValues) return null;

    return Object.entries(testDetails.immunoglobulinValues).map(([key, value], index) => {
      const referenceValue = referenceValues[key] || "Yükleniyor...";

      return (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableCell}>{key}</Text>
          <Text style={styles.tableCell}>{typeof value === 'object' ? value.value : value}</Text>
          <Text style={styles.tableCell}>{referenceValue}</Text>
          <TouchableOpacity 
            style={styles.historyButton}
            onPress={() => fetchPreviousTests(key, patientId)}
          >
            <Ionicons name="time-outline" size={20} color="#007BFF" />
          </TouchableOpacity>
          <View style={styles.iconCell}>
            {getComparisonIcon(
              typeof value === 'object' ? value.value : value,
              referenceValue
            )}
          </View>
        </View>
      );
    });
  };

  const PreviousTestsModal = () => {
    const currentValue = testDetails?.immunoglobulinValues[selectedTestName];

    return (
      <Modal
        visible={showPreviousTests}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.previousTestsModalContainer}>
          <View style={styles.previousTestsContent}>
            <View style={styles.previousTestsHeader}>
              <Text style={styles.previousTestsTitle}>Önceki Tahliller - {selectedTestName}</Text>
              <TouchableOpacity 
                style={styles.previousTestsCloseButton}
                onPress={() => setShowPreviousTests(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {previousTests.length > 0 ? (
              <FlatList
                data={previousTests}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.previousTestsList}
                renderItem={({ item }) => (
                  <View style={styles.previousTestItem}>
                    <View style={styles.previousTestInfo}>
                      <View style={styles.previousTestDate}>
                        <Ionicons name="calendar-outline" size={18} color="#64d2ff" />
                        <Text style={styles.previousTestDateText}>
                          {item.date}
                        </Text>
                      </View>
                      <View style={styles.previousTestValue}>
                        <Ionicons name="analytics-outline" size={18} color="#64d2ff" />
                        <Text style={styles.previousTestValueText}>
                          Sonuç: {item.value}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.comparisonContainer}>
                      <Text style={styles.comparisonText}>Değişim</Text>
                      {getHistoricalComparisonIcon(currentValue, item.value)}
                    </View>
                  </View>
                )}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Ionicons name="information-circle-outline" size={48} color="#666" />
                <Text style={styles.noDataText}>Önceki test verisi bulunamadı</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      {isLoading && (<HeartBeatLoader/>)}
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Test Detayları</Text>

          <View style={styles.guidelineDisplay}>
            <Text style={styles.guidelineLabel}>Değerlendirildiği Kılavuz:</Text>
            <Text style={styles.guidelineText}>{guidelineName || "Yükleniyor..."}</Text>
          </View>

          <ScrollView style={styles.tableContainer}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeader}>Tetkik Adı</Text>
              <Text style={styles.tableHeader}>Sonuç</Text>
              <Text style={styles.tableHeader}>Referans Değeri</Text>
              <Text style={styles.tableHeader}>Geçmiş</Text>
            </View>
            {renderTestRows()}
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <PreviousTestsModal />
    </Modal>
  );
};

export default TestDetail;