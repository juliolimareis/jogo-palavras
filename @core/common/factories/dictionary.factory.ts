/* eslint-disable @typescript-eslint/no-extraneous-class */
import { DeckType } from '../../game/entities/deck.entity';
import DictionaryBrDatabase from '../infra/drivers/dictionaries/dictionaryBr.database.driver';
import DictionaryEnDatabase from '../infra/drivers/dictionaries/dictionaryEn.database.driver';
import DictionaryJpDatabase from '../infra/drivers/dictionaries/dictionaryJp.database.driver';
import type DictionaryDatabaseDriver from '../infra/interfaces/dictionary.database.interface';
 
export default class DictionaryFactory {
  static build(type: DeckType): DictionaryDatabaseDriver {
    switch (type) {
      case DeckType.PT:
        return DictionaryBrDatabase.create();
      case DeckType.EN:
        return DictionaryEnDatabase.create();
      case DeckType.JP:
        return DictionaryJpDatabase.create()
    }
  }
}