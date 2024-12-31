import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

const GenderSelector = ({ value, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const genderOptions = [
    { 
      label: 'Erkek', 
      value: 'Erkek', 
      icon: 'male',
      color: '#007AFF',
      backgroundColor: 'rgba(0, 122, 255, 0.1)'
    },
    { 
      label: 'Kadın', 
      value: 'Kadın', 
      icon: 'female',
      color: '#FF2D55',
      backgroundColor: 'rgba(255, 45, 85, 0.1)' 
    }
  ];

  const showModal = () => {
    setModalVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const selectGender = (selectedValue) => {
    onChange(selectedValue);
    hideModal();
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const selectedGender = genderOptions.find(option => option.value === value);
  const selectedColor = selectedGender?.color || '#64d2ff';

  return (
    <>
      <TouchableOpacity 
        style={styles.selectorButton} 
        onPress={showModal}
      >
        <Ionicons 
          name={value ? (value === 'Erkek' ? 'male' : 'female') : 'male-female'} 
          size={20} 
          color={selectedColor}
          style={styles.icon} 
        />
        <Text style={styles.selectorButtonText}>
          {value || 'Cinsiyet Seçiniz'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={selectedColor} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideModal}
      >
        <TouchableWithoutFeedback onPress={hideModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.modalContent,
                  { transform: [{ translateY }] }
                ]}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Cinsiyet Seçiniz</Text>
                  <TouchableOpacity onPress={hideModal}>
                    <Ionicons name="close" size={24} color="#64d2ff" />
                  </TouchableOpacity>
                </View>

                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      { backgroundColor: option.backgroundColor }
                    ]}
                    onPress={() => selectGender(option.value)}
                  >
                    <Ionicons name={option.icon} size={24} color={option.color} />
                    <Text style={[styles.optionText, { color: option.color }]}>{option.label}</Text>
                    {value === option.value && (
                      <Ionicons name="checkmark" size={24} color={option.color} />
                    )}
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default GenderSelector;