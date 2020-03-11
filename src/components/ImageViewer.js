import './ImageViewer.css';
import { useSnackbar } from 'notistack';
import request from '../helpers';
import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useCallback
} from 'react';

const ImageViewer = forwardRef(
  ({ noteData, fetchData, updateLocal, resetViewImageData }, ref) => {
    let { image, startIndex } = noteData;
    const viewerPreview = useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [imageIndex, setImageIndex] = useState({ value: startIndex });
    const [currImage, setCurrImage] = useState({
      value: image[imageIndex.value].url
    });

    const updateImageIndex = useCallback(() => {
      setImageIndex({ value: startIndex });
    }, [startIndex]);
    useEffect(() => {
      updateImageIndex();
    }, [updateImageIndex]);

    // console.log(startIndex, imageIndex.value, image.length);

    const closeImageViewer = () => {
      ref.current.classList.toggle('hide');
    };

    const handleViewControlLeft = () => {
      if (imageIndex.value > 0) {
        const i = imageIndex.value - 1;
        setImageIndex({ value: i });
        setCurrImage({ value: image[i].url });
      } else {
        const i = image.length - 1;
        setImageIndex({ value: i });
        setCurrImage({ value: image[i].url });
      }
    };

    const handleViewControlRight = () => {
      if (imageIndex.value < image.length - 1) {
        const i = imageIndex.value + 1;
        setImageIndex({ value: i });
        setCurrImage({ value: image[i].url });
      } else {
        setImageIndex({ value: 0 });
        setCurrImage({ value: image[0].url });
      }
    };

    const deleteImage = async ({ target }) => {
      target.style.opacity = '0.5';
      target.style.pointerEvents = 'none';

      if (image.length > 1) {
        const prevIndex = imageIndex.value - 1;
        if (prevIndex < image.length) {
          setCurrImage({ value: image[prevIndex].url });
        } else {
          setCurrImage({ value: image[0].url });
        }
      } else {
        ref.current.classList.toggle('hide');
        resetViewImageData();
      }

      //Delete image form cache and cloudnary using my api as admin
      caches.open('PEEKER_CACHE').then(function(cache) {
        cache.delete(image[imageIndex.value].url).then(res => {});
      });
      await request('delete', 'api/image', {
        public_id: image[imageIndex.value].id
      });

      //Don't change the order!
      image.splice(imageIndex.value, 1);
      if (image.length > 1) {
        const prevIndex = imageIndex.value - 1;
        if (prevIndex < image.length) {
          startIndex = prevIndex;
          setImageIndex({ value: prevIndex });
        }
      } else {
        startIndex = 0;
        setImageIndex({ value: 0 });
      }

      const payload = {
        ...noteData,
        image
      };

      //Delete image form DB and update ui
      updateLocal(noteData.noteId, payload);
      await request('put', `api/note/${noteData.noteId}`, payload);

      fetchData();
      enqueueSnackbar('Image deleted');

      target.style.opacity = '1';
      target.style.pointerEvents = 'unset';
    };

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
              src={currImage.value ? currImage.value : image[startIndex].url}
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
