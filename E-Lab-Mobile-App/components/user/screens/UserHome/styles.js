import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Koyu arka plan
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2d3436', // Daha koyu başlık barı
    paddingHorizontal: 15,
    paddingTop: 50,
    height: 100,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  sideMenuProfile: {
    position: 'absolute',
    top: 100,
    right: 0,
    width: 220,
    backgroundColor: '#2d3436',
    borderLeftWidth: 1,
    borderLeftColor: '#404040',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  profileName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sideMenu: {
    position: 'absolute',
    top: 100,
    left: 0,
    width: 220,
    backgroundColor: '#2d3436',
    borderRightWidth: 1,
    borderRightColor: '#404040',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
  sideMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  sideMenuIcon: {
    marginRight: 10,
  },
  sideMenuText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  testsSection: {
    flex: 1,
    marginTop: 10,
  },
  testsSectionHeader: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  testsSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  testsSectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  testList: {
    padding: 16,
  },
  emptyTestsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTestsText: {
    fontSize: 16,
    color: '#888',
  },
  testItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row', // Row yaparak butonun sağa gitmesini sağlıyoruz
    justifyContent: 'space-between', // Aradaki boşluğu ayarlıyoruz
    alignItems: 'center', // Dikey hizalama
  },
  testDateText: {
    fontSize: 14,
    color: '#007BFF',
    flex: 2, // Tarih için esnek alan
  },
  testProtocolText: {
    fontSize: 12,
    color: '#666',
    flex: 3, // Protokol için daha geniş alan
  },

  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0084ff', // Canlı mavi
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  detailsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalInfoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  modalInfoLabel: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },

  modalInfoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },

  modalDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
  },
  
  modalDetails: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalDetailsText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  testCard: {
    backgroundColor: '#2d3436',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  testHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#64d2ff', // Parlak mavi
    fontWeight: '600',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },

  protocolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  protocolLabel: {
    fontSize: 14,
    color: '#bababa',
    marginRight: 8,
  },

  protocolNumber: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  departmentText: {
    fontSize: 13,
    color: '#666',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },

  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  testDetailRow: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  testValue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  
  testDate: {
    fontSize: 12,
    color: '#999',
  },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerModalContent: {
    backgroundColor: '#2d3436',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  pickerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#ffffff',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#404040',
    padding: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  pickerButtonText: {
    marginLeft: 8,
    color: '#64d2ff',
    fontSize: 14,
  },
  modernTestCard: {
    backgroundColor: '#2d3436',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modernTestDetail: {
    padding: 16,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modernTestName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64d2ff',
  },
  modernTestDate: {
    fontSize: 14,
    color: '#bababa',
  },
  comparisonContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#bababa',
    marginBottom: 4,
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  valueContainer: {
    flex: 1,
    marginRight: 16,
  },
  referenceContainer: {
    flex: 1,
  },
  valueLabel: {
    fontSize: 14,
    color: '#bababa',
    marginBottom: 4,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  referenceLabel: {
    fontSize: 14,
    color: '#bababa',
    marginBottom: 4,
  },
  referenceText: {
    fontSize: 16,
    color: '#bababa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3436',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#404040',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#ffffff',
  },
  clearButton: {
    padding: 8,
  },
  statusContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },
  statusLabel: {
    fontSize: 14,
    color: '#bababa',
    marginBottom: 4,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
});

export default styles;