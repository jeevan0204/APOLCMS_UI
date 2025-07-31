import React, { useEffect, useState } from 'react'
import Sample from './OutHeader'
import * as bst from "react-bootstrap"
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik'
import { BiLock, BiUser } from 'react-icons/bi';
import { TfiReload } from 'react-icons/tfi';
import axios from 'axios';

import * as Yup from "yup";
import { CommonAxiosPostLogin } from '../CommonUtils/CommonAxios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { TbLockOpen } from 'react-icons/tb';
import { config } from '../CommonUtils/CommonApis';


export default function LoginPage() {

    const dispatch = useDispatch();

    var md5 = require('md5');

    const navigate = useNavigate();

    const [showErrorMsg, setErrorMsg] = useState("");
    const [captcha, setCaptcha] = useState('');
    const [captchaId, setCaptchaId] = useState('');

    function getCaptcha() {
        formIk.setFieldValue("captcha", "");
        formIk.setFieldValue("captchaId", "");
        axios.post(config.url.COMMONSERVICE_URL + "tr-public/generate-captcha").then((res) => {
            if (res.data !== undefined) {
                if (res.data.status === true) {
                    console.log("-------" + res.data.captcha);
                    setCaptcha(res.data.captcha);
                    setCaptchaId(res.data.captchaId);
                }
                else {
                    setCaptcha('');
                    setCaptchaId('');
                }
            }
        }).catch(function (error) {
            console.error('Error: ' + error);
        })
    }


    useEffect(() => {
        // console.error('Error: ');
        getCaptcha();
        if (localStorage.getItem("username") === null && localStorage.getItem("image") === null) {
            submitDetails();
        }
    }, []);



    const userValidationSchema = Yup.object().shape({
        username: Yup.string().required("Please enter username").nullable(),
        password: Yup.string().required("Please enter password").nullable(),
        captcha: Yup.string().required("Please enter Captcha").nullable(),
    });

    const formIk = useFormik({
        initialValues: {
            username: "",
            password: "",
            captcha: '',
            captchaId: '',
        },
        validationSchema: userValidationSchema,
        onSubmit: (values) => {
            values.captchaId = captchaId;
            console.log("values", values)
            submitDetails(values);
        }
    });

    const submitDetails = async (values) => {
        values.password = md5(values.password);
        console.log("-----" + values.password);
        // let params = { "username": values.username, "password": values.password }
        CommonAxiosPostLogin(config.url.COMMONSERVICE_URL + "auth/authenticate", values).then((res) => {
            if (res?.data !== undefined) {
                if (res?.data?.responseCode === "01") {
                    if (res?.data?.token) {
                        // console.log("user--password-:" + res.data.list_data.user_type);
                        var decodedToken = jwtDecode(res?.data?.token);
                        var accessTokenTime = new Date(decodedToken.exp * 1000);
                        var decoded_refresh = jwtDecode(res.data.refreshtoken);
                        var rfTokenTime = new Date(decoded_refresh.exp * 1000);

                        Cookies.set("token", res.data.token, { expires: accessTokenTime });
                        Cookies.set("tokenTime", res.data.jwtExpirationMs, { expires: accessTokenTime });
                        Cookies.set("refreshToken", res.data.refreshtoken, { expires: rfTokenTime });
                        Cookies.set("refreshTokenTime", res.data.jwtRefreshExpirationMs, { expires: rfTokenTime });


                        let jsonData = {};
                        jsonData['username'] = values.username;
                        jsonData['userDescription'] = res.data.userDescription;
                        dispatch({
                            type: "LOGIN_DETAILS", payload: {
                                isLoggedIn: true, user: jsonData,
                                token: res.data.token, userLoginDetials: res.data
                            }
                        });
                        // console.log("hlooo");
                        navigate("/Sidebar");

                    } else {
                        dispatch({ type: 'HIDE_LOADING_SPINNER', payload: { key: 'showLoadingSpinner', value: false } });
                        formIk.setFieldValue('username', '');
                        formIk.setFieldValue('password', '');
                    }
                } else {
                    setErrorMsg(res?.data?.sdesc);
                    formIk.setFieldValue('password', '');
                    document.getElementById("pwd").value = "";
                    formIk.setFieldValue('captcha', '');
                    getCaptcha();
                }
            }
            return res.data;
        }).catch(() => {
            console.log("Exception Occured at Login Page ");
        });
    };

    document.body.classList.add('jnb-bg');
    // *****************password visibility **************
    const [showUserPwd, setUserPwd] = useState(true);
    function togglePasswordVisibility(id) {
        var passwordInput = document.getElementById(id);
        var passType = 'text';
        var passType1 = 'password';
        if (passwordInput.type === passType1) {
            passwordInput.type = passType;
        } else {
            passwordInput.type = passType1;
        }
    }



    return (
        <>
            <Sample />
            <bst.Container className="pb-5" >
                <bst.Row >
                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>&nbsp;</bst.Col>
                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                        <div className="login-card border" style={{ marginTop: '50%' }} >
                            <FormikProvider value={formIk}>
                                <Form onChange={formIk.handleChange} onSubmit={formIk.handleSubmit} className="form_adjust">
                                    <div className="inner-herbpage-service-title-sub pt-0">
                                        <h1 style={{ fontSize: '30px' }}> Login</h1>
                                    </div>
                                    <bst.InputGroup className="mb-3">
                                        <bst.InputGroup.Text id="basic-addon1" className="group_txt">
                                            <BiUser className="font-size" />
                                        </bst.InputGroup.Text>
                                        <Field type="text" name="username" placeholder="Enter Your User Name" className="form-control" onChange={(e) => {
                                            const { value } = e.target;
                                            const trimmedValue = value.replace(/\s+/g, ""); // Remove all spaces
                                            e.target.value = trimmedValue; // Update the input's value directly
                                        }} />
                                        <ErrorMessage name="username" component="div" className="text-error" />

                                    </bst.InputGroup>
                                    <bst.InputGroup className="mb-3">
                                        <bst.InputGroup.Text id="basic-addon2" className="group_txt">
                                            {showUserPwd === true ? <BiLock className="font_size" onClick={() => { togglePasswordVisibility("pwd"); setUserPwd(false) }} /> :
                                                <TbLockOpen className="font_size" onClick={() => { togglePasswordVisibility("pwd"); setUserPwd(true) }} />}
                                        </bst.InputGroup.Text>
                                        <input type="password" name="password" id="pwd" placeholder="Password"
                                            aria-label="Password" aria-describedby="basic-addon1" className="form-control" autoComplete="off"
                                            onChange={(e) => formIk.setFieldValue('password', e.target.value)}
                                        />
                                        <ErrorMessage name="password" component="div" className="text-error" />
                                    </bst.InputGroup>
                                    <bst.InputGroup className="mb-3">
                                        <TfiReload onClick={getCaptcha} size={20} className="mt-2" style={{ cursor: "pointer" }} />
                                        &nbsp;
                                        <img src={captcha} alt="Captcha" height={80} width={100} style={{ objectFit: "contain" }} />
                                        <Field placeholder="Enter Captcha" name="captcha" className="form-control" maxLength="6" />
                                        <ErrorMessage name="captcha" component="div" className="text-error" />
                                    </bst.InputGroup>


                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-signin">Sign In</button>
                                        {/* <a href="#" className="text-end text-black forgot mb-4" style={{ zIndex: "9994" }}
                                        //onClick={navigatetoforgot}
                                        >Forgot Password </a> */}
                                    </div>
                                    <span className="text-danger"> {showErrorMsg}</span>


                                </Form>

                            </FormikProvider>
                        </div>
                    </bst.Col>
                </bst.Row>

            </bst.Container >
        </>
    )
}
