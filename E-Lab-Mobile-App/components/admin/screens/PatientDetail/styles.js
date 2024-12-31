import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2d3436',
    paddingHorizontal: 15,
    paddingTop: 50,
    height: 100,
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
  mainContent: {
    padding: 20,
  },
  testsSection: {
    flex: 1,
  },
  testsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  testItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  testItemContent: {
    flex: 1,
    marginRight: 10,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  testDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  testDetailsButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  testDetailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyTestsContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyTestsText: {
    fontSize: 16,
    color: '#888',
  },
  patientCard: {
    backgroundColor: '#2d3436',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  patientCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  patientIconContainer: {
    marginRight: 20,
  },
  patientInfoContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  patientDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  patientDetailsSection: {
    marginTop: 10,
  },
  detailLabel: {
    color: '#bababa',
    fontWeight: '500',
  },
  patientDetail: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
  // Tahliller Bölümü Stilleri
  testsSection: {
    marginTop: 20,
    backgroundColor: '#2d3436',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  testsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  testsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addTestButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  addTestButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  testItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#404040',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  testItemContent: {
    flex: 1,
    marginRight: 10,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  testDetailsButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  testDetailsButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  emptyTestsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyTestsText: {
    fontSize: 16,
    color: '#bababa',
  }
});

export default styles;