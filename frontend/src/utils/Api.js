// Класс взаимодействия с сервером
class Api {
  #url;
  #headers;

  constructor(data) {
    this.#url = data.url; // ссылка на сервер
    this.#headers = data.headers; // данные headers из index.js для запроса
  }

  // Проверка статуса запроса
  #handleResponse(res) {
    if (res.ok) {
      return res.json()
    } else {
      return Promise.reject(`Ошибка: ${res.status}`)
    }
  }

  // Загрузка информации о пользователе с сервера
  getUserInfo() {
    return fetch(`${this.#url}/users/me`, {
      headers: this.#headers
    })
    .then(this.#handleResponse)
  }

  // Запрос карточек с сервера
  getInitialCards() {
    return fetch(`${this.#url}/cards`, {
      headers: this.#headers
    })
    .then(this.#handleResponse)
  }

  // Редактирование профиля
  setUserInfo({ name, description }) {
    return fetch(`${this.#url}/users/me`, {
      method: 'PATCH',
      headers: this.#headers,
      body: JSON.stringify({
        name: name, // имя
        about: description // о себе
      })
    })
    .then(this.#handleResponse)
  }

  // Добавление новой карточки
  addNewCard(data) {
    return fetch(`${this.#url}/cards`, {
      method: 'POST',
      headers: this.#headers,
      body: JSON.stringify(data) // name: data.name, link: data.link
    })
    .then(this.#handleResponse)
  }

  // Удаление карточки
  deleteCard(id) {
    return fetch(`${this.#url}/cards/${id}`, {
      method: 'DELETE',
      headers: this.#headers
    })
    .then(this.#handleResponse)
  }

  // Запрос на добавление лайка
  addCardLike(id) {
    return fetch(`${this.#url}/cards/${id}/likes`, {
      method: 'PUT',
      headers: this.#headers
    })
    .then(this.#handleResponse)
  }

  // Запрос на удаление лайка
  removeCardLike(id) {
    return fetch(`${this.#url}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: this.#headers
    })
    .then(this.#handleResponse)
  }
  
  // Обновление аватара пользователя
  editAvatar(data) {
    return fetch(`${this.#url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.#headers,
      body: JSON.stringify({
        avatar: data.avatar,
      })
    })
    .then(this.#handleResponse)
  }

  // Если isLiked = true - запрос на удаление, если false - постановка лайка
  changeLikeCardStatus(id, isLiked) {
    const method = isLiked ? 'PUT' : 'DELETE';
      return fetch(`${this.#url}/cards/${id}/likes`, {
        method: method,
        headers: this.#headers,
      })
      .then(this.#handleResponse)
  }
}

export default Api;

// Класс Api, отвечающий за запросы к серверу
// export const api = new Api ({
//   url: 'https://mesto.nomoreparties.co/v1/cohort-66',
//   headers: {
//     authorization: '36b3d00c-eb9b-4532-a563-964663cc5274',
//     'Content-Type': 'application/json'
//   }
// })
export const api = new Api ({
  url: 'https://api.darpeex.nomoredomainsicu.ru/main',
  headers: {
    authorization: '36b3d00c-eb9b-4532-a563-964663cc5274',
    'Content-Type': 'application/json'
  }
})



// Можно сделать универсальный метод запроса с проверкой ответа, чтобы не дублировать эту проверку в каждом запросе:

// _request(url, options) {
//   return fetch(url, options).then(this.#handleResponse)
// }

// И теперь просто нужно заменить все fetch на this._request, убрав дублирование проверки на ok. Все остальное будет без изменений 
// И даже можно поместить внутрь this._baseUrl, чтобы не дублировать его в каждом запросе. Тогда нужно будет передавать просто endpoint в вызов