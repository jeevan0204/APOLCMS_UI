import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap";
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { config } from '../../CommonUtils/CommonApis';
import ImagePdfBucket from '../../CommonUtils/ImagePdfBase64';
import Swal from 'sweetalert2';
import { failureAlert, successAlert } from '../../CommonUtils/SweetAlerts';
import { Navigate } from 'react-router-dom';
import { ERROR_MSG } from '../../CommonUtils/contextVariables';
import * as Yup from 'yup';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';


function SectionOfficerChange() {
    const [showExistEmpNames, SetShowExistEmpNames] = useState([]);
    const [showHodNames, SetShowHodNames] = useState([]);
    const [showDesignation, SetShowDesignation] = useState([]);
    const [empList, SetEmpList] = useState([]);
    const [changedSOList, SetChangedSOList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);

    const userValidations = Yup.object().shape({

        prevEmployeeid: Yup.string().required(`${ERROR_MSG}`).nullable(),
        deptId: Yup.string().required(` ${ERROR_MSG}`).nullable(),
        designation: Yup.string().required(` ${ERROR_MSG}`).nullable(),
        employeeid: Yup.string().required(` ${ERROR_MSG}`).nullable(),
        mobileno: Yup.string().required(` ${ERROR_MSG}`).nullable(),
        emailid: Yup.string().required(` ${ERROR_MSG}`).nullable(),
        aadharno: Yup.string().required(` ${ERROR_MSG}`).nullable(),
        changeReasons: Yup.string().required(` ${ERROR_MSG}`).nullable(),
        changeLetter: Yup.string().required(`Upload file ${ERROR_MSG}`).nullable(),
    })


    const formIk = useFormik({
        initialValues: {
            prevEmployeeid: "",
            deptId: "",
            designation: "",
            employeeid: "",
            mobileno: "",
            aadharno: "",
            emailid: "",
            changeReasons: "",
            changeLetter: ""

        },
        validationSchema: userValidations,
        onSubmit: (values) => {
            if (values?.billImage && values.billImage.includes("fakepath")) {
                Swal.fire({
                    text: "Photo not uploaded correctly , Please upload it again",
                    icon: "warning",
                    backdrop: false,
                    allowOutsideClick: false,
                }).then((refresh) => {
                    if (refresh.isConfirmed) {
                        formIk.setFieldValue("billImage", "");
                    }
                })
            } else {
                const postValues = {
                    prevEmployeeid: formIk?.values?.prevEmployeeid,
                    deptId: formIk?.values?.deptId,

                    designation: formIk?.values?.designation,
                    employeeid: formIk?.values?.employeeid,
                    mobileno: formIk?.values?.mobileno,
                    aadharno: formIk?.values?.aadharno,
                    emailid: formIk?.values?.emailid,
                    changeReasons: formIk?.values?.changeReasons,
                    changeLetter: formIk?.values?.changeLetter
                };
                submitDetails(postValues)
            }
        }
    })



    const submitDetails = async (values) => {
        try {
            const res = await CommonAxiosPost(config.url.COMMONSERVICE_URL + "saveSectionChange", values);
            if (res != null) {
                if (res?.data?.scode === "01") {
                    successAlert(res?.data?.sdesc);
                    //  Navigate(-1);
                } else {
                    failureAlert(res?.data?.sdesc);
                }
            } else {
                failureAlert(res?.data?.sdesc);
            }
        } catch (e) {
            console.log("exception at catch block ===>" + e);
        }
    };

    useEffect(() => {
        GetExistingEmpNames();
        GetHodNames();
        GetDesignationList();
        GetChangedSOList();

    }, []);

    function GetChangedSOList() {
        let url = config.url.COMMONSERVICE_URL + "getchangedListData";
        CommonAxiosGet(url).then((res) => {
            console.log("--" + JSON.stringify(res.data))
            if (res.data && res.data.length > 0) {
                SetChangedSOList(res.data);

            } else {
                SetChangedSOList([]);
            }
        }).catch((error) => {
            console.error("Error fetching advocate names:", error);
        });
    }



    function GetDesignationList() {
        let url = config.url.COMMONSERVICE_URL + "GetDesignation";
        CommonAxiosGet(url).then((res) => {
            //  console.log("--" + JSON.stringify(res.data))
            if (res.data && res.data.length > 0) {
                SetShowDesignation(res.data);

            } else {
                SetShowDesignation([]);
            }
        }).catch((error) => {
            console.error("Error fetching advocate names:", error);
        });
    }

    function GetExistingEmpNames() {
        let url = config.url.COMMONSERVICE_URL + "GetExistingEmpNames";
        CommonAxiosGet(url).then((res) => {
            // console.log("--" + JSON.stringify(res.data))
            if (res.data && res.data.length > 0) {
                SetShowExistEmpNames(res.data);

            } else {
                SetShowExistEmpNames([]);
            }
        }).catch((error) => {
            console.error("Error fetching advocate names:", error);
        });
    }


    function GetHodNames() {
        let url = config.url.COMMONSERVICE_URL + "GetDepartmentNames";
        CommonAxiosGet(url).then((res) => {
            //  console.log("--" + JSON.stringify(res.data))
            if (res.data && res.data.length > 0) {
                SetShowHodNames(res.data);

            } else {
                SetShowHodNames([]);
            }
        }).catch((error) => {
            console.error("Error fetching dept names:", error);
        });
    }

    function populateEmpListExceptExisting(e) {
        const prevEmployeeid = formIk?.values?.prevEmployeeid;
        const deptId = formIk?.values?.deptId !== undefined ? formIk.values.deptId : 0;
        const designation = e.target.value;

        let url = config.url.COMMONSERVICE_URL + "GetEmpListExceptExisting?designation=" + designation + "&deptId=" + deptId + "&prevEmployeeid=" + prevEmployeeid;
        CommonAxiosGet(url).then((res) => {
            console.log("--" + JSON.stringify(res.data))
            if (res.data && res.data.length > 0) {
                SetEmpList(res.data);

            } else {
                SetEmpList([]);
            }
        }).catch((error) => {
            console.error("Error fetching dept names:", error);
        });
    }

    const columnsList = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Department Name', accessor: "description"

        },
        {
            Header: 'Employee Name', accessor: "fullname_en",
        },
        {
            Header: 'Designation', accessor: "designation_name_en",
        },
        {
            Header: 'Mobile', accessor: "mobileno",
        },
        {
            Header: 'Email Id', accessor: "emailid",
        },
        {
            Header: 'Aadhar Number', accessor: "aadharno",
        },

        {
            Header: 'Reasons', accessor: "change_reasons",
        },

        {
            Header: 'changeLetter', accessor: "change_letter_path",
        },

        {
            Header: 'Request Status',
            accessor: 'change_req_approved', // Keep accessor for sorting or filtering
            Cell: ({ value }) => (

                <button
                    style={{
                        backgroundColor: value === true ? "green" : "blue",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    {value === true ? "Approved" : "Not Approved"}
                </button>
            )
        }




    ];

    return (
        <>
            <bst.Container className="outer-page-content-container">
                <bst.Row className="px-4">
                    <bst.Col xs={12} sm={12} md={12} lg={10} xl={10} xxl={10}>

                        <div className='h5'>Section Officer Change Request Service </div>

                    </bst.Col>
                    <hr style={{ border: "1px solid gray" }} />
                </bst.Row>

                <FormikProvider value={formIk}>
                    <Form onChange={formIk.handleChange} onSubmit={formIk.handleSubmit} >
                        <bst.Row className="px-4 pt-4">
                            <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                <label htmlFor="prevEmployeeid" className="form-label">
                                    Existing Employee Name<span style={{ color: 'red' }}>*</span></label>
                                <Field as="select" className='form-control' name="prevEmployeeid"
                                >
                                    <option value="">--Select--</option>
                                    {showExistEmpNames != undefined && showExistEmpNames?.map((data, indexDept) => {
                                        return (<React.Fragment key={indexDept}>
                                            <option key={indexDept} value={data.value}>
                                                {data.label}
                                            </option>
                                        </React.Fragment>);
                                    })}


                                </Field>
                                <ErrorMessage name="prevEmployeeid" component="div" className="text-danger" ></ErrorMessage>

                            </bst.Col>
                        </bst.Row>
                        <bst.Row className="px-4 pt-4">
                            <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                <label htmlFor="deptId" className="form-label">
                                    Registered Head of the Department (HoD) <span style={{ color: 'red' }}>*</span></label>
                                <Field as="select" className='form-control' name="deptId"
                                >
                                    <option value="">--Select--</option>
                                    {showHodNames != undefined && showHodNames?.map((data, indexDept) => {
                                        return (<React.Fragment key={indexDept}>
                                            <option key={indexDept} value={data.value}>
                                                {data.label}
                                            </option>
                                        </React.Fragment>);
                                    })}


                                </Field>
                                <ErrorMessage name="deptId" component="div" className="text-danger" ></ErrorMessage>

                            </bst.Col>
                            <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                <label htmlFor="designation" className="form-label">
                                    Designation<span style={{ color: 'red' }}>*</span></label>
                                <Field as="select" className='form-control' name="designation"
                                    onChange={(e) => { populateEmpListExceptExisting(e) }}>
                                    <option value="">--Select--</option>
                                    {showDesignation != undefined && showDesignation?.map((data, indexDept) => {
                                        return (<React.Fragment key={indexDept}>
                                            <option key={indexDept} value={data.value}>
                                                {data.label}
                                            </option>
                                        </React.Fragment>);
                                    })}


                                </Field>
                                <ErrorMessage name="designation" component="div" className="text-danger" ></ErrorMessage>

                            </bst.Col>
                        </bst.Row>

                        <bst.Row className="px-4 pt-4">
                            <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                <label htmlFor="employeeid" className="form-label">
                                    Employee Name <span style={{ color: 'red' }}>*</span></label>
                                <Field as="select" className='form-control' name="employeeid"
                                >
                                    <option value="">--Select--</option>
                                    {empList != undefined && empList?.map((data, indexDept) => {
                                        return (<React.Fragment key={indexDept}>
                                            <option key={indexDept} value={data.value}>
                                                {data.label}
                                            </option>
                                        </React.Fragment>);
                                    })}


                                </Field>
                                <ErrorMessage name="employeeid" component="div" className="text-danger" ></ErrorMessage>

                            </bst.Col>
                        </bst.Row>
                        <bst.Row className="px-4 pt-4">
                            <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                <label htmlFor="mobileno" className="form-label">
                                    Mobile No <span style={{ color: 'red' }}>*</span></label>
                                <Field type="text" className='form-control' name="mobileno"
                                >


                                </Field>
                                <ErrorMessage name="mobileno" component="div" className="text-danger" ></ErrorMessage>

                            </bst.Col>

                            <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                <label htmlFor="emailid" className="form-label">
                                    Email Id <span style={{ color: 'red' }}>*</span></label>
                                <Field type="text" className='form-control' name="emailid"
                                >

                                </Field>
                                <ErrorMessage name="emailid" component="div" className="text-danger" ></ErrorMessage>

                            </bst.Col>

                            <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                <label htmlFor="aadharno" className="form-label">
                                    Aadhaar Number <span style={{ color: 'red' }}>*</span></label>
                                <Field type="text" className='form-control' name="aadharno"
                                >


                                </Field>
                                <ErrorMessage name="aadharno" component="div" className="text-danger" ></ErrorMessage>

                            </bst.Col>
                        </bst.Row>
                        <bst.Row className="px-4 pt-4">
                            <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                <label htmlFor="changeReasons" className="form-label">
                                    Reason for change Request  <span style={{ color: 'red' }}>*</span></label>
                                <Field as="textarea" className='form-control' name="changeReasons"
                                >
                                </Field>
                                <ErrorMessage name="changeReasons" component="div" className="text-danger" ></ErrorMessage>

                            </bst.Col>

                            <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                <label htmlFor="changeLetter" className="form-label">
                                    Upload Letter <span style={{ color: 'red' }}>*</span>
                                </label>

                                <Field name="changeLetter">
                                    {({ field, form }) => (
                                        <input
                                            type="file"
                                            className="form-control mt-3"
                                            accept="application/pdf,image/jpeg,image/jpg"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    let fileVal = "SectionOfficerChangeReqLetter";
                                                    let filename = fileVal;
                                                    let path = "jnbNivas/apolcms/uploads/changerequests/";
                                                    form.setFieldValue("changeLetter", file);
                                                    ImagePdfBucket(e, form, path, `changeLetter`, filename);
                                                }
                                            }}
                                        />
                                    )}
                                </Field>

                                <ErrorMessage name="changeLetter" component="div" className="text-danger" />
                            </bst.Col>


                        </bst.Row>

                        <bst.Row className="px-4 pt-4">
                            <bst.Col xs={4} sm={4} md={4} lg={2} xl={2} xxl={2}>
                                <div className='d-flex flex-row justify-content-end '>
                                    <button type="submit" className="btn btn-success">Submit</button>
                                </div></bst.Col>
                        </bst.Row>

                    </Form>
                </FormikProvider>&nbsp;
                {changedSOList?.length > 0 ? (
                    <CommonReactTable data={changedSOList} columns={columnsList} showFooter={"true"}
                        filename="Cases List" />
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}

            </bst.Container>

        </>

    )
}

export default SectionOfficerChange