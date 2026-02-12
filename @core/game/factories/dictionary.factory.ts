import { DeckType } from './../entities/deck.entity';
import DictionaryBr from "~~/server/utils/dictionary-br.json";
import DictionaryEn from "~~/server/utils/dictionary-en.json";
import DictionaryJp from "~~/server/utils/dictionary-jp.json";

 
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class DictionaryFactory {
  static build(type: DeckType){
    switch (type) {
      case DeckType.EN:
        return DictionaryEn;
      case DeckType.PT:
        return DictionaryBr;
      case DeckType.JP:
        return DictionaryJp
    }
  }
}