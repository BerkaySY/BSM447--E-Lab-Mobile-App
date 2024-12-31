import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
  
const GuidelineDataDetail = ({ item, isVisible, onClose }) => {
  if (!item) return null;
    
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Detaylar
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
    
          <ScrollView style={styles.scrollContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Yaş Aralığı:</Text>
              <Text style={styles.detailValue}>
                {item.id}
              </Text>
            </View>
    
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Geometrik Ortalama:</Text>
              <Text style={styles.detailValue}>
                {item.geometricMean || 'Belirtilmemiş'}
              </Text>
            </View>
    
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Aritmetik Ortalama:</Text>
              <Text style={styles.detailValue}>
                {item.arithmeticMean || 'Belirtilmemiş'}
              </Text>
            </View>
    
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Standart Sapma:</Text>
              <Text style={styles.detailValue}>
                {item.standardDeviation || 'Belirtilmemiş'}
              </Text>
            </View>
    
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Referans Aralığı:</Text>
              <Text style={styles.detailValue}>
                {item.minValue || 'Belirtilmemiş'} - {item.maxValue || 'Belirtilmemiş'} 
              </Text>
            </View>
    
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>%95 Güven Aralığı:</Text>
              <Text style={styles.detailValue}>
                {item.confidenceIntervalMin || 'Belirtilmemiş'} - {item.confidenceIntervalMax || 'Belirtilmemiş'}
              </Text>
            </View>
        </ScrollView>
    
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Kapat</Text>
          <Ionicons name="close-circle-outline" size={20} color="#ffffff" style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
  );
};
  
export default GuidelineDataDetail;