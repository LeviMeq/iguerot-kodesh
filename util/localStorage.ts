import AsyncStorage from '@react-native-async-storage/async-storage';

export class localStorage{
    public static storeData = async (key:string,value:any) => {        
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {
            // saving error
        }
      }
      public static getData = async (key:string) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            // console.log('jsonValue', jsonValue)
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
      }

      public static removeData = async (key:string) => {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch(exception) {
            return false;
        }
      }
      public static remove=async()=>{
        try {
            await AsyncStorage.clear();
            return true;
        }
        catch(exception) {
            return false;
        }
    }     
}