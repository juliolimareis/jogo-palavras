import DictionaryBr from "~~/server/utils/dictionary-br.json";
import DictionaryEn from "~~/server/utils/dictionary-en.json";

export default defineEventHandler(async event => {
  const word = decodeURIComponent(event.context.params.word);
  const query = getQuery(event);

  let isValid = false;

  if(query.lang === "pt"){
    isValid = DictionaryBr.includes(word);
  }else if(query.lang === "en"){
    isValid = DictionaryEn.includes(word);
  }else{
    isValid = true;
  }

  return { isValid, word };
});