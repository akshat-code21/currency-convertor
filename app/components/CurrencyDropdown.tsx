import React, { useRef } from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Currency } from '../api/currencyApi';

interface CurrencyDropdownProps {
  options: Currency[];
  onSelect: (currency: Currency) => void;
  placeholder: string;
  selectedValue: Currency | null;
}

export const CurrencyDropdown = ({
  options,
  onSelect,
  placeholder,
  selectedValue,
}: CurrencyDropdownProps) => {
  const dropdownRef = useRef(null);

  return (
    <SelectDropdown
      ref={dropdownRef}
      data={options}
      defaultValue={selectedValue} // Ensure the selected value is shown
      onSelect={onSelect}
      renderButton={(selectedItem, isOpened) => (
        <View style={styles.dropdownButton}>
          <Text style={styles.dropdownButtonText}>
            {selectedItem
              ? `${selectedItem.code} - ${selectedItem.description}`
              : placeholder}
          </Text>
          <Icon
            name={isOpened ? 'expand-less' : 'expand-more'}
            style={styles.dropdownButtonIcon}
          />
        </View>
      )}
      renderItem={(item, _, isSelected) => (
        <View
          style={[
            styles.dropdownItem,
            isSelected && styles.selectedDropdownItem,
          ]}
        >
          <Text style={styles.dropdownItemText}>
            {item.code} - {item.description}
          </Text>
        </View>
      )}
      dropdownStyle={styles.dropdownMenu}
    />
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownButtonText: {
    color: '#333',
    fontSize: 16,
  },
  dropdownButtonIcon: {
    color: '#333',
    fontSize: 24,
  },
  dropdownMenu: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedDropdownItem: {
    backgroundColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
});
