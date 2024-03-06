
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
export const phonePreparing = phone => phone && phone.replaceAll(/\D+/g, "")

/** Сколько дней осталось до даты */
const today = new Date();
export const daysLeft = (future) => {
  const futureFate = new Date(future);
  let difference = futureFate.getTime() - today.getTime();

  return Math.ceil(difference / (1000 * 3600 * 24));
}

/** Сколько токенов стоит игрушка */
export const getToken = ({price, life_time}) => {
  // время окупаемости
  const okkTime = price > 12000
    ? life_time/3
    : price < 5001
      ? 1.5
      : 3;
  return parseInt((price / okkTime)/120);
};
