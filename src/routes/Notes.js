import React from 'react';
import Note from '../components/Note';
import NewNote from '../components/NewNote';

const Notes = ({
  data,
  addLocal,
  noteType,
  isSearch,
  fetchData,
  allLabels,
  searchText,
  deleteLocal,
  withNewNote,
  updateLocal,
  labelForNewNote,
  checkIfLoggedIn
}) => {
  checkIfLoggedIn();
  let note = [],
    trash = [],
    pinned = [],
    others = [],
    archive = [];

  if (isSearch) {
    note = data.filter(d => (d.status === 'note' ? d : undefined));
    archive = data.filter(d => (d.status === 'archive' ? d : undefined));
    trash = data.filter(d => (d.status === 'trash' ? d : undefined));
  } else if (noteType === 'due') {
    data = data.filter(d => (d.due ? d : undefined));
    pinned = data.filter(d => (d.pinned ? d : undefined));
    others = data.filter(d => (!d.pinned ? d : undefined));
  } else {
    data = data.filter(d => (d.status === noteType ? d : undefined));
    pinned = data.filter(d => (d.pinned ? d : undefined));
    others = data.filter(d => (!d.pinned ? d : undefined));
  }

  const sectionStyle = {
    fontWeight: 500,
    color: '#5f6368',
    margin: '21px 8px',
    fontSize: '0.725rem',
    textTransform: 'uppercase',
    letterSpacing: '0.07272727em'
  };

  const buildNotes = (noteArr, isPinned, status) => {
    const fill = isPinned ? 'pinned' : 'others';
    return (
      <div className={`${fill}`}>
        {status ? (
          <div className={`${fill}__header`} style={sectionStyle}>
            {status}
          </div>
        ) : noteType !== 'trash' ? (
          <div className={`${fill}__header`} style={sectionStyle}>
            {isPinned ? 'pinned' : pinned.length ? 'others' : undefined}
          </div>
        ) : (
          undefined
        )}

        <div className={`${fill}__content`}>
          {noteArr.map((d, k) => {
            // Quit if note is empty
            if (!d._id) return '';
            return (
              <Note
                id={d._id}
                title={d.title}
                pinned={isPinned}
                status={d.status}
                content={d.content}
                isSearch={isSearch}
                oldNoteLabel={d.label}
                fetchData={fetchData}
                due={d.due}
                allLabels={allLabels}
                updatedAt={d.updatedAt}
                searchText={searchText}
                key={`${k}-${d._id}`}
                deleteLocal={deleteLocal}
                updateLocal={updateLocal}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      {withNewNote ? (
        <NewNote
          addLocal={addLocal}
          allLabels={allLabels}
          fetchData={fetchData}
          labelForNewNote={labelForNewNote}
        />
      ) : (
        undefined
      )}

      {pinned.length ? buildNotes(pinned, true) : undefined}
      {others.length ? buildNotes(others, false) : undefined}
      {note.length ? buildNotes(note, false, 'notes') : undefined}
      {archive.length ? buildNotes(archive, false, 'archive') : undefined}
      {trash.length ? buildNotes(trash, false, 'trash') : undefined}
    </div>
  );
};
export default Notes;
