import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, ScrollView, Modal } from 'react-native';
import { firestore } from '../../../../firebase';
import HeartBeatLoader from '../../../shared/animations/HeartBeatLoader';
import styles from './styles';

const EditGuidelineData = ({ isVisible, onClose, guidelineId }) => {
  const [valueNames, setValueNames] = useState([]);
  const [ageRanges, setAgeRanges] = useState([]);
  const [selectedValueName, setSelectedValueName] = useState('');
  const [selectedAgeRange, setSelectedAgeRange] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geometricMean, setGeometricMean] = useState('');
  const [arithmeticMean, setArithmeticMean] = useState('');
  const [standardDeviation, setStandardDeviation] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [confidenceIntervalMin, setConfidenceIntervalMin] = useState('');
  const [confidenceIntervalMax, setConfidenceIntervalMax] = useState('');
  const [valueNameModalVisible, setValueNameModalVisible] = useState(false);
  const [ageRangeModalVisible, setAgeRangeModalVisible] = useState(false);

  // Form alanlarını resetleme fonksiyonu
  const resetForm = () => {
    setSelectedValueName('');
    setSelectedAgeRange('');
    setAgeRanges([]);
    setGeometricMean('');
    setArithmeticMean('');
    setStandardDeviation('');
    setMinValue('');
    setMaxValue('');
    setConfidenceIntervalMin('');
    setConfidenceIntervalMax('');
    setValueNames([]); // Bunu da ekleyebilirsiniz
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (isVisible) {
      fetchValueNames();
    } else {
      resetForm();
    }
  }, [isVisible, guidelineId]);

  useEffect(() => {
    async function loadAgeRanges() {
      if (selectedValueName) {
        setSelectedAgeRange(''); // Önce seçili yaş aralığını sıfırla
        await fetchAgeRanges(); // Yaş aralıklarını getir
      } else {
        setAgeRanges([]); // Değer adı seçili değilse yaş aralıklarını temizle
      }
    }
    loadAgeRanges();
  }, [selectedValueName, guidelineId]);

  useEffect(() => {
    if (selectedValueName && selectedAgeRange) {
      fetchDataForSelectedValues();
    }
  }, [selectedValueName, selectedAgeRange]);

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
      setValueNames([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAgeRanges = async () => {
    setIsLoading(true);
    if (!selectedValueName || !guidelineId) { // guidelineId kontrolü eklendi
      setAgeRanges([]);
      return;
    }

    try {
      const ageRangesSnapshot = await firestore
        .collection('guidelines')
        .doc(guidelineId)
        .collection('datas')
        .doc(selectedValueName)
        .collection('ageRanges')
        .get();

      if (!ageRangesSnapshot.empty) {
        const ranges = ageRangesSnapshot.docs.map(doc => doc.id);
        setAgeRanges(ranges);
      } else {
        setAgeRanges([]);
      }
    } catch (error) {
      console.error('Yaş Aralıkları Getirilemedi:', error);
      setAgeRanges([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataForSelectedValues = async () => {
    setIsLoading(true);
    try {
      const dataDoc = await firestore
        .collection('guidelines')
        .doc(guidelineId)
        .collection('datas')
        .doc(selectedValueName)
        .collection('ageRanges')
        .doc(selectedAgeRange)
        .get();

      if (dataDoc.exists) {
        const data = dataDoc.data();
        setGeometricMean(data.geometricMean || '');
        setArithmeticMean(data.arithmeticMean || '');
        setStandardDeviation(data.standardDeviation || '');
        setMinValue(data.minValue || '');
        setMaxValue(data.maxValue || '');
        setConfidenceIntervalMin(data.confidenceIntervalMin || '');
        setConfidenceIntervalMax(data.confidenceIntervalMax || '');
      }
    } catch (error) {
      console.error('Veri Getirilemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateData = async () => {
    if (!selectedValueName || !selectedAgeRange) {
      Alert.alert('Hata', 'Lütfen değer adı ve yaş aralığı seçin!');
      return;
    }
    setIsLoading(true);
    try {
      const updateData = {
        geometricMean,
        arithmeticMean,
        standardDeviation,
        minValue,
        maxValue,
        confidenceIntervalMin,
        confidenceIntervalMax,
      };

      await firestore
        .collection('guidelines')
        .doc(guidelineId)
        .collection('datas')
        .doc(selectedValueName)
        .collection('ageRanges')
        .doc(selectedAgeRange)
        .update(updateData);

      Alert.alert('Başarı', 'Veri başarıyla güncellendi!');
    } catch (error) {
      console.error('Veri güncellenirken hata oluştu:', error);
      Alert.alert('Hata', 'Veri güncellenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPickerModal = (
    visible, 
    onClose, 
    title, 
    items, 
    selectedValue, 
    onSelect
  ) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.pickerModalContent}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.pickerHeaderButton}>Kapat</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.pickerItem,
                  selectedValue === item && styles.selectedPickerItem
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={[
                  styles.pickerItemText,
                  selectedValue === item && styles.selectedPickerItemText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <Modal 
      visible={isVisible} 
      animationType="slide" 
      transparent 
      onRequestClose={handleClose}
    >
      {isLoading && (<HeartBeatLoader/>)}
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Veri Düzenle</Text>

          <ScrollView style={styles.scrollView}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Değer Adı</Text>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => setValueNameModalVisible(true)}
              >
                <Text style={styles.pickerButtonText}>
                  {selectedValueName || 'Seçiniz'}
                </Text>
              </TouchableOpacity>

              {ageRanges.length > 0 && (
                <>
                  <Text style={styles.label}>Yaş Aralığı</Text>
                  <TouchableOpacity 
                    style={styles.pickerButton}
                    onPress={() => setAgeRangeModalVisible(true)}
                  >
                    <Text style={styles.pickerButtonText}>
                      {selectedAgeRange || 'Seçiniz'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {selectedValueName && selectedAgeRange && (
                <>
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
                </>
              )}
            </View>
          </ScrollView>
          {renderPickerModal(
            valueNameModalVisible,
            () => setValueNameModalVisible(false),
            'Değer Adı Seçin',
            valueNames,
            selectedValueName,
            setSelectedValueName
          )}

          {renderPickerModal(
            ageRangeModalVisible,
            () => setAgeRangeModalVisible(false),
            'Yaş Aralığı Seçin',
            ageRanges,
            selectedAgeRange,
            setSelectedAgeRange
          )}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.iconButton, styles.updateButton]} 
              onPress={handleUpdateData}
              disabled={!selectedValueName || !selectedAgeRange}
            >
              <Text style={styles.iconButtonText}>Güncelle</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.iconButton, styles.closeButton]} 
              onPress={handleClose}
            >
              <Text style={styles.iconButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditGuidelineData;