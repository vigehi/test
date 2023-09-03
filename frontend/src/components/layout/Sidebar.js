import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Link, NavLink, useNavigate, useLocation,
} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Nav from 'react-bootstrap/Nav';
import { BsCaretLeft } from 'react-icons/bs';
import { HiMenuAlt4 } from 'react-icons/hi';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import { signOut } from '../../redux/auth/auth';
import logos from '../../assets/images/Logo.png';
import { clearBookings } from '../../redux/bookings/bookings';

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    userSignedIn: authState,
    status: authStatus,
    error: authError,
    currentUser,
  } = useSelector((state) => state.auth);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (authStatus === 'signed_out') {
      navigate('/', { state: { notice: 'You have signed out successfully' } });
    }
    if (authStatus === 'signed_out_failed') {
      navigate('/', { state: { notice: `Something went wrong: ${authError}` } });
    }
  }, [authStatus]);

  const navActive = ({ isActive }) => (isActive ? { backgroundColor: '#154d05', color: 'white' } : {});

  const signoutHandler = () => {
    setShowSidebar((state) => !state);
    dispatch(signOut());
    dispatch(clearBookings());
  };

  const navLinkHelper = ({
    href, children, onClick,
  }) => (
    <NavLink className="link-item" style={navActive} to={href} onClick={onClick}>
      {children}
    </NavLink>
  );

  const navLinksNotSignedIn = () => (
    <>
      <Nav.Link as={navLinkHelper} href="/sign_up">
        SIGN UP
      </Nav.Link>
      <Nav.Link as={navLinkHelper} href="/sign_in">
        SIGN IN
      </Nav.Link>
    </>
  );

  const navLinks = () => (
    <>
      <Nav.Link href="/" as={navLinkHelper}>
        DOCTORS
      </Nav.Link>
      <Nav.Link href="/book" as={navLinkHelper}>
        BOOK A DOCTOR
      </Nav.Link>
      <Nav.Link href="/bookings" as={navLinkHelper}>
        MY BOOKINGS
      </Nav.Link>
      <Nav.Link href="/account" as={navLinkHelper}>
        MY ACCOUNT
      </Nav.Link>
      {currentUser.role === 'admin'
        && (
          <Nav.Link href="/doctors" as={navLinkHelper}>
            MANAGE DOCTORS
          </Nav.Link>
        )}
      <Button type="button" onClick={signoutHandler} className="link-item btn btn-link bg-transparent border-0 text-start">
        SIGN OUT
      </Button>
    </>
  );

  return (
    <header className="sidebar">
      <Navbar expand="lg" collapseOnSelect expanded={showSidebar} onToggle={() => setShowSidebar((state) => !state)}>
        <Navbar.Toggle aria-controls="offcanvasNavbar-expand" className="px-1 py-0">
          <HiMenuAlt4 style={{ fontSize: '2.5rem', color: 'black' }} />
        </Navbar.Toggle>
        <Navbar.Offcanvas id="offcanvasNavbar-expand">
          {/* <Offcanvas.Header closeButton className="pb-0">
            <Offcanvas.Title>
              <Link to="/" className="text-reset logo" onClick={() => setShowSidebar((state) => !state)}>
                <img src={logos} alt="Profle" className="logo-pic" />
              </Link>
            </Offcanvas.Title>
          </Offcanvas.Header> */}
          <Offcanvas.Body className="pe-0 pb-1 d-flex flex-column bg-light">
            <Link to="/" className="text-reset logo d-none d-lg-block pe-5 pt-3">
              <img src={logos} alt="Profle" className="logo-pic" />
            </Link>
            <Nav className="navbar-links position-relative flex-column">
              {authState ? navLinks() : navLinksNotSignedIn()}
              {authStatus === 'fetching_signout'
                && (
                  <div className="signout-loading">
                    <Spinner animation="border" variant="primary" role="status" className="my-auto">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                )}
            </Nav>
            <div className="mt-auto ms-2">
              <ul className="list-unstyled d-flex social-icons gap-3">
                <li className="text-secondary">
                  <a href="/#">
                    <EmailIcon className="the-item" sx={{ "& :hover": { color: "#B23121" } }} />
                  </a>
                </li>
                <li>
                  <a href="/#">
                    <FacebookIcon className="the-item" sx={{ "& :hover": { color: "#3b5998" } }} />
                  </a>
                </li>
                <li>
                  <a href="/#">
                    <TwitterIcon className="the-item" sx={{ "& :hover": { color: "#00ACEE" } }} />
                  </a>
                </li>
                <li>
                  <a href="/#">
                    <InstagramIcon className="the-item" sx={{ "& :hover": { color: "#d6249f" } }} />
                  </a>
                </li>
                <li>
                  <a href="/">
                    <LinkedInIcon className="the-item" sx={{ "& :hover": { color: "#0e76a8" } }} />
                  </a>
                </li>
              </ul>
              <p className="small m-0">
              ©2023 Doctor|
                {' '}
                <a href="https://www.linkedin.com/in/edith-oga/" target="_blank" rel="noreferrer">Edith</a>
                {' '}
              </p>
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Navbar>
      {/\/.*\/\w+.*/.test(location.pathname)
        && (
        <Button variant="primary" className="back-btn" onClick={() => navigate(-1)}>
          <BsCaretLeft />
        </Button>
        )}
    </header>
  );
};

export default Sidebar;
