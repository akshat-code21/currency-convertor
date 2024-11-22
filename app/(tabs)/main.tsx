import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView, TextInput } from "react-native";
import {
  createTamagui,
  TamaguiProvider,
  View,
  XStack,
  YStack,
  Button,
} from "tamagui";
import defaultConfig from "@tamagui/config/v3";
import { EXCHANGE_RATE_API_KEY } from '@env';


const { width, height } = Dimensions.get("window");
const config = createTamagui(defaultConfig);

export default function App() {
  const baseDropdownRef = useRef(null);
  const finalDropdownRef = useRef(null);

  const [options, setOptions] = useState<
    { code: string; description: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [baseAmount, setBaseAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [baseCurrency, setBaseCurrency] = useState<{
    code: string;
    description: string;
  } | null>(null);
  const [finalCurrency, setFinalCurrency] = useState<{
    code: string;
    description: string;
  } | null>(null);

  const getOptions = async () => {
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/codes`
      );
      const json: { supported_codes: [string, string][] } =
        await response.json();

      const formattedOptions = json.supported_codes.map(
        ([code, description]) => ({
          code,
          description,
        })
      );

      setOptions(formattedOptions);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load currency options");
    } finally {
      setIsLoading(false);
    }
  };

  const getFinalPrice = async () => {
    if (!baseCurrency || !finalCurrency || !baseAmount) {
      Alert.alert("Error", "Please select currencies and enter an amount");
      return;
    }

    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/pair/${baseCurrency.code}/${finalCurrency.code}/${baseAmount}`
      );
      const json = await response.json();

      const convertedAmount = json.conversion_result.toString();
      setFinalAmount(convertedAmount);
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to convert currency");
    }
  };

  const handleSwapCurrencies = () => {
    if (!baseCurrency || !finalCurrency) return;

    const newBaseCurrency = finalCurrency;
    const newFinalCurrency = baseCurrency;

    setBaseCurrency(newBaseCurrency);
    setFinalCurrency(newFinalCurrency);

    const baseIndex = options.findIndex(
      (item) => item.code === newBaseCurrency.code
    );
    const finalIndex = options.findIndex(
      (item) => item.code === newFinalCurrency.code
    );

    if (baseDropdownRef.current && finalDropdownRef.current) {
      // @ts-ignore
      baseDropdownRef.current.selectIndex(baseIndex);
      // @ts-ignore
      finalDropdownRef.current.selectIndex(finalIndex);
    }

    getFinalPrice();
  };

  useEffect(() => {
    getOptions();
  }, []);

  useEffect(() => {
    if (baseCurrency && finalCurrency && baseAmount) {
      getFinalPrice();
    }
  }, [baseCurrency, finalCurrency, baseAmount]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <TamaguiProvider config={config}>
      <View style={styles.container}>
        <YStack
          space="$4"
          width={width * 0.9}
          backgroundColor="#f0f4f7"
          borderRadius={20}
          padding={20}
          elevation={5}
        >
          <Text style={styles.title}>Currency Converter</Text>

          <YStack space="$3">
            <TextInput
              placeholder="Enter Amount"
              placeholderTextColor={"#6b7280"}
              value={baseAmount}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9.]/g, "");
                setBaseAmount(numericText);
              }}
              keyboardType="numeric"
              style={styles.input}
            />

            <SelectDropdown
              ref={baseDropdownRef}
              data={options}
              onSelect={(selectedItem) => {
                setBaseCurrency(selectedItem);
              }}
              renderButton={(selectedItem, isOpened) => (
                <View style={styles.dropdownButton}>
                  <Text style={styles.dropdownButtonText}>
                    {selectedItem
                      ? `${selectedItem.code} - ${selectedItem.description}`
                      : "Select Base Currency"}
                  </Text>
                  <Icon
                    name={isOpened ? "expand-less" : "expand-more"}
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
          </YStack>

          <XStack
            justifyContent="center"
            alignItems="center"
            marginVertical={10}
          >
            <Button
              circular
              backgroundColor="#e0e7f0"
              onPress={handleSwapCurrencies}
            >
              <Ionicons name="swap-vertical" size={24} color="#333" />
            </Button>
          </XStack>

          <YStack space="$3">
            <SelectDropdown
              ref={finalDropdownRef}
              data={options}
              onSelect={(selectedItem) => {
                setFinalCurrency(selectedItem);
              }}
              renderButton={(selectedItem, isOpened) => (
                <View style={styles.dropdownButton}>
                  <Text style={styles.dropdownButtonText}>
                    {selectedItem
                      ? `${selectedItem.code} - ${selectedItem.description}`
                      : "Select Final Currency"}
                  </Text>
                  <Icon
                    name={isOpened ? "expand-less" : "expand-more"}
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

            <TextInput
              value={finalAmount}
              editable={false}
              style={styles.resultInput}
              placeholder="Converted Amount"
              placeholderTextColor="#6b7280"
            />
          </YStack>
        </YStack>
      </View>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f7",
  },
  loadingText: {
    color: "#333",
    marginTop: 10,
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
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
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdownButtonText: {
    color: "#333",
    fontSize: 16,
  },
  dropdownButtonIcon: {
    color: "#333",
    fontSize: 24,
  },
  dropdownMenu: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  selectedDropdownItem: {
    backgroundColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  convertButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
