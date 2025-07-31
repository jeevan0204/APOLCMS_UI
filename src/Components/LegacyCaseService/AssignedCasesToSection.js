import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap"
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { config } from '../../CommonUtils/CommonApis';
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import Swal from 'sweetalert2';
import { failureAlert, successAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';
import { useSelector } from 'react-redux';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';
import { useNavigate } from 'react-router-dom';

function AssignedCasesToSection() {
    const [errmsg, seterrmsg] = useState(false);
    const [casesList, setCasesList] = useState([]);
    const [selectedCINos, setSelectedCINos] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [buttonDisplayName, setbuttonDisplayName] = useState("");
    const [empIdList, setempIdList] = useState([]);
    const [nodalList, setnodalList] = useState([]);
    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);

    const navigate = useNavigate();


    function regularPopStatus() { setregularPopupFlag(false); }

    const [role, setrole] = useState([]);
    const logindetails = useSelector((state) => state.reducers.loginreducer);
    useEffect(() => {
        if (logindetails?.userLoginDetials?.role) {
            setrole(JSON.stringify(logindetails?.userLoginDetials.role));
            console.log("role----" + role);
        }
    }, [logindetails]);


    const formIk = useFormik({
        initialValues: {
            employeeId: "",
            sendBack_dept_code: ""
        },
        //  validationSchema: userValidations,
        enableReinitialize: true,

        onSubmit: (values) => {

            if (!selectedCINos || selectedCINos.length === 0) {
                Swal.fire("Select at least one case to submit.");
                return; // Prevent submission
            }
            values.selectedCaseIds = selectedCINos.join(",");
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
                        let url = config.url.local_URL + "assignMultiCases2SectionLegacy";

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
                        let url = config.url.local_URL + "AssignToDeptHODSendBackLegacy";

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

    function GetAssignedCasesData() {
        let url = config.url.local_URL + "AssignedCasesToSection";
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                setCasesList(res?.data?.data);
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


    const columnsList = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,

        },
        {
            Header: 'CINo',
            accessor: 'cino',
            Cell: role === "8" || role === "11" || role === "12"
                ? ({ row }) => {
                    const cino = row.original.cino;
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                checked={selectedCINos.includes(cino)}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setSelectedCINos(prev =>
                                        isChecked ? [...prev, cino] : prev.filter(id => id !== cino)
                                    );
                                }}
                            />
                            <button
                                class="btn btn-info btn-sm"
                                onClick={() => handleCinoClick(cino)}
                            >
                                {cino}
                            </button>
                        </div>
                    );
                }
                : ({ row }) => {
                    const cino = row.original.cino;
                    return (
                        <button className="btn btn-sm"
                            style={{ backgroundColor: '#18c4bc', color: 'white' }} onClick={() => handleCinoClick(cino)}>
                            {cino}
                        </button>
                    );
                }
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
                                onClick={() => updateStatus(data.cino)}
                            >
                                Update Status
                            </button>
                        )}
                    </div>
                );
            }

        }
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


    function updateStatus(cino) {

        navigate("/CaseStatusUpdation");
        localStorage.setItem("cino", JSON.stringify(cino));
    }

    const handleAssignCases = async () => {
        if (selectedCINos.length === 0) {
            alert("No CINos selected.");
            return;
        }
        let values = {
            employeeId: formIk?.values?.employeeId,
            selectedCaseIds: selectedCINos.join(",")
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
                    let url = config.url.local_URL + "assignMultiCases2SectionLegacy";
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
        if (selectedCINos.length === 0) {
            alert("No CINos selected.");
            return;
        }
        let values = {
            sendBack_dept_code: formIk?.values?.sendBack_dept_code,
            selectedCaseIds: selectedCINos.join(",")
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
                    let url = config.url.local_URL + "AssignToDeptHODSendBackLegacy";
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


    return (<>
        <CommonFormHeader heading={"Assigned Cases List"} />
        <bst.Container className="outer-page-content-container">
            <bst.Row className="pt-2 pt-2 ">
                {
                    casesList?.length > 0 ? (
                        <div style={{ width: "95%" }}>
                            <CommonReactTable data={casesList} columns={columnsList} showFooter={"true"}
                                filename="Assigned Cases List" />
                        </div>
                    ) : (errmsg && (<center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))

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
        <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={cino} viewdata={PopupData} />

    </>)
}

export default AssignedCasesToSection