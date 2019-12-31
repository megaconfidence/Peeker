import React from 'react';
import Notes from './Notes';

const Label = ({ match, location, data, fetchData }) => {
  const {
    params: { labelId }
  } = match;
  const fData = data.filter(d => (d.label === labelId ? d : undefined));
  console.log(fData)
  return <Notes data={fData} fetchData={fetchData} labelForNewNote={labelId} />
};

export default Label;
