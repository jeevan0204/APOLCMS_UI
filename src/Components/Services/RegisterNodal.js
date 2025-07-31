import React, { useEffect, useRef, useState } from 'react'
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import * as bst from "react-bootstrap"
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { config } from '../../CommonUtils/CommonApis';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { failureAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';
import { AADHAR_VALIDATION, EMAIL_VALIDATION, ERROR_MSG, MOBILE_VALIDATION, validateAadhaar } from '../../CommonUtils/contextVariables';
import * as Yup from "yup"

function RegisterNodal() {
    const [showDeptNames, setShowDeptNames] = useState([]);
    const [ListData, setListData] = useState([]);
    const [saveAction, setsaveAction] = useState([]);
    const [designationList, setdesignationList] = useState();
    const [empPostList, setempPostList] = useState([]);
    const [errmsg, seterrmsg] = useState([]);

    Yup.addMethod(Yup.string, 'aadharValidation', function (errorMessage) {
        return this.test('aadharValidation', errorMessage, function (value) {
            const { path, createError } = this;
            return validateAadhaar(value) || createError({ path, message: errorMessage });
        });
    });
    const validations = Yup.object().shape({
        deptId: Yup.string().required(ERROR_MSG).nullable(),
        designationId: Yup.string().required(ERROR_MSG).nullable(),
        employeeId: Yup.string().required(ERROR_MSG).nullable(),
        mobileNo: Yup.string().required(ERROR_MSG).matches(MOBILE_VALIDATION, "Invalid mobile number").nullable(),
        emailId: Yup.string().required(ERROR_MSG).matches(EMAIL_VALIDATION, "Invalid Email Id").nullable(),
        aadharNo: Yup.string().required(ERROR_MSG).aadharValidation("Invalid Aadhaar").
            matches(AADHAR_VALIDATION, " Invalid aadhar number").nullable(),

    });

    const formIk = useFormik({
        initialValues: {
            deptId: "",
            designationId: "",
            employeeId: "",
            mobileNo: "",
            emailId: "",
            aadharNo: "",

        },
        validationSchema: validations,
        onSubmit: (values) => {
            const url = config.url.local_URL + "saveEmployeeDetailsNodalOfficer";
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

    const hasFetchedData = useRef(false)
    useEffect(() => {
        if (!hasFetchedData.current) {
            GetDepartmentNames();
            GetData();
            hasFetchedData.current = true
        }
    }, []);



    function GetData() {
        let url = config.url.local_URL + "registerNodal";
        CommonAxiosGet(url).then((res) => {
            if (res.data.status === true) {
                setListData(res.data.List_data);
                setsaveAction(res.data.saveAction);
                //setdesignationList(res.data.NodalDesignationList);

            } else {
                setListData([]);
            }
        }).catch((error) => {
            console.error("Error fetching get data method names:", error);
        });
    }


    const GetDepartmentNames = () => {
        let url = config.url.local_URL + "registerNodal";
        CommonAxiosGet(url).then((res) => {
            if (res.data.scode === "01") {
                setShowDeptNames(res.data.deptsList);
            } else {
                setShowDeptNames([]);
            }
        }).catch((error) => {
            console.error("Error fetching department names:", error);
        });
    };

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
            Header: "Department Name", accessor: "dept_code",
            Cell: ({ row }) => (<>
                {row.original.dept_code} - {row.original.description}
            </>),
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
                    onClick={() => sendSMS(row.original.aadharno, row.original.emailid, 'NO')}
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

    function getHodData(e) {
        const deptId = e.target.value;
        let url = config.url.local_URL + "HodEmployeeDetails?deptId=" + deptId;
        CommonAxiosGet(url).then((res) => {
            setdesignationList(res.data.NodalDesignationList);
            setsaveAction(res.data.saveAction);
            if (res.data.status === true) {
                setListData(res.data.List_data);
            } else {
                setListData([]);
            }
        }).catch((error) => {
            console.error("Error fetching sms names:", error);
        });
    }
    // console.log(">>>>>>>>>>", designationList);

    function loadEmpDetails(e) {
        const designation = e.target.value;
        const deptId = formIk.values.deptId;
        //console.log("-----", designation, deptId);
        let url = config.url.local_URL + "getEmployeesList?designationId=" + designation + "&deptId=" + deptId;
        CommonAxiosGet(url).then((res) => {
            if (res.data.length > 0) {
                setempPostList(res.data);
                //setsaveAction(res.data.saveAction);

            } else {
                setempPostList([]);
            }
        }).catch((error) => {
            console.error("Error fetching sms names:", error);
        });
    }

    function PopulateDetails(e) {
        const empId = e.target.value;
        const designation = formIk.values.designationId
        let url = config.url.local_URL + "getEmpDetails?empId=" + empId + "&designationId=" + designation;
        CommonAxiosGet(url).then((res) => {

            if (Array.isArray(res.data) && res.data.length > 0) {
                const data = res.data[0].value;
                alert(`Raw value: ${data}`);

                const splitData = data?.split('#');

                formIk.setFieldValue("mobileNo", splitData[0]);
                formIk.setFieldValue("emailId", splitData[1]);
                formIk.setFieldValue("aadharNo", splitData[2]);
            } else {
                console.warn("Unexpected data format:", res);
            }
        }).catch((error) => {
            console.error("Error fetching data names:", error);
        });
    }
    return (
        <>
            <CommonFormHeader heading="Nodal Officer (Legal) Registration" />
            <bst.Container className='outer-page-content-container'>
                <div className="jumbotron mt20 form-card-jnb" style={{ marginTop: "5px" }}>

                    <bst.Row className='px-3 pt-5'>
                        <FormikProvider value={formIk}>
                            <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                                <bst.Row className="px-4 pt-4 mb-2">
                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <bst.InputGroup className="mb-2p5">
                                            <span className="label-text-style field-mandatory">Select Head of the Department (HoD) </span>
                                            {/* <label className="mb-0"> Head of the Department (HoD) <span style={{ color: 'red' }}>*</span></label> */}
                                            <Field as="select" className='form-control' name="deptId"
                                                onChange={(e) => { getHodData(e); }}>
                                                <option value="ALL">--ALL--</option>
                                                {showDeptNames != undefined && showDeptNames?.map((data, indexDept) => {
                                                    return (<React.Fragment key={indexDept}>
                                                        <option key={indexDept} value={data.value}>
                                                            {data.label}
                                                        </option>
                                                    </React.Fragment>);
                                                })}


                                            </Field>
                                            <ErrorMessage name="deptId" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.InputGroup>
                                    </bst.Col>
                                </bst.Row>

                                <bst.Row className='px-3 pt-5'>
                                    {Array.isArray(ListData) && ListData.length === 0 && (
                                        <>
                                            {saveAction === "INSERT" ? (
                                                <>
                                                    <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <bst.InputGroup className="mb-2p5">
                                                            <span className="label-text-style field-mandatory">Designation</span>
                                                            <Field as="select" className='form-control' name="designationId" onChange={(e) => loadEmpDetails(e)}>
                                                                <option value="ALL">--ALL--</option>
                                                                {designationList?.map((data, des) => (
                                                                    <option key={des} value={data.value}>
                                                                        {data.label}
                                                                    </option>
                                                                ))}
                                                            </Field>
                                                            <ErrorMessage name="designationId" component="div" className="text-danger" />
                                                        </bst.InputGroup>
                                                    </bst.Col>

                                                    <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <bst.InputGroup className="mb-2p5">
                                                            <span className="label-text-style field-mandatory">Employee </span>
                                                            <Field as="select" className='form-control' name="employeeId"
                                                            //onChange={(e) => PopulateDetails(e)}
                                                            >
                                                                <option value="ALL">--ALL--</option>
                                                                {empPostList?.map((data, indexDept) => (
                                                                    <option key={indexDept} value={data.value}>
                                                                        {data.label}
                                                                    </option>
                                                                ))}
                                                            </Field>
                                                            <ErrorMessage name="employeeId" component="div" className="text-error" />
                                                        </bst.InputGroup>
                                                    </bst.Col>

                                                </>
                                            ) : (
                                                <></>
                                            )}


                                            <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                                <bst.InputGroup className="mb-2p5">
                                                    <span className="label-text-style field-mandatory">Mobile Number </span>
                                                    <Field type="text" className="form-control me-1 mt-0" name="mobileNo"
                                                        maxLength="10" onKeyPress={(e) => { allowNumbersOnly(e); }} />
                                                    <ErrorMessage name="mobileNo" component="div" className="text-error" />
                                                </bst.InputGroup>
                                            </bst.Col>

                                            <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                                <bst.InputGroup className="mb-2p5">
                                                    <span className="label-text-style field-mandatory">Email Id </span>
                                                    <Field type="text" className="form-control me-1 mt-0" name="emailId" />
                                                    <ErrorMessage name="emailId" component="div" className="text-error" />
                                                </bst.InputGroup>
                                            </bst.Col>

                                            <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                                <bst.InputGroup className="mb-2p5">
                                                    <span className="label-text-style field-mandatory">Aadhaar Number </span>
                                                    <Field type="text" className="form-control me-1 mt-0" name="aadharNo"
                                                        maxLength="12" onKeyPress={(e) => { allowNumbersOnly(e); }} />
                                                    <ErrorMessage name="aadharNo" component="div" className="text-error" />
                                                </bst.InputGroup>
                                            </bst.Col>

                                            <bst.Row className="px-2 pt-2" style={{ marginLeft: "2px" }}>
                                                <bst.InputGroup className="mb-3">
                                                    <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                                        <button type="submit" className='btn btn-success mt-3'
                                                        >Submit</button>
                                                    </bst.Col>
                                                </bst.InputGroup>
                                            </bst.Row>
                                        </>)}
                                </bst.Row>
                            </Form>
                        </FormikProvider>
                    </bst.Row>
                </div>

                {ListData.length > 0 && <>
                    <bst.Row className="pt-2 pt-2 mt-2" style={{ marginLeft: "2px" }}>
                        {ListData?.length > 0 ? (
                            <div style={{ width: "98%" }}>
                                <CommonReactTable data={ListData} columns={columnsList} showFooter={"false"}
                                    filename="Nodal Officer Report" />
                            </div>
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
                    </bst.Row>
                </>}

            </bst.Container >

        </>
    )
}

export default RegisterNodal