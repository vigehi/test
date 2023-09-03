import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-bootstrap/Carousel';
import { BsCaretRight, BsCaretLeft } from 'react-icons/bs';
import DoctorCard from './DoctorCard';

const DoctorsCarousel = ({ items }) => {
  const carouselContainer = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselContainer.current) {
      return undefined;
    }
    const { element } = carouselContainer.current;
    const resizeObserver = new ResizeObserver(() => {
      setContainerWidth(element.clientWidth - 148);
    });
    resizeObserver.observe(element);
    return () => {
      resizeObserver.unobserve(element);
    };
  }, []);

  const c = Math.floor(containerWidth / 285);
  const cardsPerItem = c >= 1 ? c : 1;
  const numberOfItems = Math.ceil(items.length / cardsPerItem);

  useEffect(() => {
    if (currentSlide > numberOfItems - 1) {
      setCurrentSlide(0);
    }
  });

  const renderCarouselItems = (cardsInItems, itemsAmount) => {
    const carouselItems = [];
    let k = 0;
    for (let i = 0; i < itemsAmount; i += 1) {
      const cards = [];
      let j = 0;
      while (items[k] && j < cardsInItems) {
        cards.push((
          <DoctorCard
            key={items[k].id}
            name={items[k].name}
            avatarUrl={items[k].avatar}
            location={items[k].location}
            rates={items[k].rates}
            id={items[k].id}
          />
        ));
        j += 1;
        k += 1;
      }
      carouselItems.push((
        <Carousel.Item key={i}>
          {cards}
        </Carousel.Item>
      ));
    }

    return carouselItems;
  };

  return (
    <Carousel
      variant="dark"
      ref={carouselContainer}
      nextIcon={(
        <span className={`carousel-next-icon ${currentSlide === (numberOfItems - 1) ? 'disabled' : ''}`}>
          <BsCaretRight />
        </span>
      )}
      prevIcon={(
        <span className={`carousel-prev-icon ${currentSlide === 0 ? 'disabled' : ''}`}>
          <BsCaretLeft />
        </span>
      )}
      className="doctors-carousel"
      activeIndex={currentSlide}
      onSelect={(slide) => { setCurrentSlide(slide); }}
    >
      {renderCarouselItems(cardsPerItem, numberOfItems)}
    </Carousel>
  );
};

DoctorsCarousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    location: PropTypes.string,
    rates: PropTypes.number,
    bio: PropTypes.string,
    avatar: PropTypes.string,
    id: PropTypes.number,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  })).isRequired,
};

export default DoctorsCarousel;
