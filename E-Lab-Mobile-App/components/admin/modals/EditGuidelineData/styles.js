import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#2d3436',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    zIndex: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff',
  },
  scrollView: {
    maxHeight: '100%',
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#bababa',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#404040',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: '#404040',
    color: '#ffffff',
    fontSize: 16,
  },
  pickerContainer: {
    borderColor: '#404040',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#404040',
    overflow: 'hidden',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    height: 45,
  },
  iconButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: '#007bff',
  },
  closeButton: {
    backgroundColor: '#6c757d',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModalContent: {
    backgroundColor: '#2d3436',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '50%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  pickerHeaderButton: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  selectedPickerItem: {
    backgroundColor: '#404040',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#ffffff',
  },
  selectedPickerItemText: {
    color: '#007bff',
  },
  pickerButton: {
    width: '100%',
    height: 45,
    borderColor: '#404040',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: '#404040',
    justifyContent: 'center',
  },
  pickerButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default styles;