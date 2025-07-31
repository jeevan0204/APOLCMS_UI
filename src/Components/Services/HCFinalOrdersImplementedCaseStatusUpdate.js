import React, { useEffect, useRef, useState } from 'react'
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import { config } from '../../CommonUtils/CommonApis';
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import * as bst from "react-bootstrap"
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { useNavigate } from 'react-router-dom';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';

function HCFinalOrdersImplementedCaseStatusUpdate() {

    const [finalcasesList, setfinalcasesList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);

    function regularPopStatus() { setregularPopupFlag(false); }



    const navigate = useNavigate();


    const hasFetchedData = useRef(false)
    useEffect(() => {
        if (!hasFetchedData.current) {
            showGetData();
            hasFetchedData.current = true
        }
    }, []);

    function showGetData() {
        let Url = config.url.local_URL + "HCFinalOrdersImplementedForm";
        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                setfinalcasesList(res?.data?.CASESLIST);
            }
            else {
                setfinalcasesList([]);
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
            Header: 'Petitioner', accessor: "pet_name",

        },
        {
            Header: 'Respondents', accessor: "res_name",

        },
        {
            Header: 'Prayer', accessor: "prayer",

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
        {
            Header: 'Action/Status',
            accessor: '',
            Cell: ({ row }) => {
                const data = row.original;
                return (
                    <div>

                        <button
                            className="btn btn-outline-primary btn-sm mt-2"
                            onClick={() => updateStatus(data.cino)}
                        >
                            Update Status
                        </button>

                    </div>
                );
            }

        }
    ];

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

    function updateStatus(cino) {

        navigate("/CaseStatusUpdateFinalOrder");
        localStorage.setItem("cino", JSON.stringify(cino));
    }

    return (
        <>
            <CommonFormHeader heading="Final order Implemented Cases" />
            <bst.Container className="outer-page-content-container">
                <bst.Row className="pt-2 pt-2 ">
                    {finalcasesList?.length > 0 ? (
                        <div style={{ width: "98%" }}>
                            <CommonReactTable data={finalcasesList} columns={columnsList} showFooter={"false"}
                                filename="Final Order Impl Report" headerName="Final Order Impl Report" />
                        </div>
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
                </bst.Row>

            </bst.Container>

            <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={cino} viewdata={PopupData} />

        </>
    )
}

export default HCFinalOrdersImplementedCaseStatusUpdate