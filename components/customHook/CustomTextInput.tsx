import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native";
import { useTheme, TextInput } from "react-native-paper";

const CustomTextInput = ({ label, value, onChangeText, required }) => {
  const { colors } = useTheme();

  return (
    <View style={{ marginBottom: 15 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: colors.text, marginRight: 5 }}>{label}</Text>
        {required && <Text style={{ color: "red" }}>*</Text>}{" "}
        {/* L'astérisque rouge */}
      </View>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  input: {
    width: "90%",
    marginTop: 5,
    borderRadius: 5,
  },
});
