import React, { useEffect, useState } from 'react';
import {
  useSearchParams, useNavigate, useLocation, Navigate,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import DatePicker from 'react-datepicker';
import { IoClose } from 'react-icons/io5';
import 'react-datepicker/dist/react-datepicker.css';
import CustomDropMenu from './CustomDropMenu';
import { getDoctors } from '../../redux/doctors/doctorsIndex';
import { createBooking, resetCreateBookingState } from '../../redux/bookings/bookingsCreate';
import { fechBookings } from '../../redux/bookings/bookings';

const Book = () => {
  const [params] = useSearchParams();
  const selectedDoctor = params.get('doctor');
  const { userSignedIn, status: userAuthStatus } = useSelector((state) => state.auth);
  const doctorsState = useSelector((state) => state.doctors);
  const bookingState = useSelector((state) => state.bookings_create);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { doctors } = doctorsState;
  const mediaQuerySm = window.matchMedia('(min-width: 600px)');
  const [dropdownPosition, setDropdownPosition] = useState(mediaQuerySm.matches ? 'end' : 'down');
  const initialBookingData = {
    doctor_id: selectedDoctor,
    bookingdate: null,
    duration: '',
    is_active: true,
  };
  const [bookingData, setBookingData] = useState(initialBookingData);

  useEffect(() => {
    if (doctorsState.status === 'failed') {
      navigate(`${location.pathname}${location.search}`, { state: { notice: `Something went wrong: ${doctorsState.error}` } });
    }
  }, [doctorsState.status]);

  useEffect(() => {
    if (bookingState.status === 'success') {
      navigate('/bookings', { state: { notice: 'Booking created successfully!' } });
      dispatch(fechBookings());
    }
    if (typeof bookingState.error === 'string') {
      navigate(`${location.pathname}${location.search}`, { state: { notice: `Something went wrong: ${bookingState.error}` } });
    }
  }, [bookingState.status]);

  useEffect(() => {
    if (doctorsState.status !== 'completed') {
      dispatch(getDoctors());
    }
    const handleMediaQuery = (e) => {
      if (e.matches) {
        setDropdownPosition('end');
        return undefined;
      }
      setDropdownPosition('down');
      return undefined;
    };
    mediaQuerySm.addEventListener('change', handleMediaQuery);
    return () => {
      mediaQuerySm.removeEventListener('change', handleMediaQuery);
      dispatch(resetCreateBookingState());
    };
  }, []);

  if (!userSignedIn && userAuthStatus !== 'signed_out') {
    return <Navigate to="/sign_in" state={{ notice: 'You need to sign in or sign up before continuing.' }} />;
  }

  const removeSelectedDoctor = (id) => {
    const doctorToRemove = doctors.find((doctor) => doctor.id === +id);
    if (!doctorToRemove) {
      setBookingData((state) => ({ ...state, doctor_id: null }));
      return null;
    }
    const clickHandler = () => setBookingData((state) => ({ ...state, doctor_id: null }));

    return (
      <Button type="button" variant="secondary" className="d-flex align-items-center gap-2 py-1 w-100" onClick={clickHandler}>
        <img src={doctorToRemove.avatar} alt={doctorToRemove.name} style={{ width: '35px', height: '35px' }} className="doctor-thumbnail" />
        <p className="m-0 text-truncate">{`${doctorToRemove.name} | $${doctorToRemove.rates}/hr`}</p>
        <IoClose className="text-light fs-4 ms-auto" />
      </Button>
    );
  };

  const renderError = (key) => `${key} ${bookingState.error?.[key]?.join(', ')}`;
  const validateInput = (key) => !!bookingState.error?.[key];

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

  const totalOutputHandler = () => {
    if (doctors) {
      if (bookingData.doctor_id) {
        if (bookingData.duration) {
          return `$${(doctors.find((doctor) => doctor.id === +bookingData.doctor_id)
            .rates * bookingData.duration).toFixed(2)}`;
        }
      }
    }

    return '';
  };

  const formHandler = (e) => {
    e.preventDefault();
    dispatch(createBooking(JSON.stringify(bookingData)));
  };

  return (
    <Container fluid className="h-100 book-bg d-flex py-2 overflow-auto">
      <Container fluid="sm" className="py-3 border rounded form-width-sm shadow my-auto bg-light">
        <h2 className="text-center">Book a doctor</h2>
        <Form className={bookingState.status === 'fetching' ? 'book-form position-relative' : 'book-form'}>
          <div className="mb-2">
            {(bookingData.doctor_id && doctors)
              ? removeSelectedDoctor(bookingData.doctor_id)
              : (
                <Dropdown
                  drop={dropdownPosition}
                  onSelect={(_, e) => setBookingData((state) => ({
                    ...state,
                    doctor_id: e.currentTarget.dataset.doctorid,
                  }))}
                >
                  <Dropdown.Toggle variant="secondary">
                    Select doctor
                  </Dropdown.Toggle>
                  <Dropdown.Menu as={CustomDropMenu}>
                    {doctors?.map((doctor, index) => (
                      <Dropdown.Item eventKey={index + 1} data-doctorid={doctor.id} key={doctor.id} id={doctor.name} className="d-flex gap-2 align-items-center">
                        <img src={doctor.avatar} alt={doctor.name} className="doctor-thumbnail" />
                        <p className="m-0 text-truncate">{`${doctor.name} | $${doctor.rates}/hr`}</p>
                      </Dropdown.Item>
                    ))}
                    {doctorsState.status === 'fetching'
                      && (
                        <Dropdown.Item eventKey="1" className="text-center" disabled>
                          <Spinner animation="border" variant="primary" role="status" className="my-auto">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        </Dropdown.Item>
                      )}
                    {!doctors?.length
                      && (
                        <Dropdown.Item eventKey="1" className="text-center" disabled>
                          There are no listed doctors.
                        </Dropdown.Item>
                      )}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            <Form.Control.Feedback type="invalid" className={validateInput('doctor') ? 'd-block' : ''}>{renderError('doctor')}</Form.Control.Feedback>
          </div>
          <div className="mb-2">
            <div className="d-flex gap-2 flex-wrap">
              <DatePicker
                selected={bookingData.bookingdate}
                onChange={(date) => setBookingData((state) => ({
                  ...state,
                  bookingdate: date?.getHours() < 8 ? new Date(date?.setHours(9)) : date,
                }))}
                customInput={<CustomInput />}
                minDate={new Date()}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Appointment date"
                timeIntervals={60}
                minTime={new Date().setHours(8)}
                maxTime={new Date().setHours(17)}
                wrapperClassName="flex-grow-1"
              />
              <InputGroup className="flex-grow-1" style={{ width: '150px' }}>
                <Form.Select
                  value={bookingData.duration}
                  onChange={(e) => setBookingData((state) => ({
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
            </div>
            <div className="d-flex flex-column flex-sm-row">
              <Form.Control.Feedback type="invalid" className={validateInput('bookingdate') ? 'd-block' : ''}>{renderError('bookingdate')}</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid" className={validateInput('duration') ? 'd-block' : ''}>{renderError('duration')}</Form.Control.Feedback>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <InputGroup className="w-auto flex-grow-1">
              <InputGroup.Text>Total:</InputGroup.Text>
              <Form.Control
                value={totalOutputHandler()}
                readOnly
                placeholder="N/A"
              />
            </InputGroup>
            <Button className="px-4 text-light fw-bold" onClick={formHandler}>
              Book Now
            </Button>
          </div>
          {bookingState.status === 'fetching'
            && (
              <div className="signout-loading">
                <Spinner animation="border" variant="primary" role="status" className="my-auto">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
        </Form>
      </Container>
    </Container>
  );
};

export default Book;
