// Попап обновления аватарки профиля
import React from "react";
import { PopupWithForm } from "./PopupWithForm"

export const EditAvatarPopup = ({ onUpdateAvatar, isOpen, onClose }) => { // Передаётся текущее значение свойств isOpen и onClose
  const [avatar, setAvatar] = React.useState('');

  const handleSubmit = (evt) => {
    evt.preventDefault(); // Запрещаем браузеру переходить по адресу формы
    onUpdateAvatar({ avatar }); // Передаём значения управляемых компонентов во внешний обработчик
  }

  function handleAvatarChange(e) { // Этот метод будет обновлять данные в стейт, чтобы в него попадало самое новое введённое значение
    setAvatar(e.target.value);
  }

  return ( // В строке ниже передаём значения пропсов попапа в общую структуру/компонент попапа PopupWithForm
    <PopupWithForm id="updateAvatar" formId="updateAvatar" title="Обновить аватар" name="updateAvatar" text="Сохранить" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <input
        name="avatar"
        value={avatar} // значение поля из стейта
        onChange={handleAvatarChange} // Срабатывает каждый раз, когда в поле ввода вносятся изменения
        id="linkAvatar"
        className="popup__form-input popup__form-input_field_avatar"
        placeholder="Ссылка на картинку"
        type="url"
        minLength="2"
        maxLength="200"
        required />
      <span id="linkAvatar-error" className="popup__form-input-error"></span>
    </PopupWithForm>
  )
}