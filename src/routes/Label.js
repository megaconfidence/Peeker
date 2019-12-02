import React from 'react';

const Label = ({ match, location }) => {
//   console.log(match, location);
  const {
    params: { labelId }
  } = match;
  return (
    <div>
      <h2>{labelId}</h2>
    </div>
  );
};

export default Label;
