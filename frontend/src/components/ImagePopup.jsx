// Попап открытия карточки
export function ImagePopup({ card, onClose }) { // затем из пропса card берутся данные и подставляются в нужные поля
  return ( // В строке ниже условие | Object.keys(card).length !== 0 ? "popup_opened" : "" | если значение card не пустое, открываем попап, иначе - оставляем закрытым
    <div id="openCard" name="openCardForm" className={`popup ${Object.keys(card).length !== 0 ? "popup_opened" : ""}`} onClick={onClose}> {/* onClick={props.onClose} - производит закрытие попапа по клику на оверлей */}
      <div className="popup__image-desription" onClick={(e) => e.stopPropagation()} > {/* .stopPropagation() - препятствует продвижению события дальше и позволяет избежать закрытия при клике на его содержимое */}
        <img className="popup__image-card" src={card.link} alt={card.name} />
        <p className="popup__image-subtitle">{card.name}</p>
        <button className="popup__button popup__button_action_close" type="button" onClick={onClose} aria-label="Закрыть"></button>
      </div>
    </div>
  )
}

// Можно создать кастомный хук для правильного навешивания и удаления обработчиков Escape и оверлея:
// import { useEffect } from "react";
// // кастомные хуки всегда должны начинаться с глагола `use`, чтобы реакт понял, что это хук. Он следит за их вызовами
// export function usePopupClose(isOpen, closePopup) {
//   useEffect(() => {
//     if (!isOpen) return; // останавливаем действие эффекта, если попап закрыт
//     const handleOverlay = (event) => {
//       // если есть `popup_opened` в классах блока, значит, кликнули на оверлей
//       if (event.target.classList.contains("popup_opened")) {
//         closePopup();
//       }
//     };
//     const handleEscape = (e) => {
//       if (e.key === "Escape") {
//         closePopup();
//       }
//     };
//     document.addEventListener("keydown", handleEscape);
//     document.addEventListener("mousedown", handleOverlay);
//     //  обязательно удаляем обработчики в `clean-up`- функции
//     return () => {
//       document.removeEventListener("keydown", handleEscape);
//       document.removeEventListener("mousedown", handleOverlay);
//     };
//     // обязательно следим за `isOpen`, чтобы срабатывало только при открытии, а не при любой перерисовке компонента
//   }, [isOpen, closePopup]);
// }

// Этот код помещают в отдельный файл usePopupClose.js в папке hooks и импортируют хук туда, где нужно.
// И теперь можно использовать в любом компоненте (попапе), которому нужно установить эти обработчики. 
// Будет всего лишь одна строчка кода в компоненте PopupWithForm или ImagePopup (InfoTooltip)
// usePopupClose(isOpen, onClose).
// Если в ImagePopup не передаете isOpen, то определять открытость можно будет по card?.link
// usePopupClose(card?.link, onClose)