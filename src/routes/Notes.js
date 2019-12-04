import React from 'react';
import NewNote from '../components/NewNote';
import Note from '../components/Note';

const Notes = ({ data, toDayObj }) => {

  return (
    <div>
      <NewNote />
      {data.map((d, k) => (
         <Note title={d.title} content={d.content} key={k} editedDay={d.editedDay} toDayObj={toDayObj}/>
      ))}
    </div>
  );
};
export default Notes;
