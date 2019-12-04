import React from 'react';
import NewNote from '../components/NewNote';
import Note from '../components/Note';

const Label = ({ match, location, data, toDayObj }) => {
  //   console.log(match, location);
  const {
    params: { labelId }
  } = match;


  return (
    <div>
      <NewNote />
      {data.map((d, k) =>
        d.label === labelId ? (
          <Note
            title={d.title}
            content={d.content}
            key={k}
            editedDay={d.editedDay}
            toDayObj={toDayObj}
          />
        ) : (
          undefined
        )
      )}
    </div>
  );
};

export default Label;
