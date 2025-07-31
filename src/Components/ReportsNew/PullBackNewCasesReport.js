import React, { useEffect, useRef, useState } from 'react'
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import *as bst from "react-bootstrap"
import { config } from '../../CommonUtils/CommonApis';
import { failureAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';
import Swal from 'sweetalert2';
import AckDetailsPopup from '../Popups/AckDetailsPopup';


function PullBackNewCasesReport() {
    const [pullbackcasesList, setpullbackcasesList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [ackno, setAckno] = useState([]);
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
        let Url = config.url.local_URL + "PullBackNewCasesList";
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

    const handleAckPopup = (ackNo) => {

        let url = config.url.local_URL + "AckNoPopupView?SHOWPOPUP=SHOWPOPUP&cino=" + ackNo;

        console.log("url-----", url);
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


    const columnsList = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,

        },
        {
            Header: 'Acknowledge Number', accessor: "ack_no",
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
            Header: 'Advocate Name', accessor: "advocatename",

        },
        {
            Header: 'Advocate CC No', accessor: "advocateccno",

        },

        {
            Header: 'Main Case No', accessor: "maincaseno",

        },

        {
            Header: 'Date ', accessor: "inserted_time",
        },

        {
            Header: 'Petitioner Name', accessor: "petitioner_name",

        },
        {
            Header: 'Mode Filing', accessor: "mode_filing",

        },

        {
            Header: 'Assigned To', accessor: "assigned_to",

        },

        {
            Header: 'Action', accessor: "",
            Cell: ({ row }) => {
                const combined = `${row.original.ack_no}@${row.original.respondent_slno}`;
                return (
                    <button class="btn btn-outline-primary" onClick={() => pullback(combined)}>
                        Pullback
                    </button>
                );
            }

        },


    ];

    function pullback(ackno) {
        alert(ackno + "---------ackno");
        const values = { ackno };
        values.cino = ackno;

        Swal.fire({
            title: `Are you sure you want to send back the assigned cases(cino:${ackno})?`,
            icon: 'question',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: 'No',
            backdrop: true,
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                let url = config.url.local_URL + "sendCaseBackNewCases";

                CommonAxiosPost(url, values, {
                    headers: { "Content-Type": "application/json" }
                }).then((res) => {
                    if (res?.data?.scode === '01') {
                        successAlert2(res?.data?.data);
                    } else {
                        failureAlert(res?.data?.data);
                    }
                });
            }
        });
    }
    return (<>
        <bst.Container className="outer-page-content-container">
            <bst.Row className="pt-2 pt-2 " style={{ width: "99%" }}>
                {pullbackcasesList?.length > 0 ? (
                    <CommonReactTable data={pullbackcasesList} columns={columnsList} showFooter={"true"}
                        filename="Pull Back New Cases REPORT" headerName="Pull Back New Cases Report" />
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
            </bst.Row>
        </bst.Container>
        <AckDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={ackno} viewdata={PopupData} />
    </>)
}

export default PullBackNewCasesReport