import React from 'react';
import Note from '../components/Note';
const Notes = ({ data, fetchData, updateLocal, deleteLocal, allLabels }) => {
  data = data.filter(d => (d.status === 'archive' ? d : undefined));
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
        <div className={`${fill}__header`} style={sectionStyle}>
          {isPinned ? 'PINNED' : pinned.length ? 'OTHERS' : undefined}
        </div>
        <div className={`${fill}__content`}>
          {noteArr.map((d, k) => {
            // Quit if note is empty
            if (!d._id) return '';
            return (
              <Note
                id={d._id}
                pinned={isPinned}
                title={d.title}
                content={d.content}
                key={`${k}-${d.title}`}
                updatedAt={d.updatedAt}
                fetchData={fetchData}
                updateLocal={updateLocal}
                deleteLocal={deleteLocal}
                allLabels={allLabels}
                noteLabels={d.label}
                status={d.status}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      {pinned.length ? buildNotes(pinned, true) : undefined}
      {others.length ? buildNotes(others, false) : undefined}
    </div>
  );
};
export default Notes;
