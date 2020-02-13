import "./Notes.css";
import "./NewNote.css";
import moment from "moment";
import request from "../helpers";
import ObjectID from "bson-objectid";
import DatePicker from "./DatePicker";
import LabelModal from "./LabelModal";
import PalateModal from "./PalateModal";
import { useSnackbar } from "notistack";
import colorLog from "../helpers/colorLog";
import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";

const NewNote = ({ addLocal, allLabels, labelForNewNote }) => {
  const noteRef = useRef(null);
  const dpwrapper = useRef(null);
  const titleTextRef = useRef(null);
  const palateModalRef = useRef(null);
  const contentTextRef = useRef(null);
  const createLabelOverlay = useRef(null);

  const { enqueueSnackbar } = useSnackbar();

  const [noteLabel, setNoteLabel] = useState({
    data: []
  });
  const [labelState, setLabelState] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [titleText, setTitleText] = useState({ value: "" });
  const [pinState, setPinState] = useState({ value: false });
  const [contentText, setContentText] = useState({ value: "" });
  const [allowNotifSBKey, setAllowNotifSBKey] = useState(null);
  const [noteColor, setNoteColor] = useState({ value: "#fff" });

  // holds all labels from db
  // Holds only labels for this individual note

  const openNote = () => {
    noteRef.current.classList.remove("nwnote--closed");
  };

  const uploadChanges = async () => {
    noteRef.current.classList.add("nwnote--closed");

    const noteTitle = titleText.value;
    const noteContent = contentText.value;
    const labels = labelForNewNote.concat(noteLabel.data);

    // Reset the fields
    setNoteLabel({
      data: []
    });
    setReminderDate("");
    setTitleText({ value: "" });
    setContentText({ value: "" });
    setPinState({ value: false });
    setNoteColor({ value: "#fff" });
    contentTextRef.current.textContent = "";
    titleTextRef.current.textContent = "";
    titleTextRef.current.style.height = "45px";
    contentTextRef.current.style.height = "45px";

    if (noteTitle || noteContent || labels.length) {
      const subscription =
        JSON.parse(localStorage.getItem("PEEKER_SUBSCRIPTION")) || "";
      const payload = {
        subscription,
        label: labels,
        status: "note",
        pinned: pinState.value,
        color: noteColor.value,
        title: noteTitle || "",
        due: reminderDate || "",
        content: noteContent || "",
        clientNow: moment().format()
      };

      let date = new Date();
      date = date.toISOString();

      // Creates a local copy of payload to update app state
      const fakePayload = {
        ...payload,
        updatedAt: date,
        _id: ObjectID.generate()
      };

      colorLog("Saving note", "success");

      // Updates state with local payload
      addLocal(fakePayload);
      await request("post", "api/note", payload);
    }
  };

  const handleTitleInput = ({ target: { value } }) => {
    if (value.length < 70) {
      setTitleText({ value });
    } else {
      setTitleText({ value: value.substring(0, 70) });
    }
  };

  const handleContentInput = ({ target: { value } }) => {
    setContentText({ value });
  };

  const pinNote = () => {
    setPinState(() => ({ value: !pinState.value }));
  };

  const updateNoteLabelAndStatus = (data, bool) => {
    setNoteLabel({ data });
  };

  const handleDeleteLabelClick = ({ target }) => {
    const { data } = noteLabel;
    const value = target.getAttribute("data-value");

    const i = data.findIndex(d => d === value);
    data.splice(i, 1);
    setNoteLabel({
      data
    });
  };

  const labelModalOpenCLose = () => {
    const labelOverlay = createLabelOverlay.current;
    labelOverlay.classList.toggle("hide");
    if (!labelOverlay.classList.contains("hide")) {
      const labelSearchbox = labelOverlay.querySelector("input");
      labelSearchbox.focus();
      clearLabelState();
    }
  };

  const clearLabelState = () => {
    setLabelState(true);
    setTimeout(() => {
      setLabelState(false);
    }, 1000);
  };

  const handleReminderDate = value => {
    const newDate = moment(value).format();
    setReminderDate(newDate);
  };

  const handleDeleteReminder = e => {
    e.stopPropagation();
    setReminderDate("");
  };

  const handleAlarmiconClick = () => {
    dpwrapper.current.classList.toggle("hide");
    if (
      !dpwrapper.current.classList.contains("hide") &&
      !localStorage.getItem("PEEKER_NOTIFICATION_ISPERMITTED")
    ) {
      const snackbarKey = enqueueSnackbar(
        "Please allow notifications to use this feature",
        {
          persist: true
        }
      );
      setAllowNotifSBKey(snackbarKey);
    }
  };
  const changeBackgroundColor = color => {
    setNoteColor({ value: color });
  };

  const handlePalateClick = () => {
    if (!palateModalRef.current.classList.contains("open")) {
      setTimeout(() => {
        palateModalRef.current.focus();
      }, 100);
    }
    palateModalRef.current.classList.toggle("open");
  };

  return (
    <div
      className="note nwnote nwnote--closed"
      ref={noteRef}
      style={{
        background: noteColor.value
      }}
    >
      <div className="note__head">
        <ContentEditable
          placeholder="Title"
          spellCheck="false"
          html={titleText.value}
          innerRef={titleTextRef}
          onChange={handleTitleInput}
          className="note__head__titletext textarea--mod"
        />
        <div
          data-img
          onClick={pinNote}
          className="note__head__pin"
          data-imgname={`pin${pinState.value ? "_fill" : ""}`}
        />
      </div>
      <div className="note__body">
        <div className="note__body__content">
          <ContentEditable
            spellCheck="false"
            onFocus={openNote}
            html={contentText.value}
            innerRef={contentTextRef}
            placeholder="Take a note..."
            onChange={handleContentInput}
            className="note__body__content__textarea textarea--mod"
          />
          <div className="note__body__content__label">
            {reminderDate ? (
              <div
                className="note__body__content__label__tag note__body__content__label__tag--reminder"
                onClick={handleAlarmiconClick}
              >
                <div data-img data-imgname="alarm" />
                <span className="text">
                  {moment(reminderDate).format("MMMM Do YYYY, h:mm a")}
                </span>
                <div
                  data-img
                  data-imgname="close"
                  onClick={handleDeleteReminder}
                />
              </div>
            ) : (
              undefined
            )}
            {noteLabel.data.map((d, i) =>
              d ? (
                <div key={i} className="note__body__content__label__tag">
                  <span className="text">{d}</span>
                  <div
                    data-img
                    data-value={d}
                    data-imgname="close"
                    onClick={handleDeleteLabelClick}
                  />
                </div>
              ) : (
                undefined
              )
            )}
          </div>
        </div>
        <div className="note__body__controls">
          <div className="note__body__controls__item">
            <div
              data-img
              data-imgname="alarm"
              className="note__body__controls__item__image"
              onClick={handleAlarmiconClick}
            />
            <div className="note__body__controls__item__withmodal">
              <div
                data-img
                data-imgname="badge"
                onClick={labelModalOpenCLose}
                className="note__body__controls__item__image"
              />

              <LabelModal
                oldNoteLabel={[]}
                allLabels={allLabels}
                fromNewNote={labelState}
                ref={createLabelOverlay}
                labelModalOpenCLose={labelModalOpenCLose}
                updateNoteLabelAndStatus={updateNoteLabelAndStatus}
              />
            </div>
            <div
              data-img
              data-imgname="add_contact"
              className="note__body__controls__item__image disabled"
            />
            <div className="note__body__controls__item__withmodal">
              <div
                data-img
                data-imgname="palate"
                onClick={handlePalateClick}
                className="note__body__controls__item__image"
              />
              <PalateModal
                ref={palateModalRef}
                changeBackgroundColor={changeBackgroundColor}
              />
            </div>
            <div
              data-img
              data-imgname="picture"
              className="note__body__controls__item__image disabled"
            />
            <div
              data-img
              data-imgname="archive"
              className="note__body__controls__item__image disabled"
            />
            <div
              data-img
              data-imgname="undo"
              className="note__body__controls__item__image disabled"
            />
            <div
              data-img
              data-imgname="redo"
              className="note__body__controls__item__image disabled"
            />
          </div>
        </div>
        <DatePicker
          ref={dpwrapper}
          value={handleReminderDate}
          allowNotifSBKey={allowNotifSBKey}
        />
      </div>
      <div className="note__footer">
        <button className="note__footer__closebtn" onClick={uploadChanges}>
          Save
        </button>
      </div>
    </div>
  );
};

export default NewNote;
