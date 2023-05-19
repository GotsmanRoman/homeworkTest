import React from 'react';
import './Button';

const Button = ({ onLoadFoto }) => {
  return (
    <button type="button" className="Button" onClick={onLoadFoto}>
      Load more
    </button>
  );
};

export default Button;
