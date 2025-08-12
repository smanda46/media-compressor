import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Btn({
  label,
  onPress,
  disabled,
  kind = 'primary',
  small,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  kind?: 'primary' | 'ghost' | 'neutral';
  small?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        kind === 'ghost' && styles.btnGhost,
        kind === 'neutral' && styles.btnNeutral,
        small && styles.btnSmall,
        disabled && styles.btnDisabled,
      ]}
      activeOpacity={0.75}
    >
      <Text
        style={[
          styles.btnText,
          kind === 'ghost' && styles.btnTextGhost,
          kind === 'neutral' && styles.btnTextNeutral,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#5662F6',
    borderWidth: 1,
    borderColor: '#626DF8',
    shadowColor: '#5662F6',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  btnNeutral: {
    backgroundColor: '#1A2033',
    borderColor: '#2E3A63',
    shadowOpacity: 0,
  },
  btnGhost: {
    backgroundColor: 'transparent',
    borderColor: '#27314F',
    shadowOpacity: 0,
  },
  btnSmall: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.3,
    fontSize: 14,
  },
  btnTextNeutral: { color: '#D7E0F5' },
  btnTextGhost: { color: '#95A1B8' },
});