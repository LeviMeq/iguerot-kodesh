import React, { useContext, useRef, useState } from "react";
import { StyleSheet, View, Animated } from "react-native";
import LetterContent from "./LetterContent";
import { GlobalContext } from "@/util/context/GlobalContext";

interface FlipCardProps {
  dataLetter: any;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}
const FlipCard = ({
  dataLetter,
  modalVisible,
  setModalVisible,
}: FlipCardProps) => {
  const { language, letterContext } = useContext<any>(GlobalContext);
  const [isFlipped, setIsFlipped] = useState(false);
  const [result, setResult] = useState(letterContext);
  const [lang, setLang] = useState(language);

  const flipAnimation = useRef(new Animated.Value(0)).current;
  // Interpolation pour faire pivoter la carte
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const handleFlip = () => {    
    if (isFlipped) {
      Animated.spring(flipAnimation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnimation, {
        toValue: 180,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };
  
  return (
    <View style={styles.container}>
      <View>
        {/* Face avant */}
        <Animated.View
          style={[
            styles.card,
            { transform: [{ rotateY: frontInterpolate }] },
            { zIndex: isFlipped ? 0 : 1 }, // Contrôle la priorité de rendu
          ]}
        >
          <LetterContent
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            sendTranslation={(result, lang, flip) => {
              setLang(lang);
              setResult(result);
              flip !== "noFlip" && handleFlip();
            }}
            flipLang={lang}
          />
        </Animated.View>
        {/* Face arrière */}
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            { transform: [{ rotateY: backInterpolate }] },
            { zIndex: isFlipped ? 1 : 0 },
          ]}
        >
          <LetterContent
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            sendTranslation={(result, lang, flip) => {
              setLang(lang);
              setResult(result);
              flip !== "noFlip" && handleFlip();
            }}
            flipLang={lang}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor:'yellow',
  },
  card: {
    width: "100%",
    maxHeight: 600,
    backfaceVisibility: "hidden", // Empêche de voir l'autre face pendant la rotation
    position: "absolute",
    // backgroundColor:'green',
  },
  cardBack: {
    // backgroundColor: 'skyblue',
  },
  text: {
    fontSize: 20,
    color: "white",
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "black",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default FlipCard;
