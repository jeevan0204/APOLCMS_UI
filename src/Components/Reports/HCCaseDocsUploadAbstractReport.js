import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap"
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import { useDispatch, useSelector } from 'react-redux';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';

function HCCaseDocsUploadAbstractReport() {
    const [secdeptwiseList, setSecdeptwiseList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [heading, setHeading] = useState([]);
    const [casesList, setCasesList] = useState([]);
    const [hodWiseReportList, setHodWiseReportList] = useState([]);
    const dispatch = useDispatch();

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }
    const [showdata, setData] = useState();

    const [showDrillCount, setDrillCount] = useState();

    const logindetails = useSelector((state) => state.reducers.loginreducer?.userLoginDetials);

    useEffect(() => {
        GetSecDeptData();
    }, []);

    function isBackFunction() {
        console.log("drillcounts-------", showDrillCount)
        if ((logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) && showDrillCount == 1) {
            setDrillCount(showDrillCount - 1)
        }
        else if (!showdata && showDrillCount === 2) {
            setDrillCount(showDrillCount - 2);
        }
        else {
            setDrillCount(showDrillCount - 1);
        }
    }

    useEffect(() => {
        if (showDrillCount === 0) {
            setData();
        }
    })

    function GetSecDeptData() {
        let url = config.url.local_URL + "HCCaseDocsUploadAbstract";
        CommonAxiosGet(url).then((res) => {
            setDrillCount(0);
            if (res?.data?.status === true) {
                if (logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) {
                    setHodWiseReportList(res?.data?.hodData);
                } else {
                    setSecdeptwiseList(res?.data?.secData);
                }
            } else {
                setSecdeptwiseList([]);
            }
        }).catch((error) => {
            console.error("Error fetching secretariet dept names:", error);
        });

    }

    const columns = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Sect. Department Code', accessor: "deptcode"

        },
        {
            Header: 'Sect. Department Name', accessor: "description",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", textDecoration: "underline", color: "blue", textAlign: "left", }}
                    onClick={() => {
                        ShowHODWise(row.original.deptcode, row.original.description);
                    }} >
                    {row.original.description}
                </div>
            ),
        },
        {
            Header: 'Total Cases', accessor: "total_cases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'ALL');

                    }}
                >
                    {row.original.total_cases}
                </div>
            ),
            Footer: 'total_cases'
        },
        {
            Header: 'Scanned by APOLCMS Cell', accessor: "olcms_uploads",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'SCANNEDDOC');

                    }}
                >
                    {row.original.olcms_uploads}
                </div>
            ),
            Footer: 'olcms_uploads'
        },
        {
            Header: 'Petition Uploaded by Dept.', accessor: "petition_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'PET');
                    }}
                >
                    {row.original.petition_uploaded}
                </div>
            ),
            Footer: 'petition_uploaded'
        },
        {
            Header: 'Judgement Order Uploaded by Dept.', accessor: "judgement_order_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'JUD');

                    }}
                >
                    {row.original.judgement_order_uploaded}
                </div>
            ), Footer: 'judgement_order_uploaded'
        },

        {
            Header: 'Action Taken Order Uploaded by Dept.', accessor: "action_taken_order_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'ACT');

                    }}
                >
                    {row.original.action_taken_order_uploaded}
                </div>
            ), Footer: 'action_taken_order_uploaded'
        },

        {
            Header: 'Closed', accessor: "closed_cases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'CLOSED');

                    }}
                >
                    {row.original.closed_cases}
                </div>
            ), Footer: 'closed_cases'
        },

        {
            Header: 'Counter filed', accessor: "counter_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'COUNTERUPLOADED');

                    }}
                >
                    {row.original.counter_uploaded}
                </div>
            ),
            Footer: 'counter_uploaded'
        },

        {
            Header: 'Parawise Remarks Uploaded', accessor: "pwrcounter_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'PWRUPLOADED');

                    }}
                >
                    {row.original.pwrcounter_uploaded}
                </div>
            ),
            Footer: 'pwrcounter_uploaded'
        },

        {
            Header: 'Parawise Remarks Approved by GP', accessor: "pwr_approved_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'GPAPPROVEPWR');

                    }}
                >
                    {row.original.pwr_approved_gp}
                </div>
            ),
            Footer: 'pwr_approved_gp'
        },
        {
            Header: 'Parawise Remarks Not Approved by GP', accessor: "pwr_not_approved_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'GPAPPROVENOTPWR');

                    }}
                >
                    {row.original.pwr_not_approved_gp}
                </div>
            ),
            Footer: 'pwr_not_approved_gp'
        },
        {
            Header: 'Counter Approved by GP', accessor: "counter_approved_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'GPAPPROVECOUNTER');

                    }}
                >
                    {row.original.counter_approved_gp}
                </div>
            ),
            Footer: 'counter_approved_gp'
        },

        {
            Header: 'Counter Not Approved by GP', accessor: "counter_not_approved_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'GPNOTAPPROVECOUNTER');

                    }}
                >
                    {row.original.counter_not_approved_gp}
                </div>
            ),
            Footer: 'counter_not_approved_gp'
        }

    ];


    function ShowHODWise(deptCode, deptName) {
        let Url = config.url.local_URL + "HCCaseDocsUploadHODwisedetails?deptCode=" + deptCode + "&deptName=" + deptName;
        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                if (logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) {
                    setDrillCount(0);
                }
                else {
                    setDrillCount(1);
                    setData(1);
                }
                setHodWiseReportList(res?.data?.hodData);
            }
            else {
                setHodWiseReportList([]);
            }
        })
    }

    function getCasesWiseList(deptCode, deptName, status) {
        let Url = config.url.local_URL + "HCCaseDocsUploadCasesList?deptCode=" + deptCode + "&deptName=" + deptName
            + "&caseStatus=" + status;
        dispatch({ type: "SHOW_SPINNER", payload: true });
        CommonAxiosGet(Url).then((res) => {
            dispatch({ type: 'HIDE_SPINNER', payload: { key: 'showSpinner', value: false } });
            if (res?.data?.status === true) {
                if (logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) {
                    setDrillCount(1);
                }
                else {
                    setDrillCount(2);
                }
                setCasesList(res?.data?.caseListData);
            }
            else {
                setCasesList([]);

            }
        })

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
            Header: 'Date of Filing', accessor: "date_of_filing",

        },


        {
            Header: 'Case Reg Type.', accessor: "type_name_fil",

        },

        {
            Header: 'Case Reg No.', accessor: "reg_no",
        },

        {
            Header: 'Case Reg Year.', accessor: "reg_year",

        },

        {
            Header: 'Prayer', accessor: "prayer",

        },

        {
            Header: 'SR Number', accessor: "fil_no",

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

    const columnsHod = [

        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Sect. Department Code', accessor: "deptcode"

        },
        {
            Header: 'Sect. Department Name', accessor: "description",

        },
        {
            Header: 'Total Cases', accessor: "total_cases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'ALL');

                    }}
                >
                    {row.original.total_cases}
                </div>
            ),
            Footer: 'total_cases'
        },
        {
            Header: 'Scanned by APOLCMS Cell', accessor: "olcms_uploads",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'SCANNEDDOC');

                    }}
                >
                    {row.original.olcms_uploads}
                </div>
            ),
            Footer: 'olcms_uploads'
        },
        {
            Header: 'Petition Uploaded by Dept.', accessor: "petition_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'PET');

                    }}
                >
                    {row.original.petition_uploaded}
                </div>
            ),
            Footer: 'petition_uploaded'
        },
        {
            Header: 'Judgement Order Uploaded by Dept.', accessor: "judgement_order_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'JUD');

                    }}
                >
                    {row.original.judgement_order_uploaded}
                </div>
            ), Footer: 'judgement_order_uploaded'
        },

        {
            Header: 'Action Taken Order Uploaded by Dept.', accessor: "action_taken_order_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'ACT');

                    }}
                >
                    {row.original.action_taken_order_uploaded}
                </div>
            ), Footer: 'action_taken_order_uploaded'
        },

        {
            Header: 'Closed', accessor: "closed_cases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'CLOSED');

                    }}
                >
                    {row.original.closed_cases}
                </div>
            ), Footer: 'closed_cases'
        },

        {
            Header: 'Counter filed', accessor: "counter_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'COUNTERUPLOADED');

                    }}
                >
                    {row.original.counter_uploaded}
                </div>
            ),
            Footer: 'counter_uploaded'
        },

        {
            Header: 'Parawise Remarks Uploaded', accessor: "pwrcounter_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'PWRUPLOADED');

                    }}
                >
                    {row.original.pwrcounter_uploaded}
                </div>
            ),
            Footer: 'pwrcounter_uploaded'
        },

        {
            Header: 'Parawise Remarks Approved by GP', accessor: "pwr_approved_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'GPAPPROVEPWR');

                    }}
                >
                    {row.original.pwr_approved_gp}
                </div>
            ),
            Footer: 'pwr_approved_gp'
        },
        {
            Header: 'Parawise Remarks Not Approved by GP', accessor: "pwr_not_approved_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'GPAPPROVENOTPWR');

                    }}
                >
                    {row.original.pwr_not_approved_gp}
                </div>
            ),
            Footer: 'pwr_not_approved_gp'
        },
        {
            Header: 'Counter Approved by GP', accessor: "counter_approved_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'GPAPPROVECOUNTER');

                    }}
                >
                    {row.original.counter_approved_gp}
                </div>
            ),
            Footer: 'counter_approved_gp'
        },

        {
            Header: 'Counter Not Approved by GP', accessor: "counter_not_approved_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'GPNOTAPPROVECOUNTER');

                    }}
                >
                    {row.original.counter_not_approved_gp}
                </div>
            ),
            Footer: 'counter_not_approved_gp'
        }
    ];

    return (<>

        {showDrillCount === 0 && (<>
            {secdeptwiseList?.length > 0 ? (
                <CommonReactTable data={secdeptwiseList} columns={columns} showFooter={"true"}
                    filename="HC Case Docs Upload Abstract Report" headerName="Sect. Dept. Wise Case processing Abstract Report" />
            ) : (errmsg && (
                <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}

        {showDrillCount === 0 || showDrillCount === 1 && (<>
            {
                hodWiseReportList?.length > 0 ? (
                    <CommonReactTable data={hodWiseReportList} columns={columnsHod} showFooter={"true"}
                        filename="Deptwise Abstract Report" headerName={heading}
                        isBack={(logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) ? false : true} isBackFunction={isBackFunction} />
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))
            }</>)}

        {showDrillCount === 1 || showDrillCount === 2 && (<>
            {
                casesList?.length > 0 ? (
                    <div style={{ width: "98%" }}>
                        <CommonReactTable data={casesList} columns={columnsList} showFooter={"true"}
                            filename="HC DOC ABSTRACT REPORT" headerName={heading} isBack={true}
                            isBackFunction={isBackFunction} />
                    </div>
                ) : (errmsg && (<center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))

            }</>)}

        <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={cino} viewdata={PopupData} />

    </>)
}

export default HCCaseDocsUploadAbstractReport