import React, { useEffect, useRef, useState } from 'react'
import * as bst from "react-bootstrap"
import CommonReactTable from '../../CommonUtils/CommonReactTable'
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { useNavigate } from 'react-router-dom';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';

function ScannedAffidavitCountsReport() {
    const [scannedCountLegacy, setScannedCountLegacy] = useState([]);
    const [scannedCountNew, setScannedCountNew] = useState([]);
    const [NotAvailableCount, setNotAvailableCount] = useState([]);

    const [errmsg, seterrmsg] = useState(false);
    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }

    const hasFetchedData = useRef(false)
    const navigate = useNavigate();

    useEffect(() => {
        if (!hasFetchedData.current) {
            let url = config.url.local_URL + "ScanDocsCountReport";
            CommonAxiosGet(url).then((res) => {
                if (res !== null && res !== undefined) {
                    if (res?.data?.status === true) {
                        // setHeading(res?.data?.HEADING);
                        setScannedCountLegacy(res?.data?.SCANDOCS);
                        setScannedCountNew(res?.data?.NEWSCANDOCS)
                    }
                    else {
                        seterrmsg(true);
                        setScannedCountLegacy([]);
                    }

                }
            })
            hasFetchedData.current = true
        }
    })

    function NotAvailableOldScanDocsCount(year, month) {

        let url = config.url.local_URL + "NotAvailableOldScanDocsCount?year=" + year + "&month=" + month;
        CommonAxiosGet(url).then((res) => {
            if (res !== null && res !== undefined) {
                if (res?.data?.status === true) {
                    // setHeading(res?.data?.HEADING);
                    setNotAvailableCount(res?.data?.NotAvailableScanList);
                    setScannedCountLegacy([]);
                    setScannedCountNew([]);
                    seterrmsg(false);
                }
                else {
                    seterrmsg(true);
                    setNotAvailableCount([]);
                }

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
            Header: 'Year', accessor: "year"

        },
        {
            Header: 'Month', accessor: "month"

        },
        {
            Header: "Scanned Affidavit Pdf's Count",
            accessor: "filecount",
            Footer: 'filecount'

        },
        {
            Header: "Available Scanned Affidavit Pdf's Count", accessor: "available_scanned_affidavits",
            Footer: 'available_scanned_affidavits'

        },
        {
            Header: "Not Available Scanned Affidavit Pdf's Count", accessor: "not_available_scanned_affidavits",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        NotAvailableOldScanDocsCount(row.original.year, row.original.month);
                    }}
                >
                    {row.original.not_available_scanned_affidavits}
                </div>
            ),
            Footer: 'not_available_scanned_affidavits'

        },
        {
            Header: 'Total Pages Count', accessor: "pages_count",
            Footer: 'pages_count'

        },

    ];

    const columnsNew = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Year', accessor: "year"

        },
        {
            Header: 'Month', accessor: "month"

        },
        {
            Header: "Total Scanned Affidavit's Count",
            accessor: "filecount",
            Footer: 'filecount'

        },
        {
            Header: "Available New Scanned Affidavit's Count", accessor: "available_new",
            Footer: 'available_new'

        },
        {
            Header: "Available New Scanned Affidavit Pages Count", accessor: "available_new_p",

            Footer: 'available_new_p'

        },
        {
            Header: "Available Old Scanned Affidavit's Count", accessor: "available_old",
            Footer: 'available_old'

        },
        {
            Header: "Available Old Scanned Affidavit Pages Count", accessor: "available_old_p",
            Footer: 'available_old_p'

        },
        {
            Header: "Available New Criminal Scanned Affidavit's Count", accessor: "available_new_pp",
            Footer: 'available_new_pp'

        },
        {
            Header: "Available New Criminal Scanned Affidavit Pages Count", accessor: "available_new_pp_p",
            Footer: 'available_new_pp_p'

        },
        {
            Header: "Available Old Criminal Scanned Affidavit's Count", accessor: "available_old_pp",
            Footer: 'available_old_pp'

        },
        {
            Header: "Available Old Criminal Scanned Affidavit Pages Count", accessor: "available_old_pp_p",
            Footer: 'available_old_pp_p'

        },
        {
            Header: "Total Pages Count", accessor: "pages_count",
            Footer: 'pages_count'

        },
    ];

    const columnsNotAvailable = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: '',
        },
        {
            Header: 'cino', accessor: "cino",
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
            Header: 'UserId', accessor: "hc_scan_legacy_by"

        },
        {
            Header: "Registration Date",
            accessor: "hc_scan_legacy_date",
            // Footer: 'filecount'

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

            } else {
                setPopupData([]);
            }
        }).catch((error) => {
            console.error("Error fetching popup:", error);
        });
    };

    return (
        <>
            <bst.Container className="outer-page-content-container">

                <bst.Row className="pt-2 pt-2 ">
                    {scannedCountLegacy?.length > 0 ? (<>

                        <div className="inner-herbpage-service-title-sub">
                            <h1>
                                <span>
                                    Total No Of Scanned Affidavit Report For Legacy Cases
                                </span>
                            </h1>
                        </div>



                        <CommonReactTable data={scannedCountLegacy} columns={columns} showFooter={"true"}
                            filename="Scanned Affidavit Counts Report"
                        />
                    </>) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
                </bst.Row>

                <bst.Row className="pt-2 pt-2 ">

                    {scannedCountNew?.length > 0 ? (<>
                        <div className="inner-herbpage-service-title-sub">
                            <h1>
                                <span>
                                    Total No Of Scanned Affidavit Report For New Cases
                                </span>
                            </h1>
                        </div>

                        <CommonReactTable data={scannedCountNew} columns={columnsNew} showFooter={"true"}
                            filename="Scanned Affidavit Counts Report New" />
                    </>) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
                </bst.Row>

                <bst.Row className="pt-2 pt-2 ">

                    {NotAvailableCount?.length > 0 ? (<>

                        <div className="inner-herbpage-service-title-sub">
                            <h1>
                                <span>
                                    Not Available Legacy Scanned Affidavit Details
                                </span>
                            </h1>
                        </div>

                        <div className="float-end mt-4 pb-4">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    //   getInstitutes();
                                    window.location.href = "/ScannedAffidavitCountsReport"
                                }}
                            >
                                Back
                            </button>
                        </div>
                        <CommonReactTable data={NotAvailableCount} columns={columnsNotAvailable} showFooter={"true"}
                            filename="not avl Scanned Affidavit Counts Report" />
                    </>) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
                </bst.Row>
            </bst.Container >

            <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={cino} viewdata={PopupData} />
        </>
    )
}

export default ScannedAffidavitCountsReport