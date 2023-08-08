
/** Уникальный лист */
export const uniqList = (list = [], uniqProperty = "id") => {
  let dataDictionary = {}; // Здесь все предыдщушие значения
  return list.filter(({ id }) => {
    if (dataDictionary[id]) return false;
    dataDictionary[id] = true;
    return true;
  })
}

/** Удаление из номера лишний символов */
export const phonePreparing = phone => phone.replaceAll(/\D+/g, "")
