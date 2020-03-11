import './ImageViewer.css';
import { useSnackbar } from 'notistack';
import request from '../helpers';
import React, { useState, useRef, forwardRef } from 'react';

const ImageViewer = forwardRef(
  ({ noteData, updateLocal, fetchData, resetViewImageData }, ref) => {
    let { image, startIndex } = noteData;
    const viewerPreview = useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [imageIndex, setImageIndex] = useState({ value: startIndex });
    const [currImage, setCurrImage] = useState({
      value: image[startIndex].url
    });

    const handleViewControlLeft = ({ target }) => {
      if (imageIndex.value > 0) {
        setImageIndex(imageIndex => {
          return { value: imageIndex.value - 1 };
        });
        setCurrImage({ value: image[imageIndex.value - 1].url });
      } else if (imageIndex.value === 0) {
        setImageIndex({ value: image.length - 1 });
        setCurrImage({ value: image[image.length - 1].url });
      }
    };

    const handleViewControlRight = ({ target }) => {
      if (imageIndex.value < image.length - 1) {
        setImageIndex(imageIndex => {
          return { value: imageIndex.value + 1 };
        });
        setCurrImage({ value: image[imageIndex.value + 1].url });
      } else {
        setImageIndex({ value: 0 });
        setCurrImage({ value: image[0].url });
      }
    };
    const closeImageViewer = () => {
      ref.current.classList.toggle('hide');
    };
    const deleteImage = async () => {
      if (image.length > 1) {
        setCurrImage({ value: image[0].url });
      }
      if (image.length === 1) {
        ref.current.classList.toggle('hide');
        resetViewImageData();
      }

      //Delete image form cloudnary using my api as admin
      await request('delete', 'api/image', {public_id: image[imageIndex.value].id});

      startIndex = 0;
      setImageIndex({ value: 0 });
      image.splice(imageIndex.value, 1);


      const payload = {
        ...noteData,
        image
      };

      //Delete image form DB and update ui
      updateLocal(noteData.noteId, payload);
      await request('put', `api/note/${noteData.noteId}`, payload);
      fetchData();
      enqueueSnackbar('Image deleted');
    };
    // style={{ backgroundImage: `url(${currImage.value?currImage.value:image[startIndex]})` }}

    return (
      <div className='viewer hide' ref={ref}>
        <div className='viewer__container'>
          <div className='viewer__control'>
            <div
              data-img
              data-imgname='left_arrow_white'
              onClick={closeImageViewer}
            />
            <div data-img data-imgname='trash_white' onClick={deleteImage} />
          </div>
          <div className='viewer__preview' ref={viewerPreview}>
            <div className='viewer__navigation viewer__navigation--left'>
              <div
                data-img
                data-imgname='caret_left'
                onClick={handleViewControlLeft}
              />
            </div>
            <img
              src={currImage.value ? currImage.value : image[startIndex]}
              alt=''
            />
            <div className='viewer__navigation viewer__navigation--right'>
              <div
                data-img
                data-imgname='caret_right'
                onClick={handleViewControlRight}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ImageViewer;
