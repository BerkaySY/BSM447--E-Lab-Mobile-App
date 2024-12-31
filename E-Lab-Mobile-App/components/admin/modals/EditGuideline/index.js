import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firestore } from '../../../../firebase';
import HeartBeatLoader from '../../../shared/animations/HeartBeatLoader';
import styles from './styles';

const EditGuideline = ({ isVisible, onClose, guidelineId }) => {
  const [guideName, setGuideName] = useState('');
  const [valueNames, setValueNames] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible && guidelineId) {
      fetchGuidelineData();
    } else {
      if (isVisible && !guidelineId) {
        Alert.alert('Hata', 'Geçersiz kılavuz ID\'si');
        onClose();
      }
    }
  }, [isVisible, guidelineId]);

  const addValueField = () => {
    setValueNames([...valueNames, '']);
  };
  
  const removeLastValueField = () => {
    if (valueNames.length > 1) {
      setValueNames(valueNames.slice(0, -1));
    } else {
      Alert.alert('Uyarı', 'En az bir değer alanı olmalıdır.');
    }
  };

  const updateValueName = (text, index) => {
    const updatedValues = [...valueNames];
    updatedValues[index] = text;
    setValueNames(updatedValues);
  };
  
  const fetchGuidelineData = async () => {
    setIsLoading(true);
    try {
      const guidelineDoc = await firestore.collection('guidelines').doc(guidelineId).get();
      if (guidelineDoc.exists) {
        const guidelineData = guidelineDoc.data();
        setGuideName(guidelineData.name || '');
        setValueNames(guidelineData.value_names || ['']);
      } else {
        Alert.alert('Hata', 'Kılavuz bulunamadı.');
        onClose();
      }
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      Alert.alert('Hata', 'Kılavuz verisi alınırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (guidelineId) {
      fetchGuidelineData();
    }
  }, [isVisible, guidelineId]);

  const handleUpdateGuide = async () => {
    if (!guidelineId) {
      Alert.alert('Hata', 'Geçersiz kılavuz ID\'si');
      return;
    }
  
    if (!guideName.trim()) {
      Alert.alert('Hata', 'Kılavuz adını giriniz.');
      return;
    }
    if (valueNames.some(value => !value.trim())) {
      Alert.alert('Hata', 'Tüm değer alanlarını doldurunuz.');
      return;
    }
    
    setIsLoading(true);
    try {
      const docRef = firestore.collection('guidelines').doc(guidelineId);
      const docSnapshot = await docRef.get();
      
      if (!docSnapshot.exists) {
        Alert.alert('Hata', 'Güncellenecek kılavuz bulunamadı. Sayfa yenilenecek.');
        onClose();
        return;
      }
  
      const updatedGuide = {
        name: guideName.trim(),
        value_names: valueNames.map(value => value.trim()),
      };
  
      await docRef.update(updatedGuide);
  
      Alert.alert('Başarılı', 'Kılavuz başarıyla güncellendi.');
      onClose();
    } catch (error) {
      console.error('Firestore güncelleme hatası:', error);
      Alert.alert('Hata', `Güncelleme hatası: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {isLoading && (<HeartBeatLoader/>)}
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Kılavuz Düzenle
          </Text>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Kılavuz Adı
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Kılavuz adı giriniz"
                placeholderTextColor='#666'
                value={guideName}
                onChangeText={setGuideName}
              />

              <Text style={[styles.label, styles.valueNamesLabel]}>
                Değer Adları
              </Text>
              {valueNames.map((value, index) => (
                <TextInput
                  key={index}
                  style={styles.input}
                  placeholder={`Değer ${index + 1}`}
                  placeholderTextColor={'#666'}
                  value={value}
                  onChangeText={(text) => updateValueName(text, index)}
                />
              ))}
            </View>
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.iconButton, styles.addButton]} 
              onPress={addValueField}
            >
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.iconButtonText}>Değer Ekle</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.iconButton, styles.removeButton]} 
              onPress={removeLastValueField}
            >
              <Ionicons name="remove" size={24} color="white" />
              <Text style={styles.iconButtonText}>Değer Sil</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.updateButton]} 
              onPress={handleUpdateGuide}
            >
              <Text style={styles.actionButtonText}>Güncelle</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.actionButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditGuideline;