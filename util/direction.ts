import React, { useContext } from "react";
import { I18nManager, Platform, TextStyle, ViewStyle } from "react-native";
import { GlobalContext } from "./context/GlobalContext";

const getDirection = (language: string): boolean => {
  // Détermine si la langue est RTL ou LTR
  const rtlLanguages = ["he", "ar"]; // Ajoutez d'autres langues RTL si nécessaire
  return rtlLanguages.includes(language);
};

// Fonction pour déterminer la direction des vues
const getViewDirection = (language: string): ViewStyle => {
  const directionIsRtl = getDirection(language);
  return directionIsRtl
    ? { flexDirection: "row-reverse" }
    : { flexDirection: "row" };
};

// Fonction pour déterminer la direction du texte
const getTextDirection = (language: string): TextStyle => {
  const directionIsRtl = getDirection(language);
  return directionIsRtl
    ? { textAlign: "right", alignItems: "flex-end" }
    : { textAlign: "left", alignItems: "flex-start" };
};

// Composant principal qui exporte les styles en fonction de la langue du contexte
const DirectionProvider = () => {
  const { language } = useContext<any>(GlobalContext);

  // Appels des fonctions avec la langue actuelle
  const viewDirection = getViewDirection(language);
  const textDirection = getTextDirection(language);

  return {
    viewDirection,
    textDirection,
  };
};

export { getTextDirection, getViewDirection, DirectionProvider };
