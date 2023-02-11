export default defineEventHandler(async event => {
  const word = decodeURIComponent(event.context.params.word);
  const res = await fetch(`https://api.dicionario-aberto.net/near/${word}`)
    .then(res => res.json());

  let isValid = false;

  if(res && Array.isArray(res)){
    isValid = res.some(w => w === word);
  }

  return { isValid, word };
});