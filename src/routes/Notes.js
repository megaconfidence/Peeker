import React from 'react';
import NewNote from '../components/NewNote';
import Note from '../components/Note';

const Notes = ({ data }) => {
  console.log(data);
  return (
    <div>
      <NewNote />
      {data.map((d, k) => (
        <Note title={d.title} content={d.content} key={k} />
      ))}
    </div>
  );
};
export default Notes;
