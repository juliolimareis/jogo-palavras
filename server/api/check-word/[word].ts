export default defineEventHandler(async event => {
  const word = decodeURIComponent(event.context.params.word);
  let isValid = false;

  return await new Promise((resolve, reject) => {
    fetch(`https://api.dicionario-aberto.net/near/${word}`)
      .then(res => resolve(res.json()));

    setTimeout(() => {
      reject(`[check-word]: https://api.dicionario-aberto.net/near/${word}: timeout`);
    }, 10000);
  }).then(res => {
    if(res && Array.isArray(res)){
      isValid = res.some(w => w === word);
    }

    return { isValid, word };
  }).catch(err => {
    console.log(err);

    return { isValid, word };
  });
});