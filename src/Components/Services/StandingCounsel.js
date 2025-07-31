import React, { useEffect, useState } from 'react'
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import * as bst from "react-bootstrap"
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik'
import ImagePdfBucket from '../../CommonUtils/ImagePdfBase64'
import { config } from '../../CommonUtils/CommonApis'
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios'
import { failureAlert, successAlert2 } from '../../CommonUtils/SweetAlerts'
import CommonReactTable from '../../CommonUtils/CommonReactTable'
import { viewBucketImage } from '../../CommonUtils/ViewImagelm'
import { AADHAR_VALIDATION, EMAIL_VALIDATION, ERROR_MSG, MOBILE_VALIDATION, validateAadhaar } from '../../CommonUtils/contextVariables'
import *as Yup from "yup"

function StandingCounsel() {
    const [showDeptNames, setShowDeptNames] = useState([]);
    const [CounselData, setCounselData] = useState([]);
    const [errmsg, seterrmsg] = useState(false);


    Yup.addMethod(Yup.string, 'aadharValidation', function (errorMessage) {
        return this.test('aadharValidation', errorMessage, function (value) {
            const { path, createError } = this;
            return validateAadhaar(value) || createError({ path, message: errorMessage });
        });
    });
    const Validations = Yup.object().shape({
        employeeName: Yup.string().required(ERROR_MSG).nullable(),
        employeeCode: Yup.string().required(ERROR_MSG).nullable(),
        fromDate: Yup.string().required(ERROR_MSG).nullable(),
        toDate: Yup.string().required(ERROR_MSG).nullable(),
        mobileNo: Yup.string().required(ERROR_MSG).matches(MOBILE_VALIDATION, "Invalid mobile number").nullable(),
        emailId: Yup.string().required(ERROR_MSG).matches(EMAIL_VALIDATION, "Invalid Email Id").nullable(),
        aadharNo: Yup.string().required(ERROR_MSG).aadharValidation("Invalid Aadhaar").matches(AADHAR_VALIDATION, " Invalid aadhar number").nullable(),
        deptId: Yup.string().required(ERROR_MSG).nullable(),
        changeLetter: Yup.string().required(ERROR_MSG).nullable(),
        remarks: Yup.string().required(ERROR_MSG).nullable(),
    });

    const formIk = useFormik({
        initialValues: {
            employeeName: "",
            employeeCode: "",
            fromDate: "",
            toDate: "",
            mobileNo: "",
            emailId: "",
            aadharNo: "",
            deptId: "",
            changeLetter: "",
            remarks: ""

        },
        validationSchema: Validations,
        onSubmit: (values) => {
            console.log(values);
            const url = config.url.local_URL + "saveStandingCounselEmployee";
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

    useEffect(() => {
        GetDepartmentNames();
        GetConselData();
    }, []);

    function GetConselData() {
        let url = config.url.local_URL + "StandingCounsel";
        CommonAxiosGet(url).then((res) => {
            if (res.data.status === true) {
                setCounselData(res.data.Standard_Council_Data);

            } else {
                setCounselData([]);
                seterrmsg(true);
            }
        }).catch((error) => {
            console.error("Error fetching GetConselData :", error);
        });
    }


    const GetDepartmentNames = () => {
        let url = config.url.local_URL + "getDepartmentList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setShowDeptNames(res.data);

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
            Header: "Standing Counsel Name", accessor: "employee_name"
        },
        {
            Header: "Standing Counsel Advocate CC", accessor: "employee_code"
        },
        {
            Header: "From Date", accessor: "from_date"
        },
        {
            Header: "To Date", accessor: "to_date"
        },
        {
            Header: "Mobile No", accessor: "mobile_no"
        },
        {
            Header: "Email Id", accessor: "email_id"
        },
        {
            Header: "Aadhaar Number", accessor: "adhaar_no"
        },
        {
            Header: "Document", accessor: "standard_council_path",
            isClickable: true,
            Cell: ({ row }) => (
                <center>
                    <h5 style={{
                        color: "blue", fontSize: "1.5vh", textDecoration: "underline",
                        cursor: "pointer", textAlign: "center"
                    }} onClick={() => { viewBucketImage(row?.original?.standard_council_path); }} >
                        View
                    </h5>
                </center>
            ),
        },
        {
            Header: "Remarks", accessor: "remarks"
        },
    ];

    return (
        <>
            <CommonFormHeader heading="Standing Counsel Details Form" />
            <bst.Container className='outer-page-content-container'>
                <bst.Row className="pt-2 pt-2 ">
                    <FormikProvider value={formIk}>
                        <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0">Standing Counsel Name<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="employeeName" />
                                    <ErrorMessage name="employeeName" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0">Standing Counsel Advocate CC <span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="employeeCode" />
                                    <ErrorMessage name="employeeCode" component="div" className="text-error" />
                                </bst.Col>
                                <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0">From Date<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="date" name="fromDate" className="form-control" />
                                    <ErrorMessage name="fromDate" component="div" className="text-error" />
                                </bst.Col>
                                <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0">To Date<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="date" name="toDate" className="form-control" />
                                    <ErrorMessage name="toDate" component="div" className="text-error" />
                                </bst.Col>
                            </bst.Row>
                            <bst.Row className="px-4 pt-4">

                                <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0">Mobile Number <span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="mobileNo"
                                        maxLength="10" onKeyPress={(e) => { allowNumbersOnly(e); }} />
                                    <ErrorMessage name="mobileNo" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0">Email Id <span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="emailId" />
                                    <ErrorMessage name="emailId" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0">Aadhaar Number <span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="aadharNo"
                                        maxLength="12" onKeyPress={(e) => { allowNumbersOnly(e); }} />
                                    <ErrorMessage name="aadharNo" component="div" className="text-error" />
                                </bst.Col>
                                <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0"> Department <span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="deptId" >
                                        <option value="ALL">--ALL--</option>
                                        {showDeptNames != undefined && showDeptNames?.map((data, indexDept) => {
                                            return (<React.Fragment key={indexDept}>
                                                <option key={indexDept} value={data.dept_id}>
                                                    {data.dept_name}
                                                </option>
                                            </React.Fragment>);
                                        })}


                                    </Field>
                                    <ErrorMessage name="deptId" component="div" className="text-danger" ></ErrorMessage>
                                </bst.Col>

                            </bst.Row>
                            <bst.Row className="px-4 pt-4">

                                <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0">Upload Letter <span style={{ color: 'red' }}>*</span></label>
                                    <Field name="changeLetter">
                                        {({ field, form }) => (
                                            <input
                                                type="file"
                                                className="form-control mt-1"
                                                accept="application/pdf,image/jpeg,image/jpg"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        let fileVal = " ChangeLetter";
                                                        let filename = fileVal;
                                                        let path = "apolcms/uploads/StandingCounselLetter/";
                                                        form.setFieldValue("changeLetter", file);
                                                        ImagePdfBucket(e, form, path, `changeLetter`, filename);
                                                    }
                                                }}
                                            />
                                        )}
                                    </Field>

                                    <ErrorMessage name="changeLetter" component="div" className="text-danger" ></ErrorMessage>
                                </bst.Col>
                                <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0"> Remarks <span style={{ color: 'red' }}>*</span></label>
                                    <Field as='textarea' className='form-control' name="remarks" />
                                    <ErrorMessage name="remarks" component="div" className="text-danger" ></ErrorMessage>
                                </bst.Col>
                            </bst.Row>

                            <bst.Row className="px-2 pt-2" style={{ marginLeft: "20px" }}>
                                <bst.InputGroup className="mb-3">
                                    <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                        <button type="submit" className='btn btn-success mt-3'
                                        >Submit</button>
                                    </bst.Col>
                                </bst.InputGroup>
                            </bst.Row>
                        </Form>
                    </FormikProvider>
                </bst.Row>

                <bst.Row className="pt-2 pt-2 ">
                    {CounselData?.length > 0 ? (
                        <div style={{ width: "98%" }}>
                            <CommonReactTable data={CounselData} columns={columnsList} showFooter={"false"}
                                filename="Standing Consel Report" headerName="Standing Consel Report" />
                        </div>
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
                </bst.Row>




            </bst.Container>
        </>
    )
}

export default StandingCounsel