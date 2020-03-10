import './ImageViewer.css';
import { useSnackbar } from 'notistack';
import React, { useState, useRef } from 'react';

const ImageViewer = ({ imagess }) => {
  const images = [
    '/image/product1.jpg',
    '/image/product2.jpg',
    '/image/product3.jpg',
    '/image/product4.jpg',
    '/image/product5.jpg',
    '/image/note_image.jpg',
    '/image/product6.jpg'
  ];
  const [currImage, setCurrImage] = useState({ value: images[3] });
  const [imageIndex, setImageIndex] = useState({ value: 3 });
  const viewerPreview = useRef(null);
  const ImageViewer = useRef(null);
  const { enqueueSnackbar } = useSnackbar();


  const handleViewControlLeft = ({ target }) => {
    if (imageIndex.value > 0) {
      setImageIndex(imageIndex => {
        return { value: imageIndex.value - 1 };
      });
      setCurrImage({ value: images[imageIndex.value - 1] });
    } else if (imageIndex.value === 0) {
      setImageIndex({ value: images.length - 1 });
      setCurrImage({ value: images[images.length - 1] });
    }
  };

  const handleViewControlRight = ({ target }) => {
    if (imageIndex.value < images.length - 1) {
      setImageIndex(imageIndex => {
        return { value: imageIndex.value + 1 };
      });
      setCurrImage({ value: images[imageIndex.value + 1] });
    } else {
      setImageIndex({ value: 0 });
      setCurrImage({ value: images[0] });
    }
  };
  const closeImageViewer = () => {
    ImageViewer.current.classList.toggle('hide')
  }
  const deleteImage = () => {
    enqueueSnackbar('Image deleted');

  }
  //   style={{ backgroundImage: `url("/image/note_image.jpg")` }}
  return (
    <div className='viewer' ref={ImageViewer}>
      <div className='viewer__container'>
        <div className='viewer__control'>
          <div data-img data-imgname='left_arrow_white' onClick={closeImageViewer}/>
          <div data-img data-imgname='trash_white' onClick={deleteImage}/>
        </div>
        <div
          className='viewer__preview'
          ref={viewerPreview}
          style={{ backgroundImage: `url(${currImage.value})` }}
        >
          <div className='viewer__navigation'>
            <div
              data-img
              data-imgname='caret_left'
              onClick={handleViewControlLeft}
            />
          </div>
          <div className='viewer__navigation'>
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
};

export default ImageViewer;
