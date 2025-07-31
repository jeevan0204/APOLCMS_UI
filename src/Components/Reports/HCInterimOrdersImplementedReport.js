import React, { useEffect, useRef, useState } from 'react'
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import * as bst from "react-bootstrap"
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';

function HCInterimOrdersImplementedReport() {
    const [InterimcasesList, setInterimcasesList] = useState([]);
    const [casesList, setcasesList] = useState([]);
    const [LEGACYcasesList, setLEGACYcasesList] = useState([]);
    const [NEWcasesList, setNEWcasesList] = useState([]);
    const [CCcasesList, setCCcasesList] = useState([]);
    const [errmsg, seterrmsg] = useState([]);
    const [heading, setHeading] = useState([]);
    const [headingCC, setHeadingCC] = useState([]);
    const [headingFresh, setHeadingFresh] = useState([]);
    const [headingLegacy, setHeadingLegacy] = useState([]);

    const [showDrillCount, setDrillCount] = useState();
    const [showData, setshowData] = useState();

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }

    const hasFetchedData = useRef(false)
    useEffect(() => {
        if (!hasFetchedData.current) {
            showGetData();
            hasFetchedData.current = true
        }
    }, []);

    function showGetData() {
        const reportType = formIk.values?.reportType;
        const fromDate = formIk.values?.fromDate;
        const toDate = formIk?.values?.toDate;
        let Url = config.url.local_URL + "InterimOrdersImplReport?fromDate=" + fromDate + "&toDate=" + toDate;
        setshowData("ioi");

        CommonAxiosGet(Url).then((res) => {
            setDrillCount(0);

            if (res?.data?.status === true) {
                setInterimcasesList(res?.data?.interimORDERSREPORT);
            }
            else {
                setInterimcasesList([]);
                seterrmsg(true);
            }
        })
    }
    const formIk = useFormik({
        initialValues: {
            reportType: "",
            fromDate: "",
            toDate: ""

        },
        onSubmit: (values) => {

            if (values.reportType === "IOI") {
                getInterimOrdersImplReport();
                setshowData("ioi");

            }
            else if (values.reportType === "CC") {
                getCCCasesReport();
                setshowData("cc");

            }
            else if (values.reportType === "NEW") {
                getNewCasesReport();
                setshowData("new");

            }
            else if (values.reportType === "LEGACY") {
                getLegacyCasesReport();
                setshowData("legacy");

            }
            else {
                getInterimOrdersImplReport();
                setshowData("ioi");

            }
        }
    })

    const columnsList = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'District', accessor: "district_name",


        },
        {
            Header: 'Orders Issued', accessor: "casescount",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'ALL');

                    }}
                >
                    {row.original.casescount}
                </div>
            ),
            Footer: 'casescount'

        },
        {
            Header: 'Orders Implemented', accessor: "order_implemented",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'INTERIMORDER');

                    }}
                >
                    {row.original.order_implemented}
                </div>
            ),
            Footer: 'order_implemented'

        },
        {
            Header: 'Appeal Filed', accessor: "appeal_filed",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'APPEALFILEDINTERIMORDER');

                    }}
                >
                    {row.original.appeal_filed}
                </div>
            ),
            Footer: 'appeal_filed'
        },
        {
            Header: 'Dismissed /Closed', accessor: "dismissed_copy",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'DISMISSEDINTERIMORDER');

                    }}
                >
                    {row.original.dismissed_copy}
                </div>
            ),
            Footer: 'dismissed_copy'

        },

        {
            Header: 'Pending', accessor: "pending",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'PENDINGINTERIMORDER');

                    }}
                >
                    {row.original.pending}
                </div>
            ),
            Footer: 'pending'

        },
        {
            Header: 'Action Taken %', accessor: "actoin_taken_percent",
        },
    ];

    const [showL2, setL2] = useState(false);
    function getCasesWiseList(districtid, districtname, status) {
        let Url = config.url.local_URL + "CasesListInterim?caseStatus=" + status + "&distName=" + districtname + "&distid=" + districtid;
        setshowData("caseslist")
        CommonAxiosGet(Url).then((res) => {

            if (res?.data?.status === true) {
                setcasesList(res?.data?.CASESLIST);
                setHeading(res?.data?.HEADING);
                setL2(true);
                setL1(false);
            }
            else {
                setL2(true);
                setL1(false);
                setcasesList([]);
                seterrmsg(true);
            }
        })
    }

    const [showL1, setL1] = useState(false);
    function getInterimOrdersImplReport() {
        const fromDate = formIk.values?.fromDate;
        const toDate = formIk?.values?.toDate;
        let Url = config.url.local_URL + "InterimOrdersImplReport?fromDate=" + fromDate + "&toDate=" + toDate;
        setshowData("ioi");

        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                setInterimcasesList(res?.data?.interimORDERSREPORT);
                setHeading(res?.data?.HEADING);
                setL1(true);
            }
            else {
                setInterimcasesList([]);
                setL1(true);
                seterrmsg(true);
            }
        })
    }

    function getCCCasesReport() {
        const fromDate = formIk.values?.fromDate;
        const toDate = formIk?.values?.toDate;
        let Url = config.url.local_URL + "CCCasesReportInterim?fromDate=" + fromDate + "&toDate=" + toDate;
        setshowData("cc");

        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                setCCcasesList(res?.data?.CCCASESREPORT);
                setHeadingCC(res?.data?.HEADING);
            }
            else {
                setCCcasesList([]);
                seterrmsg(true);
            }
        })
    }
    function getNewCasesReport() {
        const fromDate = formIk.values?.fromDate;
        const toDate = formIk?.values?.toDate;
        let Url = config.url.local_URL + "NewCasesReportInterim?fromDate=" + fromDate + "&toDate=" + toDate;
        setshowData("new");

        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                setNEWcasesList(res?.data?.FRESHCASESREPORT);
                setHeadingFresh(res?.data?.HEADING);
            }
            else {
                setNEWcasesList([]);
                seterrmsg(true);
            }
        })
    }
    function getLegacyCasesReport() {
        const fromDate = formIk.values?.fromDate;
        const toDate = formIk?.values?.toDate;
        let Url = config.url.local_URL + "LegacyCasesReportInterim?fromDate=" + fromDate + "&toDate=" + toDate;
        setshowData("legacy");

        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                setLEGACYcasesList(res?.data?.LEGACYCASESREPORT);
                setHeadingLegacy(res?.data?.HEADING);
            }
            else {
                setLEGACYcasesList([]);
                seterrmsg(true);
            }
        })
    }

    const columnsFreshLegacyCC = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'District', accessor: "district_name",
        },
        {
            Header: 'Cases Count', accessor: "casescount",
            Footer: 'casescount'
        },
        {
            Header: 'Counters Filed', accessor: "counterscount",
            Footer: 'counterscount'
        },

    ];

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

    const columns = [
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
                        Scanned Affidavit
                    </h5>
                </center>
            ),
        },

        {
            Header: 'Date of Filing', accessor: "date_of_filing",

        },

        {
            Header: 'Case Reg No.', accessor: "reg_no",
        },

        {
            Header: 'Filing Year', accessor: "fil_year",
        },
        {
            Header: 'Filing Year', accessor: "reg_year",

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

    function isBackFunction() {
        setDrillCount(showDrillCount - 1);
        setshowData("ioi");
    }

    return (
        <>
            <CommonFormHeader heading="District Wise Report" />
            <bst.Container className='outer-page-content-container'>
                <bst.Row className="pt-2 pt-2 ">
                    <FormikProvider value={formIk}>
                        <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                            <div className="border px-13 pb-13 mb-4 pt-1" >
                                <bst.Row className="px-4 pt-4 mb-4" >
                                    <bst.Col xs={8} sm={8} md={8} lg={2} xl={2} xxl={2}>
                                        <label className="mb-0">Report Type <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control mt-2' name="reportType" >
                                            <option value="0">--SELECT--</option>
                                            <option value="CC">CC (Contempt Cases)</option>
                                            <option value="IOI">Interim Orders Implementation Report</option>
                                            <option value="NEW">Fresh Cases Report</option>
                                            <option value="LEGACY">Legacy Cases Report</option>
                                        </Field>
                                        <ErrorMessage name="reportType" component="div" className="text-danger" ></ErrorMessage>
                                    </bst.Col>
                                    <bst.Col xs={8} sm={8} md={8} lg={2} xl={2} xxl={2}>
                                        <label className="mb-0"> From Date <span style={{ color: 'red' }}>*</span></label>
                                        <Field type="date" name="fromDate" className="form-control mt-2" />
                                        <ErrorMessage name="fromDate" component="div" className="text-danger" ></ErrorMessage>
                                    </bst.Col>
                                    <bst.Col xs={8} sm={8} md={8} lg={2} xl={2} xxl={2}>
                                        <label className="mb-0">To Date <span style={{ color: 'red' }}>*</span></label>
                                        <Field type="date" name="toDate" className="form-control mt-2" />
                                        <ErrorMessage name="toDate" component="div" className="text-danger" ></ErrorMessage>
                                    </bst.Col>

                                    <bst.Col xs={8} sm={8} md={8} lg={2} xl={2} xxl={2}>
                                        <button type="submit" className='btn btn-primary btn-md rounded mt-4' >Show Report</button>
                                    </bst.Col>
                                </bst.Row>

                            </div>
                        </Form>
                    </FormikProvider>
                </bst.Row>
                <bst.Row className="pt-2 pt-2 ">
                    {showL1 && (<>
                        {InterimcasesList?.length > 0 ? (
                            <div style={{ width: "98%" }}>
                                <CommonReactTable data={InterimcasesList} columns={columnsList} showFooter={"false"}
                                    filename="Interim Order Impl Report" headerName={heading} />
                            </div>
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}


                    {showData === "cc" && (<>
                        {CCcasesList?.length > 0 ? (
                            <div style={{ width: "98%" }}>
                                <CommonReactTable data={CCcasesList} columns={columnsFreshLegacyCC} showFooter={"false"}
                                    filename="Interim Order Impl cc cases Report" headerName={headingCC} />
                            </div>
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}



                    {showData === "new" && (<>
                        {NEWcasesList?.length > 0 ? (
                            <div style={{ width: "98%" }}>
                                <CommonReactTable data={NEWcasesList} columns={columnsFreshLegacyCC} showFooter={"false"}
                                    filename="Interim Order Impl new cases Report" headerName={headingFresh} />
                            </div>
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}


                    {showData === "legacy" && (<>
                        {LEGACYcasesList?.length > 0 ? (
                            <div style={{ width: "98%" }}>
                                <CommonReactTable data={LEGACYcasesList} columns={columnsFreshLegacyCC} showFooter={"false"}
                                    filename="Interim Order Impl legacy cases Report" headerName={headingLegacy} />
                            </div>
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}

                    {showL2 && (<>
                        {casesList?.length > 0 ? (<>
                            <bst.Row>
                                <bst.Col xs={12} sm={12} md={12} lg={11} xl={11} xxl={11}></bst.Col>
                                <bst.Col xs={12} sm={12} md={12} lg={1} xl={1} xxl={1} className="px-5 py-1">
                                    <button type="button" className="btn btn-sm btn-secondary"
                                        onClick={() => {
                                            setL2(false);
                                            setL1(true);
                                        }}>Back</button>
                                </bst.Col>
                            </bst.Row>

                            <center className="text-danger h6">*** No Data Found ***</center>
                        </>
                        ) : (
                            <>
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={11} xl={11} xxl={11}></bst.Col>
                                    <bst.Col xs={12} sm={12} md={12} lg={1} xl={1} xxl={1} className="px-5 py-1">
                                        <button type="button" className="btn btn-sm btn-secondary"
                                            onClick={() => {
                                                setL2(false);
                                                setL1(true);
                                            }}>Back</button>
                                    </bst.Col>
                                </bst.Row>
                                <div className="inner-herbpage-service-title-sub">
                                    {/* <h1>{headingCases}</h1> */}
                                </div>
                                <CommonReactTable data={casesList} columns={columns} showFooter={"false"}
                                    filename="Interim Order Impl cases list Report" />

                            </>
                        )}
                    </>
                    )}
                </bst.Row>

            </bst.Container>
            <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={cino} viewdata={PopupData} />


        </>)
}

export default HCInterimOrdersImplementedReport