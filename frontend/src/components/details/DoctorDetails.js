import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import { getDoctors } from '../../redux/doctors/doctorsIndex';

const Detail = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const doctorsState = useSelector((state) => state.doctors);

  useEffect(() => {
    if (doctorsState.status !== 'completed') {
      dispatch(getDoctors());
    }
  }, []);

  if (doctorsState.status === 'idle' || doctorsState.status === 'fetching') {
    return (
      <Container as="section" fluid className="py-2 doctors align-items-center">
        <Spinner animation="border" variant="primary" role="status" className="my-auto">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (doctorsState.status === 'failed') {
    return (
      <Container as="section" fluid className="py-2 doctors">
        <h2 className="mt-2">{`Something went wrong: ${doctorsState.error}`}</h2>
      </Container>
    );
  }

  const doctor = doctorsState.doctors.filter((doctor) => doctor.id === +(params.id))[0];
  const mylink = `/book?doctor=${doctor.id}`;

  return (
    <Container fluid="sm" as="section" className="py-3 px-xl-5 my-auto d-flex flex-column flex-xl-row text-center detail-section">
      <div className="top-details p-3">
        <img src={doctor.avatar} alt="Profle" className="profile-pic" />
        <p className="m-0 mt-3">
          { doctor.bio }
        </p>
      </div>
      <div className="bottom-details d-flex flex-column">
        <h2 className="text-center">{doctor.name}</h2>
        <ul className="doctor-items m-0 p-0">
          <div className="inner-listing">
            <li><strong>Phone No:</strong></li>
            <li className="inner-listing2">
              { doctor.phone }
            </li>
          </div>
          <div className="inner-listing">
            <li><strong>Location:</strong></li>
            <li className="inner-listing2">
              { doctor.location }
            </li>
          </div>
          <div className="inner-listing">
            <li><strong>Charges:</strong></li>
            <li className="inner-listing2">
              $
              { doctor.rates }
              /hr
            </li>
          </div>
          <div className="inner-listing">
            <li><strong>Email:</strong></li>
            <li className="inner-listing2">
              { doctor.email }
            </li>
          </div>
        </ul>
        <Link to={mylink} variant="primary" className="text-white w-auto fw-bold btn btn-primary btn-lg">Book appointment</Link>
      </div>
    </Container>
  );

  // return (
  //   <section className="detail-section">
  //     <div className="top-details">
  //       <img src={doctor.avatar} alt="Profle" className="profile-pic" />
  //       <p className="bio-head">Biography</p>
  //       <p className="bio">
  //         { doctor.bio }
  //       </p>
  //     </div>
  //     <div className="bottom-details">
  //       <ul className="doctor-items">
  //         <div className="inner-listing">
  //           <li><strong>Name:</strong></li>
  //           <li className="inner-listing2">
  //             {' '}
  //             { doctor.name }
  //           </li>
  //         </div>
  //         <div className="inner-listing">
  //           <li><strong>Phone No:</strong></li>
  //           <li className="inner-listing2">
  //             {' '}
  //             { doctor.phone }
  //           </li>
  //         </div>
  //         <div className="inner-listing">
  //           <li><strong>Location:</strong></li>
  //           <li className="inner-listing2">
  //             {' '}
  //             { doctor.location }
  //           </li>
  //         </div>
  //         <div className="inner-listing">
  //           <li><strong>Charges:</strong></li>
  //           <li className="inner-listing2">
  //             {' '}
  //             $
  //             { doctor.rates }
  //             /hr
  //           </li>
  //         </div>
  //         <div className="inner-listing">
  //           <li><strong>Email:</strong></li>
  //           <li className="inner-listing2">
  //             { doctor.email }
  //             {' '}
  //           </li>
  //         </div>
  //       </ul>
  //       <Button href={mylink} variant="primary" size="lg" className="resrvebtn">Book</Button>
  //     </div>
  //   </section>
  // );
};

export default Detail;
