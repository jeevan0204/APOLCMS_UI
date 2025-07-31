import React from 'react'
import logo from "../Images/APlogo.png"
import { AiOutlineLogout } from 'react-icons/ai'

import * as btp from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { clearCookies } from '../../clearCookies';
import Cookies from 'js-cookie';


export const logout = (navigate1) => {
    localStorage.clear();
    navigate1("/")
    clearCookies();
    // dispatch({ type: "USER_LOGOUT" });
    // dispatch({ type: "LOGIN_DETAILS", payload: {} });
    window.localStorage.clear();
    Cookies.remove("token");
    Cookies.remove("tokenTime");
    Cookies.remove("refreshToken");
    Cookies.remove("refreshTokenTime");
}

const Header = () => {
    const logindetails = useSelector((state) => state.reducers?.loginreducer?.user);
    console.log("logindetails--:" + logindetails)
    const navigate = useNavigate();

    return (
        <>
            <btp.Navbar collapseOnSelect expand="lg" bg="white" sticky="top" variant="light">
                <btp.Container fluid>
                    <btp.Navbar.Brand href="#" >
                        <img src={logo} height="50px" width="50px" alt="Jnanabhumi" />
                        <span style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
                            &nbsp; APOLCMS
                        </span>

                    </btp.Navbar.Brand>

                    <btp.Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <btp.Navbar.Collapse id="responsive-navbar-nav">
                        <btp.Nav className="me-auto" style={{ marginLeft: '85%' }}>


                            <btp.NavDropdown title={<> <strong>&nbsp;{logindetails?.userDescription}</strong></>}
                                id="collasible-nav-dropdown" >
                                {/* <NavDropdown.Item href="/">Change Password</NavDropdown.Item> */}
                                <btp.NavDropdown.Item onClick={() => { logout(navigate) }}><AiOutlineLogout
                                // onClick={logout} 
                                /> Signout </btp.NavDropdown.Item>
                            </btp.NavDropdown>
                        </btp.Nav>
                    </btp.Navbar.Collapse>
                </btp.Container>
            </btp.Navbar>

        </>
    )
}

export default Header