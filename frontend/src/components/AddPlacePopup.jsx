// Попап добавления карточки
import React from "react";
import { PopupWithForm } from "./PopupWithForm"

export const AddPlacePopup = ({ onAddPlace, isOpen, onClose }) => { // Передаётся текущее значение свойств isOpen и onClose
  const [name, setName] = React.useState(''); // Состояние имени
  const [link, setLink] = React.useState(''); // Состояние ссылки

  React.useEffect(() => { // ресет - при изменении состояния попапа поля формы чистятся
    setName('');
    setLink('');
  }, [isOpen]);
  
  const handleSubmit = (evt) => {
    evt.preventDefault(); // Запрещаем браузеру переходить по адресу формы
    onAddPlace({ name, link }); // Передаём значения управляемых компонентов во внешний обработчик
  }
  function handleNameChange(e) { // Следим за изменениями в поле name и подставляем в стейт
    setName(e.target.value);
  }
  function handleLinkChange(e) { // Следим за изменениями в поле link и подставляем в стейт
    setLink(e.target.value);
  }
  
  return( // В строке ниже передаём значения пропсов попапа в общую структуру/компонент попапа PopupWithForm
    <PopupWithForm id="addCard" formId="creationForm" title="Новое место" name="creationForm" text="Создать" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
        <input 
          name="name"
          id="name-card"
          value={name} // значение стейта
          onChange={handleNameChange} // Функция срабатывает каждый раз, когда в поле ввода вносятся изменения
          className="popup__form-input popup__form-input_field_nameCard"
          type="text"
          placeholder="Название"
          minLength="2"
          maxLength="30"
          required/>
        <span id="name-card-error" className="popup__form-input-error"></span>
        <input
          name="link"
          id="link"
          value={link} // значение стейта
          onChange={handleLinkChange} // Функция срабатывает каждый раз, когда в поле ввода вносятся изменения
          className="popup__form-input popup__form-input_field_srcImg"
          placeholder="Ссылка на картинку"
          type="url"
          required/>
        <span id="link-error" className="popup__form-input-error"></span>
    </PopupWithForm>
  )
}

// Можно лучше
// Можно сделать универсальный кастомный хук для контроля любого количества инпутов в любых формах:
// export function useForm(inputValues={}) {
//   const [values, setValues] = useState(inputValues);
//   const handleChange = (event) => {
//     const {value, name} = event.target;
//     setValues({...values, [name]: value});
//   };
//   return {values, handleChange, setValues};
// }
// Этот код помещают в отдельный файл useForm.js в папке hooks и импортируют функцию туда, где нужно контролировать инпуты
// И Вам не нужно будет теперь вручную создавать функции обработки инпутов и т д. Все будет в одной строчке кода:
//   const {values, handleChange, setValues} = useForm({});