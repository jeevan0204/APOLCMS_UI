import React, { useEffect, useRef, useState } from 'react'
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import * as bst from "react-bootstrap"
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import AckDetailsPopup from '../Popups/AckDetailsPopup';

function EcourtsCaseSearch() {


    const [caseTypeShrtList, setCaseTypeShrtList] = useState([]);
    const [regYearList, setRegYearList] = useState([]);
    const [acknoList, setAcknoList] = useState([]);
    const [MainCaseNolist, setMainCaseNolist] = useState([]);
    const [YearList, setYearList] = useState([]);
    const [CasesList, setCasesList] = useState([]);

    const [errmsg, seterrmsg] = useState(false);

    const hasFetchedData = useRef(false)

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }

    const [showModelPopupNew, setModelPopupNew] = useState(false);
    const [PopupDataNew, setPopupDataNew] = useState([]);
    const [ackno, setAckno] = useState([]);



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
            GetCaseTypeShrtList();
            GetAckNoList();
            GetYearsList();
            hasFetchedData.current = true
        }
    }, []);

    const GetYearsList = () => {
        let url = config.url.COMMONSERVICE_URL + "getYearsList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setYearList(res.data);

            } else {
                setYearList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getYearsList names:", error);
        });
    }

    const GetAckNoList = () => {
        let url = config.url.local_URL + "EcourtsDeptInstructionNew";
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

    const GetCaseTypeShrtList = () => {
        let url = config.url.local_URL + "CaseTypesListShrtNEW";
        CommonAxiosGet(url).then((res) => {
            if (res.data.status === true) {
                setCaseTypeShrtList(res.data.caseTypesListShrt);

            } else {
                setCaseTypeShrtList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getCaseTypesListShrt names:", error);
        });
    };

    function GetRegYearList(caseType) {
        let url = config.url.local_URL + "yearByCaseType?caseType=" + caseType;
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                setRegYearList(res?.data?.YearbyCasetypes);

            } else {
                setRegYearList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getYearsList names:", error);
        });
    };

    function GetMainCaseNolist(type, year) {
        let url = config.url.local_URL + "NumberByCaseType?caseType=" + type + "&year=" + year;
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                setMainCaseNolist(res?.data?.caseTypesListShrt);

            } else {
                setMainCaseNolist([]);
            }
        }).catch((error) => {
            console.error("Error fetching maincaseno list:", error);
        });
    };


    const formIk = useFormik({
        initialValues: {
            oldNewType: "",
            caseType: "",
            regYear1: "",
            mainCaseNo: "",
            respodentName: "",
            petitionerName: "",
            regYear3: "",
            petAdv: "",
            resAdv: "",
            regYear4: "",
            filNo: "",
            filYear: "",

            ackNo: "",
            advocateName: "",
            petitionerName: ""

        }
    })

    const [showLegacyTable, setLegacyTable] = useState(false);
    function getMainCaseDetails(typeOfCase) {
        let type = typeOfCase;
        alert("type--" + type);
        const oldNewType = formIk?.values?.oldNewType;
        const caseType = formIk?.values?.caseType;

        const mainCaseNo = formIk?.values?.mainCaseNo;
        const respodentName = formIk?.values?.respodentName;
        const petitionerName = formIk?.values?.petitionerName;
        const regYear3 = formIk?.values?.regYear3;
        const petAdv = formIk?.values?.petAdv;
        const resAdv = formIk?.values?.resAdv;
        const regYear4 = formIk?.values?.regYear4;
        const filNo = formIk?.values?.filNo;
        const filYear = formIk?.values?.filYear;
        const ackNo = formIk?.values?.ackNo;
        const advocateName = formIk?.values?.advocateName ?? "";

        const regYear = formIk?.values?.regYear1;
        alert("regyear----->>" + regYear);
        if (oldNewType === "Legacy") {
            setLegacyTable(true);

            const url = config.url.local_URL + "SearchCasesList?oldNewType=" + oldNewType + "&type=" + type +
                "&caseType1=" + caseType + "&regYear1=" + regYear + "&regYear3=" + regYear3 + "&regYear4=" + regYear4 + "&mainCaseNo=" + mainCaseNo + "&respodentName=" + respodentName +
                "&petitionerName=" + petitionerName + "&petAdv=" + petAdv + "&resAdv=" + resAdv + "&filNo=" + filNo + "&filYear=" + filYear;
            CommonAxiosGet(url).then((res) => {
                if (res?.data?.status === true) {
                    setCasesList(res?.data?.CASESLISTOLD);
                } else {
                    setCasesList([]);
                    seterrmsg(true);
                }
            }).catch((error) => {
                console.error("Error fetching ContemptCasesAbstractReport list:", error);
            });
        }
        else {
            const url = config.url.local_URL + "SearchCasesList?oldNewType=" + oldNewType + "&type=" + type +
                "&ackNoo=" + ackNo + "&advocateName=" + advocateName +
                "&petitionerName=" + petitionerName;
            CommonAxiosGet(url).then((res) => {
                setLegacyTable(false);

                if (res?.data?.status === true) {
                    setCasesList(res?.data?.CASESLISTNEW);

                } else {
                    setCasesList([]);
                    seterrmsg(true);
                }
            }).catch((error) => {
                console.error("Error fetching ContemptCasesAbstractReport list:", error);
            });
        }
    }

    const handleCinoClick = (cino) => {
        let url = config.url.local_URL + "AssignedCasesToSections?cino=" + cino + "&fileCino=&SHOWPOPUP=SHOWPOPUP";
        CommonAxiosGet(url).then((res) => {
            if (res.data !== undefined) {
                setcino(res?.data?.fileCino);
                setModelPopup(true);
                setPopupData(res.data);

            } else {
                setPopupData([]);
            }
        }).catch((error) => {
            console.error("Error fetching popup:", error);
        });
    };

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
                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }}
                        onClick={() => { viewBucketImage(row?.original?.scanned_document_path); }} >
                        View
                    </h5>
                </center>
            ),
        },
        // {
        //     Header: 'Currently Pending at', accessor: "fullname",
        // },
        // {
        //     Header: 'Office Name', accessor: "org_unit_name_en",

        // },
        {
            Header: 'Date of Filing', accessor: "date_of_filing",

        },

        {
            Header: 'Case Reg Type.', accessor: "type_name_reg",

        },

        {
            Header: 'Case Reg No.', accessor: "reg_no",
        },

        {
            Header: 'Case Reg Year.', accessor: "reg_year",

        },

        // {
        //     Header: 'Prayer', accessor: "prayer",

        // },
        // {
        //     Header: 'SR Number', accessor: "fil_no",

        // },
        // {
        //     Header: 'Filing Year', accessor: "fil_year",
        // },
        // {
        //     Header: 'Date of Next List', accessor: "date_next_list",

        // },
        // {
        //     Header: 'Bench', accessor: "bench_name",

        // },

        {
            Header: 'Judge Name', accessor: "coram",

        },
        {
            Header: 'Petitioner', accessor: "pet_name",

        },
        // {
        //     Header: 'District', accessor: "dist_name",

        // },
        // {
        //     Header: 'Purpose', accessor: "purpose_name",

        // },
        {
            Header: 'Respondents', accessor: "res_name",

        },
        // {
        //     Header: 'Petitioner Advocate', accessor: "pet_adv",

        // },
        // {
        //     Header: 'Respondent Advocate', accessor: "res_adv",

        // },

        {
            Header: 'Status', accessor: "status",

        },
        {
            Header: 'Service type', accessor: "servicetype",

        },
        // {
        //     Header: 'Orders', accessor: "orderpaths",
        //     Cell: ({ row }) => {
        //         const orderList = row?.original?.orderpaths?.split("<br/>-") || [];
        //         return (
        //             <ul style={{ paddingLeft: "1rem", margin: 0 }}>
        //                 {orderList.map((item, index) => (
        //                     <li key={index}>{item.trim()}</li>
        //                 ))}
        //             </ul>
        //         );
        //     }
        // },
    ];

    const columnsNew = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,

        },
        {
            Header: 'Ack No.',
            accessor: "ack_no",
            Cell: ({ value, row }) => (
                <button
                    onClick={() => handleAckPopup(value)}
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
        {
            Header: 'Departments/Respondents',
            accessor: 'dept_descs',
            Cell: ({ value }) => {
                if (!value) return null;

                const items = value.split('<br>'); // Already numbered in data
                return (
                    <div>
                        {items.map((item, index) => (
                            <div key={index}>{item.trim()}</div>
                        ))}
                    </div>
                );
            },
        }
        ,
        { Header: 'Case Type', accessor: "case_full_name", },
        { Header: 'Main Case No.', accessor: "maincaseno" },
        { Header: 'Advocate CC No.', accessor: "advocateccno" },
        { Header: 'Advocate Name', accessor: "advocatename" },
        { Header: 'Petitioner', accessor: "petitioner_name" },
        { Header: 'Mode Of Filing', accessor: "mode_filing" },

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
                                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }}
                                        onClick={() => { viewBucketImage(row?.original?.barcode_file_path); }} >
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
                setModelPopupNew(true);
                setPopupDataNew(res.data);

            } else {
                setPopupDataNew([]);
            }
        }).catch((error) => {
            console.error("Error fetching popup:", error);
        });

    }


    return (
        <>
            <CommonFormHeader heading={"Case Search"} />
            <bst.Container className="outer-page-content-container">
                <div className="jumbotron mt20 form-card-jnb" style={{ marginTop: "5px" }}>

                    <FormikProvider value={formIk}>
                        <Form onChange={formIk.handleChange} onSubmit={formIk.handleSubmit} >
                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <bst.InputGroup className="mb-4p5">
                                        <div className="form-control-md">
                                            <Field type='radio' name="oldNewType" value='Legacy' onChange={(e) => { formIk.setFieldValue("ackNo", "") }} /> Legacy Cases &nbsp;
                                            <Field type='radio' name="oldNewType" value='New'
                                                onChange={(e) => {
                                                    formIk.setFieldValue("caseType", "");
                                                    formIk.setFieldValue("regYear", "");
                                                    formIk.setFieldValue("mainCaseNo", "");
                                                    setCasesList([]);
                                                    seterrmsg(false);
                                                }} /> New Cases
                                        </div>
                                        <ErrorMessage name="oldNewType" component="div" className="text-error" />
                                    </bst.InputGroup>
                                </bst.Col>
                            </bst.Row>
                            <bst.Row className="px-4" style={{ marginBottom: "5%" }}>
                                {formIk?.values?.oldNewType === "Legacy" && (<>
                                    <bst.Row className="px-4">
                                        <h6>Main Case No. (WP/WA/AS/CRP Nos.)</h6>
                                        <bst.Row className="px-2">
                                            <bst.Col xs={12} sm={12} md={3} lg={2} xl={2} xxl={2}>
                                                <Field as="select" className='form-control' name="caseType"
                                                    onChange={(e) => {
                                                        GetRegYearList(e.target.value);
                                                    }}>
                                                    <option value="">--Select--</option>

                                                    {caseTypeShrtList != undefined && caseTypeShrtList?.map((data, indexDept) => {
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

                                                <Field as="select" className='form-control' name="regYear1"
                                                    onChange={(e) => {
                                                        const type = formIk?.values?.caseType;
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
                                                <ErrorMessage name="regYear1" component="div" className="text-error" />
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

                                            <bst.Col xs={12} sm={12} md={3} lg={3} xl={2} xxl={2}>
                                                <div className='d-flex flex-row justify-content-end '>
                                                    <button type="button" className="btn btn-primary"
                                                        onClick={() => {
                                                            getMainCaseDetails("maincase");
                                                            formIk.resetForm();
                                                        }}

                                                    >Get Details</button>
                                                </div>
                                            </bst.Col>

                                        </bst.Row>
                                    </bst.Row>

                                    <bst.Row className="px-4 pt-5">
                                        <bst.InputGroup className="mb-3p5 mt-4">
                                            <span className="label-text-style field-mandatory">
                                                <b>Case Search By Party Name</b>
                                            </span>
                                        </bst.InputGroup>
                                        <bst.Row className="px-2">
                                            <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                                <label className="mb-0">Respondent Name</label>

                                                <Field type="text" className="form-control me-1 mt-0" name="respodentName" />
                                                <ErrorMessage name="respodentName" component="div" className="text-error" />
                                            </bst.Col>
                                            (or)
                                            <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                                <label className="mb-0">Petitioner Name</label>

                                                <Field type="text" className="form-control me-1 mt-0" name="petitionerName" />
                                                <ErrorMessage name="petitionerName" component="div" className="text-error" />
                                            </bst.Col>


                                            <bst.Col xs={12} sm={12} md={3} lg={2} xl={2} xxl={2}>
                                                <label className="mb-0">Year</label>

                                                <Field as="select" className='form-control' name="regYear3">
                                                    <option value="">--Select--</option>
                                                    {YearList != undefined && YearList?.map((data, indexDept) => {
                                                        return (<React.Fragment key={indexDept}>
                                                            <option key={indexDept} value={data.value}>
                                                                {data.label}
                                                            </option>
                                                        </React.Fragment>);
                                                    })}

                                                </Field>
                                                <ErrorMessage name="regYear3" component="div" className="text-error" />
                                            </bst.Col>

                                            <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                                <div className='d-flex flex-row justify-content-end mt-4'>
                                                    <button type="button" className="btn btn-primary"
                                                        onClick={(e) => {
                                                            getMainCaseDetails("party");
                                                            formIk.resetForm();
                                                        }
                                                        }
                                                    >Get Details</button>
                                                </div>
                                            </bst.Col>

                                        </bst.Row>
                                    </bst.Row>
                                    <bst.Row className="px-4 pt-5">
                                        <bst.InputGroup className="mb-3p5 mt-4">
                                            <span className="label-text-style field-mandatory">
                                                <b>Case Search By Advocate Name</b>
                                            </span>
                                        </bst.InputGroup>
                                        <bst.Row className="px-2">
                                            <bst.Col xs={12} sm={12} md={12} lg={3} xl={2} xxl={2}>
                                                <label className="mb-0">Petitioners Advocate Name</label>
                                                <Field type="text" className="form-control me-1 mt-0" name="petAdv" />
                                                <ErrorMessage name="petAdv" component="div" className="text-error" />
                                            </bst.Col>
                                            (or)
                                            <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>

                                                <label className="mb-0">Respondents Advocate Name</label>
                                                <Field type="text" className="form-control me-1 mt-0" name="resAdv" />
                                                <ErrorMessage name="resAdv" component="div" className="text-error" />
                                            </bst.Col>


                                            <bst.Col xs={12} sm={12} md={3} lg={2} xl={2} xxl={2}>

                                                <label className="mb-3">Year</label>
                                                <Field as="select" className='form-control' name="regYear4">
                                                    <option value="">--Select--</option>
                                                    {YearList != undefined && YearList?.map((data, indexDept) => {
                                                        return (<React.Fragment key={indexDept}>
                                                            <option key={indexDept} value={data.value}>
                                                                {data.label}
                                                            </option>
                                                        </React.Fragment>);
                                                    })}

                                                </Field>
                                                <ErrorMessage name="regYear4" component="div" className="text-error" />
                                            </bst.Col>

                                            <bst.Col xs={12} sm={12} md={3} lg={2} xl={2} xxl={2}>
                                                <div className='d-flex flex-row justify-content-end mt-4 mb-3'>
                                                    <button type="button" className="btn btn-primary"
                                                        onClick={(e) => { getMainCaseDetails("adv"); formIk.resetForm(); }}
                                                    >Get Details</button>
                                                </div>
                                            </bst.Col>

                                        </bst.Row>
                                    </bst.Row>

                                    <bst.Row className="px-4 pt-5">
                                        <bst.InputGroup className="mb-3p5 mt-4">
                                            <span className="label-text-style field-mandatory">
                                                <b>Case Search By Filing Number</b>
                                            </span>
                                        </bst.InputGroup>


                                        <bst.Row className="px-2">
                                            <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                                <label className="mb-0">Filing Number</label>
                                                <Field type="text" className="form-control me-1 mt-0" name="filNo" />
                                                <ErrorMessage name="filNo" component="div" className="text-error" />
                                            </bst.Col>

                                            <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>

                                                <label className="mb-0">Filing Year</label>

                                                <Field type="text" className="form-control me-1 mt-0" name="filYear" />
                                                <ErrorMessage name="filYear" component="div" className="text-error" />
                                            </bst.Col>
                                            <bst.Col xs={12} sm={12} md={3} lg={2} xl={2} xxl={2}>
                                                <div className='d-flex flex-row justify-content-end mt-4'>
                                                    <button type="button" className="btn btn-primary"
                                                        onClick={(e) => { getMainCaseDetails("file"); formIk.resetForm(); }}
                                                    >Get Details</button>
                                                </div>
                                            </bst.Col>
                                        </bst.Row>
                                    </bst.Row>



                                </>)}

                                {formIk?.values?.oldNewType === "New" && (<>
                                    <bst.Row className="px-2" style={{ marginLeft: "10px" }}>
                                        <bst.Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                                            <label className="mb-3">
                                                Select Acknowledge Number
                                            </label>
                                            <bst.Row>
                                                <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                                    <Field type="text" className="form-control me-1 mt-0" name="ackNo" maxLength='26' />
                                                    <ErrorMessage name="ackNo" component="div" className="text-error" />
                                                </bst.Col>
                                                <bst.Col xs={6} sm={6} md={6} lg={3} xl={2} xxl={2}>
                                                    <div className='d-flex flex-row justify-content-end '>
                                                        <button type="button" className="btn btn-primary"
                                                            onClick={(e) => { getMainCaseDetails("ackNo"); formIk.resetForm(); }}
                                                        >Get Details</button>
                                                    </div>
                                                </bst.Col>

                                            </bst.Row>
                                        </bst.Col>
                                    </bst.Row>

                                    <bst.Row className="px-4 pt-5">
                                        <bst.InputGroup className="mb-3p5 mt-4">
                                            <span className="label-text-style field-mandatory">
                                                <b>Case Search By Party Name</b>
                                            </span>
                                        </bst.InputGroup>
                                        <bst.Row className="px-2">
                                            <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                                <label className="mb-0">Advocate Name</label>

                                                <Field type="text" className="form-control me-1 mt-0" name="advocateName" />
                                                <ErrorMessage name="advocateName" component="div" className="text-error" />
                                            </bst.Col>
                                            (or)
                                            <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                                <label className="mb-0">Petitioner Name</label>

                                                <Field type="text" className="form-control me-1 mt-0" name="petitionerName" />
                                                <ErrorMessage name="petitionerName" component="div" className="text-error" />
                                            </bst.Col>


                                            <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                                <div className='d-flex flex-row justify-content-end mt-4'>
                                                    <button type="button" className="btn btn-primary"
                                                        onClick={(e) => { getMainCaseDetails("party"); formIk.resetForm(); }}>Get Details</button>
                                                </div>
                                            </bst.Col>

                                        </bst.Row>
                                    </bst.Row>
                                </>)}
                            </bst.Row>
                        </Form>
                    </FormikProvider>
                </div>
                <div style={{ marginTop: "5%" }}>
                    {showLegacyTable === true && <>
                        {CasesList?.length > 0 ? (
                            <CommonReactTable data={CasesList} columns={columnsList} showFooter={"true"}
                                filename="Cases List REPORT" />
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>}
                    {showLegacyTable === false && <>
                        {CasesList?.length > 0 ? (
                            <CommonReactTable data={CasesList} columns={columnsNew} showFooter={"true"}
                                filename="New Cases List REPORT" />
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>}
                </div>


            </bst.Container >
            <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={cino} viewdata={PopupData} />

            <AckDetailsPopup popupflagvalue={showModelPopupNew} setPopupflagvalue={setModelPopupNew} regularpopup={regularPopStatus}
                category={ackno} viewdata={PopupDataNew} />

        </>
    )
}

export default EcourtsCaseSearch