import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminDashboard = () => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);

  const toggleSideMenu = () => setSideMenuVisible(!isSideMenuVisible);

  const statsData = [
    { id: '1', icon: 'person', label: 'Kullanıcılar', value: '2500' },
    { id: '2', icon: 'medkit', label: 'Tahliller', value: '123.50 dk' },
  ];

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuIcon} onPress={toggleSideMenu}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.profileSection}>
          <Ionicons name="person-circle" size={24} color="white" />
          <Text style={styles.adminName}>Admin</Text>
        </View>
      </View>

      {/* Side Menu */}
      {isSideMenuVisible && (
        <View style={styles.sideMenu}>
          <TouchableOpacity style={styles.sideMenuItem}>
            <Ionicons name="stats-chart" size={20} color="#007BFF" style={styles.sideMenuIcon} />
            <Text style={styles.sideMenuText}>İstatistikler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideMenuItem}>
            <Ionicons name="people" size={20} color="#007BFF" style={styles.sideMenuIcon} />
            <Text style={styles.sideMenuText}>Hasta Takibi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideMenuItem}>
            <Ionicons name="book" size={20} color="#007BFF" style={styles.sideMenuIcon} />
            <Text style={styles.sideMenuText}>Kılavuzlar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Logo */}
        <Image source={require('../../assets/labLogo.png')} style={styles.labLogo} />
        
        {/* Stats */}
        {statsData.map((item) => (
          <View key={item.id} style={styles.statCard}>
            <Ionicons name={item.icon} size={40} color="#007BFF" />
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007BFF',
    paddingHorizontal: 15,
    paddingTop: 50,
    height: 100,
  },
  menuIcon: {
    padding: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminName: {
    color: 'white',
    marginLeft: 10,
    fontSize: 18,
  },
  sideMenu: {
    position: 'absolute',
    top: 100,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
  sideMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sideMenuIcon: {
    marginRight: 15,
  },
  sideMenuText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  mainContent: {
    alignItems: 'center',
    padding: 20,
  },
  labLogo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  statCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#007BFF',
  },
});

export default AdminDashboard;
