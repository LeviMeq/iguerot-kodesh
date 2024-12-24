import React, { createContext, ReactElement, useState } from "react";
import { localStorage } from "../localStorage";
import * as Localization from 'expo-localization';
import fr from "../../assets/translations/fr.json";
import he from "../../assets/translations/he.json";
interface GlobalProviderProps {
    children: any;
}

export const GlobalContext = createContext()

const translations: any = {
    fr: fr,
    he: he,
  };

export const GlobalProvider = ({children}: GlobalProviderProps) => {
    const [storage, setStorage] = useState(null)
    const [language, setLanguage] = useState('he')
    const [fontSizeStore, setFontSizeStore] = useState(16)
    const [letterContext, setLetterContext] = useState(null)
    // const languageSystem = Localization.getLocales(); // Ex: "en-US"
    // console.log('letterContext', letterContext);
    
    const getDataFromStorage = async (key: string) => {
        let value
        try {
            value = await localStorage.getData(key)
            setStorage(value)
        } catch (error) {
            console.log('error getDataFromStorage');
        }
        return value
    }

    const getLangFromStorage = async () => {
        try {
          const storedLanguage = await localStorage.getData("LANGUAGE_STORAGE");
          if (storedLanguage) {
            setLanguage(storedLanguage);
          } else {
            const deviceLanguage = Localization.locale.split("-")[0]; // "fr" de "fr-FR"
            setLanguage(deviceLanguage);
          }
        } catch (error) {
          console.log("Erreur lors de la récupération de la langue :", error);
        }
      };
    const getFontSizeFromStorage = async () => {
        try {
          const storedSize = await localStorage.getData("FONT_SIZE");
          if (storedSize) {
            setFontSizeStore(storedSize);
          } else {
            setFontSizeStore(16);
          }
        } catch (error) {
          console.log("Erreur lors de la récupération de la taille :", error);
        }
      };
    
    const alreadyExists = (data: any, letterData:any) => {        
        return data?.some((letter: any) => {                        
            return (letter?.Num_id || letter?.idx) === (letterData?.Num_id || letterData?.idx)
        })
    }
    
    const storeDataToStorage = async (key: string, dataLetter: any) => {
        const dataStorage = await getDataFromStorage('lettres')
        let storeData: any = []
        if(dataStorage !== null && alreadyExists(dataStorage, dataLetter)) {            
            return "ALREADY_EXIST"
        } else 
        {
            if(dataStorage) {
                storeData.push(...dataStorage, dataLetter)
            } else {
                storeData.push(dataLetter)
            }
        }
        setStorage(storeData)
        localStorage.storeData(key , storeData)
    }

    const removeItemFromStorage = async (newData: any) => {
        localStorage.storeData('lettres' , newData)
    }

   const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.storeData("LANGUAGE_STORAGE", newLanguage);
  };
   const changeFontSize = (size: number) => {
    setFontSizeStore(size);
    localStorage.storeData("FONT_SIZE", size);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };
    return (
        <GlobalContext.Provider value={{getDataFromStorage, storeDataToStorage, alreadyExists, removeItemFromStorage, storage, setStorage, changeLanguage, getLangFromStorage, language, t, getFontSizeFromStorage, changeFontSize, fontSizeStore, setFontSizeStore, letterContext, setLetterContext}}>
            {children}
        </GlobalContext.Provider>
    )
}