import React from 'react';
import Note from '../components/Note';
import NewNote from '../components/NewNote';

const Notes = ({
  data,
  addLocal,
  noteType,
  fetchData,
  allLabels,
  withNewNote,
  deleteLocal,
  updateLocal,
  labelForNewNote,
  isSearch,
  searchText,
}) => {
  data = data.filter(d => (d.status === noteType ? d : undefined));
  const pinned = data.filter(d => (d.pinned ? d : undefined));
  const others = data.filter(d => (!d.pinned ? d : undefined));


  const sectionStyle = {
    fontWeight: 500,
    color: '#5f6368',
    margin: '21px 8px',
    fontSize: '0.725rem',
    letterSpacing: '0.07272727em'
  };

  const buildNotes = (noteArr, isPinned) => {
    const fill = isPinned ? 'pinned' : 'others';
    return (
      <div className={`${fill}`}>
        {noteType !== 'trash' ? (
          <div className={`${fill}__header`} style={sectionStyle}>
            {isPinned ? 'PINNED' : pinned.length ? 'OTHERS' : undefined}
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
                noteLabels={d.label}
                fetchData={fetchData}
                allLabels={allLabels}
                updatedAt={d.updatedAt}
                searchText={searchText}
                key={`${k}-${d.title}`}
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
    </div>
  );
};
export default Notes;
