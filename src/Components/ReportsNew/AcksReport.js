import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap"
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { CommonAxiosDelete, CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import { config } from '../../CommonUtils/CommonApis';
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { useNavigate } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import { BiEdit } from 'react-icons/bi';
import Swal from 'sweetalert2';
import { failureAlert, successAlert } from '../../CommonUtils/SweetAlerts';
import AckDetailsPopup from '../Popups/AckDetailsPopup';

function AcksReport() {
    const [AckData, setAckData] = useState([]);
    const [AckDataExisting, setAckDataExisting] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [CasesList, setCasesList] = useState([]);
    const [CasesListOld, setCasesListOld] = useState([]);
    const [Heading, setHeading] = useState([]);
    const [HeadingNew, setHeadingNew] = useState([]);

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [ackno, setAckno] = useState([]);
    const [PopupData, setPopupData] = useState([]);

    function regularPopStatus() { setregularPopupFlag(false); }


    const navigate = useNavigate();


    useEffect(() => {
        GetAckData();
        //GetAckDataExisting();
    }, [])

    function GetAckData() {
        let url = config.url.local_URL + "AcksReport";
        CommonAxiosGet(url).then((res) => {
            if (res.data.scode === "01") {
                setAckData(res.data.ACKDATA);
                setAckDataExisting(res.data.ACKDATAExisting);
            } else {
                seterrmsg(true)
                setAckData([]);
                setAckDataExisting([]);
            }
        }).catch((error) => {
            console.error("Error fetching ACK names:", error);
        });
    }

    function GPOAcknowledementsListAll(ackDate, ackType) {

        let Url = config.url.local_URL + "GPOAcknowledementsListAll?ackDate=" + ackDate + "&ackType=" + ackType;
        CommonAxiosGet(Url).then((res) => {

            if (res?.data?.status === true) {
                console.log("heading----", res?.data?.HEADING)
                setHeadingNew(res?.data?.HEADING);
                setCasesList(res?.data?.ACKDATA);
                setAckData([]);
                setAckDataExisting([]);
                setCasesListOld([]);

            }
            else {

                setCasesList([]);
                seterrmsg(true);

            }
        })

    }

    function ExistingCaseDetails(ackDate, ackType) {

        let Url = config.url.local_URL + "ExistingCaseDetails?ackDate=" + ackDate + "&ackType=" + ackType;
        CommonAxiosGet(Url).then((res) => {

            if (res?.data?.status === true) {
                console.log("heading----", res?.data?.HEADING)
                setHeading(res?.data?.HEADING);
                setCasesListOld(res?.data?.ACKDATA);
                setAckData([]);
                setAckDataExisting([]);
                setCasesList([]);
            }
            else {

                setCasesList([]);
                //  seterrmsg(true);

            }
        })

    }

    const EditAck = (ackNo) => {
        // navigate('/GPOAckForm');
        localStorage.setItem("ackNo", JSON.stringify(ackNo));
        navigate('/GPOAcknowledgementForm', { state: { ackNo } });

    };

    function deleteAck(ackNo) {
        let delUrl = (config.url.local_URL + "deleteAckDetails?ackNo=" + ackNo);
        Swal.fire({
            text: "Do you want to delete ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
        }).then((willDelete) => {

            if (willDelete.isConfirmed) {
                CommonAxiosDelete(delUrl).then((res) => {
                    if (res.data != null) {
                        if (res.data.scode === "01") {
                            successAlert("Successfully Deleted");
                            navigate("/AcksReport")
                        } else {
                            failureAlert(res.data.sdesc);
                        }
                    } else {
                        failureAlert(res.data.sdesc);

                    }
                })
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

    const columns = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Ack Date', accessor: "ack_date",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        GPOAcknowledementsListAll(row.original.ack_date, 0);
                    }}
                >
                    {row.original.ack_date}
                </div>
            ),

        },
        {
            Header: 'Total', accessor: "total",
            Footer: 'total'
        },
        {
            Header: 'New Cases', accessor: "new_acks",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        GPOAcknowledementsListAll(row.original.ack_date, 'NEW');
                    }}
                >
                    {row.original.new_acks}
                </div>
            ),
            Footer: 'new_acks'
        },
        {
            Header: 'Existing Cases', accessor: "existing_acks",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        GPOAcknowledementsListAll(row.original.ack_date, 'OLD');
                    }}
                >
                    {row.original.existing_acks}
                </div>
            ),
            Footer: 'existing_acks'
        },

    ];

    const columnsTable2 = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Ack Date', accessor: "ack_date",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        ExistingCaseDetails(row.original.ack_date, 0);
                    }}
                >
                    {row.original.ack_date}
                </div>
            ),

        },
        {
            Header: 'Existing Cases With Case Number', accessor: "existing_casenumber",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        ExistingCaseDetails(row.original.ack_date, 'OLD');
                    }}
                >
                    {row.original.existing_casenumber}
                </div>
            ),
            Footer: 'existing_casenumber'
        },

    ];





    const columnsList = [

        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,

        },
        {
            Header: 'Ack No.',
            accessor: "ack_no",
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
            Header: 'HC Ack No.', accessor: "hc_ack_no",
            Cell: ({ value }) => (
                <span style={{ color: '#00008B', fontWeight: 'bold' }}>
                    {value}
                </span>
            )
        },
        { Header: 'Date', accessor: "generated_date", },
        { Header: 'District.', accessor: "district_name", },
        { Header: 'Department', accessor: "dept_descs", },
        { Header: 'Case Type', accessor: "case_full_name", },

        { Header: 'Main Case No.', accessor: "maincaseno" },
        { Header: 'Advocate CC No.', accessor: "advocateccno" },
        { Header: 'Advocate Name', accessor: "advocatename" },
        { Header: 'Mode of Filing', accessor: "mode_filing" },
        { Header: 'Other Selection Type', accessor: "other_selection_types" },
        { Header: 'Remarks', accessor: "remarks" },


        {
            Header: 'Download / Print', accessor: "",
            Cell: ({ row }) => {
                const data = row.original;
                console.log("Data:", data.ack_file_path);

                return (
                    <div>

                        <center>
                            <button className="btn btn-sm btn-warning" onClick={() => EditAck(data.ack_no)} >
                                <BiEdit />Edit
                            </button>
                        </center>

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
                                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.barcode_file_path); }} >
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

        {
            Header: 'Action', accessor: "",
            Cell: ({ row }) => {
                const data = row.original;
                return (
                    <div>
                        < center >
                            <button className="btn btn-sm btn-danger" onClick={() => deleteAck(data.ack_no)} >
                                <AiOutlineDelete />Delete
                            </button>
                        </center>
                    </div>
                )
            }
        },

    ];

    const columnsListold = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'CINo', accessor: "cino"

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
            Header: 'District', accessor: "dist_name",

        },
        {
            Header: 'Entered By', accessor: "hc_scan_legacy_by",

        },
    ];


    return (<>
        <CommonFormHeader heading={"Generated Cases Report"} />
        <bst.Container className="outer-page-content-container">

            <bst.Row className="pt-2 pt-2 ">
                {AckData?.length > 0 ? (
                    <CommonReactTable data={AckData} columns={columns} showFooter={"true"} heading={Heading}
                        filename="New Cases Report" headerClassName="table-header-colored" footerClassName="table-footer-colored" />
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
            </bst.Row>


            <bst.Row className="pt-2 pt-2 ">
                {AckDataExisting?.length > 0 ? (
                    <CommonReactTable data={AckDataExisting} columns={columnsTable2} showFooter={"true"}
                        filename="New Cases Report" heading={Heading} />
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
            </bst.Row >


            <bst.Row className="pt-2 pt-2 ">
                {CasesList?.length > 0 ? (
                    <div style={{ width: "95%" }}>
                        <CommonReactTable data={CasesList} columns={columnsList} showFooter={"false"}
                            filename="New Cases Report" headerName={HeadingNew} />
                    </div>
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
            </bst.Row>

            <bst.Row className="pt-2 pt-2 ">
                {CasesListOld?.length > 0 ? (
                    <div style={{ width: "95%" }}>
                        <CommonReactTable data={CasesListOld} columns={columnsListold} showFooter={"false"}
                            filename="old Cases Report" headerName={Heading} />
                    </div>
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
            </bst.Row>
        </bst.Container>

        <AckDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={ackno} viewdata={PopupData} />
    </>)
}

export default AcksReport