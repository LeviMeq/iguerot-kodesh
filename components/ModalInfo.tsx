import { GlobalContext } from "@/util/context/GlobalContext";
import { getTextDirection } from "@/util/direction";
import React, { useContext } from "react";
import { TouchableWithoutFeedback } from "react-native";
import { Pressable } from "react-native";
import { Modal, StyleSheet, Text, View } from "react-native";

interface ModalInfoProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}
export default function ModalInfo({ visible, setVisible }: ModalInfoProps) {
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
        <TouchableWithoutFeedback onPressOut={() => setVisible(false)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback style={styles.modalView}>
              <View style={styles.modalView}>
                <View style={styles.titleLettre}>
                  <Pressable style={{}} onPress={() => setVisible(!visible)}>
                    <Text style={styles.text}>X</Text>
                  </Pressable>
                </View>
                <Text style={[styles.title, getTextDirection(language)]}>
                  info!
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //   width: "100%",
    //   height: 500
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
