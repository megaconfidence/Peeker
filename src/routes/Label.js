import React from 'react';
import Notes from './Notes';

const Label = ({
  match,
  location,
  data,
  fetchData,
  allLabels,
  updateLocal,
  addLocal,
  deleteLocal
}) => {
  const {
    params: { labelId }
  } = match;
  const fData = data.filter(d => (d.label.includes(labelId) ? d : undefined));
  return (
    <Notes
      data={fData}
      fetchData={fetchData}
      labelForNewNote={[labelId]}
      allLabels={allLabels}
      updateLocal={updateLocal}
      deleteLocal={deleteLocal}
      addLocal={addLocal}
    />
  );
};

export default Label;
