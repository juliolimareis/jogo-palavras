import DictionaryBr from "~~/game/dictionary-br.json";
import DictionaryEn from "~~/game/dictionary-en.json";

export default defineEventHandler(async event => {
  const word = decodeURIComponent(event.context.params.word);
  const query = getQuery(event);

  let isValid = false;

  if(query.lang === "pt"){
    if(DictionaryBr.includes(word)){
      isValid = true;
    }
  }else if(query.lang === "en"){
    if(DictionaryEn.includes(word)){
      isValid = true;
    }
  }

  return { isValid, word };
});