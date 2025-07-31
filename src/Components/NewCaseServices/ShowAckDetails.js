import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap"
import CommonReactTable from '../../CommonUtils/CommonReactTable'
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosDelete, CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import { BiEdit } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';
import Sweetalert, { failureAlert, successAlert, SweetalertOKFunction } from '../../CommonUtils/SweetAlerts';
import Swal from 'sweetalert2';
import AckDetailsPopup from '../Popups/AckDetailsPopup';

function ShowAckDetails() {

    const [showAckList, setShowAckList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [displayDelete, setdisplayDelete] = useState([]);

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [PopupData, setPopupData] = useState([]);

    function regularPopStatus() { setregularPopupFlag(false); }

    const [ackno, setAckno] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        ShowAckList();
    }, []);

    function ShowAckList() {
        let url = config.url.local_URL + "getAcknowledementsList";
        CommonAxiosGet(url).then((res) => {
            if (res.data.scode === "01") {
                setShowAckList(res?.data?.ACKDATA);
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
        navigate('/GPOAcknowledgementForm', { state: { ackNo } });

    };

    // const deleteAck = (ackNo) => {
    //     CommonAxiosDelete(`${config.url.local_URL}deleteAckDetails/${ackNo}`).then((response) => {
    //         if (response.data.scode === "01") {
    //             SweetalertOKFunction("Deleted Successfully", 'success').then(function (isConfirm) {
    //                 if (isConfirm.value) {
    //                     navigate("/ShowAckDetails")
    //                 }
    //             });
    //         } else if (response.data.scode === "02") {
    //             Sweetalert(response.data.sdesc, "warning");
    //         }
    //     });
    // };


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
                            navigate("/ShowAckDetails")
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

        ...(displayDelete ? [ // Conditionally add columns
            { Header: 'Case Year', accessor: 'caseYear' },
            { Header: 'Case Reg. No.', accessor: 'caseRegNo' }
        ] : []),

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

        <AckDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={ackno} viewdata={PopupData} />


    </>)
}

export default ShowAckDetails