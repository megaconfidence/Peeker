import React from 'react';
import Notes from './Notes';

const Label = ({
  data,
  match,
  addLocal,
  fetchData,
  allLabels,
  updateLocal,
  deleteLocal,
  checkIfLoggedIn

}) => {
  const {
    params: { labelId }
  } = match;
  const fData = data.filter(d => (d.label.includes(labelId) ? d : undefined));
  return (
    <Notes
      data={fData}
      noteType='note'
      withNewNote={true}
      addLocal={addLocal}
      fetchData={fetchData}
      allLabels={allLabels}
      updateLocal={updateLocal}
      deleteLocal={deleteLocal}
      labelForNewNote={[labelId]}
      checkIfLoggedIn={checkIfLoggedIn}

    />
  );
};

export default Label;
