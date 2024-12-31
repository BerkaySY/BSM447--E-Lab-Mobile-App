import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2d3436',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    padding: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#64d2ff',
  },
  formScrollView: {
    marginTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#505050',
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
    color: '#64d2ff',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#505050',
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  picker: {
    flex: 1,
    color: '#ffffff',
  },
  pickerItem: {
    backgroundColor: '#2d3436',
    color: '#ffffff',
  },
  registerButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#DC3545',
    padding: 15,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;