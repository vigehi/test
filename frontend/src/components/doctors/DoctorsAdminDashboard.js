import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { destroyDoctor, resetDestroyDoctorState } from '../../redux/doctors/doctorDestroy';
import { getDoctors } from '../../redux/doctors/doctorsIndex';
import DoctorsTable from './DoctorsTable';

const DoctorsAdminDashboard = ({ doctors }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const destroyDoctorState = useSelector((state) => state.doctor_destroy);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (destroyDoctorState.status === 'failed') {
      navigate('/doctors', { state: { notice: `Something went wrong: ${destroyDoctorState.error}` } });
    }
    if (destroyDoctorState.status === 'success') {
      navigate('/doctors', { state: { notice: 'Doctor deleted successfully' } });
      dispatch(getDoctors());
    }
  }, [destroyDoctorState.status]);

  useEffect(() => () => {
    dispatch(resetDestroyDoctorState());
  }, []);

  const deleteDoctorHandler = (id) => {
    dispatch(destroyDoctor(id));
    setShowDeleteConfirm(null);
  };

  return (
    <Container fluid="sm" className="py-3 border rounded shadow my-auto bg-light">
      <div className="d-flex mb-3">
        <h2 className="mx-auto my-0">Doctors</h2>
        <Link to="/doctors/new" className="text-light fw-bold btn btn-primary">Add a doctor</Link>
      </div>
      <DoctorsTable doctors={doctors} deleteHandler={setShowDeleteConfirm} />
      {!doctors.length
        && (
          <div className="w-100 text-center nodata-row">
            There are no doctors yet.
          </div>
        )}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This action is irreversible.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)} className="fw-bold">
            Cancel
          </Button>
          <Button variant="primary" onClick={() => deleteDoctorHandler(showDeleteConfirm)} className="text-light fw-bold">
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

DoctorsAdminDashboard.propTypes = {
  doctors: PropTypes.arrayOf(PropTypes.shape({
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
  })),
};

DoctorsAdminDashboard.defaultProps = {
  doctors: [],
};

export default DoctorsAdminDashboard;
