import React, { useEffect, useRef, useState } from 'react'
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import * as bst from "react-bootstrap"
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import { config } from '../../CommonUtils/CommonApis';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';

function InstructionsreplyCount() {
    const [instructionsList, setInstructionsList] = useState([]);
    const [casesList, setcasesList] = useState([]);
    const [Heading, setHeading] = useState([]);
    const [showDrillCount, setDrillCount] = useState();
    const [errmsg, seterrmsg] = useState(false);
    const [secShow, setsecShow] = useState("");

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);

    function regularPopStatus() { setregularPopupFlag(false); }

    const hasFetchedData = useRef(false)
    useEffect(() => {
        if (!hasFetchedData.current) {
            showInstructionsData();
            hasFetchedData.current = true
        }
    }, []);

    function showInstructionsData() {
        let Url = config.url.local_URL + "";
        CommonAxiosGet(Url).then((res) => {
            setDrillCount(0);
            if (res?.data?.status === true) {
                setInstructionsList(res?.data?.data);
                setHeading(res?.data?.HEADING);
                setsecShow(res?.data?.sec_show);
            }
            else {
                setInstructionsList([]);
                seterrmsg(true);
            }
        })
    }

    const columns = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: secShow ? `${secShow} Department Code` : 'Department Code',
            accessor: 'dept_code',
        },
        {
            Header: secShow ? `${secShow} Department Name` : 'Department Name',
            accessor: 'dept_name',
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        ShowHODWise(row.original.dept_code, row.original.dept_name);
                    }}
                >
                    {row.original.casescount}
                </div>
            ),
            Footer: 'dept_name'
        },
        {
            Header: 'Instructions Sent',
            accessor: 'instructions_count',
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        ViewData("InstCount", row.original.dept_code, row.original.flag, "SHOWPOPUP");
                    }}
                >
                    {row.original.casescount}
                </div>
            ),
            Footer: 'instructions_count'
        },
        {
            Header: 'Reply Instructions',
            accessor: 'reply_instructions_count',
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        ViewData("ReplyInstCount", row.original.dept_code, row.original.flag, "SHOWPOPUP");
                    }}
                >
                    {row.original.casescount}
                </div>
            ),
            Footer: 'reply_instructions_count'
        },


    ];

    function ShowHODWise(deptId, deptDesc) {
        let Url = config.url.local_URL + "InstructionsreplyCount?deptName=" + deptDesc + "&deptId=" + deptId;
        CommonAxiosGet(Url).then((res) => {
            setDrillCount(0);
            if (res?.data?.status === true) {
                setInstructionsList(res?.data?.data);
            }
            else {
                setInstructionsList([]);
                seterrmsg(true);
            }
        })
    }

    function ViewData(pwCounterFlag, deptId, flag, popup) {
        let Url = config.url.local_URL + "viewdata?pwCounterFlag=" + pwCounterFlag + "&deptId=" + deptId + "&flag=" + flag + "&SHOWPOPUP=" + popup;
        CommonAxiosGet(Url).then((res) => {
            setDrillCount(1);
            if (res?.data?.status === true) {
                setcasesList(res?.data?.CASEWISEDATA);
            }
            else {
                setcasesList([]);
                seterrmsg(true);
            }
        })
    }

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
            Header: 'Department Code', accessor: 'dept_code',
        },
        {
            Header: 'Department Name', accessor: 'dept_name',
        },
        {
            Header: 'Instruction', accessor: 'instructions',
        },
        {
            Header: 'Reply Instruction', accessor: 'reply_instructions',
        },
        {
            Header: 'Mobile', accessor: 'mobile_no',
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
    }

    return (
        <>
            <CommonFormHeader heading="Instructions Reply Count Report" />
            <bst.Container className='outer-page-content-container'>

                <bst.Row className="pt-2 pt-2 ">
                    {showDrillCount === 0 && (<>
                        {instructionsList?.length > 0 ? (
                            <div style={{ width: "98%" }}>
                                <CommonReactTable data={instructionsList} columns={columns} showFooter={"true"}
                                    filename="Instructions Reply Count Report" headerName={Heading} />
                            </div>
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}


                    {showDrillCount === 1 && (<>
                        {casesList?.length > 0 ? (
                            <div style={{ width: "98%" }}>
                                <CommonReactTable data={casesList} columns={columnsList} showFooter={"true"}
                                    filename="Instructions Reply Count Report" headerName={Heading} isBack={true} isBackFunction={isBackFunction} />
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

export default InstructionsreplyCount