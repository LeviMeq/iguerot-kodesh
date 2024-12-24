import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import lettres from "../assets/lettres/lettres.json";
import lettresHebreu from "../assets/lettres/lettre_hebreu.json";
import { GlobalContext } from "@/util/context/GlobalContext";
import { lettresHebreuType, lettresType } from "@/util/types";
import Toast from "react-native-toast-message";
import { getTextDirection } from "@/util/direction";
import { Button } from "react-native-paper";

interface LetterContentProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  sendTranslation: (
    result: lettresType & lettresHebreuType,
    lang: string,
    flip?: string | boolean
  ) => void;
  flipLang?: string;
}
export default function LetterContent({
  modalVisible,
  setModalVisible,
  sendTranslation,
  flipLang,
}: LetterContentProps) {
  const {
    storeDataToStorage,
    alreadyExists,
    removeItemFromStorage,
    storage,
    setStorage,
    language,
    t,
    changeFontSize,
    fontSizeStore,
    letterContext, 
    setLetterContext
  } = useContext<any>(GlobalContext);
  const [isFavoris, setIsFavoris] = useState(
    alreadyExists(storage, letterContext)
  );
  const [lang, setLanguage] = useState(flipLang);
  const [fontSize, setFontSize] = useState(fontSizeStore); // Taille initiale du texte
  const MIN_FONT_SIZE = 8; // Limite minimale
  const MAX_FONT_SIZE = 32; // Limite maximale
  
  useEffect(() => {
    setIsFavoris(alreadyExists(storage, letterContext));
  }, [modalVisible, flipLang, changeLettre]);

  useEffect(() => {
    if (language === "fr" && letterContext?.idx) {
      getTheTranslation(letterContext?.idx, "he", "noFlip");
    } else if (language === "he" && letterContext?.lettre_id) {
      getTheTranslation(letterContext?.lettre_id, "fr", "noFlip");
    }
  }, [modalVisible]);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: (letterContext?.texte || letterContext?.Igroys_text),
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error?.message);
    }
  };

  const getCurrentDate = () => {
    const dateTime = new Date();
    return `${dateTime.getDate()}-${
      dateTime.getMonth() + 1
    }-${dateTime.getFullYear()} ${dateTime.toLocaleTimeString()}`;
  };

  const addToFavoris = () => {
    setIsFavoris(!isFavoris);

    let newletterContext = { ...letterContext, time: getCurrentDate() };

    !isFavoris
      ? storeDataToStorage("lettres", newletterContext)
      : removeItem(letterContext.Num_id || letterContext.idx);
  };

  const removeItem = (numId: string) => {
    const newData = storage.filter(
      (letter: lettresType & lettresHebreuType) => {
        return (letter?.Num_id || letter?.idx) !== numId;
      }
    );
    setStorage(newData);
    removeItemFromStorage(newData);
  };

  const getTheTranslation = async (
    value: string,
    langu: string,
    flip?: string
  ) => {
    let letters = langu === "he" ? lettresHebreu : lettres?.data;    
    const result = await letters?.find(
      (val: lettresType & lettresHebreuType) =>
        (val.lettre_id || val.idx) === value
    );
    if (result) {
      setLetterContext(result);
      sendTranslation(result, langu, flip);
      setLanguage(flipLang);
    } else {
      console.log("error getTheTranslation fr");
      Toast.show({
        type: "error",
        position: "bottom",
        bottomOffset: 20,
        text1: "המכתב לא קיים",
      });
    }
  };

  const increaseFontSize = () => {
    setFontSize((prevSize: number) => 
      prevSize < MAX_FONT_SIZE ? prevSize + 2 : prevSize
    );
    changeFontSize(fontSize + 2)
    // setFontSizeStore(fontSize)
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize: number) =>
      prevSize > MIN_FONT_SIZE ? prevSize - 2 : prevSize
    );
    changeFontSize(fontSize - 2)
    // setFontSizeStore(fontSize)
  };

  async function changeLettre(sign: string)  {
    let letters = flipLang === "he" ? lettresHebreu : lettres?.data;
    let value = sign === '>' ? Number(letterContext.lettre_id || letterContext.idx) + 1 : Number(letterContext.lettre_id || letterContext.idx) - 1    
    const result = await letters?.find(
      (val: lettresType & lettresHebreuType) => (val.lettre_id || val.idx) === value.toString()
    );
    if (result) {
      sendTranslation(result, flipLang, "noFlip");
      setLetterContext(result)
    } else {
      console.log("error handleSearch");
    }
  }

  return (
    // <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <View style={styles.titleLettre}>
        <Pressable style={{ marginLeft: 10 }} onPress={addToFavoris}>
          <Image
            source={
              isFavoris || alreadyExists(storage, letterContext)
                ? require("@/assets/fonts/star.png")
                : require("@/assets/fonts/favorite.png")
            }
            style={[{ width: 20, height: 20 }]}
          />
        </Pressable>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={increaseFontSize}>
            <Text style={{ fontSize: 15 }}>A+</Text>
          </Pressable>
          <Pressable style={[styles.button, {flexDirection: 'row'}]} onPress={decreaseFontSize}>
            <Text style={{ fontSize: 11 }}>A</Text>
            <Text style={{ fontSize: 15 }}>-</Text>
          </Pressable>
        </View>
        <Text style={styles.modalText}>
          {flipLang === "fr" ? "Lettre N" : "מכתב"}* {letterContext?.lettre_id || letterContext?.idx}
        </Text>
        <Pressable style={{ marginTop: -10 }} onPress={() => setModalVisible(false)}>
          <Text style={styles.textStyle}>X</Text>
        </Pressable>
      </View>
      <ScrollView style={styles.scrollView}>
        {letterContext !== null && letterContext?.lettre_id ? (
          <>
            <Text style={styles.modalText}>
              Lettre N*{letterContext?.lettre_id}
            </Text>
            <Text style={[styles.modalText, { fontSize }]}>
              {letterContext?.texte
                ?.replace(/   /g, "\n")
                ?.replace(letterContext?.lettre_id, "")}
            </Text>
          </>
        ) : (
          flipLang && letterContext?.idx && (
            <>
              <Text
                style={[
                  styles.modalText,
                  { fontSize },
                  getTextDirection(flipLang),
                ]}
              >
                מכתב {letterContext?.idx}
              </Text>
              <Text
                style={[
                  styles.modalText,
                  { fontSize },
                  getTextDirection(flipLang),
                ]}
              >
                {letterContext?.Igroys_address}
              </Text>
              {letterContext?.Igroys_bsd && (
                <Text
                  style={[
                    styles.modalText,
                    { fontSize },
                    getTextDirection(flipLang),
                  ]}
                >
                  {letterContext?.Igroys_bsd}
                </Text>
              )}
              {letterContext?.Igroys_city && (
                <Text
                  style={[
                    styles.modalText,
                    { fontSize },
                    getTextDirection(flipLang),
                  ]}
                >
                  {letterContext?.Igroys_city}
                </Text>
              )}
              {letterContext?.Igroys_comment && (
                <Text
                  style={[
                    styles.modalText,
                    { fontSize },
                    getTextDirection(flipLang),
                  ]}
                >
                  {letterContext?.Igroys_comment}
                </Text>
              )}
              {letterContext?.Igroys_text && (
                <Text
                  style={[
                    styles.modalText,
                    { fontSize },
                    getTextDirection(flipLang),
                  ]}
                >
                  {letterContext?.Igroys_text}
                </Text>
              )}
              {letterContext?.summary && (
                <Text
                  style={[
                    styles.modalText,
                    { fontSize },
                    getTextDirection(flipLang),
                  ]}
                >
                  {letterContext?.summary}
                </Text>
              )}
              {letterContext?.Igroys_signature && (
                <Text
                  style={[
                    styles.modalText,
                    { fontSize },
                    getTextDirection(flipLang),
                  ]}
                >
                  {letterContext?.Igroys_signature}
                </Text>
              )}
              {letterContext?.vol && (
                <Text
                  style={[
                    styles.modalText,
                    { fontSize },
                    getTextDirection(flipLang),
                  ]}
                >
                  כרך {letterContext?.vol}
                </Text>
              )}
              {letterContext?.Page_number && (
                <Text
                  style={[
                    styles.modalText,
                    { fontSize },
                    getTextDirection(flipLang),
                  ]}
                >
                  עמוד {letterContext?.Page_number}
                </Text>
              )}
              {letterContext?.book_page && (
                <Text
                  style={[
                    styles.modalText,
                    { fontSize },
                    getTextDirection(flipLang),
                  ]}
                >
                  דף הספר {letterContext?.book_page}
                </Text>
              )}
            </>
          )
        )}
      </ScrollView>
      <View style={styles.options}>
      {(letterContext?.lettre_id || letterContext?.idx) !== '1' ? 
      <Pressable onPress={() => changeLettre('<')} style={styles.share}>
        <Text >{'<'}</Text>
        </Pressable> : <View style={styles.share}></View>}
        <Pressable
          style={{}}
          onPress={() =>
            getTheTranslation(
              letterContext?.lettre_id || letterContext?.idx,
              flipLang === "fr" ? "he" : "fr"
            )
          }
        >
          <Text style={{}}>
            {flipLang === "he" ? "לראות את התרגום" : "Voir l'original"}
          </Text>
        </Pressable>
        <Pressable onPress={onShare} style={styles.share}>
          <Image
            source={require("@/assets/fonts/share.png")}
            style={[{ width: 20, height: 20 }]}
          />
        </Pressable>
        {(letterContext?.lettre_id !== '9065' && letterContext?.idx !== '10972') ? 
        <Pressable onPress={() => changeLettre('>')} style={styles.share}>
        <Text >{'>'}</Text>
        </Pressable>: <View style={styles.share}></View>}
      </View>
    </View>
    // </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  modalView: {
    margin: 15,
    backgroundColor: "#9fa9a3",
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
  titleLettre: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    marginLeft: -20,
    flexDirection: "row",
    // justifyContent: "space-between",
    // gap: 10,
    // width: 30,
    borderWidth: 1,
    borderColor: "#878f99",
    borderRadius: 5,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 5,
    fontSize: 16,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    // height: 20
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {},
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 30,
    marginTop: -10,
    marginBottom: -10,
  },
  scrollView: {
    backgroundColor: "#F7F6CF",
    padding: 5,
  },
  share: {
    margin: 2,
    padding: 5,
  },
  options: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: -5,
  },
});
