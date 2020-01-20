import React from 'react';

const LabelModal = () => {
  return (
    <div
      ref={createLabelOverlay}
      onClick={handleLabelModalOpenCLose}
      className='label__modal__wrapper hide'
    >
      <div
        className='label__modal '
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div className='body'>
          <div className='label__modal__head'>Note label</div>
          <div className='label__modal__search'>
            <input
              type='text'
              value={labelSearchbox}
              placeholder='Enter label name'
              onChange={handleLabelSearchboxChange}
              className='label__modal__search__input'
            />
            <div
              data-img
              data-imgname='search'
              className='label__modal__search__icon'
            />
          </div>
          <div className='label__modal__labels'>
            <ul>{labelModalListItems}</ul>
          </div>
        </div>

        <div
          ref={createNewLabel}
          onClick={handleCreateNewLabel}
          className='label__modal__createlabel hide'
        >
          <div
            data-img
            data-imgname='plus'
            className='label__modal__createlabel__icon'
          />
          <span>Create &nbsp;</span>
          <span className='label__modal__createlabel__text'>
            "{labelSearchbox}"
          </span>
        </div>
      </div>
    </div>
  );
};

export default LabelModal;
