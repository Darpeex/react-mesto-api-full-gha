// Попап результата регистрации
import successfully from "../images/successfully.svg"
import unsuccessfully from "../images/unsuccessfully.svg"

export const InfoTooltip = ({ isOpen, onClose, result, error }) => {
// Проверка целевого элемента. Если целевой элемент события является самим оверлеем попапа (event.target === event.currentTarget), то вызывается функция props.onClose, закрывающая попап.
  function handleOverlayMouseDown(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return ( // Условие попапа | isOpen ? "popup_opened" : "" | значит - если isOpen = true, попапу добавляется класс popup_opened (он открывается), иначе ничего не добавляем
    <div id="InfoTooltip" className={`popup ${isOpen ? "popup_opened" : ""}`} onMouseDown={handleOverlayMouseDown}> {/* Производит закрытие попапа по клику на оверлей */}
      <div className={"popup__container popup__container_info-tooltip"} onClick={(e) => e.stopPropagation()} > {/* .stopPropagation() - препятствует продвижению события дальше и позволяет избежать закрытия при клике на его содержимое */}
        <img src={result ? successfully : unsuccessfully} alt="result" />
        <h2 className="popup__title">{result ? "Вы успешно зарегистрировались!" : `${error}`}</h2>
        <button className="popup__button popup__button_action_close" type="button" onClick={onClose} aria-label="Закрыть"></button>
      </div>
    </div>
  )
}