import React, { useEffect, useRef, useState } from 'react'
import * as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup'
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { config } from '../../CommonUtils/CommonApis';
import { failureAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import ImagePdfBucket from '../../CommonUtils/ImagePdfBase64';
import { useSelector } from 'react-redux';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';
import AckDetailsPopup from '../Popups/AckDetailsPopup';

function EcourtsDeptInstructiontoPP() {
    const [caseTypesList, setCaseTypeList] = useState([]);
    const [regYearList, setRegYearList] = useState([]);
    const [acknoList, setAcknoList] = useState([]);
    const [MainCaseNolist, setMainCaseNolist] = useState([]);
    const [Instruction, showInstruction] = useState([]);
    const [existDataOld, setexistDataOld] = useState();
    const [existDataNew, setexistDataNew] = useState();

    const [showPrintData, setPrintData] = useState(true);
    const [casesList, setcasesList] = useState([]);
    const [casesListNew, setcasesListNew] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);

    const [ackno, setAckno] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    const [popupType, setPopupType] = useState("");

    function regularPopStatus() { setregularPopupFlag(false); }

    const [typeOfCase, showtypeOfCase] = useState([]);

    const hasFetchedData = useRef(false)

    const [dept, setdept] = useState(false);
    const logindetails = useSelector((state) => state.reducers.loginreducer);
    const deptcodee = logindetails?.userLoginDetials?.dept_code;
    useEffect(() => {
        if (deptcodee === "REV03") {
            console.log("dept----" + deptcodee);
            setdept(true);

        }
    }, [deptcodee]);


    useEffect(() => {
        if (!hasFetchedData.current) {
            GetCaseTypesList();
            GetRegYearList();
            GetAckNoList();
            hasFetchedData.current = true
        }
    }, []);

    const userValidations = Yup.object().shape({
        caseType: Yup.string().when("oldNewType", {
            is: (val) => val === "Legacy",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),

        regYear: Yup.string().when("oldNewType", {
            is: (val) => val === "Legacy",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        mainCaseNo: Yup.string().when("oldNewType", {
            is: (val) => val === "Legacy",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        ackNo: Yup.string().when("oldNewType", {
            is: (val) => val === "New",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),
    })

    const formIkEntry = useFormik({
        initialValues: {
            oldNewType: "",
            caseType: "",
            regYear: "",
            mainCaseNo: "",
            ackNo: ""
        },
        validationSchema: userValidations,
        onSubmit: (values) => {
            values.ackNoo = values.ackNo;
            let url = config.url.local_URL + "getCasesListEcourtsDeptPP";
            CommonAxiosPost(url, values, {
                headers: { "Content-Type": "application/json" }
            }).then((res) => {
                if (res?.data?.scode === '01') {
                    if (res?.data?.oldNewType === "New") {
                        setcasesListNew(res?.data?.data?.CASESLISTNEW);
                        setcino(res?.data?.data?.CASESLISTNEW[0]?.ack_no);
                        setexistDataNew(res?.data?.data?.existDataNew)
                        showtypeOfCase(res?.data?.oldNewType);
                        showInstruction(res?.data?.data?.showInstructions);
                        setcasesList([]);
                        setexistDataOld('')
                    }
                    else {
                        setcasesList(res?.data?.data?.CASESLISTOLD);
                        setcino(res?.data?.data?.CASESLISTOLD[0]?.cino);
                        setexistDataOld(res?.data?.data?.existDataOld)

                        showtypeOfCase(res?.data?.oldNewType);
                        showInstruction(res?.data?.data?.showInstructions);
                        setcasesListNew([]);
                        setexistDataNew('')
                    }

                } else {
                    failureAlert(res?.data?.sdesc);
                }
            });
        }
    })


    const GetCaseTypesList = () => {
        let url = config.url.local_URL + "getCaseTypeListPP";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setCaseTypeList(res.data);

            } else {
                setCaseTypeList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getCaseTypesListShrt names:", error);
        });
    };


    const GetRegYearList = () => {
        let url = config.url.COMMONSERVICE_URL + "getYearsList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setRegYearList(res.data);

            } else {
                setRegYearList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getYearsList names:", error);
        });
    };

    function GetMainCaseNolist(type, year) {
        let url = config.url.local_URL + "NumberbyCaseType?caseType=" + type + "&regYear=" + year;
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                setMainCaseNolist(res?.data?.data);

            } else {
                setMainCaseNolist([]);
            }
        }).catch((error) => {
            console.error("Error fetching maincaseno list:", error);
        });
    };

    const GetAckNoList = () => {
        let url = config.url.local_URL + "EcourtsDeptInstructiontoPP";
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                setAcknoList(res?.data?.data);
            } else {
                setAcknoList([]);
            }
        }).catch((error) => {
            console.error("Error fetching ackno list:", error);
        });
    };


    const validationNoraml = Yup.object().shape({
        daily_status: Yup.string().required("Required"),
        changeLetter: Yup.mixed().required("Required"),
    })

    const formIk = useFormik({
        initialValues: {
            daily_status: "",
            changeLetter: "",
        },
        enableReinitialize: true,
        validationSchema: validationNoraml,
        onSubmit: (values) => {
            console.log("heloo-----", values);
            values.cino = cino;
            values.instructions = values.daily_status;
            values.oldNewType = typeOfCase;
            const url = config.url.local_URL + "getSubmitCategoryecourtsDeptInstructionPP";
            CommonAxiosPost(url, values).then((res) => {
                if (res?.data?.scode === "01") {
                    successAlert2(res?.data?.data);
                } else {
                    failureAlert(res?.data?.sdesc);
                }
            }).catch((error) => {
                console.error("Error fetching legacy instructions submit:", error);
            });
        }

    })

    const userValidationsRev = Yup.object().shape({
        slno1: Yup.string().required("Required"),
        slno2: Yup.string().required("Required"),
        slno3a: Yup.string().required("Required"),
        slno3b: Yup.string().required("Required"),
        slno3c: Yup.string().required("Required"),
        slno3d: Yup.string().required("Required"),
        slno3e: Yup.string().required("Required"),
        slno4: Yup.string().required("Required"),
        slno5: Yup.string().required("Required"),
        slno6: Yup.string().required("Required"),
        slno7: Yup.string().required("Required"),
        slno8: Yup.string().required("Required"),
        slno8a: Yup.string().required("Required"),
        slno8b: Yup.string().required("Required"),
        slno9: Yup.string().required("Required"),
        slno10: Yup.string().required("Required"),
        slno11: Yup.string().required("Required"),
        slno12: Yup.string().required("Required"),
        slno13: Yup.string().required("Required"),
        slno14: Yup.string().required("Required"),
        changeLetter: Yup.mixed().required("Required"),
    });

    const formIknew = useFormik({
        initialValues: {
            slno1: "",
            slno2: "",
            slno3a: "",
            slno3b: "",
            slno3c: "",
            slno3d: "",
            slno3e: "",
            slno4: "",
            slno5: "",
            slno6: "",
            slno7: "",
            slno8: "",
            slno8a: "",
            slno8b: "",
            slno9: "",
            slno10: "",
            slno11: "",
            slno12: "",
            slno13: "",
            slno14: "",
            changeLetter: "",
        },
        enableReinitialize: false,
        validationSchema: userValidationsRev,

        onSubmit: (values) => {
            console.log("heloo-----", values);
            values.cino = cino;
            values.oldNewType = typeOfCase;
            const url = config.url.local_URL + "getSubmitCategoryecourtsDeptInstructionPP";
            CommonAxiosPost(url, values).then((res) => {
                if (res?.data?.scode === "01") {
                    successAlert2(res?.data?.data);
                } else {
                    failureAlert(res?.data?.sdesc);
                }
            }).catch((error) => {
                console.error("Error fetching legacy instraction submit:", error);
            });
        }
    });

    const columnsList = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'CINo', accessor: "cino",
            Cell: ({ value, row }) => (
                <button
                    onClick={() => handleCinoClick(value)}
                    style={{
                        backgroundColor: '#74b9db',
                        color: '#000',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                    {value}
                </button>
            )

        },
        {
            Header: 'Scanned Affidavit', accessor: "scanned_document_path",
            isClickable: true,
            Cell: ({ row }) => (
                <center>
                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.scanned_document_path); }} >
                        View
                    </h5>
                </center>
            ),
        },
        {
            Header: 'Currently Status', accessor: "fullname",
        },

        {
            Header: 'Date of Filing', accessor: "date_of_filing",

        },

        {
            Header: 'Case Reg No.', accessor: "reg_no",
        },
        {
            Header: 'Prayer', accessor: "prayer",

        },

        {
            Header: 'Filing No.', accessor: "fil_no",

        },
        {
            Header: 'Filing Year', accessor: "fil_year",
        },
        {
            Header: 'Date of Next List', accessor: "date_next_list",

        },

        {
            Header: 'Bench', accessor: "bench_name",

        },

        {
            Header: 'Judge Name', accessor: "coram",

        },
        {
            Header: 'Petitioner', accessor: "pet_name",

        },
        {
            Header: 'District', accessor: "dist_name",

        },
        {
            Header: 'Purpose', accessor: "purpose_name",

        },
        {
            Header: 'Respondents', accessor: "res_name",

        },
        {
            Header: 'Petitioner Advocate', accessor: "pet_adv",

        },
        {
            Header: 'Respondent Advocate', accessor: "res_adv",

        },

        {
            Header: 'Orders', accessor: "orderpaths",
            Cell: ({ row }) => {
                const orderList = row?.original?.orderpaths?.split("<br/>-") || [];
                return (
                    <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                        {orderList.map((item, index) => (
                            <li key={index}>{item.trim()}</li>
                        ))}
                    </ul>
                );
            }
        },


    ];

    const handleCinoClick = (cino) => {

        let url = config.url.local_URL + "AssignedCasesToSections?cino=" + cino + "&fileCino=&SHOWPOPUP=SHOWPOPUP";
        CommonAxiosGet(url).then((res) => {
            if (res.data !== undefined) {
                alert("test")
                setcino(res?.data?.fileCino);
                setModelPopup(true);
                setPopupData(res.data);
                setPopupType("legacy");

            } else {
                setPopupData([]);
            }
        }).catch((error) => {
            console.error("Error fetching popup:", error);
        });
    };

    const columnsListNew = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,

        },
        {
            Header: 'Ack No.',
            accessor: "ack_no",
            Cell: ({ value, row }) => (
                <button onClick={() => handleAckPopup(value)}
                    style={{
                        backgroundColor: '#74b9db',
                        color: '#000',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                    {value}
                </button>
            )
        },
        {
            Header: 'HC Ack No.', accessor: "hc_ack_no",
            Cell: ({ value }) => (
                <span style={{ color: '#00008B', fontWeight: 'bold' }}>
                    {value}
                </span>
            )
        },
        { Header: 'Date', accessor: "generated_date", },
        { Header: 'District.', accessor: "district_name", },
        { Header: 'Department', accessor: "dept_descs", },
        { Header: 'Case Type', accessor: "case_full_name", },
        { Header: 'Main Case No.', accessor: "maincaseno" },
        { Header: 'Advocate CC No.', accessor: "advocateccno" },
        { Header: 'Advocate Name', accessor: "advocatename" },

        {
            Header: 'Download / Print', accessor: "",
            Cell: ({ row }) => {
                const data = row.original;
                console.log("Data:", data.ack_file_path);

                return (
                    <div>
                        {
                            data.ack_file_path !== '' && (
                                <center>
                                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.ack_file_path); }} >
                                        Acknowledgement
                                    </h5>
                                </center>
                            )
                        }

                        {
                            data.barcode_file_path !== '' && (
                                <center>
                                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.barcode_file_path); }} >
                                        Barcode
                                    </h5>
                                </center>
                            )
                        }

                        {/* {data.hc_ack_no !== '-' && (
                                    <center>
                                        <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.barcode_file_path); }} >
                                            print Barcode
                                        </h5>
                                    </center>
                                )} */}

                    </div >
                );
            }
        },

    ];

    const handleAckPopup = (ackNo) => {
        let url = config.url.local_URL + "AckNoPopupView?SHOWPOPUP=SHOWPOPUP&cino=" + ackNo;
        CommonAxiosGet(url).then((res) => {
            if (res.data !== undefined) {
                alert("test-----new popup" + res?.data?.USERSLIST[0]?.ack_no)
                setAckno(res?.data?.USERSLIST[0]?.ack_no);
                setModelPopup(true);
                setPopupData(res.data);

            } else {
                setPopupData([]);
            }
        }).catch((error) => {
            console.error("Error fetching popup:", error);
        });

    }

    return (
        <>
            <CommonFormHeader heading="Instructions Entry" />
            <bst.Container className="outer-page-content-container">
                <div className="jumbotron mt20 form-card-jnb" style={{ marginTop: "5px" }}>
                    <FormikProvider value={formIkEntry}>
                        <Form onSubmit={formIkEntry.handleSubmit} onChange={formIkEntry.handleChange}>

                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <bst.InputGroup className="mb-4p5">
                                        <div className="form-control-md">
                                            <Field type='radio' name="oldNewType" value='Legacy' onChange={(e) => { formIkEntry.setFieldValue("ackNo", "") }} /> Legacy Cases &nbsp;
                                            <Field type='radio' name="oldNewType" value='New'
                                                onChange={(e) => {
                                                    formIkEntry.setFieldValue("caseType", "");
                                                    formIkEntry.setFieldValue("regYear", "");
                                                    formIkEntry.setFieldValue("mainCaseNo", "");
                                                }} /> New Cases
                                        </div>
                                        <ErrorMessage name="oldNewType" component="div" className="text-error" />
                                    </bst.InputGroup>
                                </bst.Col>
                            </bst.Row>
                            <bst.Row className="px-4" style={{ marginBottom: "5%" }}>
                                {formIkEntry?.values?.oldNewType === "Legacy" && (<>
                                    <bst.Row className="px-4">
                                        <bst.Row>
                                            <label className="mb-0"> Main Case No. (WP/WA/AS/CRP Nos.) <span style={{ color: 'red' }}>*</span></label>
                                        </bst.Row>
                                        <bst.Row className="px-2">
                                            <bst.Col xs={12} sm={12} md={3} lg={2} xl={2} xxl={2}>
                                                <Field as="select" className='form-control' name="caseType"
                                                >
                                                    <option value="">--Select--</option>

                                                    {caseTypesList != undefined && caseTypesList?.map((data, indexDept) => {
                                                        return (<React.Fragment key={indexDept}>
                                                            <option key={indexDept} value={data.value}>
                                                                {data.label}
                                                            </option>
                                                        </React.Fragment>);
                                                    })}

                                                </Field>
                                                <ErrorMessage name="caseType" component="div" className="text-error" />
                                            </bst.Col>
                                            <bst.Col xs={12} sm={12} md={3} lg={2} xl={2} xxl={2}>

                                                <Field as="select" className='form-control' name="regYear"
                                                    onChange={(e) => {
                                                        const type = formIkEntry?.values?.caseType;
                                                        GetMainCaseNolist(type, e.target.value);
                                                    }}>
                                                    <option value="">--Select--</option>
                                                    {regYearList != undefined && regYearList?.map((data, indexDept) => {
                                                        return (<React.Fragment key={indexDept}>
                                                            <option key={indexDept} value={data.value}>
                                                                {data.label}
                                                            </option>
                                                        </React.Fragment>);
                                                    })}

                                                </Field>
                                                <ErrorMessage name="regYear" component="div" className="text-error" />
                                            </bst.Col>
                                            <bst.Col xs={12} sm={12} md={3} lg={2} xl={2} xxl={2}>

                                                <Field as="select" className='form-control' name="mainCaseNo">
                                                    <option value="">--Select--</option>
                                                    {MainCaseNolist != undefined && MainCaseNolist?.map((data, indexDept) => {
                                                        return (<React.Fragment key={indexDept}>
                                                            <option key={indexDept} value={data.value}>
                                                                {data.label}
                                                            </option>
                                                        </React.Fragment>);
                                                    })}

                                                </Field>

                                                <ErrorMessage name="mainCaseNo" component="div" className="text-error" />
                                            </bst.Col>

                                            <bst.Col xs={12} sm={12} md={3} lg={4} xl={2} xxl={2}>
                                                <div className='d-flex flex-row justify-content-end '>
                                                    <button type="submit" className="btn btn-success">Get Details</button>
                                                </div>
                                            </bst.Col>

                                        </bst.Row>
                                    </bst.Row>
                                </>)}

                                {formIkEntry?.values?.oldNewType === "New" && (<>
                                    <bst.Row className="px-2" style={{ marginLeft: "10px" }}>
                                        <bst.Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                                            <label className="mb-0">
                                                Select Acknowledge Number<span style={{ color: 'red' }}>*</span>
                                            </label>



                                            <bst.Row>
                                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                                    <Field as="select" className='form-control' name="ackNo" >
                                                        <option value="">--Select--</option>

                                                        {acknoList != undefined && acknoList?.map((data, indexDept) => {
                                                            return (<React.Fragment key={indexDept}>
                                                                <option key={indexDept} value={data.value}>
                                                                    {data.label}
                                                                </option>
                                                            </React.Fragment>);
                                                        })}

                                                    </Field>
                                                    <ErrorMessage name="ackNo" component="div" className="text-error" />
                                                </bst.Col>
                                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                                    <div className='d-flex flex-row justify-content-end '>
                                                        <button type="submit" className="btn btn-success">Get Details</button>
                                                    </div>
                                                </bst.Col>

                                            </bst.Row>
                                        </bst.Col>
                                    </bst.Row>

                                </>)}
                            </bst.Row>

                        </Form>
                    </FormikProvider>
                </div >
                <bst.Row className="pt-2 pt-2 ">
                    {
                        casesList?.length > 0 ? (
                            <div style={{ width: "95%", marginTop: "5%" }}>
                                <CommonReactTable data={casesList} columns={columnsList} showFooter={"false"}
                                    filename="Cases List" heading="case details" />
                            </div>
                        ) : (errmsg && (<center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))

                    }

                    {
                        casesListNew?.length > 0 ? (
                            <div style={{ width: "95%", marginTop: "5%" }}>
                                <CommonReactTable data={casesListNew} columns={columnsListNew} showFooter={"false"}
                                    filename="New Cases List" />
                            </div>
                        ) : (errmsg && (<center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))
                    }
                </bst.Row>


                {Instruction.length > 0 && (

                    dept ? (<>

                        <FormikProvider value={formIknew}>
                            <Form onChange={formIknew.handleChange} onSubmit={formIknew.handleSubmit} >
                                <div className="table-container" style={{ marginTop: "5%" }}>
                                    <bst.Row className="px-4 pt-4">
                                        <div className="table-responsive">
                                            <table
                                                className="table table-condensed table-bordered table-striped"
                                                style={{ width: "100%" }}>
                                                <thead >
                                                    <tr style={{ backgroundColor: "#e3aa68" }}>
                                                        <th colSpan={5} className="sticky-header">
                                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                                                <span style={{ flex: 1, textAlign: "center" }}>Instructions to the Government Pleader for Taxes before the Hon'ble High Court of Andhra Pradesh, Amaravati</span>

                                                            </div>
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th className="sticky-header">S.No</th>
                                                        <th className="sticky-header">Description</th>
                                                        <th className="sticky-header">Details</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>Name of the Petitioner / W.P.No.</td>
                                                        <td><Field type="textarea" className="form-control" name="slno1" ></Field>
                                                            <ErrorMessage name="slno1" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>2</td>
                                                        <td>Name of the Act	</td>
                                                        <td><Field type="textarea" className="form-control" name="slno2" ></Field>
                                                            <ErrorMessage name="slno2" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>3</td>
                                                        <td>The information relating to the Service of Notice/Order
                                                            (Clearly mentioning the above particulars substantiates the department's compliance with
                                                            due process in issuing and serving the notices/orders effectively)</td>
                                                        <td>

                                                            <bst.Row className="px-4 pt-4">
                                                                <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                                    <label className="mb-0"> 3a. Notice/Order DIN No. & Date: </label>
                                                                    <Field as='textarea' name='slno3a' className='form-control' />
                                                                    <ErrorMessage name="slno3a" component="div" className="text-error" />
                                                                </bst.Col>
                                                            </bst.Row>
                                                            <bst.Row className="px-4 pt-4">
                                                                <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                                    <label className="mb-0"> 3b. Mode of Service: [Registered Post/Speed Post/Email/Personal Service] </label>
                                                                    <Field as='textarea' name='slno3b' className='form-control' />
                                                                    <ErrorMessage name="slno3b" component="div" className="text-error" />
                                                                </bst.Col>
                                                            </bst.Row>
                                                            <bst.Row className="px-4 pt-4">
                                                                <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                                    <label className="mb-0"> 3c. Date of Dispatch:</label>
                                                                    <Field as='textarea' name='slno3c' className='form-control' />
                                                                    <ErrorMessage name="slno3c" component="div" className="text-error" />
                                                                </bst.Col>
                                                            </bst.Row>
                                                            <bst.Row className="px-4 pt-4">
                                                                <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                                    <label className="mb-0">3d. Date of Actual Service: </label>
                                                                    <Field as='textarea' name='slno3d' className='form-control' />
                                                                    <ErrorMessage name="slno3d" component="div" className="text-error" />
                                                                </bst.Col>
                                                            </bst.Row>
                                                            <bst.Row className="px-4 pt-4">
                                                                <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                                    <label className="mb-0">3e. Date of Acknowledgment:</label>
                                                                    <Field as='textarea' name='slno3e' className='form-control' />
                                                                    <ErrorMessage name="slno3e" component="div" className="text-error" />
                                                                </bst.Col>
                                                            </bst.Row>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>4</td>
                                                        <td>Brief facts of the case
                                                            (clearly narrate the issue under dispute)</td>
                                                        <td><Field type="textarea" className="form-control" name="slno4" ></Field>
                                                            <ErrorMessage name="slno4" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>5</td>
                                                        <td>Issues raised by the petitioner
                                                            (Briefly mention the main issues or allegations raised by the petitioner)</td>
                                                        <td><Field type="textarea" className="form-control" name="slno5" ></Field>
                                                            <ErrorMessage name="slno5" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>6</td>
                                                        <td>Counter points of the Department against issues raised by the petitioner in column No.4
                                                            (clearly & precisely outline the stand of the Department in response to each issue raised by the petitioner)</td>
                                                        <td><Field type="textarea" className="form-control" name="slno6" ></Field>
                                                            <ErrorMessage name="slno6" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>7</td>
                                                        <td>Relevant provisions of the act
                                                            (mention applicable sections, rules, notification, circulars and case laws to support the departmental stance)</td>
                                                        <td><Field type="textarea" className="form-control" name="slno7" ></Field>
                                                            <ErrorMessage name="slno7" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>8</td>
                                                        <td>Mention the following points clearly indicating the reasons for opposing the writ petition	</td>
                                                        <td><Field type="textarea" className="form-control" name="slno8" ></Field>
                                                            <ErrorMessage name="slno8" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>8a</td>
                                                        <td>Maintainability
                                                            (Generally, if there exists an effective and alternative statutory remedy
                                                            (e.g., appeal, revision), the writ petition may not be maintainable unless there are exceptional circumstances
                                                            such as violation of fundamental rights, natural justice, or jurisdictional errors)</td>
                                                        <td><Field type="textarea" className="form-control" name="slno8a" ></Field>
                                                            <ErrorMessage name="slno8a" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>8b</td>
                                                        <td>Limitation period
                                                            (Although no explicit limitation period is fixed for writ petitions, courts expect petitions to be filed promptly and without undue delay.
                                                            Delayed petitions might be dismissed on grounds of laches (unexplained delay) unless adequately justified)</td>
                                                        <td><Field type="textarea" className="form-control" name="slno8b" ></Field>
                                                            <ErrorMessage name="slno8b" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>9</td>
                                                        <td>Mention specific reasons and material on record based upon which the assessment orders is passed
                                                            by invoking Section 74 of the CGST/APGST Act 2017 (in Fraud cases)</td>
                                                        <td><Field type="textarea" className="form-control" name="slno9" ></Field>
                                                            <ErrorMessage name="slno9" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>10</td>
                                                        <td>Specific instructions based on the above to the G.P. for effective argument of the case.
                                                            (Provide the gist of the case supporting the Departmental stance)</td>
                                                        <td><Field type="textarea" className="form-control" name="slno10" ></Field>
                                                            <ErrorMessage name="slno10" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>11</td>
                                                        <td>Prayer
                                                            (Request dismissal of the petition clearly stating no valid grounds exist warranting judicial intervention,
                                                            seeking upholding of the departmental action as lawful and justified)</td>
                                                        <td><Field type="textarea" className="form-control" name="slno11" ></Field>
                                                            <ErrorMessage name="slno11" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>12</td>
                                                        <td>Name of the Respondent</td>
                                                        <td><Field type="text" className="form-control" name="slno12" placeholder="Name of the Respondent"></Field>
                                                            <ErrorMessage name="slno12" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>13</td>
                                                        <td>Designation</td>
                                                        <td><Field type="text" className="form-control" name="slno13" placeholder="Designation"></Field>
                                                            <ErrorMessage name="slno13" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>14</td>
                                                        <td>Mobile No</td>
                                                        <td><Field type="text" className="form-control" name="slno14" placeholder="Mobile No"></Field>
                                                            <ErrorMessage name="slno14" component="div" className="text-danger" ></ErrorMessage>
                                                        </td>
                                                    </tr>


                                                </tbody>
                                            </table>
                                        </div>
                                    </bst.Row>
                                    <bst.Row className="px-4 pt-4">
                                        <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                            <label className="mb-0">
                                                Upload file: <span style={{ color: 'red' }}>*</span>
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
                                                                let fileVal = "instruction_" + cino;
                                                                let filename = fileVal;
                                                                let path = "apolcms/uploads/instructions/";
                                                                formIknew.setFieldValue("changeLetter", file);
                                                                ImagePdfBucket(e, form, path, `changeLetter`, filename);
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="changeLetter" component="div" className="text-danger" />
                                        </bst.Col>
                                    </bst.Row>
                                    <bst.Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4}>
                                        <button type="submit" className='btn btn-success mt-4' style={{ marginLeft: "40px" }}>Submit</button>
                                    </bst.Col>

                                </div>

                            </Form>
                        </FormikProvider>
                    </>) : (
                        <>
                            <div className="inner-herbpage-service-title-sub" style={{ marginLeft: "20px" }}>
                                <h1>
                                    <span>Instructions</span>
                                </h1>
                            </div>
                            <FormikProvider value={formIk}>
                                <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange}>
                                    <div>
                                        <bst.Row className="px-4 pt-4">
                                            <bst.Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                                                <label className="mb-0">
                                                    Status: <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <Field as='textarea' className='form-control' name="daily_status" />
                                                <ErrorMessage name="daily_status" component="div" className="text-danger" />
                                            </bst.Col>
                                        </bst.Row>
                                        <bst.Row className="px-4 pt-4">
                                            <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                <label className="mb-0">
                                                    Upload file: <span style={{ color: 'red' }}>*</span>
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
                                                                    let fileVal = "instruction_" + cino;
                                                                    let filename = fileVal;
                                                                    let path = "apolcms/uploads/instructions/";
                                                                    formIk.setFieldValue("changeLetter", file);
                                                                    ImagePdfBucket(e, form, path, `changeLetter`, filename);
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                                <ErrorMessage name="changeLetter" component="div" className="text-danger" />
                                            </bst.Col>
                                        </bst.Row>
                                        <bst.Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4}>
                                            <button type="submit" className='btn btn-success mt-4' style={{ marginLeft: "40px" }}>Submit</button>
                                        </bst.Col>
                                    </div>
                                </Form>
                            </FormikProvider>
                        </>
                    ))}




                {Array.isArray(existDataOld) && existDataOld.length > 0 && <>

                    <bst.Row style={{ marginTop: "5%", marginLeft: "1%" }}>
                        <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <table className="table  table-bordered  table-responsive commontbl" style={{ width: "80%" }}>
                                <thead>
                                    <tr>

                                        <th>Sl.No</th>
                                        <th>Description</th>
                                        <th>Submitted On</th>
                                        <th>Uploaded Instructions File</th>
                                        <th>Generated Instructions File</th>

                                        <th>Reply Instructions</th>
                                        <th>Reply Submitted On</th>
                                        <th>Reply Uploaded Instructions File</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: "left" }}>
                                    {Array.isArray(existDataOld) &&
                                        existDataOld.map((party, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{party?.instructions}</td>
                                                <td>{party?.insert_time}</td>
                                                <td>

                                                    <center>
                                                        <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(party?.upload_fileno); }} >
                                                            View Uploaded File
                                                        </h5>
                                                    </center>

                                                </td>
                                                <td>

                                                    <center>
                                                        <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(party?.generated_file); }} >
                                                            View Uploaded File
                                                        </h5>
                                                    </center>

                                                </td>
                                                <td>{party?.reply_instructions}</td>
                                                <td>{party?.reply_insert_time}</td>
                                                <td>

                                                    <center>
                                                        <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(party?.reply_upload_fileno); }} >
                                                            View Uploaded File
                                                        </h5>
                                                    </center>

                                                </td>
                                            </tr>
                                        ))}
                                </tbody>

                            </table>
                        </bst.Col>
                    </bst.Row>

                </>}

                {Array.isArray(existDataNew) && existDataNew.length > 0 && <>
                    <div className="card">
                        <div style={{
                            backgroundColor: '#989b9c',
                            color: '#ffffff',
                            borderRadius: '10px',
                            boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                            display: 'inline-block',
                            width: '200px',
                            height: '40px',
                            marginTop: '20px',
                            marginLeft: '10px',
                            textAlign: 'center'
                        }}>
                            Instructions submitted
                        </div>
                        <div className="card-body RowColorForLeave">
                            <bst.Row>
                                <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                    <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                        <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                            <tr>

                                                <th>Sl.No</th>
                                                <th>Description</th>
                                                <th>Submitted On</th>
                                                <th>Uploaded Instructions File</th>
                                                <th>Generated Instructions File</th>
                                                <th>Reply Instructions</th>
                                                <th>Reply Submitted On</th>
                                                <th>Reply Uploaded Instructions File</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ textAlign: "left" }}>
                                            {Array.isArray(existDataNew) &&
                                                existDataNew.map((party, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{party?.instructions}</td>
                                                        <td>{party?.insert_time}</td>
                                                        <td>

                                                            <center>
                                                                <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(party?.upload_fileno); }} >
                                                                    View Uploaded File
                                                                </h5>
                                                            </center>

                                                        </td>
                                                        <td>

                                                            <center>
                                                                <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(party?.generated_file); }} >
                                                                    View Uploaded File
                                                                </h5>
                                                            </center>

                                                        </td>
                                                        <td>{party?.reply_instructions}</td>
                                                        <td>{party?.reply_insert_time}</td>
                                                        <td>

                                                            <center>
                                                                <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(party?.reply_upload_fileno); }} >
                                                                    View Uploaded File
                                                                </h5>
                                                            </center>

                                                        </td>

                                                    </tr>
                                                ))}
                                        </tbody>

                                    </table>
                                </bst.Col>
                            </bst.Row>
                        </div>
                    </div>

                </>}
            </bst.Container>
            {popupType === "legacy" && showModelPopup && (

                <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                    category={cino} viewdata={PopupData} />
            )}

            {popupType === "new" && showModelPopup && (
                <AckDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                    category={ackno} viewdata={PopupData} />
            )}

        </>
    )
}

export default EcourtsDeptInstructiontoPP