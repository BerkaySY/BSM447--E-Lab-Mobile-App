import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  guidelineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  guidelineText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'column', 
    alignItems: 'flex-start',
    gap: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#007BFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#2d3436',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff',
  },
  pickerContainer: {
    marginBottom: 15,
 },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#bababa',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
  },
  picker: {
    color: '#ffffff',
  },
  searchButton: {
    backgroundColor: '#17A2B8',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    color: '#ffffff',
  },
  emptyResultText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  closeButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detailButton: {
    backgroundColor: '#64d2ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  detailButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontWeight: 'bold',
    flex: 1,
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
  },
  editOptionButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  editOptionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  pickerButton: {
    width: '100%',
    height: 45,
    borderColor: '#404040',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
  },
  pickerButtonText: {
    color: '#ffffff',
    fontSize: 16,
  }
});

export default styles;