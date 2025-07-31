import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap"
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosDelete, CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import { failureAlert, successAlert } from '../../CommonUtils/SweetAlerts';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import { AiOutlineDelete } from 'react-icons/ai';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { BiEdit } from 'react-icons/bi';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import AckDetailsPopup from '../Popups/AckDetailsPopup';

function ShowAckDetailsPP() {

    const [showAckList, setShowAckList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [displayDelete, setdisplayDelete] = useState([]);
    const [bail, setBail] = useState([]);

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [ackno, setAckno] = useState([]);
    const [PopupData, setPopupData] = useState([]);

    function regularPopStatus() { setregularPopupFlag(false); }

    const navigate = useNavigate();

    useEffect(() => {
        ShowAckList();
    }, []);

    function ShowAckList() {
        let url = config.url.local_URL + "getAcknowledementsList";
        CommonAxiosGet(url).then((res) => {
            if (res.data.scode === "01") {
                setShowAckList(res?.data?.sdesc);
                setdisplayDelete(res?.data?.DISPLAYOLD);
            } else {
                setShowAckList([]);
            }
        }).catch((error) => {
            console.error("Error fetching acknowledgement list names:", error);
        });
    }

    const EditAck = (ackNo) => {
        // navigate('/GPOAckForm');
        localStorage.setItem("ackNo", JSON.stringify(ackNo));
        navigate('/PPOAcknowledgementForm', { state: { ackNo } });

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
                            navigate("/ShowAckDetailsPP")
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


    const columns = [
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

        ...(displayDelete ? [
            { Header: 'Case Year', accessor: 'caseYear' },
            { Header: 'Case Reg. No.', accessor: 'caseRegNo' }
        ] : []),

        { Header: 'Main Case No.', accessor: "maincaseno" },
        { Header: 'Advocate CC No.', accessor: "advocateccno" },
        { Header: 'Advocate Name', accessor: "advocatename" },
        { Header: 'Mode of Filing', accessor: "mode_filing" },
        { Header: 'Police Station Name', accessor: "name_of_the_police_station" },
        { Header: 'Court Name', accessor: "court_name" },
        { Header: 'Charge Sheet Number', accessor: "charge_sheet_no" },
        { Header: 'Crime No', accessor: "crime_no" },
        { Header: 'Crime Year', accessor: "crime_year" },


        ...(bail ? [
            { Header: 'Bail Petition Type', accessor: 'bail_petition_type' },

        ] : []),

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

                        {!displayDelete && (
                            < center >
                                <button className="btn btn-sm btn-danger" onClick={() => deleteAck(data.ack_no)} >
                                    <AiOutlineDelete />Delete
                                </button>
                            </center>

                        )}

                    </div >
                );
            }
        },

        ...(displayDelete ? [
            {
                Header: 'Action', accessor: "",
                Cell: ({ row }) => {
                    {
                        const data = row.original;

                        < center >
                            <button className="btn btn-sm btn-danger" onClick={() => deleteAck(data.ack_no)} >
                                <AiOutlineDelete />Delete
                            </button>
                        </center>
                    }
                }
            }] : []),
    ];

    const handleAckPopup = (ackNo) => {
        let url = config.url.local_URL + "AckNoPopupView?SHOWPOPUP=SHOWPOPUP&cino=" + ackNo;
        CommonAxiosGet(url).then((res) => {
            if (res.data !== undefined) {
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

    return (<>
        <bst.Container className="outer-page-content-container">
            <bst.Row className="pt-2 pt-2 ">
                {
                    showAckList?.length > 0 ? (
                        <div style={{ width: "95%" }}>
                            <CommonReactTable data={showAckList} columns={columns} showFooter={"false"}
                                filename="Acknowledgements Generated" />
                        </div>
                    ) : (errmsg && (<center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))

                }
            </bst.Row>
        </bst.Container>

        <AckDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={ackno} viewdata={PopupData} />

    </>)
}

export default ShowAckDetailsPP