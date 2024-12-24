import React, { useState } from "react";
import { View, Modal, StyleSheet, Pressable, Image } from "react-native";
import FlipCard from "./FlipCard";
import Toast from 'react-native-toast-message'
import lettres from "../assets/lettres/lettres.json";
import lettresHebreu from "../assets/lettres/lettre_hebreu.json";
import { lettresHebreuType, lettresType } from "@/util/types";

interface LettreModalProps {
  dataLetter: any;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  languageLettre?: string;
}

export default function LettreModal({
  dataLetter,
  modalVisible,
  setModalVisible,
}: LettreModalProps) {


  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <FlipCard
          dataLetter={dataLetter}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
        <Toast />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({

});
