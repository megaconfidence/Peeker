import React, { useState } from 'react';
import NewNote from '../components/NewNote';
import Note from '../components/Note';

const Label = ({ match, location, data, toDayObj }) => {
  //   console.log(match, location);
  const {
    params: { labelId }
  } = match;
  const fData = data.filter(d => (d.label === labelId ? d : undefined));

  const pinned = fData.filter(d => (d.pinned ? d : undefined));
  const others = fData.filter(d => (!d.pinned ? d : undefined));

  console.log(labelId, pinned, others);

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
          {isPinned ? 'PINNED' : 'OTHERS'}
        </div>
        <div className={`${fill}__content`}>
          {noteArr.map((d, k) => (
            <Note
              pinned={isPinned}
              title={d.title}
              content={d.content}
              key={`${k}-${d.title}`}
              editedDay={d.editedDay}
              toDayObj={toDayObj}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <NewNote />
      {pinned.length ? buildNotes(pinned, true) : undefined}
      {others.length ? buildNotes(others, false) : undefined}
    </div>
  );
};

export default Label;
