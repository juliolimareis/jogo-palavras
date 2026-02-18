import DictionaryDatabaseDriver from "../../interfaces/dictionary.database.interface";
import DictionaryEn from "./files/dictionary-en.json";

export default class DictionaryEnDatabase extends DictionaryDatabaseDriver {
  checkWorld(word: string): boolean {
    if(!word || !word.trim()){
      return false;
    }

    return DictionaryEn.includes(word.toLocaleLowerCase());
  }

  static create(){
    return new DictionaryEnDatabase();
  }
}