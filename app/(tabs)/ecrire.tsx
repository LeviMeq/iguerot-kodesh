import EcrireModal from "@/components/EcrireModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GlobalContext } from "@/util/context/GlobalContext";
import { getTextDirection } from "@/util/direction";
import { useIsFocused, useNavigationState } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  Linking,
  Pressable,
  Text,
  TextInput,
} from "react-native";
import {  Button, HelperText } from "react-native-paper";

export default function ecrire() {
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(true);
  const index = useNavigationState((state) => state.index);
  const { language, t } = useContext<any>(GlobalContext);

//   useEffect(() => {
//     index === 1 && setModalVisible(true);
//   }, [isFocused]);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    prenomMere: "",
    email: "",
    textArea: "",
  });
  const [formValidation, setFormValidation] = useState({
    nom: false,
    prenom: false,
    prenomMere: false,
    email: false,
    textArea: false,
  });

  const validationCheck = () => {
    const areValid = {
      nom: false,
      prenom: false,
      prenomMere: false,
      email: false,
      textArea: false,
    };

    if (form.nom.length < 3 || form.nom.length > 30) {
      setFormValidation((state) => ({ ...state, nom: true }));
    } else {
      areValid.nom = true;
      setFormValidation((state) => ({ ...state, nom: false }));
    }
    if (form.prenom.length < 3 || form.prenom.length > 30) {
      setFormValidation((state) => ({ ...state, prenom: true }));
    } else {
      areValid.prenom = true;
      setFormValidation((state) => ({ ...state, prenom: false }));
    }
    if (form.prenomMere.length < 3 || form.prenomMere.length > 30) {
      setFormValidation((state) => ({ ...state, prenomMere: true }));
    } else {
      areValid.prenomMere = true;
      setFormValidation((state) => ({ ...state, prenomMere: false }));
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (
      form.email.length < 5 ||
      form.email.length > 100 ||
      !emailRegex.test(form.email)
    ) {
      setFormValidation((state) => ({ ...state, email: true }));
    } else {
      areValid.email = true;
      setFormValidation((state) => ({ ...state, email: false }));
    }
    if (form.textArea.length < 10) {
      setFormValidation((state) => ({ ...state, textArea: true }));
    } else {
      areValid.textArea = true;
      setFormValidation((state) => ({ ...state, textArea: false }));
    }
    return Object.values(areValid).every((value) => value);
  };

  const sendEmail = () => {
    if (!validationCheck()) {
      return;
    } else {
      const email = "ohel@ohelchabad.org"; // Adresse e-mail du destinataire
      const subject = `Request for blessings ${form.nom}`;
      const body = `
            Email: ${form.email}
            Hebrew first name: ${form.prenom}
            Mother Hebrew name: ${form.prenomMere}
    
            Letter to The Rebbe ${form.textArea}`;
      const url = `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            Alert.alert("Error", "No email app available");
          } else {
            return Linking.openURL(url);
          }
        })
        .catch((err) => console.error("Error opening email app", err));
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>
        {t('write_to_Rabbi')}
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
        {t('ask_blessing')}
        </ThemedText>
      </ThemedView>
      <Pressable onPress={() => setModalVisible(!modalVisible)} style={styles.noteButton} >
          <Text style={styles.text}>{t('importante_note')}</Text>
        </Pressable>
      <ScrollView contentContainerStyle={styles.contain}>
        <TextInput
          placeholder={t('latName_firstName')}
          value={form.nom}
          onChangeText={(text) => setForm({ ...form, nom: text })}
          style={[styles.input, getTextDirection(language)]}
        />
        {formValidation.nom && (
          <HelperText type="error" visible={formValidation.nom}>
            {t('latName_firstName')} *
          </HelperText>
        )}
        <TextInput
          placeholder={t('hebrew_firstName')}
          value={form.prenom}
          onChangeText={(text) => setForm({ ...form, prenom: text })}
          style={[styles.input, getTextDirection(language)]}
        />
        {formValidation.prenom && (
          <HelperText type="error" visible={formValidation.prenom}>
            {t('hebrew_firstName')} *
          </HelperText>
        )}
        <TextInput
          placeholder={t('hebrew_mother_firstName')}
          value={form.prenomMere}
          onChangeText={(text) => setForm({ ...form, prenomMere: text })}
          style={[styles.input, getTextDirection(language)]}
        />
        {formValidation.prenomMere && (
          <HelperText type="error" visible={formValidation.prenomMere}>
            {t('hebrew_mother_firstName')} *
          </HelperText>
        )}
        <TextInput
          placeholder={t('email')}
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          style={[styles.input, getTextDirection(language)]}
        />
        {formValidation.email && (
          <HelperText type="error" visible={formValidation.email}>
            {t('valid_email')} *
          </HelperText>
        )}
        <TextInput
          // mode="flat"
          style={[styles.textarea, ]}
          multiline={true}
          numberOfLines={6}
          placeholder={t('request_blessing')}
          value={form.textArea}
          onChangeText={(text) => setForm({ ...form, textArea: text })}
        />
        {formValidation.textArea && (
          <HelperText type="error" visible={formValidation.textArea}>
            {t('min_characters')} *
          </HelperText>
        )}
        <Button
          icon="send"
          mode="contained"
          style={styles.button}
          onPress={sendEmail}
        >
          {t('send_bless')}
        </Button>
      </ScrollView>
      <EcrireModal visible={modalVisible} setVisible={setModalVisible} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  titleContainer: {
    paddingTop: 20,
    flexDirection: "column",
    gap: 4,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
  },
  contain: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "90%",
    marginTop: 5,
    height: 45,
    // margin: 12,
    borderWidth: 1,
    borderColor: "#878f99",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#e0e2e4",
  },
  textarea: {
    width: "90%",
    height: 170,
    marginTop: 5,
    fontSize: 16,
    // margin: 12,
    borderWidth: 1,
    borderColor: "#878f99",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#e0e2e4",
  },
  button: {
    marginTop: 5,
    width: '90%',
    borderRadius: 10,
  },
  noteButton: {
    margin: 12,
},
text: {
    color: 'red',
    textAlign: 'center'
  }
});
