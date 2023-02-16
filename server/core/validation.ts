export function checkBody<T = Record<string, any>>(body: T, checkValues?: string[]){
  return new Promise<T>((resolve, reject) => {
    const erros = [] as string[];
    const valuesToCheck = checkValues && checkValues.length ? checkValues : Object.values(body);

    if(body && typeof body === "object"){
      Object.keys(body).forEach(k => {
        if(valuesToCheck.includes(k)){
          if(!body[k as keyof T]){
            erros.push(`${k} is required`);
          }else{
            if(typeof body[k as keyof T] === "string"){
              const str = body[k as keyof T] as string;
  
              if(!str.trim()){
                erros.push(`${k} is not valid`);
              }
            }
          }
        }
      });
    }else{
      erros.push("invalid body.");
    }

    if(erros.length) {
      reject(erros.join(", "));
    }

    resolve(body);
  });
}