import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

const GuidelineEditType = ({ isVisible, onClose, onSelectEditType, guideline }) => {
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
            Düzenleme Türünü Seçin
          </Text>

          <TouchableOpacity 
            style={styles.editOptionButton}
            onPress={() => {
              onClose();
              onSelectEditType('editGuideline', guideline.id);
            }}
          >
            <Text style={styles.editOptionButtonText}>Kılavuz Bilgilerini Düzenle</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.editOptionButton}
            onPress={() => {
              onClose();
              onSelectEditType('editData', guideline.id);
            }}
          >
            <Text style={styles.editOptionButtonText}>Veriyi Düzenle</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>İptal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default GuidelineEditType;