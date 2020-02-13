import React, { forwardRef } from "react";
import "./PalateModal.css";

const PalateModal = forwardRef(
  ({ changeBackgroundColor, currentColor }, ref) => {
    const handleColorPick = ({ target }) => {
      changeBackgroundColor(target.value);
    };
    return (
      <div
        ref={ref}
        tabIndex="0"
        className="palate"
        onFocus={({ target }) => {
          target.childNodes.forEach(child => {
            if (child.value === currentColor) {
              child.checked = true;
            }
          });
        }}
        onBlur={() => {
          ref.current.classList.remove("open");
        }}
      >
        <input
          type="radio"
          name="color"
          value="#fff"
          className="palate__colorpreview white"
          style={{ background: "#fff" }}
          onClick={handleColorPick}
          onBlur={() => {
            ref.current.classList.remove("open");
          }}
        />
        <input
          type="radio"
          name="color"
          value="#f28b82"
          className="palate__colorpreview"
          style={{ background: "#f28b82" }}
          onClick={handleColorPick}
          onBlur={() => {
            ref.current.classList.remove("open");
          }}
        />
        <input
          type="radio"
          name="color"
          value="#fbbc0b"
          className="palate__colorpreview"
          style={{ background: "#fbbc0b" }}
          onClick={handleColorPick}
          onBlur={() => {
            ref.current.classList.remove("open");
          }}
        />
        <input
          type="radio"
          name="color"
          value="#fff475"
          className="palate__colorpreview"
          style={{ background: "#fff475" }}
          onClick={handleColorPick}
          onBlur={() => {
            ref.current.classList.remove("open");
          }}
        />
        <input
          type="radio"
          name="color"
          value="#ccfe90"
          className="palate__colorpreview"
          style={{ background: "#ccfe90" }}
          onClick={handleColorPick}
          onBlur={() => {
            ref.current.classList.remove("open");
          }}
        />
        <input
          type="radio"
          name="color"
          value="#a7feeb"
          className="palate__colorpreview"
          style={{ background: "#a7feeb" }}
          onClick={handleColorPick}
          onBlur={() => {
            ref.current.classList.remove("open");
          }}
        />
        <input
          type="radio"
          name="color"
          value="#cbf0f8"
          className="palate__colorpreview"
          style={{ background: "#cbf0f8" }}
          onClick={handleColorPick}
          onBlur={() => {
            ref.current.classList.remove("open");
          }}
        />
        <input
          type="radio"
          name="color"
          value="#aecbfa"
          className="palate__colorpreview"
          style={{ background: "#aecbfa" }}
          onClick={handleColorPick}
          onBlur={() => {
            ref.current.classList.remove("open");
          }}
        />
        <input
          type="radio"
          name="color"
          value="#d7aefb"
          className="palate__colorpreview"
          style={{ background: "#d7aefb" }}
          onClick={handleColorPick}
          onBlur={() => {
            ref.current.classList.remove("open");
          }}
        />
        <input
          type="radio"
          name="color"
          value="#fdcfe8"
          className="palate__colorpreview"
          style={{ background: "#fdcfe8" }}
          onClick={handleColorPick}
          onBlur={() => {
            ref.current.classList.remove("open");
          }}
        />
        <input
          type="radio"
          name="color"
          value="#e6c9a8"
          className="palate__colorpreview"
          style={{ background: "#e6c9a8" }}
          onClick={handleColorPick}
          onBlur={() => {
            ref.current.classList.remove("open");
          }}
        />
        <input
          type="radio"
          name="color"
          value="#e8eaed"
          className="palate__colorpreview"
          style={{ background: "#e8eaed" }}
          onClick={handleColorPick}
          onBlur={() => {
            ref.current.classList.remove("open");
          }}
        />
      </div>
    );
  }
);

export default PalateModal;
