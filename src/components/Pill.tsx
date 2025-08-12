import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#141926',
    borderWidth: 1,
    borderColor: '#2A3147',
  },
  pillText: {
    color: '#C8D2E0',
    fontSize: 12,
    fontWeight: '700',
  },
});