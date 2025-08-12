import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.section}>{children}</Text>;
}

const styles = StyleSheet.create({
  section: {
    color: '#B6C1D6',
    fontWeight: '700',
    marginTop: 4,
    marginBottom: -6,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});