const URL = 'https://restcountries.com/v3.1/name';
const option = '?fields=name,capital,population,flags,languages ';

export function fetchCountries(name) {
  if (name) {
    return fetch(`${URL}/${name}${option}`).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }
}
