import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { firestore } from '../../../../firebase';
import GuidelineDataDetail from '../GuidelineDataDetail';
import HeartBeatLoader from '../../../shared/animations/HeartBeatLoader';
import Selection from '../Selection';
import styles from './styles';

const GuidelineValueSearch = ({ isVisible, onClose, guidelineId }) => {
  const [selectedValueName, setSelectedValueName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [valueNames, setValueNames] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [showValueNameModal, setShowValueNameModal] = useState(false);

  // Modal görünür olduğunda değer adlarını getir
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
        console.error('Değer adlarını getirirken hata oluştu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible) {
      fetchValueNames();
    }
  }, [guidelineId, isVisible]);

  // Arama işlevi
  const handleSearch = async () => {
    if (!selectedValueName) {
      Alert.alert('Uyarı', 'Lütfen bir değer adı seçin.');
      return;
    }
    setIsLoading(true);
    try {
      const querySnapshot = await firestore
        .collection('guidelines')
        .doc(guidelineId)
        .collection('datas')
        .doc(selectedValueName)
        .collection('ageRanges')
        .get();

      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        ageInterval: `${doc.data().ageRange} ${doc.data().intervalType}`,
      }));

      if (results.length === 0) {
        Alert.alert('Bilgi', `"${selectedValueName}" için sonuç bulunamadı.`);
      }

      setSearchResults(results);
      setSelectedItem(null);
    } catch (error) {
      console.error('Arama sırasında hata oluştu:', error);
      Alert.alert('Hata', 'Arama sırasında bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    setIsLoading(true);
    try {
      await firestore
        .collection('guidelines')
        .doc(guidelineId)
        .collection('datas')
        .doc(selectedValueName)
        .collection('ageRanges')
        .doc(itemId)
        .delete();

      Alert.alert('Başarılı', 'Kayıt başarıyla silindi.');
      setSearchResults(prevResults => prevResults.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Silme sırasında hata oluştu:', error);
      Alert.alert('Hata', 'Kayıt silinirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderResultItem = ({ item }) => (
    <View
      style={[
        styles.resultItem,
        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
      ]}
    >
      <Text
        style={[
          styles.resultTitle,
          { flex: 1, marginRight: 10 },
        ]}
      >
        {item.id}
      </Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedItem(item);
            setIsDetailsModalVisible(true);
          }}
          style={[
            styles.detailButton,
            { backgroundColor: '#17A2B8', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 },
          ]}
        >
          <Text style={[styles.detailButtonText, { color: 'white' }]}>Detayları Gör</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={[
            styles.deleteButton,
            { backgroundColor: '#dc3545', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 },
          ]}
        >
          <Text style={[styles.deleteButtonText, { color: 'white' }]}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
          <Text style={styles.modalTitle}>Değer Ara</Text>

          {/* Değer Adı Seçici */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Değer Adı:</Text>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setShowValueNameModal(true)}
            >
              <Text style={styles.pickerButtonText}>
                {selectedValueName || 'Bir değer adı seçin'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Ara Butonu */}
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Ara</Text>
          </TouchableOpacity>

          {/* Arama Sonuçları */}
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={renderResultItem}
          />

          {/* Kapat Butonu */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
      <GuidelineDataDetail
        item={selectedItem}
        isVisible={isDetailsModalVisible}
        onClose={() => setIsDetailsModalVisible(false)}
      />
      <Selection
        visible={showValueNameModal}
        onClose={() => setShowValueNameModal(false)}
        onSelect={setSelectedValueName}
        options={valueNames}
        selectedValue={selectedValueName}
        title="Değer Adı Seçin"
      />
    </Modal>
  );
};

export default GuidelineValueSearch;