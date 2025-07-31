import React, { useEffect, useRef, useState } from 'react'
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import * as bst from "react-bootstrap"
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';

function CaseAssignmentStatusReport() {
    const [assignmentList, setassignmentList] = useState([]);
    const [heading, setHeading] = useState([]);
    const [casesList, setcasesList] = useState([]);
    const [showDrillCount, setDrillCount] = useState();
    const [errmsg, seterrmsg] = useState(false);

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);

    function regularPopStatus() { setregularPopupFlag(false); }

    const hasFetchedData = useRef(false)
    useEffect(() => {
        if (!hasFetchedData.current) {
            showAssignmentsData();
            hasFetchedData.current = true
        }
    }, []);

    function showAssignmentsData() {
        let Url = config.url.local_URL + "";
        CommonAxiosGet(Url).then((res) => {
            setDrillCount(0);
            if (res?.data?.status === true) {
                setassignmentList(res?.data?.data);
                setHeading(res?.data?.HEADING);

            }
            else {
                setassignmentList([]);
                seterrmsg(true);
            }
        })
    }

    function isBackFunction() {
        setDrillCount(showDrillCount - 1)
    }

    const columns = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Department Code', accessor: 'deptshortname',
        },
        {
            Header: 'Department Name', accessor: 'description',
        },
        {
            Header: 'Total Cases',
            accessor: 'total',
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesList('total', row.original.deptshortname, row.original.description);
                    }}
                >
                    {row.original.total}
                </div>
            ),
            Footer: 'total'
        },

        {
            Header: 'Assigned To HOD / Nodal Officers',
            accessor: 'assigned_to_hod',
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesList('assigned2HOD', row.original.deptshortname, row.original.description);
                    }}
                >
                    {row.original.assigned_to_hod}
                </div>
            ),
            Footer: 'assigned_to_hod'
        },

        {
            Header: 'Assigned To Section (Sect. Dept.)',
            accessor: 'assigned_to_sect_sec',
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesList('assigned2SectSec', row.original.deptshortname, row.original.description);
                    }}
                >
                    {row.original.assigned_to_sect_sec}
                </div>
            ),
            Footer: 'assigned_to_sect_sec'
        },

        {
            Header: 'Assigned To Section (HOD)',
            accessor: 'assigned_to_hod_sec',
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesList('assigned2HodSec', row.original.deptshortname, row.original.description);
                    }}
                >
                    {row.original.assigned_to_hod_sec}
                </div>
            ),
            Footer: 'assigned_to_hod_sec'
        },
    ];

    function getCasesList(type, deptId, deptName) {
        let Url = config.url.local_URL + "CaseAssignmentStatusList?deptName=" + deptName + "&deptId=" + deptId + "&actionType=" + type;
        CommonAxiosGet(Url).then((res) => {
            setDrillCount(0);
            if (res?.data?.status === true) {
                setassignmentList(res?.data?.data);
            }
            else {
                setassignmentList([]);
                seterrmsg(true);
            }
        })
    }

    const handleCinoClick = (cino) => {
        let url = config.url.local_URL + "AssignedCasesToSections?cino=" + cino + "&fileCino=&SHOWPOPUP=SHOWPOPUP";
        CommonAxiosGet(url).then((res) => {
            if (res.data !== undefined) {
                alert("test")
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

    return (
        <>
            <CommonFormHeader heading={heading} />
            <bst.Container className="outer-page-content-container">
                <bst.Row className="pt-2 pt-2 ">
                    {showDrillCount === 0 && (<>
                        {assignmentList?.length > 0 ? (
                            <div style={{ width: "98%" }}>
                                <CommonReactTable data={assignmentList} columns={columns} showFooter={"true"}
                                    filename="Assignment Status Abstract Report" headerName="" />
                            </div>
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}


                    {showDrillCount === 1 && (<>
                        {casesList?.length > 0 ? (
                            <div style={{ width: "98%" }}>
                                <CommonReactTable data={casesList} columns={columnsList} showFooter={"true"}
                                    filename="Assignment Status Abstract Report" headerName="" isBack={true} isBackFunction={isBackFunction} />
                            </div>
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}
                </bst.Row>


            </bst.Container>
            <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={cino} viewdata={PopupData} />

        </>
    )
}

export default CaseAssignmentStatusReport