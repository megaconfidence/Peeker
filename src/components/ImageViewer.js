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
    const { image, startIndex } = noteData;
    const viewerPreview = useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [imageIndex, setImageIndex] = useState({ value: startIndex });

    const updateImageIndex = useCallback(() => {
      setImageIndex({ value: startIndex });
    }, [startIndex]);
    useEffect(() => {
      updateImageIndex();
    }, [updateImageIndex]);

    const closeImageViewer = () => {
      setImageIndex({ value: 0 });
      ref.current.classList.toggle('hide');
      resetViewImageData();
    };

    const handleViewControlLeft = () => {
      if (imageIndex.value > 0) {
        const i = imageIndex.value - 1;
        setImageIndex({ value: i });
      } else {
        const i = image.length - 1;
        setImageIndex({ value: i });
      }
    };

    const handleViewControlRight = () => {
      if (imageIndex.value < image.length - 1) {
        const i = imageIndex.value + 1;
        setImageIndex({ value: i });
      } else {
        setImageIndex({ value: 0 });
      }
    };

    const deleteImage = async ({ target }) => {
      target.style.opacity = '0.5';
      target.style.pointerEvents = 'none';

      //If there is only one image in the array close the modal before deleting
      if (image.length === 1) {
        closeImageViewer();
        resetViewImageData();
      }

      //Delete image form cache and cloudnary using my api as admin
      caches.open('PEEKER_CACHE').then(function(cache) {
        cache.delete(image[imageIndex.value].url).then(res => {});
      });
      if (!navigator.onLine) {
        const deleteImage =
          JSON.parse(localStorage.getItem('PEEKER_DELETE_IMAGE')) || [];
        deleteImage.push(image[imageIndex.value].id);
        localStorage.setItem(
          'PEEKER_DELETE_IMAGE',
          JSON.stringify(deleteImage)
        );
      } else {
        await request('delete', 'api/image', {
          public_id: image[imageIndex.value].id
        });
      }

      //Don't change the order!
      image.splice(imageIndex.value, 1);
      if (image.length > 1 && imageIndex.value !== 0) {
        const prevIndex = imageIndex.value - 1;
        if (prevIndex < image.length) {
          setImageIndex({ value: prevIndex });
        }
      } else {
        setImageIndex({ value: 0 });
      }

      if (noteData.noteType !== 'newnote') {
        const payload = {
          ...noteData,
          image
        };

        //Delete image form DB and update ui
        updateLocal(noteData.noteId, payload);
        await request('put', `api/note/${noteData.noteId}`, payload);
      }
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
            <div
              className='viewer__navigation viewer__navigation--left'
              style={{ opacity: image.length === 1 ? '0.5' : '1' }}
            >
              <div
                data-img
                data-imgname='caret_left'
                onClick={handleViewControlLeft}
              />
            </div>
            <img src={image[imageIndex.value].url} alt='' />
            <div
              className='viewer__navigation viewer__navigation--right'
              style={{ opacity: image.length === 1 ? '0.5' : '1' }}
            >
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
