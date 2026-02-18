import DictionaryDatabaseDriver from "../../interfaces/dictionary.database.interface";
import DictionaryBr from "./files/dictionary-br.json";

export default class DictionaryBrDatabase extends DictionaryDatabaseDriver {
  checkWorld(word: string): boolean {
    if(!word || !word.trim()){
      return false;
    }

    return DictionaryBr.includes(word.toLocaleLowerCase());
  }

  static create(){
    return new DictionaryBrDatabase();
  }
}