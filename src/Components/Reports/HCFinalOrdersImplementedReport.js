import React, { useEffect, useRef, useState } from 'react'
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import * as bst from "react-bootstrap"
import { ErrorMessage, Field, Form, Formik, FormikProvider, useFormik } from 'formik'
import CommonReactTable from '../../CommonUtils/CommonReactTable'
import { config } from '../../CommonUtils/CommonApis'
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios'
import { viewBucketImage } from '../../CommonUtils/ViewImagelm'
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup'

function HCFinalOrdersImplementedReport() {
    const [finalcasesList, setFinalcasesList] = useState();
    const [casesList, setcasesList] = useState([]);
    const [LEGACYcasesList, setLEGACYcasesList] = useState([]);
    const [NEWcasesList, setNEWcasesList] = useState([]);
    const [CCcasesList, setCCcasesList] = useState([]);
    const [FOIcasesList, setFOIcasesList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [HEADING, setHEADING] = useState([]);
    const [showData, setshowData] = useState("");

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }

    const [showDrillCount, setDrillCount] = useState();


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
        let Url = config.url.local_URL + "FinalOrdersImplReport?fromDate=" + fromDate + "&toDate=" + toDate;
        setshowData("foi");
        CommonAxiosGet(Url).then((res) => {

            if (res?.data?.status === true) {
                setDrillCount(0);

                setFinalcasesList(res?.data?.FINALORDERSREPORT);
                setHEADING(res?.data?.HEADING);

            }
            else {
                setFinalcasesList([]);
                seterrmsg(true);
            }
        })
    }
    console.log("-----", showDrillCount, showData);



    const formIk = useFormik({
        initialValues: {
            reportType: "",
            fromDate: "",
            toDate: ""

        },
        onSubmit: (values) => {
            if (values.reportType === "FOI") {
                setshowData("foi");
                showGetData();
            }
            else if (values.reportType === "CC") {
                setshowData("cc");
                getCCCasesReport();
            }
            else if (values.reportType === "NEW") {
                setshowData("new");
                getNewCasesReport();
            }
            else if (values.reportType === "LEGACY") {
                setshowData("legacy");
                getLegacyCasesReport();
            }
            else {
                setshowData("foi");
                showGetData();
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
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'FINALORDER');
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
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'APPEALFILED');

                    }}
                >
                    {row.original.appeal_filed}
                </div>
            ),
            Footer: 'appeal_filed'
        },
        {
            Header: 'Dismissed /No Action Taken', accessor: "dismissed_copy",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'DISMISSED');

                    }}
                >
                    {row.original.dismissed_copy}
                </div>
            ),
            Footer: 'dismissed_copy'

        },
        {
            Header: 'Private Cases', accessor: "privatecase",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'PRIVATE');

                    }}
                >
                    {row.original.privatecase}
                </div>
            ),
            Footer: 'privatecase'

        },
        {
            Header: 'Pending', accessor: "pending",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'PENDING');

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

    function getCasesWiseList(districtid, districtname, status) {
        let Url = config.url.local_URL + "getCasesListHCF?caseStatus=" + status + "&distName=" + districtname + "&distid=" + districtid;
        setshowData("caseslist");
        CommonAxiosGet(Url).then((res) => {
            setDrillCount(1);
            if (res?.data?.status === true) {
                setcasesList(res?.data?.CASESLIST);
            }
            else {
                setcasesList([]);
                seterrmsg(true);
            }
        })
    }


    function getCCCasesReport() {
        const fromDate = formIk?.values?.fromDate;
        const toDate = formIk?.values?.toDate;
        let Url = config.url.local_URL + "CCCasesReport?fromDate=" + fromDate + "&toDate=" + toDate;
        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                setCCcasesList(res?.data?.CCCASESREPORT);
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
        let Url = config.url.local_URL + "NewCasesReport?fromDate=" + fromDate + "&toDate=" + toDate;
        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                setNEWcasesList(res?.data?.FRESHCASESREPORT);
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
        let Url = config.url.local_URL + "LegacyCasesReport?fromDate=" + fromDate + "&toDate=" + toDate;
        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                setLEGACYcasesList(res?.data?.LEGACYCASESREPORT);
            }
            else {
                setLEGACYcasesList([]);
            }
        })
    }


    const columnsCC = [
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

    const columnsFreshLegacy = [
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
        {
            Header: 'Private Cases', accessor: "privatecase",
            Footer: 'privatecase'
        },
    ];


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
                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.scanned_document_path); }} >
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

    function isBackFunction() {
        setDrillCount(showDrillCount - 1)
        setshowData("foi")
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
                                            <option value="FOI">Final Orders Implementation Report</option>
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
                    {showDrillCount === 0 && showData === "foi" && (<>
                        {finalcasesList !== "" ? (
                            <div style={{ width: "98%" }}>
                                <CommonReactTable data={finalcasesList} columns={columnsList} showFooter={"true"}
                                    filename="Final Order Impl Report" headerName="District Wise Final Orders Implementation Report" />
                            </div>
                        ) : (showData === "foi" && errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}

                    {showData === "cc" &&
                        CCcasesList?.length > 0 ? (
                        <div style={{ width: "98%" }}>
                            <CommonReactTable data={CCcasesList} columns={columnsCC} showFooter={"false"}
                                filename="Final Order Impl cc cases Report" headerName="District Wise Contempt Cases Report" />
                        </div>
                    ) : (showData === "cc" && errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}



                    {showData === "new" &&
                        NEWcasesList?.length > 0 ? (
                        <div style={{ width: "98%" }}>
                            <CommonReactTable data={NEWcasesList} columns={columnsFreshLegacy} showFooter={"false"}
                                filename="Final Order Impl new cases Report" headerName="District Wise New Cases Report" />
                        </div>
                    ) : (showData === "new" && errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}



                    {showData === "legacy" &&
                        LEGACYcasesList?.length > 0 ? (
                        <div style={{ width: "98%" }}>
                            <CommonReactTable data={LEGACYcasesList} columns={columnsFreshLegacy} showFooter={"false"}
                                filename="Final Order Impl legacy cases Report" headerName="District Wise Legacy Cases Report" />
                        </div>
                    ) : (showData === "legacy" && errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}

                    {showDrillCount === 1 && showData === "caseslist" && (<>
                        {casesList?.length > 0 ? (
                            <div style={{ width: "98%" }}>
                                <CommonReactTable data={casesList} columns={columns} showFooter={"false"}
                                    filename="Final Order Impl cases list Report" headerName="" isBack={true}
                                    isBackFunction={isBackFunction} />
                            </div>
                        ) : (showData === "caseslist" && errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}
                </bst.Row>

            </bst.Container>

            <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={cino} viewdata={PopupData} />


        </>
    )
}

export default HCFinalOrdersImplementedReport