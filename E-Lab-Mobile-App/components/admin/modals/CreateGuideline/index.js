import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Modal,ScrollView } from 'react-native';
import { firestore } from '../../../../firebase';
import styles from './styles';

const CreateGuideline = ({ isVisible, onClose }) => {
  const [guideName, setGuideName] = useState('');
  const [valueNames, setValueNames] = useState(['']);

  const addValueField = () => {
    setValueNames([...valueNames, '']);
  };

  const updateValueName = (text, index) => {
    const updatedValues = [...valueNames];
    updatedValues[index] = text;
    setValueNames(updatedValues);
  };

  const removeLastValueField = () => {
    if (valueNames.length > 1) {
      setValueNames(valueNames.slice(0, -1));
    } else {
      Alert.alert('Uyarı', 'En az bir değer alanı olmalıdır.');
    }
  };

  const handleCreateGuide = async () => {
    if (!guideName.trim()) {
      Alert.alert('Hata', 'Kılavuz adını giriniz.');
      return;
    }
    if (valueNames.some(value => !value.trim())) {
      Alert.alert('Hata', 'Tüm değer alanlarını doldurunuz.');
      return;
    }
  
    try {
      const newGuide = {
        name: guideName,
        value_names: valueNames,
      };
  
      await firestore.collection('guidelines').add(newGuide);
  
      Alert.alert('Başarılı', 'Kılavuz başarıyla oluşturuldu.');
      setGuideName('');
      setValueNames(['']);
      onClose();
    } catch (error) {
      console.error('Firestore Hatası:', error);
      Alert.alert('Hata', 'Kılavuz kaydedilirken bir hata oluştu.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Yeni Kılavuz Oluştur
          </Text>

          <ScrollView>
            <Text style={styles.label}>Kılavuz Adı:</Text>
            <TextInput
              style={styles.input}
              placeholder="Kılavuz adı giriniz"
              placeholderTextColor='#666'
              value={guideName}
              onChangeText={setGuideName}
            />

            <Text style={styles.label}>Değer Adları:</Text>
            {valueNames.map((value, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder={`Değer ${index + 1}`}
                placeholderTextColor='#666'
                value={value}
                onChangeText={(text) => updateValueName(text, index)}
              />
            ))}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.addButton} onPress={addValueField}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeButton} onPress={removeLastValueField}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateGuide}>
              <Text style={styles.createButtonText}>Oluştur</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateGuideline;