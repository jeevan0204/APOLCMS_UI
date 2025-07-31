import React, { useEffect, useState } from 'react'
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import * as bst from "react-bootstrap";
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { useSelector } from 'react-redux';
import * as Yup from "yup";
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { AADHAR_VALIDATION, EMAIL_VALIDATION, ERROR_MSG, MOBILE_VALIDATION, validateAadhaar } from '../../CommonUtils/contextVariables';
import { failureAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';


function RegisterMLOSubject() {
    const [designationList, setdesignationList] = useState([]);
    const [saveAction, setsaveAction] = useState([]);
    const [empPostList, setempPostList] = useState([]);
    const [ListData, setListData] = useState([]);
    const [errmsg, seterrmsg] = useState([]);

    const logindetails = useSelector((state) => state.reducers.loginreducer?.userLoginDetials);

    const deptId = logindetails.dept_code;
    //  alert("dept------>>" + deptId);

    Yup.addMethod(Yup.string, 'aadharValidation', function (errorMessage) {
        return this.test('aadharValidation', errorMessage, function (value) {
            const { path, createError } = this;
            return validateAadhaar(value) || createError({ path, message: errorMessage });
        });
    });
    const validations = Yup.object().shape({
        designationId: Yup.string().required(ERROR_MSG).nullable(),
        employeeId: Yup.string().required(ERROR_MSG).nullable(),
        subjectDesc: Yup.string().required(ERROR_MSG).nullable(),
        //mobileNo: Yup.string().required(ERROR_MSG).matches(MOBILE_VALIDATION, "Invalid mobile number").nullable(),
        //emailId: Yup.string().required(ERROR_MSG).matches(EMAIL_VALIDATION, "Invalid Email Id").nullable(),
        aadharNo: Yup.string().required(ERROR_MSG).aadharValidation("Invalid Aadhaar").matches(AADHAR_VALIDATION, " Invalid aadhar number").nullable(),
    });

    const formIk = useFormik({
        initialValues: {
            designationId: "",
            employeeId: "",
            subjectDesc: "",
            mobileNo: "",
            emailId: "",
            aadharNo: "",
        },
        validationSchema: validations,
        onSubmit: (values) => {
            console.log(values);
            const url = config.url.local_URL + "saveEmployeeDetailsMLOSubject";
            CommonAxiosPost(url, values).then((res) => {
                if (res?.data?.scode === '01') {
                    successAlert2(res?.data?.data);
                } else {
                    failureAlert(res?.data?.data);
                }

            }).catch((error) => {
                console.error("Error fetching onsubmit:", error);
            });
        }

    })

    function loadEmpDetails(e) {
        const designation = e.target.value;
        console.log("-----", designation, deptId);
        let url = config.url.local_URL + "getEmployeesList?designationId=" + designation + "&deptId=" + deptId;
        CommonAxiosGet(url).then((res) => {
            if (res.data.length > 0) {
                setempPostList(res.data);
                //setsaveAction(res.data.saveAction);

            } else {
                setempPostList([]);
            }
        }).catch((error) => {
            console.error("Error fetching post names:", error);
        });
    }

    useEffect(() => {
        GetDesignationList();
        GetData();
    }, []);

    function GetDesignationList() {
        let url = config.url.local_URL + "DesignationListMLOSubject";
        CommonAxiosGet(url).then((res) => {
            if (res.data.status === true) {
                setdesignationList(res.data.DesignationList);

            } else {
                setdesignationList([]);
            }
        }).catch((error) => {
            console.error("Error fetching designation names:", error);
        });
    }


    function GetData() {
        let url = config.url.local_URL + "registerMLOSubject";
        CommonAxiosGet(url).then((res) => {
            if (res.data.status === true) {
                setListData(res.data.List_data);
                setsaveAction(res.data.saveAction);
            } else {
                setListData([]);
                setsaveAction(res.data.saveAction);

            }
        }).catch((error) => {
            console.error("Error fetching get data method names:", error);
        });
    }


    function allowNumbersOnly(e) {
        var keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
        var value = Number(e.target.value + e.key) || 0;
        if (keyCode >= 48 && keyCode <= 57) {
            return isValidNumber(value);
        } else {
            e.preventDefault();
        }
        return false;
    }

    const isValidNumber = (number) => {
        return 1 <= number && number <= 10;
    };


    const columnsList = [

        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: "MLO - Subject", accessor: "subject_desc"
        },
        {
            Header: "Employee Name", accessor: "fullname_en"
        },

        {
            Header: "Designation", accessor: "designation_name_en"
        },
        {
            Header: "Mobile", accessor: "mobileno"
        },
        {
            Header: "Email Id", accessor: "emailid"
        },
        {
            Header: "Aadhar Number", accessor: "aadharno"
        },
        {
            Header: "Action", accessor: "",
            Cell: ({ row }) => (
                <button
                    onClick={() => sendSMS(row.original.aadharno, row.original.emailid, 'MLO-SUB')}
                    style={{
                        backgroundColor: '#74b9db',
                        color: '#000',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                    Send SMS
                </button>
            )
        },
    ];

    function sendSMS(aadhar, uId, uType) {
        let url = config.url.local_URL + "sendCredentialsSMS?empUserId=" + uId + "&userType=" + uType;
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                // setShowDeptNames(res.data);

            } else {
                // setShowDeptNames([]);
            }
        }).catch((error) => {
            console.error("Error fetching sms names:", error);
        });
    }


    function PopulateDetails(e) {
        const empId = e.target.value;
        const designation = formIk.values.designationId;
        console.log("-----", designation, empId);
        let url = config.url.local_URL + "getEmpDetails?empId=" + empId + "&designationId=" + designation;
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.length > 0) {
                const data = res.data[0]?.value;
                const splitData = data?.split('#');

                if (splitData?.length >= 3) {
                    const mobile = splitData[1]?.trim() || '';
                    const email = splitData[2]?.trim() || '';

                    formIk.setFieldValue("mobileNo", mobile);
                    formIk.setFieldValue("emailId", email);
                } else {
                    console.warn("Split data is incomplete:", splitData);
                }
            } else {
                console.warn("Unexpected data format:", res);
            }
        }).catch((err) => {
            console.error("API Error:", err);
        });

    }


    return (
        <>
            <CommonFormHeader heading="Mid Level Officer (Subject)" />
            <bst.Container className='outer-page-content-container'>
                <bst.Row className="pt-2 pt-2 ">
                    <FormikProvider value={formIk}>
                        <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                            {saveAction === "INSERT" && (<>
                                <bst.Row className="px-4 pt-4">
                                    <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                        <label className="mb-0"> Designation <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="designationId"
                                            onChange={(e) => {
                                                loadEmpDetails(e);
                                            }}>
                                            <option value="ALL">--ALL--</option>
                                            {designationList != undefined && designationList?.map((data, indexDept) => {
                                                return (<React.Fragment key={indexDept}>
                                                    <option key={indexDept} value={data.value}>
                                                        {data.label}
                                                    </option>
                                                </React.Fragment>);
                                            })}

                                        </Field>
                                        <ErrorMessage name="designationId" component="div" className="text-danger" ></ErrorMessage>
                                    </bst.Col>

                                    <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                        <label className="mb-0"> Employee<span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="employeeId"
                                            onChange={(e) => PopulateDetails(e)}>
                                            <option value="ALL">--ALL--</option>
                                            {empPostList != undefined && empPostList?.map((data, indexDept) => {
                                                return (<React.Fragment key={indexDept}>
                                                    <option key={indexDept} value={data.value}>
                                                        {data.label}
                                                    </option>
                                                </React.Fragment>);
                                            })}

                                        </Field>
                                        <ErrorMessage name="employeeId" component="div" className="text-error" />
                                    </bst.Col>
                                    <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                        <label className="mb-0">Subject Description<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="text" className="form-control me-1 mt-0" name="subjectDesc"
                                            maxLength="25" />
                                        <ErrorMessage name="subjectDesc" component="div" className="text-error" />
                                    </bst.Col>
                                </bst.Row>

                            </>)}
                            <bst.Row className="px-4 pt-4">

                                <bst.Col xs={6} sm={6} md={6} lg={2} xl={2} xxl={2}>
                                    <label className="mb-0">Mobile Number <span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="mobileNo"
                                        maxLength="10" onKeyPress={(e) => { allowNumbersOnly(e); }} />
                                    <ErrorMessage name="mobileNo" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={6} sm={6} md={6} lg={2} xl={2} xxl={2}>
                                    <label className="mb-0">Email Id <span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="emailId" />
                                    <ErrorMessage name="emailId" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={6} sm={6} md={6} lg={2} xl={2} xxl={2}>
                                    <label className="mb-0">Aadhaar Number <span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="aadharNo"
                                        maxLength="12" onKeyPress={(e) => { allowNumbersOnly(e); }}
                                    />
                                    <ErrorMessage name="aadharNo" component="div" className="text-error" />
                                </bst.Col>
                            </bst.Row>

                            {saveAction === "INSERT" ? (
                                <bst.Row className="px-2 pt-2" style={{ marginLeft: "20px" }}>
                                    <bst.InputGroup className="mb-3">
                                        <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                            <button type="submit" className='btn btn-success mt-3'
                                            >Submit</button>
                                        </bst.Col>
                                    </bst.InputGroup>
                                </bst.Row>
                            ) : (
                                <></>
                            )}


                        </Form>
                    </FormikProvider>
                </bst.Row>


                {ListData.length > 0 && <>
                    <bst.Row className="pt-2 pt-2 mt-2" style={{ marginLeft: "2px" }}>
                        {ListData?.length > 0 ? (
                            <div style={{ width: "98%" }}>
                                <CommonReactTable data={ListData} columns={columnsList} showFooter={"false"}
                                    filename="Nodal Officer Report" headerName="Mid Level Officer (Subject)	Registered" />
                            </div>
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
                    </bst.Row>
                </>}

            </bst.Container >


        </>
    )
}

export default RegisterMLOSubject