// Web stub for react-native-maps — maps are not supported on web.
// This renders a placeholder so the web build doesn't crash.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapView({ style, children }) {
  return (
    <View style={[styles.placeholder, style]}>
      <Text style={styles.text}>🗺  Map view is only available on the mobile app.</Text>
    </View>
  );
}

export function Marker() {
  return null;
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#e8eaed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#5f6368',
    fontSize: 14,
  },
});
