import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap"
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { failureAlert, successAlert } from '../../CommonUtils/SweetAlerts';
import Swal from 'sweetalert2';
import { FaMinus, FaPlus } from 'react-icons/fa';
import AckDetailsPopup from '../Popups/AckDetailsPopup';

function AssignedNewCases() {
    const [selectedACKs, setSelectedACKs] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [casesList, setCasesList] = useState([]);

    const [collapsed, setCollapsed] = useState(false);
    const [buttonDisplayName, setbuttonDisplayName] = useState("");
    const [empIdList, setempIdList] = useState([]);
    const [nodalList, setnodalList] = useState([]);

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [ackno, setAckno] = useState([]);
    const [PopupData, setPopupData] = useState([]);

    function regularPopStatus() { setregularPopupFlag(false); }

    const navigate = useNavigate();

    const [role, setrole] = useState([]);
    const logindetails = useSelector((state) => state.reducers.loginreducer);
    useEffect(() => {
        if (logindetails?.userLoginDetials?.role) {
            setrole(JSON.stringify(logindetails?.userLoginDetials.role));
            console.log("role----" + role);
        }
    }, [logindetails]);




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

    const columns = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,

        },
        {
            Header: 'Ack No.',
            accessor: "ack_no",
            Cell: role === "8" || role === "11" || role === "12"
                ? ({ row }) => {
                    const ack_no = row.original.ack_no;
                    const hc_ack_no = row.original.hc_ack_no;
                    const respondent_slno = row.original.respondent_slno;

                    return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={selectedACKs.includes(ack_no + "@" + respondent_slno)}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setSelectedACKs(prev =>
                                        isChecked
                                            ? [...prev, ack_no + "@" + respondent_slno]
                                            : prev.filter(id => id !== ack_no + "@" + respondent_slno)
                                    );
                                }}
                            />

                            <div>
                                <button
                                    onClick={() => handleAckPopup(ack_no)}
                                    style={{
                                        backgroundColor: '#74b9db',
                                        color: '#000',
                                        padding: '6px 12px',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        display: 'block',
                                        width: '100%'
                                    }}
                                >
                                    {ack_no}
                                </button>

                                {hc_ack_no && (
                                    <div style={{
                                        color: '#00008B',
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        marginTop: '4px',
                                        textAlign: 'center'
                                    }}>
                                        {hc_ack_no}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }
                : ({ row }) => {
                    const ackno = row.original.ack_no;
                    const hc_ack_no = row.original.hc_ack_no;

                    return (
                        <div>
                            <button
                                className="btn btn-sm"
                                style={{ backgroundColor: '#18c4bc', color: 'white', display: 'block', width: '100%' }}
                                onClick={() => handleAckPopup(ackno)}
                            >
                                {ackno}
                            </button>

                            {hc_ack_no && (
                                <div style={{
                                    color: '#00008B',
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                    marginTop: '4px',
                                    textAlign: 'center'
                                }}>
                                    {hc_ack_no}
                                </div>
                            )}
                        </div>
                    );
                }

        },

        { Header: 'Date', accessor: "generated_date", },

        { Header: 'Case Type', accessor: "case_full_name", },
        { Header: 'Main Case No.', accessor: "maincaseno" },
        { Header: 'Advocate CC No.', accessor: "advocateccno" },
        { Header: 'Advocate Name', accessor: "advocatename" },

        {
            Header: 'Download / Print', accessor: "",
            Cell: ({ row }) => {
                const data = row.original;
                console.log("Data:", data.ack_file_path);

                return (
                    <div>

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
                            data.scanned_file_path !== '' && (
                                <center>
                                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.scanned_file_path); }} >
                                        Scanned Affidavit
                                    </h5>
                                </center>
                            )
                        }

                    </div >
                );
            }
        },
        {
            Header: 'Action/Status',
            accessor: '',
            Cell: ({ row }) => {
                const data = row.original;
                console.log("Data:", data.counter_approved_gp);

                return (
                    <div>
                        {data.pwr_approved_gp === 'Yes' && (
                            <b style={{ color: 'navy' }}>
                                {data.casestatus1}. <br />
                                {data.casestatus2}.<br />
                            </b>
                        )}

                        {data.counter_approved_gp !== '-' && (
                            <b style={{ color: 'navy' }}>
                                {data.casestatus3}. <br />
                                {data.casestatus4}.<br />
                            </b>
                        )}

                        {data.counter_approved_gp !== 'T' && (
                            <button
                                className="btn btn-outline-primary btn-sm mt-2"
                                onClick={() => updateStatus(`${data.ack_no}@${data.respondent_slno}`)}>
                                Update Status
                            </button>
                        )
                        }
                    </div >
                );
            }

        }

    ];

    const formIk = useFormik({
        initialValues: {
            employeeId: "",
            sendBack_dept_code: ""
        },
        //  validationSchema: userValidations,
        enableReinitialize: true,

        onSubmit: (values) => {

            if (!selectedACKs || selectedACKs.length === 0) {
                Swal.fire("Select at least one case to submit.");
                return; // Prevent submission
            }
            values.selectedCaseIds = selectedACKs.join(",");

            console.log(selectedACKs.length);
            // console.log(buttonDisplayName);
            // console.log(values);
            if (buttonDisplayName === "Assign Cases to Section") {
                Swal.fire({
                    title: `Are you sure you want to Assign Cases to Section Officer?`,
                    icon: 'question',
                    showDenyButton: false,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: 'No',
                    backdrop: true,
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        let url = config.url.local_URL + "assignMultiCases2SectionH";

                        CommonAxiosPost(url, values, {
                            headers: { "Content-Type": "application/json" }
                        }).then((res) => {
                            if (res?.data?.scode === '01') {
                                successAlert(res?.data?.sdesc);
                            } else {
                                failureAlert(res?.data?.sdesc);
                            }
                        });
                    }
                });
            }
            else if (buttonDisplayName === "Assign Cases to Nodal/HOD") {
                Swal.fire({
                    title: `Are you sure you want to Assign Cases to Nodal/HOD?`,
                    icon: 'question',
                    showDenyButton: false,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: 'No',
                    backdrop: true,
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        let url = config.url.local_URL + "AssignToDeptHODSendBack";

                        CommonAxiosPost(url, values, {
                            headers: { "Content-Type": "application/json" }
                        }).then((res) => {
                            if (res?.data?.scode === '01') {
                                successAlert(res?.data?.sdesc);
                            } else {
                                failureAlert(res?.data?.sdesc);
                            }
                        });
                    }
                });
            }
        }
    });


    useEffect(() => {
        GetAssignedCasesData();
        GetEmpIdLists();
        GetNodalEmpIdLists();
    }, []);
    const [showdata, Setdata] = useState('')
    function GetAssignedCasesData() {
        let url = config.url.local_URL + "AssignedNewCasesToEmp";
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                setCasesList(res?.data?.CASEWISEACKS);
                Setdata(true)
            }
            else if (res?.data?.status === false) {
                Setdata(false)

            } else {
                seterrmsg(true);
                setCasesList([]);

            }
        }).catch((error) => {
            console.error("Error fetching assigned cases list:", error);
        });

    }

    function GetEmpIdLists() {
        let url = config.url.local_URL + "getEMPList";
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                setempIdList(res?.data?.sdesc);

            } else {
                seterrmsg(true);
                setempIdList([]);

            }
        }).catch((error) => {
            console.error("Error fetching assigned cases list:", error);
        });

    }
    function GetNodalEmpIdLists() {
        let url = config.url.local_URL + "getNoList";
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                setnodalList(res?.data?.data);

            } else {
                seterrmsg(true);
                setnodalList([]);

            }
        }).catch((error) => {
            console.error("Error fetching assigned cases list:", error);
        });

    }


    function updateStatus(ackNo) {

        navigate("/CaseStatusUpdationNew");
        localStorage.setItem("ackNo", JSON.stringify(ackNo));


    }


    const handleAssignCases = async () => {
        if (selectedACKs.length === 0) {
            alert("No Ack Nos selected.");
            return;
        }
        let values = {
            employeeId: formIk?.values?.employeeId,
            selectedCaseIds: selectedACKs.join(",")
        }
        try {
            Swal.fire({
                title: `Are you sure you want to Assign Cases to Section Officer?`,
                icon: 'question',
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: 'No',
                backdrop: true,
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    let url = config.url.local_URL + "";
                    CommonAxiosPost(url, values, {
                        headers: { "Content-Type": "application/json" }
                    }).then((res) => {
                        if (res?.data?.scode === '01') {
                            successAlert(res?.data?.sdesc);
                        } else {
                            failureAlert(res?.data?.sdesc);
                        }
                    });
                }
            });

        } catch (error) {
            console.error("API error:", error);
            alert("An error occurred while assigning cases.");
        }
    };

    const handleSendBackCases = async () => {
        if (selectedACKs.length === 0) {
            alert("No Ack Nos selected.");
            return;
        }
        let values = {
            sendBack_dept_code: formIk?.values?.sendBack_dept_code,
            selectedCaseIds: selectedACKs.join(",")
        }
        try {
            Swal.fire({
                title: `Are you sure you want to Send Back Cases to Nodal/HOD?`,
                icon: 'question',
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: 'No',
                backdrop: true,
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    let url = config.url.local_URL + "";
                    CommonAxiosPost(url, values, {
                        headers: { "Content-Type": "application/json" }
                    }).then((res) => {
                        if (res?.data?.scode === '01') {
                            successAlert(res?.data?.sdesc);
                        } else {
                            failureAlert(res?.data?.sdesc);
                        }
                    });
                }
            });

        } catch (error) {
            console.error("API error:", error);
        }
    };



    return (
        <>
            <CommonFormHeader heading={"Assigned Cases List"} />
            <bst.Container className="outer-page-content-container">
                <bst.Row className="pt-2 pt-4">
                    {
                        showdata === true ? (
                            // <div style={{ overflowX: "auto", width: "90%" }}>
                            <CommonReactTable data={casesList} columns={columns} showFooter={"false"}
                                filename="Assigned Cases List" />
                            // </div>
                        ) : showdata === false ? (errmsg && (<center><b style={{ color: "red" }}>*********No Data Found*********</b></center>)) : ''

                    }
                </bst.Row>

                {role === "8" || role === "11" || role === "12" ? <>
                    <bst.Row className="pt-2 pt-2 ">
                        <FormikProvider value={formIk}>
                            <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} ></Form>
                            <div className="border px-13 pb-13 mb-4 pt-1">

                                <bst.Row className="px-4">
                                    <bst.Col xs={12} sm={12} md={12} lg={10} xl={10} xxl={10}>

                                        <div className='h6'>Assign Cases</div>

                                    </bst.Col>

                                    <bst.Col xs={12} sm={12} md={12} lg={1} xl={1} xxl={1}>
                                        <div className="flex justify-end">
                                            <button
                                                className="text-gray-600 hover:text-gray-800 transition"
                                                onClick={() => setCollapsed(!collapsed)}
                                            >
                                                {collapsed ? <FaPlus /> : <FaMinus />}
                                            </button>
                                        </div>

                                    </bst.Col>
                                    <hr style={{ border: "1px solid gray" }} />
                                </bst.Row>
                                {collapsed === false ? (<>
                                    <bst.Row className="px-2 pt-4" style={{ marginLeft: "10px" }}>
                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <label className="form-label">
                                                Select Section Employee<span style={{ color: 'red' }}>*</span>
                                            </label>

                                            <Field as="select" className='form-control' name="employeeId">
                                                <option value="">--Select Employee--</option>

                                                {empIdList != undefined && empIdList?.map((data, indexDept) => {
                                                    return (<React.Fragment key={indexDept}>
                                                        <option key={indexDept} value={data.value}>
                                                            {data.label}
                                                        </option>
                                                    </React.Fragment>);
                                                })}
                                            </Field>
                                            <ErrorMessage name="employeeId" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>
                                        <bst.Col xs={12} sm={6} md={6} lg={4} xl={4} xxl={4} className="d-flex align-items-end">
                                            <button type="button" className="btn btn-primary" style={{ fontSize: "12px" }}
                                                onClick={handleAssignCases}
                                            //  disabled={!selectedCINos.length}
                                            >
                                                Assign Cases to Section
                                            </button>
                                        </bst.Col>
                                    </bst.Row>
                                    <bst.Row className="px-2 pt-4" style={{ marginLeft: "10px", marginBottom: "20px" }}>

                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <label className="form-label">
                                                Send Back to Nodal Officer<span style={{ color: 'red' }}>*</span>
                                            </label>

                                            <Field as="select" className='form-control' name="sendBack_dept_code">
                                                <option value="">--Select Officer--</option>
                                                {nodalList != undefined && nodalList?.map((data, indexDept) => {
                                                    return (<React.Fragment key={indexDept}>
                                                        <option key={indexDept} value={data.value}>
                                                            {data.label}
                                                        </option>
                                                    </React.Fragment>);
                                                })}
                                            </Field>
                                            <ErrorMessage name="sendBack_dept_code" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>
                                        <bst.Col xs={12} sm={6} md={6} lg={4} xl={4} xxl={4} className="d-flex align-items-end">
                                            <button type="button" className="btn btn-primary" style={{ fontSize: "12px" }} onClick={handleSendBackCases}>
                                                Assign Cases to Nodal/HOD
                                            </button>
                                        </bst.Col>
                                    </bst.Row>

                                </>) : <></>}
                            </div>
                        </FormikProvider>


                    </bst.Row>
                </> : <></>}
            </bst.Container >
            <AckDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={ackno} viewdata={PopupData} />

        </>
    )
}

export default AssignedNewCases