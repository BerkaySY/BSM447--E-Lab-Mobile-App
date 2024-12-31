import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, ScrollView, Modal } from 'react-native';
import { firestore } from '../../../../firebase';
import HeartBeatLoader from '../../../shared/animations/HeartBeatLoader';
import styles from './styles';
import Selection from '../Selection';

const AddData2Guideline = ({ isVisible, onClose, guidelineId }) => {
  const [valueNames, setValueNames] = useState([]);
  const [ageRange, setAgeRange] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [intervalType, setIntervalType] = useState('gün');
  const [geometricMean, setGeometricMean] = useState('');
  const [arithmeticMean, setArithmeticMean] = useState('');
  const [standardDeviation, setStandardDeviation] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [confidenceIntervalMin, setConfidenceIntervalMin] = useState('');
  const [confidenceIntervalMax, setConfidenceIntervalMax] = useState('');
  const [selectedValueName, setSelectedValueName] = useState('');

  const [showAgeTypeModal, setShowAgeTypeModal] = useState(false);
  const [showValueNameModal, setShowValueNameModal] = useState(false);

  const intervalTypes = ['gün', 'ay', 'yıl'];
  useEffect(() => {
    const fetchValueNames = async () => {
      setIsLoading(true);
      try {
        const guidelineDoc = await firestore
          .collection('guidelines')
          .doc(guidelineId)
          .get();

        if (guidelineDoc.exists) {
          const data = guidelineDoc.data();
          setValueNames(data.value_names || []);
        }
      } catch (error) {
        console.error('Değer Adları Getirilemedi:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible) {
      fetchValueNames();
    }
  }, [isVisible, guidelineId]);

  const handleAddData = async () => {
    if (!ageRange || !selectedValueName || !minValue || !maxValue || !intervalType) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun!');
      return;
    }
    setIsLoading(true);
    try {
      const guidelineRef = firestore.collection('guidelines').doc(guidelineId);
      const datasRef = guidelineRef.collection('datas');
      const ageInterval = `${ageRange} ${intervalType}`;
  
      const valueNameDoc = await datasRef.doc(selectedValueName).get();
      
      if (!valueNameDoc.exists) {
        await datasRef.doc(selectedValueName).set({
          testName: selectedValueName
        });
      }
  
      const newData = {
        ageInterval,
        geometricMean,
        arithmeticMean,
        standardDeviation,
        minValue,
        maxValue,
        confidenceIntervalMin,
        confidenceIntervalMax,
      };
  
      const ageRangeDocRef = datasRef
        .doc(selectedValueName)
        .collection('ageRanges')
        .doc(ageInterval);
  
      await ageRangeDocRef.set(newData);
      Alert.alert('Başarı', 'Veri başarıyla eklendi!');
  
      setAgeRange('');
      setIntervalType('');
      setSelectedValueName('');
      setGeometricMean('');
      setArithmeticMean('');
      setStandardDeviation('');
      setMinValue('');
      setMaxValue('');
      setConfidenceIntervalMin('');
      setConfidenceIntervalMax('');
    } catch (error) {
      console.error('Veri eklenirken hata oluştu:', error);
      Alert.alert('Hata', 'Veri eklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent onRequestClose={onClose}>
      {isLoading && (<HeartBeatLoader/>)}
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Yeni Veri Ekle</Text>
          <ScrollView style={styles.scrollView}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Yaş Aralığı</Text>
              <TextInput
                style={styles.input}
                value={ageRange}
                onChangeText={setAgeRange}
                placeholder="Örn: 18-25"
                placeholderTextColor='#666'
              />

              <Text style={styles.label}>Yaş Aralığı Türü</Text>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => setShowAgeTypeModal(true)}
              >
                <Text style={styles.pickerButtonText}>
                  {intervalType || 'Seçiniz'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Değer Adı</Text>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => setShowValueNameModal(true)}
              >
                <Text style={styles.pickerButtonText}>
                  {selectedValueName || 'Seçiniz'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Geometrik Ortalama</Text>
              <TextInput
                style={styles.input}
                value={geometricMean}
                onChangeText={setGeometricMean}
                keyboardType="numeric"
                placeholder="Geometrik ortalama"
                placeholderTextColor='#666'
              />

              <Text style={styles.label}>Aritmetik Ortalama</Text>
              <TextInput
                style={styles.input}
                value={arithmeticMean}
                onChangeText={setArithmeticMean}
                keyboardType="numeric"
                placeholder="Aritmetik ortalama"
                placeholderTextColor='#666'
              />

              <Text style={styles.label}>Standart Sapma</Text>
              <TextInput
                style={styles.input}
                value={standardDeviation}
                onChangeText={setStandardDeviation}
                keyboardType="numeric"
                placeholder="Standart sapma"
                placeholderTextColor='#666'
              />

              <Text style={styles.label}>Minimum Değer</Text>
              <TextInput
                style={styles.input}
                value={minValue}
                onChangeText={setMinValue}
                keyboardType="numeric"
                placeholder="Min değer"
                placeholderTextColor='#666'
              />

              <Text style={styles.label}>Maksimum Değer</Text>
              <TextInput
                style={styles.input}
                value={maxValue}
                onChangeText={setMaxValue}
                keyboardType="numeric"
                placeholder="Max değer"
                placeholderTextColor='#666'
              />

              <Text style={styles.label}>%95 Güven Aralığı Min</Text>
              <TextInput
                style={styles.input}
                value={confidenceIntervalMin}
                onChangeText={setConfidenceIntervalMin}
                keyboardType="numeric"
                placeholder="%95 güven aralığı min"
                placeholderTextColor='#666'
              />

              <Text style={styles.label}>%95 Güven Aralığı Max</Text>
              <TextInput
                style={styles.input}
                value={confidenceIntervalMax}
                onChangeText={setConfidenceIntervalMax}
                keyboardType="numeric"
                placeholder="%95 güven aralığı max"
                placeholderTextColor='#666'
              />
            </View>
          </ScrollView>

          {/* Yaş Aralığı Türü Modal */}
          <Selection
            visible={showAgeTypeModal}
            onClose={() => setShowAgeTypeModal(false)}
            onSelect={setIntervalType}
            options={intervalTypes}
            selectedValue={intervalType}
            title="Yaş Aralığı Türü Seçin"
          />

          {/* Değer Adı Modal */}
          <Selection
            visible={showValueNameModal}
            onClose={() => setShowValueNameModal(false)}
            onSelect={setSelectedValueName}
            options={valueNames}
            selectedValue={selectedValueName}
            title="Değer Adı Seçin"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.iconButton, styles.addButton]} onPress={handleAddData}>
              <Text style={styles.iconButtonText}>Veriyi Ekle</Text>
            </TouchableOpacity>
              
            <TouchableOpacity style={[styles.iconButton, styles.closeButton]} onPress={onClose}>
              <Text style={styles.iconButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddData2Guideline;