import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { BiDetail, BiEdit, BiTrash } from 'react-icons/bi';

const DoctorsTable = ({ doctors, deleteHandler }) => (
  <div className="doctors-table">
    <div className="flex-cols">
      <div className="row-header">
        <div className="header-col col-id">Id</div>
        <div className="header-col col-name">Name</div>
        <div className="header-col col-created">Created at</div>
        <div className="header-col col-updated">Updated at</div>
      </div>
      {doctors.map((doctor) => (
        <div className="row-body" key={doctor.id}>
          <div className="body-col col-id" title={doctor.id}>{doctor.id}</div>
          <div className="body-col col-name" title={doctor.name}>{doctor.name}</div>
          <div className="body-col col-created" title={new Date(doctor.created_at).toLocaleString()}>
            {new Date(doctor.created_at).toLocaleString()}
          </div>
          <div className="body-col col-updated" title={new Date(doctor.updated_at).toLocaleString()}>
            {new Date(doctor.updated_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
    <div className="fixed-col">
      <div className="row-header">
        <div className="header-col">Actions</div>
      </div>
      {doctors.map((doctor) => (
        <div className="row-body" key={doctor.id}>
          <div className="body-col col-actions">
            <Link title="Details" to={`/doctors/${doctor.id}`}>
              <BiDetail />
            </Link>
            <Link title="Edit" to={`/doctors/${doctor.id}/edit`}>
              <BiEdit />
            </Link>
            <Button title="Delete" variant="link" className="p-0" onClick={() => deleteHandler(doctor.id)}>
              <BiTrash />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

DoctorsTable.propTypes = {
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
  deleteHandler: PropTypes.func.isRequired,
};

DoctorsTable.defaultProps = {
  doctors: [],
};

export default DoctorsTable;
