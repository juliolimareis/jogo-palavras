import DictionaryDatabaseDriver from "../../interfaces/dictionary.database.interface";
import DictionaryJp from "./files/dictionary-jp.json";

export default class DictionaryJpDatabase extends DictionaryDatabaseDriver {
  checkWorld(word: string): boolean {
    if(!word || !word.trim()){
      return false;
    }

    return DictionaryJp.includes(word.toLocaleLowerCase());
  }

  static create(){
    return new DictionaryJpDatabase();
  }
}