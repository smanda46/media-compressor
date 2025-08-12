import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressBar({ pct }: { pct: number }) {
  return (
    <View style={styles.progWrap}>
      <View style={[styles.progFill, { width: `${Math.min(100, Math.max(0, pct))}%` }]} />
      <Text style={styles.progText}>{pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progWrap: {
    marginTop: 6,
    height: 16,
    borderRadius: 999,
    backgroundColor: '#111523',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#202744',
    justifyContent: 'center',
  },
  progFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: '#5F6BF8',
  },
  progText: {
    textAlign: 'center',
    color: '#DCE4F8',
    fontSize: 11,
    fontWeight: '700',
  },
});