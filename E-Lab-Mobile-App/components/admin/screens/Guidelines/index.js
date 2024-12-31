import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  TouchableWithoutFeedback, 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import { auth, firestore } from '../../../../firebase';
import EditGuideline from '../../modals/EditGuideline';
import CreateGuideline from '../../modals/CreateGuideline';
import AddData2Guideline from '../../modals/AddData2Guideline';
import GuidelineEditType from '../../modals/GuidelineEditType';
import GuidelineValueSearch from '../../modals/GuidelineValueSearch';
import EditGuidelineData from '../../modals/EditGuidelineData';
import HeartBeatLoader from '../../../shared/animations/HeartBeatLoader';
import styles from './styles';

const Guidelines = () => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [guidelines, setGuidelines] = useState([]);
  const [selectedGuidelineForSearch, setSelectedGuidelineForSearch] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedGuideline, setSelectedGuideline] = useState(null);
  const [editTypeModalVisible, setEditTypeModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isAddDataModalVisible, setIsAddDataModalVisible] = useState(false);
  const [selectedGuidelineForAddData, setSelectedGuidelineForAddData] = useState(null);
  const [isEditDataModalVisible, setIsEditDataModalVisible] = useState(false);
  const navigation = useNavigation(); 

  
  
  const handleEditButton = (guideline) => {
    if (guideline && guideline.id) { 
      setSelectedGuideline(guideline);
      setEditTypeModalVisible(true);
    } else {
      Alert.alert("Hata", "Geçersiz kılavuz seçimi.");
    }
  };
  
  const handleSelectEditType = (type, guidelineId) => {
    const guideline = guidelines.find(g => g.id === guidelineId);
    
    setEditTypeModalVisible(false);
    if (type === 'editGuideline') {
      setSelectedGuideline(guideline);
      setEditModalVisible(true);
    } else if (type === 'editData') {
      setSelectedGuideline(guideline);
      setIsEditDataModalVisible(true);
    }
  };

  const toggleSideMenu = () => {
    if (isProfileMenuVisible) {
      setProfileMenuVisible(false); 
    }
    setSideMenuVisible(!isSideMenuVisible);
  };
  
  const toggleProfileMenu = () => {
    if (isSideMenuVisible) {
      setSideMenuVisible(false); 
    }
    setProfileMenuVisible(!isProfileMenuVisible); 
  };

  const closeMenus = () => {
    setSideMenuVisible(false);
    setProfileMenuVisible(false);
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      firestore.collection('users').doc(userId).get().then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          setUserName(`${userData.fullName}`);
        }
      });
    }
    fetchGuidelines();
  }, []);

  const fetchGuidelines = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await firestore.collection('guidelines').get();
      const guidelinesData = [];
      querySnapshot.forEach((doc) => {
        guidelinesData.push({ id: doc.id, ...doc.data() });
      });
      setGuidelines(guidelinesData);
    } catch (error) {
      console.error("Kılavuzlar çekilirken hata oluştu: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('WelcomeScreen'); 
        setTimeout(() => {
          Alert.alert("Çıkış Yap", "Başarıyla çıkış yapıldı!", [{ text: "Tamam" }]);
        }, 100);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const handleCreateGuideline = () => {
    setIsCreateModalVisible(true);
  };

  const handleAddData = (guidelineId) => {
    setSelectedGuidelineForAddData(guidelineId);
    setIsAddDataModalVisible(true);
  };


  const handleDeleteGuideline = async (id) => {
    Alert.alert(
      "Kılavuzu Sil",
      "Bu kılavuzu silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await firestore.collection('guidelines').doc(id).delete();
              setGuidelines(guidelines.filter((guideline) => guideline.id !== id));
              Alert.alert("Başarılı", "Kılavuz silindi!");
            } catch (error) {
              console.error("Silme işlemi sırasında hata: ", error);
              Alert.alert("Hata", "Kılavuz silinemedi.");
            }
          },
        },
      ]
    );
  };

  const renderGuidelineItem = ({ item }) => (
    <View style={styles.guidelineItem}>
      <Text 
        style={styles.guidelineText} 
        numberOfLines={1} 
        ellipsizeMode="tail"
      >
        {item.name}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleEditButton(item)} style={styles.button}>
          <Ionicons name="create-outline" size={24} color="#007BFF" />
          <Text style={styles.buttonText}>Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAddData(item.id)} style={styles.button}>
          <Ionicons name="add-outline" size={24} color="#28A745" />
          <Text style={styles.buttonText}>Veri Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteGuideline(item.id)} style={styles.button}>
          <Ionicons name="trash-outline" size={24} color="#DC3545" />
          <Text style={styles.buttonText}>Sil</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setSelectedGuidelineForSearch(item.id)} 
          style={styles.button}
        >
          <Ionicons name="search-outline" size={24} color="#17A2B8" />
          <Text style={styles.buttonText}>Değer Ara</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={closeMenus}>
      <View style={styles.container}>
      {isLoading && (<HeartBeatLoader/>)}
        {/* Üst Bar */}
        <View style={[styles.topBar]}>
          <TouchableOpacity onPress={toggleSideMenu}>
            <Ionicons name="menu" size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleProfileMenu}>
            <Ionicons name="person-circle" size={24} color='white' />
          </TouchableOpacity>
        </View>

        {/* Profil Menüsü */}
        {isProfileMenuVisible && (
          <View style={styles.sideMenuProfile}>
            <View style={styles.profileHeader}>
              <Ionicons name="person-circle" size={40} color="#007BFF" />
              <Text style={styles.profileName}>{userName || 'Admin'}</Text>
            </View>
            <TouchableOpacity style={styles.sideMenuItem} onPress={handleLogOut}>
              <Text style={styles.sideMenuText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Yan Menü */}
        {isSideMenuVisible && (
          <View style={styles.sideMenu}>
            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('AdminHomeScreen')}>
              <Ionicons name="stats-chart" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={styles.sideMenuText}>İstatistikler</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('PatientTrackingScreen')}>
              <Ionicons name="people" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={styles.sideMenuText}>Hasta Takibi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideMenuItem} onPress={() => navigation.navigate('GuidelinesScreen')}>
              <Ionicons name="book" size={20} color="#007BFF" style={styles.sideMenuIcon} />
              <Text style={styles.sideMenuText}>Kılavuzlar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ana İçerik */}
        <View style={styles.mainContent}>
          {/* Kılavuzlar Başlığı ve Ekle Butonu */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Kılavuzlar</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleCreateGuideline}>
              <Text style={styles.addButtonText}>Kılavuz Oluştur</Text>
            </TouchableOpacity>
          </View>

          {/* Kılavuzlar Listesi */}
          <FlatList
            data={guidelines}
            keyExtractor={(item) => item.id}
            renderItem={renderGuidelineItem}
            contentContainerStyle={styles.guidelinesList}
          />
          
          {selectedGuidelineForSearch && (
          <GuidelineValueSearch
            isVisible={!!selectedGuidelineForSearch}
            onClose={() => setSelectedGuidelineForSearch(null)}
            guidelineId={selectedGuidelineForSearch}
          />
          
          )}
          <AddData2Guideline
            isVisible={isAddDataModalVisible}
            onClose={() => setIsAddDataModalVisible(false)}
            guidelineId={selectedGuidelineForAddData}
          />
          <GuidelineEditType
            isVisible={editTypeModalVisible}
            onClose={() => setEditTypeModalVisible(false)}
            onSelectEditType={handleSelectEditType}
            guideline={selectedGuideline}
          />

          <EditGuideline
            isVisible={editModalVisible}
            onClose={() => {
              setEditModalVisible(false);
              setSelectedGuideline(null);
              fetchGuidelines(); 
            }}
            guidelineId={selectedGuideline?.id || ''} 
          />
          <EditGuidelineData
            isVisible={isEditDataModalVisible}
            onClose={() => {
              setIsEditDataModalVisible(false);
            }}
            guidelineId={selectedGuideline?.id}
          />
        </View>
        <CreateGuideline
          isVisible={isCreateModalVisible}
          onClose={() => {
            setIsCreateModalVisible(false);
            fetchGuidelines();}
          }
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Guidelines;