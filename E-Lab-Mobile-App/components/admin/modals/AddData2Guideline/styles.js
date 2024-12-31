import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 10,
    },
      modalContent: {
        backgroundColor: '#2d3436',
        borderRadius: 20,
        padding: 20,
        zIndex: 1,
        maxHeight: '80%',
        width: '90%',
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
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        fontSize: 16,
      },
      pickerContainer: {
        borderColor: '#404040',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
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
        marginLeft: 8,
      },
      addButton: {
        backgroundColor: '#28a745',
      },
      closeButton: {
        backgroundColor: '#dc3545',
      },
      valueNamesLabel: {
        marginTop: 16,
        color: '#bababa',
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