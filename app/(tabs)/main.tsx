import React, { useEffect, useState } from "react";
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  TamaguiProvider,
  View,
  XStack,
  YStack,
  Button,
  createTamagui,
} from "tamagui";
import defaultConfig from "@tamagui/config/v3";

import { CurrencyApi, Currency } from "../api/currencyApi";
import { CurrencyInput } from "../components/CurrencyInput";
import { CurrencyDropdown } from "../components/CurrencyDropdown";

const { width } = Dimensions.get("window");
const config = createTamagui(defaultConfig);

export default function App() {
  const [options, setOptions] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [baseAmount, setBaseAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [baseCurrency, setBaseCurrency] = useState<Currency | null>(null);
  const [finalCurrency, setFinalCurrency] = useState<Currency | null>(null);

  const loadCurrencyOptions = async () => {
    try {
      const currencies = await CurrencyApi.fetchSupportedCurrencies();
      setOptions(currencies);
      setIsLoading(false);
    } catch (error: any) {
      Alert.alert("Error", "Failed to load currencies. Please try again.");
      setIsLoading(false);
    }
  };

  const convertCurrency = async () => {
    if (!baseCurrency || !finalCurrency || !baseAmount) {
      Alert.alert("Error", "Please select currencies and enter an amount");
      return;
    }

    try {
      const convertedAmount = await CurrencyApi.convertCurrency(
        baseCurrency.code,
        finalCurrency.code,
        baseAmount
      );
      setFinalAmount(convertedAmount.toString());
    } catch (error: any) {
      Alert.alert("Error", "Conversion failed. Please try again.");
    }
  };

  const handleSwapCurrencies = () => {
    if (!baseCurrency || !finalCurrency) return;

    setBaseCurrency(finalCurrency);
    setFinalCurrency(baseCurrency);
  };

  useEffect(() => {
    loadCurrencyOptions();
  }, []);

  useEffect(() => {
    if (baseCurrency && finalCurrency && baseAmount) {
      convertCurrency();
    }
  }, [baseCurrency, finalCurrency,baseAmount]);

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
            <CurrencyInput
              value={baseAmount}
              onChangeText={(value) =>
                !isNaN(Number(value)) ? setBaseAmount(value) : null
              }
              placeholder="Enter Amount"
            />

            <CurrencyDropdown
              options={options}
              onSelect={setBaseCurrency}
              placeholder="Select Base Currency"
              selectedValue={baseCurrency}
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
            <CurrencyDropdown
              options={options}
              onSelect={setFinalCurrency}
              placeholder="Select Final Currency"
              selectedValue={finalCurrency}
            />

            <CurrencyInput
              value={finalAmount}
              onChangeText={setFinalAmount}
              placeholder="Converted Amount"
              editable={false}
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
});
