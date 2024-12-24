import { GlobalContext } from "@/util/context/GlobalContext";
import React, { useContext } from "react";
import { Pressable } from "react-native";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  Modal,
} from "react-native";

interface ListModalProps {
  lists: any;
  visible: boolean;
  setListModalVisible: (visible: boolean) => void;
  setModalVisible: (visible: boolean) => void;
  setLetterData: (letter: any) => void;
}
export default function ListModal({
  lists,
  visible,
  setListModalVisible,
  setModalVisible,
  setLetterData,
}: ListModalProps) {
  const { language, t, setLetterContext } = useContext<any>(GlobalContext);

  const Item = ({ item }) => (
    <View style={styles.item}>
      <Pressable
        style={[]}
        onPress={() => {
          setModalVisible(true);
          // setLetterData(item);
          setLetterContext(item)
        }}
      >
        {item.texte && <Text style={styles.title}>{item.texte?.slice(0, 150)}</Text>}
        {item.idx && <Text style={styles.title}>{item.idx}</Text>}
        {item.Igroys_text && <Text style={styles.title}>{item.Igroys_text?.slice(0, 100)}</Text>}
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setListModalVisible(!visible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.titleLettre}>
              <View></View>
              <Text style={styles.modalText}>
                {lists.length} {t('result')}{(lists.length > 1 && language !== 'he') && "s"}
              </Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setListModalVisible(!visible)}
              >
                <Text style={styles.textStyle}>X</Text>
              </Pressable>
            </View>
            <FlatList
              data={lists}
              renderItem={({ item }) => <Item item={item} />}
              keyExtractor={(item) => (item.Num_id || item.idx)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 15,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    // elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    // backgroundColor: "#2196F3",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
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
  },
  modalText: {
    marginBottom: 15,
    // textAlign: 'center',
  },
  textStyle: {
    color: "black",
    fontSize: 20,
    textAlign: "center",
  },
});
