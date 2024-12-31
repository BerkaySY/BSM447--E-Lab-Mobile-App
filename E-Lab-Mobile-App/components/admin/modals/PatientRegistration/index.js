import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GenderSelector from '../GenderSelector';
import styles from './styles';

const PatientRegistration = ({
  visible,
  onClose,
  onRegister,
  formData,
  setFormData,
  birthDateError
}) => {
  const resetFormData = () => {
    setFormData({
      fullName: '',
      birthDate: '',
      password: '',
      confirmPassword: '',
      gender: '',
      tcId: '',
    });
  };

  const handleClose = () => {
    resetFormData();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleClose}
            >
              <Ionicons name="close" size={30} color="#333" />
            </TouchableOpacity>
            
            <ScrollView style={styles.formScrollView}>
              <Text style={styles.modalTitle}>Yeni Hasta Kaydı</Text>
              
              {/* Ad Soyad */}
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ad Soyad"
                  placeholderTextColor="#aaa"
                  value={formData.fullName}
                  onChangeText={(text) => setFormData({...formData, fullName: text.slice(0, 30)})}
                  maxLength={30}
                />
              </View>

              {/* TC Kimlik */}
              <View style={styles.inputContainer}>
                <Ionicons name="card" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="TC Kimlik Numarası"
                  placeholderTextColor="#aaa"
                  value={formData.tcId}
                  onChangeText={(text) => {
                    const filteredText = text.replace(/[^0-9]/g, '');
                    setFormData({...formData, tcId: filteredText.slice(0, 11)});
                  }}
                  keyboardType="numeric"
                  maxLength={11}
                />
              </View>

              {/* Doğum Tarihi */}
              <View style={styles.inputContainer}>
                <Ionicons name="calendar" size={20} style={styles.icon} />
                <TextInput
                  style={[styles.input, birthDateError && { borderColor: 'red' }]}
                  placeholder="Doğum Tarihi (GG.AA.YYYY)"
                  placeholderTextColor="#aaa"
                  value={formData.birthDate}
                  onChangeText={(text) => {
                    const filteredText = text.replace(/[^0-9.]/g, '');
                    setFormData({...formData, birthDate: filteredText});
                  }}
                  maxLength={10}
                />
              </View>

              {/* Cinsiyet */}
              <GenderSelector
                value={formData.gender}
                onChange={(value) => setFormData({...formData, gender: value})}
              />
              

              {/* Şifre */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre"
                  placeholderTextColor="#aaa"
                  value={formData.password}
                  onChangeText={(text) => setFormData({...formData, password: text.slice(0, 20)})}
                  secureTextEntry={true}
                  maxLength={20}
                />
              </View>

              {/* Şifre Tekrar */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre Tekrar"
                  placeholderTextColor="#aaa"
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({...formData, confirmPassword: text.slice(0, 20)})}
                  secureTextEntry={true}
                  maxLength={20}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                  <Text style={styles.buttonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerButton} onPress={onRegister}>
                  <Text style={styles.buttonText}>Kayıt Et</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PatientRegistration;