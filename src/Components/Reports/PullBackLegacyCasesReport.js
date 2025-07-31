import React, { useEffect, useRef, useState } from 'react'
import * as bst from "react-bootstrap"
import CommonReactTable from '../../CommonUtils/CommonReactTable'
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { failureAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';
import Swal from 'sweetalert2';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';

function PullBackLegacyCasesReport() {
    const [pullbackcasesList, setpullbackcasesList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }

    const hasFetchedData = useRef(false)
    useEffect(() => {
        if (!hasFetchedData.current) {
            GetPullBackCasesList();
            hasFetchedData.current = true
        }
    }, []);


    function GetPullBackCasesList() {
        let Url = config.url.local_URL + "PullBackLegacyCasesList";
        CommonAxiosGet(Url).then((res) => {

            if (res?.data?.status === true) {
                setpullbackcasesList(res?.data?.data);

            }
            else {
                setpullbackcasesList([]);
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
            Header: 'Date of Filing', accessor: "date_of_filing",

        },
        {
            Header: 'Date of Registration', accessor: "dt_regis",

        },

        {
            Header: 'Case Type.', accessor: "type_name_reg",

        },

        {
            Header: 'Reg No.', accessor: "reg_no",
        },

        {
            Header: 'Reg Year.', accessor: "reg_year",

        },
        {
            Header: 'District', accessor: "dist_name",

        },

        {
            Header: 'Assigned To', accessor: "assigned_to",

        },

        {
            Header: 'Action', accessor: "",
            Cell: ({ row }) => (
                <button class="btn btn-outline-primary btn-sm mt-2" onClick={() => pullback(row.original.cino)}>
                    Pullback
                </button>
            )

        },


    ];

    function pullback(cino) {

        const values = { cino: cino };
        Swal.fire({
            title: `Are you sure you want to pull back the assigned cases(cino:${cino})?`,
            icon: 'question',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: 'No',
            backdrop: true,
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                let url = config.url.local_URL + "sendCaseBackLegacyCases";

                CommonAxiosPost(url, values, {
                    headers: { "Content-Type": "application/json" }
                }).then((res) => {
                    if (res?.data?.scode === '01') {
                        successAlert2(res?.data?.sdesc);
                    } else {
                        failureAlert(res?.data?.sdesc);
                    }
                });
            }
        });
    }

    return (<>
        <bst.Container className="outer-page-content-container">
            <bst.Row className="pt-2 pt-2 ">
                {pullbackcasesList?.length > 0 ? (
                    <CommonReactTable data={pullbackcasesList} columns={columnsList} showFooter={"true"}
                        filename="Pull Back Cases REPORT" headerName="Pull Back Legacy Cases Report" />
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
            </bst.Row>
        </bst.Container>
        <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={cino} viewdata={PopupData} />
    </>)
}

export default PullBackLegacyCasesReport