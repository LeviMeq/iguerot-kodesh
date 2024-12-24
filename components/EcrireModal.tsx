import { GlobalContext } from "@/util/context/GlobalContext";
import { getViewDirection, getTextDirection } from "@/util/direction";
import React, { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { Pressable, Text } from "react-native";
import { Modal } from "react-native";
import { View } from "react-native";

interface EcrireModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export default function EcrireModal({ visible, setVisible }: EcrireModalProps) {
  const { language, t } = useContext<any>(GlobalContext);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.titleLettre}>
              <Pressable style={{}} onPress={() => setVisible(!visible)}>
                <Text style={styles.text}>X</Text>
              </Pressable>
            </View>
            <View style={{}}>
              <Text style={[styles.title, getTextDirection(language)]}>
                {t('how_proceed')}
              </Text>
              <Text style={[styles.textStyle, getTextDirection(language)]}>
                {'\t'}{t('text_1')}
              </Text>
              <Text style={[styles.textStyle, getTextDirection(language)]}>
                {'\t'}{t('text_2')}
              </Text>
              <Text style={[styles.textStyle, getTextDirection(language)]}>
                {'\t'}{t('text_3')}
              </Text>
              <Text style={[styles.textStyle, getTextDirection(language)]}>
                {'\t'}{t('text_4')}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#d5e1df",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  titleLettre: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
      fontSize: 20,
      color: "black",
  },
  textStyle: {
    fontSize: 18,
    color: "black",
    textAlign: "justify",
  },
});
