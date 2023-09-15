// Попап подтверждения
import { PopupWithForm } from "./PopupWithForm"

export const ConfirmationPopup = ({ isOpen, onClose }) => { // Передаётся текущее значение свойств isOpen и onClose
  return ( // В строке ниже передаём значения пропсов попапа в общую структуру/компонент попапа PopupWithForm
    <PopupWithForm id="confirmationPopup" formId="confirmationPopup" title="Вы уверены?" name="confirmationPopup" text="Да" isOpen={isOpen} onClose={onClose} >
    </PopupWithForm>
  )
}