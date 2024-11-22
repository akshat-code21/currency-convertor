import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface CurrencyInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  editable?: boolean;
}

export const CurrencyInput = ({ 
  value, 
  onChangeText, 
  placeholder, 
  editable = true 
}: CurrencyInputProps) => {
  const handleTextChange = (text: string) => {
    const numericText = editable ? text.replace(/[^0-9.]/g, '') : text;
    onChangeText(numericText);
  };

  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#6b7280"
      value={value}
      onChangeText={handleTextChange}
      keyboardType="numeric"
      editable={editable}
      style={editable ? styles.input : styles.resultInput}
    />
  );
};
const styles = StyleSheet.create({
    input: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 15,
      fontSize: 18,
      color: "#333",
      marginVertical: 10,
      borderWidth: 1,
      borderColor: "#e0e0e0",
    },
    resultInput: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 15,
      fontSize: 18,
      color: "#4a90e2",
      marginVertical: 10,
      borderWidth: 1,
      borderColor: "#e0e0e0",
    }
  });