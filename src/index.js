import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const MAX_COUNTRIES_TO_VIEW = 10;

const refs = {
  inputSeach: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputSeach.addEventListener('input', debounce(renderMarkup, DEBOUNCE_DELAY));

function renderMarkup(event) {
  const userRequest = event.target.value.trim();
  cleanMarkup();
  refs.countryList.classList.remove('visually-hidden');

  if (!userRequest) {
    return;
  }
  fetchCountries(userRequest)
    .then(onSearchQuery)
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function onSearchQuery(data) {
  if (data.length > MAX_COUNTRIES_TO_VIEW) {
    return Notify.info('Too many matches found. Please enter a more specific name.');
  }
  if (data.length === 1) {
    refs.countryList.classList.add('visually-hidden');
    return renderOneCountry(data);
  }
  renderCountriesList(data);
}

function renderCountriesList(data) {
  const countriesMarkup = data
    .map(
      ({ flags, name }) => `      <li class="country-list__item">
          <img src="${flags.svg}" alt="${name.official} flag" width="40"/>
          <p>${name.official}</p>
        </li>`,
    )
    .join('');
  refs.countryList.innerHTML = countriesMarkup;
}

function renderOneCountry(data) {
  const oneCountryMarkup = data
    .map(({ flags, name, capital, population, languages }) => {
      return `      <div class="country-info__item">
        <img src="${flags.svg}" alt="${name.official} flag" width="40" />
        <h1>${name.official}</h1>
      </div>
      <ul>
        <li><b>Capital: </b>${capital}</li>
        <li><b>Population: </b>${population}</li>
        <li><b>Languages: </b>${Object.values(languages)}</li>
      </ul>
  `;
    })
    .join('');
  refs.countryInfo.innerHTML = oneCountryMarkup;
}

function cleanMarkup() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
