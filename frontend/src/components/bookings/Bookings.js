/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import DatePicker from 'react-datepicker';
import { fechBookings } from '../../redux/bookings/bookings';
import { deleteBookings, clearDeleteBookingState } from '../../redux/bookings/deleteBooking';
import { getDoctors } from '../../redux/doctors/doctorsIndex';
import { updateBooking, resetUpdateBookingState } from '../../redux/bookings/bookingUpdate';

const Bookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);
  const bookingState = useSelector((state) => state.bookings);
  const editBookingState = useSelector((state) => state.booking_update);
  const doctorsState = useSelector((state) => state.doctors);
  const delResevationState = useSelector((state) => state.delResevation);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get('p');
  const [showCurrentPage, setShowCurrentPage] = useState(+currentPage || 1);
  const [maxPagesNumber, setMaxPagesNumber] = useState(null);
  const initialArrayIndex = ((showCurrentPage * 5) - 5);
  const itemsToRender = bookingState.bookings.slice(initialArrayIndex, initialArrayIndex + 5);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    bookingdate: null,
    bookingtime: null,
    duration: '',
    id: '',
  });

  useEffect(() => {
    if (bookingState.status !== 'completed' && authState.userSignedIn) {
      dispatch(fechBookings());
    }
    if (doctorsState.status !== 'completed') {
      dispatch(getDoctors());
    }
    return () => {
      dispatch(clearDeleteBookingState());
      dispatch(resetUpdateBookingState());
    };
  }, []);

  useEffect(() => {
    if (bookingState.status === 'completed') {
      setMaxPagesNumber(Math.ceil(bookingState.bookings.length / 5));
    }
  }, [bookingState.status]);

  useEffect(() => {
    if (maxPagesNumber && (showCurrentPage > maxPagesNumber)) {
      setSearchParams({ p: maxPagesNumber });
      setShowCurrentPage(maxPagesNumber);
    }
  }, [maxPagesNumber]);

  useEffect(() => {
    if (typeof editBookingState.error === 'string') {
      navigate('/bookings', { state: { notice: `Something went wrong: ${editBookingState.error}` } });
    }
    if (editBookingState.status === 'success') {
      navigate('/bookings', { state: { notice: 'Booking updated successfully!' } });
      dispatch(fechBookings());
      setShowEditModal(false);
    }
  }, [editBookingState.status]);

  useEffect(() => {
    if (delResevationState.status === 'failed') {
      navigate('/bookings', { state: { notice: `Something went wrong: ${delResevationState.error}` } });
    }
    if (delResevationState.status === 'completed') {
      navigate('/bookings', { state: { notice: 'Booking deleted succesfully' } });
      dispatch(fechBookings());
    }
  }, [delResevationState.status]);

  const deleteBookingData = (id) => () => {
    dispatch(deleteBookings(id));
  };

  if (!authState.userSignedIn) {
    return <Navigate to="/sign_in" state={{ notice: 'You need to sign in before you continue' }} />;
  }

  if (doctorsState.status === 'idle' || doctorsState.status === 'fetching') {
    return (
      <Container as="section" fluid className="py-2 doctors align-items-center">
        <h1 className="mt-3">Please Wait...</h1>
        <Spinner animation="border" variant="primary" role="status" className="my-auto">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (doctorsState.status === 'failed') {
    return (
      <Container as="section" fluid className="py-2 doctors">
        <h2 className="mt-2 text-center mt-auto mb-auto">{`Something went wrong: ${doctorsState.error}`}</h2>
      </Container>
    );
  }

  if (!bookingState.bookings.length) {
    return (
      <Container as="section" fluid className="py-2 doctors">
        <h2 className="mt-2 text-center mt-auto mb-auto">The booking list is empty</h2>
      </Container>
    );
  }

  const pageHandler = (page) => {
    setShowCurrentPage(page);
    setSearchParams({ p: page });
  };

  const renderError = (key) => `${key} ${editBookingState.error?.[key]?.join(', ')}`;
  const validateInput = (key) => !!editBookingState.error?.[key];

  const datePickerCustomInput = ({
    value, onClick, onChange, placeholder,
  }, ref) => (
    <Form.Control
      value={value}
      onClick={onClick}
      ref={ref}
      onChange={onChange}
      placeholder={placeholder}
      isInvalid={validateInput('bookingdate')}
    />
  );

  const CustomInput = React.forwardRef(datePickerCustomInput);

  const editFormHandler = () => {
    const {
      bookingdate, bookingtime, duration, id,
    } = formData;
    const newBookingDate = bookingtime
      ? new Date((bookingdate?.setHours(bookingtime?.getHours())))
      : null;

    dispatch(updateBooking(JSON.stringify({
      booking: {
        bookingdate: newBookingDate,
        duration,
      },
    }), id));
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    if (editBookingState.status === 'failed') {
      dispatch(resetUpdateBookingState());
    }
  };

  return (
    <section className="bookingtop gap-3 position-relative">
      <h2 className="text-center m-0">Bookings</h2>
      <div className="booking-container px-3 gap-3">
        {itemsToRender.map((book) => (
          <div key={book.id} className="allinclusive p-2">
            <div className="bookingdeatails">
              <div>
                <p>Doctor:</p>
                <div className="d-flex align-items-center ms-4">
                  <img src={doctorsState.doctors.filter((item) => item.id === book.doctor_id)[0].avatar} alt="Profle" className="doctor-thumb" />
                  <p className="m-0 ms-2">{doctorsState.doctors.filter((item) => item.id === book.doctor_id)[0].name}</p>
                </div>
                <div className="ms-auto fw-bold">{`#${book.id}`}</div>
              </div>
              <div>
                <p>Appointment date:</p>
                <p>{new Date(book.bookingdate).toLocaleDateString()}</p>
              </div>
              <div>
                <p>Time:</p>
                <p>{new Date(book.bookingdate).toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}</p>
              </div>
              <div>
                <p>Duration:</p>
                <p>
                  {book.duration}
                  {' '}
                  hrs
                </p>
              </div>
            </div>
            <div className="bookingbtns pt-2 justify-content-center">
              <Button
                className="px-5 text-light fw-bold"
                onClick={() => {
                  setFormData({
                    bookingdate: new Date(book.bookingdate),
                    bookingtime: new Date(book.bookingdate),
                    duration: book.duration,
                    id: book.id,
                  });
                  setShowEditModal(true);
                }}
              >
                Edit
              </Button>
              <Button className="px-5" variant="secondary" onClick={deleteBookingData(book.id)}>Cancel</Button>
            </div>
          </div>
        ))}
      </div>
      <Pagination className="bookings-pagination">
        <Pagination.First disabled={showCurrentPage === 1} onClick={() => pageHandler(1)} />
        <Pagination.Prev disabled={showCurrentPage === 1} onClick={() => pageHandler(showCurrentPage - 1)} />
        {showCurrentPage >= 3 && <Pagination.Item onClick={() => pageHandler(showCurrentPage - 2)}>{showCurrentPage - 2}</Pagination.Item>}
        {showCurrentPage >= 2 && <Pagination.Item onClick={() => pageHandler(showCurrentPage - 1)}>{showCurrentPage - 1}</Pagination.Item>}
        <Pagination.Item active>{showCurrentPage}</Pagination.Item>
        {showCurrentPage <= (maxPagesNumber - 1) && <Pagination.Item onClick={() => pageHandler(showCurrentPage + 1)}>{showCurrentPage + 1}</Pagination.Item>}
        {showCurrentPage <= (maxPagesNumber - 2) && <Pagination.Item onClick={() => pageHandler(showCurrentPage + 2)}>{showCurrentPage + 2}</Pagination.Item>}
        <Pagination.Next disabled={showCurrentPage === maxPagesNumber} onClick={() => pageHandler(showCurrentPage + 1)} />
        <Pagination.Last disabled={showCurrentPage === maxPagesNumber} onClick={() => pageHandler(maxPagesNumber)} />
      </Pagination>
      <Modal centered show={showEditModal} onHide={() => closeEditModal()}>
        <Modal.Header closeButton>
          <Modal.Title>{`Edit booking #${formData.id}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="position-relative">
          <Form id="edit-booking">
            <Form.Group controlId="bookingdate" className="mb-2">
              <Form.Label visuallyHidden>
                Appoint date
              </Form.Label>
              <DatePicker
                selected={formData.bookingdate}
                onChange={(date) => setFormData((state) => ({
                  ...state,
                  bookingdate: date?.getHours() < 8 ? new Date(date.setHours(9)) : date,
                }))}
                customInput={<CustomInput />}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                placeholderText="Appointment date"
                wrapperClassName="flex-grow-1"
              />
            </Form.Group>
            <Form.Group controlId="bookingtime" className="mb-2">
              <Form.Label visuallyHidden>
                Appoint time
              </Form.Label>
              <DatePicker
                selected={formData.bookingtime}
                onChange={(date) => setFormData((state) => ({
                  ...state,
                  bookingtime: date?.getHours() < 8 ? new Date(date.setHours(9)) : date,
                }))}
                customInput={<CustomInput />}
                minDate={new Date()}
                placeholderText="Appointment time"
                wrapperClassName="flex-grow-1"
                showTimeSelect
                showTimeSelectOnly
                dateFormat="h:mm aa"
                timeIntervals={60}
                minTime={new Date().setHours(8)}
                maxTime={new Date().setHours(17)}
              />
            </Form.Group>
            <Form.Control.Feedback type="invalid" className={validateInput('bookingdate') ? 'd-block' : ''}>
              {renderError('bookingdate')}
            </Form.Control.Feedback>
            <InputGroup className="flex-grow-1" style={{ maxWidth: '274px' }}>
              <Form.Select
                value={formData.duration}
                onChange={(e) => setFormData((state) => ({
                  ...state,
                  duration: e.target.value,
                }))}
                isInvalid={validateInput('duration')}
              >
                <option value="">Duration</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Form.Select>
              <InputGroup.Text>Hours</InputGroup.Text>
            </InputGroup>
            <Form.Control.Feedback type="invalid" className={validateInput('duration') ? 'd-block' : ''}>{renderError('duration')}</Form.Control.Feedback>
          </Form>
          {editBookingState.status === 'fetching'
          && (
            <div className="signout-loading">
              <Spinner animation="border" variant="primary" role="status" className="my-auto">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => closeEditModal()} className="fw-bold">
            Cancel
          </Button>
          <Button form="edit-booking" variant="primary" onClick={() => editFormHandler()} className="text-light fw-bold">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      {delResevationState.status === 'fetching'
        && (
        <div className="signout-loading">
          <Spinner animation="border" variant="primary" role="status" className="my-auto">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
        )}
    </section>
  );
};

export default Bookings;
