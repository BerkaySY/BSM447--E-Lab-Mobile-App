import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(87, 87, 87, 0.9)',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heart: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;