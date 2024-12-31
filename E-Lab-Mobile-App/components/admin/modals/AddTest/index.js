import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, SafeAreaView, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { firestore } from '../../../../firebase';
import { serverTimestamp } from "firebase/firestore";
import HeartBeatLoader from '../../../shared/animations/HeartBeatLoader';
import styles from './styles';

const AddTest = ({ isVisible, onClose, onSubmit, patientId }) => {
  const [testDetails, setTestDetails] = useState({
    protokolNo: '',
    istemZamani: '',
    numunealmaZamani: '',
    numunekabulZamani: '',
    selectedGuideline: '',
    selectedGuidelineName: '', 
    immunoglobulinValues: {
      IgA: '',
      IgM: '',
      IgG: '',
      IgG1: '',
      IgG2: '',
      IgG3: '',
      IgG4: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [guidelines, setGuidelines] = useState([]);
  const [showImmunoglobulinModal, setShowImmunoglobulinModal] = useState(false);
  const [showGuidelineModal, setShowGuidelineModal] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    const fetchGuidelines = async () => {
      setIsLoading(true);
      try {
        const snapshot = await firestore.collection('guidelines').get();
        const fetchedGuidelines = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGuidelines(fetchedGuidelines);
      } catch (error) {
        console.error("Error fetching guidelines:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuidelines();
  }, []);

  const isFormValid = () => {
    const { protokolNo, istemZamani, numunealmaZamani, numunekabulZamani, selectedGuideline } = testDetails;
    return protokolNo.trim() && istemZamani.trim() && 
           numunealmaZamani.trim() && numunekabulZamani.trim() && selectedGuideline;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert('Uyarı', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    const filteredImmunoglobulinValues = Object.fromEntries(
      Object.entries(testDetails.immunoglobulinValues)
        .filter(([_, value]) => value.trim() !== '')
    );
    setIsLoading(true);
    try {
      const testsRef = firestore
        .collection('users')
        .doc(patientId)
        .collection('tests');
      
      await testsRef.add({
        ...testDetails,
        immunoglobulinValues: filteredImmunoglobulinValues,
        createdAt: serverTimestamp()
      });

      Alert.alert('Başarılı', 'Tahlil başarıyla eklendi.');
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error creating test:", error);
      Alert.alert('Hata', 'Tahlil eklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderGuidelineModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showGuidelineModal}
      onRequestClose={() => {
        dismissKeyboard();
        setShowGuidelineModal(false);
      }}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kılavuz Seçin</Text>
            <ScrollView style={styles.guidelineScrollView}>
              {guidelines.map((guideline) => (
                <TouchableOpacity
                  key={guideline.id}
                  style={[
                    styles.guidelineOption,
                    testDetails.selectedGuideline === guideline.id && styles.selectedGuidelineOption
                  ]}
                  onPress={() => {
                    dismissKeyboard();
                    setTestDetails(prev => ({
                      ...prev,
                      selectedGuideline: guideline.id,
                      selectedGuidelineName: guideline.name
                    }));
                    setShowGuidelineModal(false);
                  }}
                >
                  <Text style={[
                    styles.guidelineOptionText,
                    testDetails.selectedGuideline === guideline.id && styles.selectedGuidelineText
                  ]}>
                    {guideline.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderImmunoglobulinModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showImmunoglobulinModal}
      onRequestClose={() => {
        dismissKeyboard();
        setShowImmunoglobulinModal(false);
      }}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {isLoading && (<HeartBeatLoader/>)}
            <Text style={styles.modalTitle}>
              İmmünoglobulin Değerleri
            </Text>
            <ScrollView>
              {Object.keys(testDetails.immunoglobulinValues).map((key) => (
                <TextInput
                  key={key}
                  style={styles.input}
                  placeholder={`${key} Değeri`}
                  placeholderTextColor='#888'
                  value={testDetails.immunoglobulinValues[key]}
                  onChangeText={(text) => setTestDetails(prev => ({
                    ...prev,
                    immunoglobulinValues: {
                      ...prev.immunoglobulinValues,
                      [key]: text
                    }
                  }))}
                  keyboardType="numeric"
                />
              ))}
              <TouchableOpacity 
                style={styles.modalCreateButton} 
                onPress={() => {
                  dismissKeyboard();
                  setShowImmunoglobulinModal(false);
                }}
              >
                <Text style={styles.modalCreateButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        dismissKeyboard();
        onClose();
      }}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Yeni Tahlil Ekle
            </Text>
            
            <TouchableOpacity 
              style={styles.guidelineSelector}
              onPress={() => {
                dismissKeyboard();
                setShowGuidelineModal(true);
              }}
            >
              <Text style={styles.guidelineSelectorText}>
                {testDetails.selectedGuidelineName || 'Kılavuz Seçin'}
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Protokol Numarası"
              placeholderTextColor='#888'
              value={testDetails.protokolNo}
              onChangeText={(text) => setTestDetails(prev => ({...prev, protokolNo: text}))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="İstem Zamanı"
              placeholderTextColor='#888'
              value={testDetails.istemZamani}
              onChangeText={(text) => setTestDetails(prev => ({...prev, istemZamani: text}))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Numune Alma Zamanı"
              placeholderTextColor='#888'
              value={testDetails.numunealmaZamani}
              onChangeText={(text) => setTestDetails(prev => ({...prev, numunealmaZamani: text}))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Numune Kabul Zamanı"
              placeholderTextColor='#888'
              value={testDetails.numunekabulZamani}
              onChangeText={(text) => setTestDetails(prev => ({...prev, numunekabulZamani: text}))}
            />
            
            <TouchableOpacity 
              style={styles.immunoglobulinButton}
              onPress={() => {
                dismissKeyboard();
                setShowImmunoglobulinModal(true);
              }}
            >
              <Text style={styles.immunoglobulinButtonText}>
                İmmünoglobulin Değerlerini Gir
              </Text>
            </TouchableOpacity>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => {
                  dismissKeyboard();
                  onClose();
                }}
              >
                <Text style={styles.modalCancelButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalCreateButton} 
                onPress={() => {
                  dismissKeyboard();
                  handleSubmit();
                }}
              >
                <Text style={styles.modalCreateButtonText}>Oluştur</Text>
              </TouchableOpacity>
            </View>
            
            {renderImmunoglobulinModal()}
            {renderGuidelineModal()}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddTest;