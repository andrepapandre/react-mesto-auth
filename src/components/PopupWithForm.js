import React from "react";

function PopupWithForm(props) {
  return (
    <>
      <div className={`popup ${props.isOpen ? "popup_opened" : ""}`}>
        <section className="popup__container">
          <form
            id="popupFormEdit"
            name={`popupForm${props.name}`}
            method="post"
            className="popup__form popup__form-edit"
            onSubmit={props.onSubmit}
          >
            <h2 className="popup__title">{props.title}</h2>
            {props.children}

            <button
              type="button"
              onClick={props.onClose}
              className="popup__close-button"
            />
            <button
              className="popup__submit popupSet"
              id="avatarSubmit"
              type="submit"
            >
              <span className="popup__save">{props.buttonText}</span>
            </button>
          </form>
        </section>
      </div>
    </>
  );
}

export default PopupWithForm;
