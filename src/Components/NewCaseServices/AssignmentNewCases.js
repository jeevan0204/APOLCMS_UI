import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap"
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet, CommonAxiosGetPost, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import * as Yup from 'yup'
import { failureAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import Swal from 'sweetalert2';
import { ERROR_MSG } from '../../CommonUtils/contextVariables';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { FaMinus, FaPlus } from 'react-icons/fa';
import AckDetailsPopup from '../Popups/AckDetailsPopup';

function AssignmentNewCases() {

    const [caseTypesList, setCaseTypesList] = useState([]);
    const [showDeptNames, setShowDeptNames] = useState([]);
    const [showDistNames, setShowDistNames] = useState([]);
    const [NewCasesList, setNewCasesList] = useState([]);
    const [errmsg, seterrmsg] = useState([]);
    const [selectedACKs, setSelectedACKs] = useState([]);

    const [regYearList, setRegYearList] = useState([]);

    const [empDeptDetails, SetEmpDeptDetails] = useState([]);
    const [showHodNames, SetShowHodNames] = useState([]);

    const [collapsed, setCollapsed] = useState(false);

    const [depthodSectionDiv, setDepthodSectionDiv] = useState(false);
    const [depthodDiv, setDepthodDiv] = useState(false);
    const [distDiv, setDistDiv] = useState(false);
    const [disthodDiv, setDisthodDiv] = useState(false);
    const [distdepthodSectionDiv, setDistdepthodSectionDiv] = useState(false);
    const [mloSubDiv, setMloSubDiv] = useState(false);

    const [empSectionList, setEmpSectionList] = useState([]);
    const [empPOstList, setEmpPOstList] = useState([]);
    const [empIdList, setEmpIdList] = useState([]);
    const [mloList, setMloList] = useState([]);
    const [buttonDisplayName, setbuttonDisplayName] = useState("");
    const [isChecked, setIsChecked] = useState(false);


    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [ackno, setAckno] = useState([]);
    const [PopupData, setPopupData] = useState([]);

    function regularPopStatus() { setregularPopupFlag(false); }

    useEffect(() => {

        GetCaseTypesList();
        GetDepartmentNames();
        GetDistrictNames();
        GetNewCasesList();

    }, []);

    const formIk = useFormik({
        initialValues: {
            deptId: "",
            districtId: "",
            fromDate: "",
            toDate: "",
            caseType: "",
            advcteName: "",
        },
        onSubmit: (values) => {
            let url = config.url.local_URL + "";

            CommonAxiosGetPost(url, values).then((res) => {
                if (res?.data?.status === true) {
                    setNewCasesList(res?.data?.data);

                } else {
                    seterrmsg(true);
                    setNewCasesList([]);
                }
            }).catch((error) => {
                console.error("Error fetching ContemptCasesAbstractReport list:", error);
            });

        }
    });

    const userValidations = Yup.object().shape({

        caseDept: Yup.string().when("officerType", {
            is: (val) => val === "S-HOD" || val === "D-HOD",
            then: () => Yup.string().required(ERROR_MSG).nullable(),
            otherwise: () => Yup.string().nullable(),
        }),

        caseDist1: Yup.string().when("officerType", {
            is: (val) => val === "DC-SO",
            then: () => Yup.string().required(ERROR_MSG).nullable(),
            otherwise: () => Yup.string().nullable(),
        }),
        empDept: Yup.string().when("officerType", {
            is: (val) => val === "SD-SO" || val === "OD-SO" || val === "DC-SO",
            then: () => Yup.string().required(ERROR_MSG).nullable(),
            otherwise: () => Yup.string().nullable(),
        }),
        caseDist: Yup.string().when("officerType", {
            is: (val) => val === "DC" || val === "DC-NO",
            then: () => Yup.string().required(ERROR_MSG).nullable(),
            otherwise: () => Yup.string().nullable(),
        }),
        distDept: Yup.string().when("officerType", {
            is: (val) => val === "DC-NO",
            then: () => Yup.string().required(ERROR_MSG).nullable(),
            otherwise: () => Yup.string().nullable(),
        }),
        empSection: Yup.string().when("officerType", {
            is: (val) => val === "SD-SO" || val === "OD-SO" || val === "DC-SO",
            then: () => Yup.string().required(ERROR_MSG).nullable(),
            otherwise: () => Yup.string().nullable(),
        }),
        empPost: Yup.string().when("officerType", {
            is: (val) => val === "SD-SO" || val === "OD-SO" || val === "DC-SO",
            then: () => Yup.string().required(ERROR_MSG).nullable(),
            otherwise: () => Yup.string().nullable(),
        }),
        employeeId: Yup.string().when("officerType", {
            is: (val) => val === "SD-SO" || val === "OD-SO" || val === "DC-SO",
            then: () => Yup.string().required(ERROR_MSG).nullable(),
            otherwise: () => Yup.string().nullable(),
        }),

    });

    const formIk1 = useFormik({
        initialValues: {
            officerType: "",
            caseDept: "",
            empDept: "",
            empSection: "",
            empPost: "",
            employeeId: "",
            caseDist1: "",
            caseDist: "",
            distDept: "",
        },
        validationSchema: userValidations,
        enableReinitialize: true,

        onSubmit: (values) => {

            if (!selectedACKs || selectedACKs.length === 0) {
                Swal.fire("Select at least one case to submit.");
                return; // Prevent submission
            }
            values.selectedCaseIds = selectedACKs.join(",");

            console.log(selectedACKs.length);

            if (buttonDisplayName === "Assign Cases to Dept/HOD") {
                Swal.fire({
                    title: `Are you sure you want to Assign Cases to Dept/HOD ?`,
                    icon: 'question',
                    showDenyButton: false,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: 'No',
                    backdrop: true,
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        let url = config.url.local_URL + "AssignToDeptHOD";
                        CommonAxiosPost(url, values, {
                            headers: { "Content-Type": "application/json" }
                        }).then((res) => {
                            if (res?.data?.scode === '01') {
                                console.log("sdesc------" + res?.data?.sdesc);
                                successAlert2(res?.data?.sdesc);
                            } else {
                                failureAlert(res?.data?.sdesc);
                            }
                        });
                    }
                });
            }
            else if (buttonDisplayName === "Assign Cases to Section") {
                Swal.fire({
                    title: `Are you sure you want to Assign Cases to Section ?`,
                    icon: 'question',
                    showDenyButton: false,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: 'No',
                    backdrop: true,
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        let url = config.url.local_URL + "AssignMultiCasesToSection";
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
            else if (buttonDisplayName === "Assign Cases") {

                Swal.fire({
                    title: `Are you sure you want to Assign Cases  ?`,
                    icon: 'question',
                    showDenyButton: false,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: 'No',
                    backdrop: true,
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        let url = config.url.local_URL + "AssignToDistCollector";
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
        }
    });


    function GetNewCasesList() {
        let url = config.url.local_URL + "AssignmentAndNewCasesList";
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {

                setNewCasesList(res?.data?.CASEWISEACKS);

            } else {
                setNewCasesList([]);
            }
        }).catch((error) => {
            console.error("Error fetch AssignmentAndNewCasesList names:", error);
        });
    };


    const GetCaseTypesList = () => {
        let url = config.url.local_URL + "getCaseTypeMstNEW";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setCaseTypesList(res.data);

            } else {
                setCaseTypesList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getCaseTypesList names:", error);
        });
    };

    const GetDepartmentNames = () => {
        let url = config.url.local_URL + "getDepartmentList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setShowDeptNames(res.data);

            } else {
                setShowDeptNames([]);
            }
        }).catch((error) => {
            console.error("Error fetching department names:", error);
        });
    };

    const GetDistrictNames = () => {
        let url = config.url.local_URL + "getDistrictList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setShowDistNames(res.data);
            } else {
                setShowDistNames([]);
            }
        }).catch((error) => {
            console.error("Error fetching district names:", error);
        });
    };


    useEffect(() => {
        console.log("Currently selected ACKs:", selectedACKs);
    }, [selectedACKs]);



    const columns = [

        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,

        },
        {
            Header: 'Ack No', accessor: "ack_no",
            Cell: ({ row }) => {
                const ack_no = row.original.ack_no;
                const respondent_slno = row.original.respondent_slno;
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }} >
                        <input
                            type="checkbox"
                            checked={selectedACKs.includes(ack_no + "@" + respondent_slno)}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                setSelectedACKs(prev =>
                                    isChecked ? [...prev, ack_no + "@" + respondent_slno] : prev.filter(id => id !== ack_no + "@" + respondent_slno)
                                );
                            }}
                        />
                        <button onClick={() => handleAckPopup(ack_no)}
                            style={{
                                backgroundColor: '#74b9db',
                                color: '#000',
                                padding: '6px 12px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                            {ack_no}
                        </button>
                    </div >
                );
            }


        },
        {
            Header: 'Date ', accessor: "generated_date",
        },
        {
            Header: 'District', accessor: "district_name",

        },
        {
            Header: 'Case Type', accessor: "case_full_name",

        },
        {
            Header: 'Advocate CC No', accessor: "advocateccno",

        },

        {
            Header: 'Advocate Name', accessor: "advocatename",

        },
        {
            Header: 'Download/Print', accessor: "",
            Cell: ({ row }) => {
                let data = row.original;
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
                            data.barcode_file_path !== '' && (
                                <center>
                                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.barcode_file_path); }} >
                                        Barcode
                                    </h5>
                                </center>
                            )
                        }


                        {/* {scanned affidavit} */}

                    </div>
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


    function handleRadioChange(e) {


        const chkdVal = e.target.value;

        setMloSubDiv(false);
        setDepthodDiv(false);
        setDepthodSectionDiv(false);
        setDistDiv(false);
        setDisthodDiv(false);
        setDistdepthodSectionDiv(false);

        const { checked, value } = e.target;
        setIsChecked(checked);

        // Now set the appropriate state based on the checked value
        if (chkdVal === "S-HOD" || chkdVal === "D-HOD") {
            setDepthodDiv(true);
            showDepts(chkdVal);
        } else if (chkdVal === "SD-SO" || chkdVal === "OD-SO") {
            setDepthodSectionDiv(true);
        } else if (chkdVal === "DC") {
            setDistDiv(true);
            setDisthodDiv(true);
        } else if (chkdVal === "DC-NO") {
            setDistDiv(true);
            setDisthodDiv(true);
        } else if (chkdVal === "DC-SO") {
            setDepthodSectionDiv(true);
            setDistdepthodSectionDiv(true);
        }

        showDepts(chkdVal);
    }

    function showDepts(chkdVal) {
        let url = config.url.local_URL + "empDeptListToAssignCases?chkdVal=" + chkdVal;
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {

                if (chkdVal == "S-HOD" || chkdVal == "D-HOD" || chkdVal == "DC-NO") {
                    SetShowHodNames(res?.data?.data);
                }
                else if (chkdVal == "SD-SO" || chkdVal == "OD-SO" || chkdVal == "DC-SO") {
                    SetEmpDeptDetails(res?.data?.data);
                }
            } else {
                SetShowHodNames([]);
                SetEmpDeptDetails([]);
            }
        }).catch((error) => {
            console.error("Error fetching district names:", error);
        });
    }

    function getSectionList(e) {
        console.log(e.target.value);
        const deptCode = e.target.value;
        const distCode = formIk1?.values?.caseDist1 !== undefined ? formIk1?.values?.caseDist1 : 0;

        // alert(distCode);
        let url = config.url.COMMONSERVICE_URL + "getEmpDeptSectionsList?distCode=" + distCode + "&deptCode=" + deptCode;
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                let options = res.data.map((item, i) => (
                    <option key={i} value={item.value}>
                        {item.label}
                    </option>
                ));
                setEmpSectionList(options);
            } else {
                setEmpSectionList([]);
            }
        }).catch((error) => {
            console.error("Error fetching section names:", error);
        });

    }


    function getPostList(e) {
        console.log(e.target.value);
        const empSec = e.target.value;
        const deptCode = formIk1?.values?.empDept;
        const distCode = formIk1?.values?.caseDist1 !== undefined ? formIk1?.values?.caseDist1 : 0;
        let url = config.url.COMMONSERVICE_URL + "getEmpPostsList?distCode=" + distCode + "&deptCode=" + deptCode + "&empSec=" + empSec;
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                let options = res.data.map((item, i) => (
                    <option key={i} value={item.value}>
                        {item.label}
                    </option>
                ));
                setEmpPOstList(options);
            } else {
                setEmpPOstList([]);
            }
        }).catch((error) => {
            console.error("Error fetching section names:", error);
        });

    }

    function getEmpList(e) {
        console.log(e.target.value);
        const deptCode = formIk1?.values?.empDept;
        const distCode = formIk1?.values?.caseDist1 !== undefined ? formIk1?.values?.caseDist1 : 0;
        const empSec = formIk1?.values?.empSection;
        const empPost = e.target.value;
        let url = config.url.COMMONSERVICE_URL + "getEmpIdList?distCode=" + distCode + "&deptCode=" + deptCode + "&empSec=" + empSec + "&empPost=" + empPost;
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                let options = res.data.map((item, i) => (
                    <option key={i} value={item.value}>
                        {item.label}
                    </option>
                ));
                setEmpIdList(options);
            } else {
                setEmpIdList([]);
            }
        }).catch((error) => {
            console.error("Error fetching section names:", error);
        });

    }
    return (
        <>
            <CommonFormHeader heading={"Assignment of New Cases"} />
            <bst.Container className="outer-page-content-container">
                <bst.Row className="pt-2 pt-2 ">
                    <FormikProvider value={formIk}>
                        <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                            <div className="border px-4 pb-13 mb-4 pt-1">
                                <bst.Row className="px-2 pt-4">
                                    <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                        <label className="mb-0"> Department <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="deptId" >
                                            <option value="ALL">--ALL--</option>
                                            {showDeptNames != undefined && showDeptNames?.map((data, indexDept) => {
                                                return (<React.Fragment key={indexDept}>
                                                    <option key={indexDept} value={data.dept_id}>
                                                        {data.dept_name}
                                                    </option>
                                                </React.Fragment>);
                                            })}

                                        </Field>
                                        <ErrorMessage name="deptId" component="div" className="text-danger" ></ErrorMessage>
                                    </bst.Col>
                                    <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                        <label className="mb-0"> District <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="districtId" >
                                            <option value="ALL">--ALL--</option>
                                            {showDistNames != undefined && showDistNames?.map((data, indexDept) => {
                                                return (<React.Fragment key={indexDept}>
                                                    <option key={indexDept} value={data.value}>
                                                        {data.label}
                                                    </option>
                                                </React.Fragment>);
                                            })}

                                        </Field>
                                        <ErrorMessage name="districtId" component="div" className="text-error" />
                                    </bst.Col>
                                    <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                        <label className="mb-0"> From Date <span style={{ color: 'red' }}>*</span></label>
                                        <Field type="date" name="dofFromDate" className="form-control" />
                                        <ErrorMessage name="dofFromDate" component="div" className="text-error" />
                                    </bst.Col>

                                    <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                        <label className="mb-0"> To Date<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="date" name="dofToDate" className="form-control" />
                                        <ErrorMessage name="dofToDate" component="div" className="text-error" />
                                    </bst.Col>


                                </bst.Row>

                                <bst.Row className="px-2 pt-3" >

                                    <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                        <label className="mb-0"> Case Type <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="caseType"
                                        >
                                            <option value="">--Select--</option>

                                            {caseTypesList != undefined && caseTypesList?.map((data, indexDept) => {
                                                return (<React.Fragment key={indexDept}>
                                                    <option key={indexDept} value={data.value}>
                                                        {data.label}
                                                    </option>
                                                </React.Fragment>);
                                            })}
                                        </Field>
                                        <ErrorMessage name="caseType" component="div" className="text-error" />
                                    </bst.Col>
                                    <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                        <label className="mb-0">Advocate Name<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="text" className="form-control me-1 mt-0" name="advcteName" />
                                        <ErrorMessage name="advcteName" component="div" className="text-error" />

                                    </bst.Col>


                                </bst.Row>

                                <bst.Row className="px-2 pt-3" style={{ marginLeft: "10px" }}>
                                    <bst.InputGroup className="mb-4">
                                        <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                            <button type="submit" className='btn btn-success mt-4'
                                            >Submit</button>
                                        </bst.Col>
                                    </bst.InputGroup>
                                </bst.Row>



                            </div>
                        </Form>
                    </FormikProvider>
                    {NewCasesList?.length > 0 ? (
                        <div style={{ overflowX: "auto", width: "98%" }}>
                            <CommonReactTable data={NewCasesList} columns={columns} showFooter={"true"}
                                filename="New HC Cases REPORT" headerName="" />
                        </div>
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
                </bst.Row>


                <bst.Row className="pt-2 pt-2 ">
                    <FormikProvider value={formIk1}>
                        <Form onSubmit={formIk1?.handleSubmit} onChange={formIk1?.handleChange} >
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
                                    <bst.Row className="px-4 pt-4">
                                        <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                            <label className="mb-0"> Remarks </label>
                                            <Field as='textarea' name='remarks' className='form-control' />
                                            <ErrorMessage name="remarks" component="div" className="text-error" />
                                        </bst.Col>
                                    </bst.Row>&nbsp;

                                    {/* <hr style={{ border: "1px solid gray" }} /> */}
                                    &nbsp;&nbsp;&nbsp;

                                    <label style={{ marginTop: "40px" }}>
                                        <bst.Row className="px-2 pt-2">


                                            <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                                <Field
                                                    type="radio"
                                                    name="officerType"
                                                    value="S-HOD"
                                                    onChange={(e) => {
                                                        handleRadioChange(e); setbuttonDisplayName("Assign Cases to Dept/HOD");
                                                        formIk1.setFieldValue("caseDept", "");
                                                    }}
                                                />Assign Cases to Department HOD&nbsp;
                                            </bst.Col>
                                            <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                                <Field
                                                    type="radio"
                                                    name="officerType"
                                                    value="D-HOD"
                                                    onChange={(e) => {
                                                        handleRadioChange(e); setbuttonDisplayName("Assign Cases to Dept/HOD");
                                                        formIk1.setFieldValue("caseDept", "");
                                                    }}
                                                /> Assign Cases to Other Department HOD &nbsp;

                                            </bst.Col>

                                            <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                                <Field
                                                    type="radio"
                                                    name="officerType"
                                                    value="SD-SO"
                                                    onChange={(e) => {
                                                        handleRadioChange(e); setbuttonDisplayName("Assign Cases to Section");
                                                        formIk1.setFieldValue("empDept", "");
                                                        formIk1.setFieldValue("empDept", "");
                                                        formIk1.setFieldValue("empSection", "");
                                                        formIk1.setFieldValue("empPost", "");
                                                        formIk1.setFieldValue("employeeId", "");
                                                    }}
                                                />Assign Cases to Section Officer(Dept.) &nbsp;
                                            </bst.Col>
                                        </bst.Row>
                                        <bst.Row className="px-2 pt-2">

                                            <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                                <Field
                                                    type="radio"
                                                    name="officerType"
                                                    value="OD-SO"
                                                    onChange={(e) => {
                                                        handleRadioChange(e); setbuttonDisplayName("Assign Cases to Section");
                                                        formIk1.setFieldValue("empDept", "");
                                                        formIk1.setFieldValue("empDept", "");
                                                        formIk1.setFieldValue("empSection", "");
                                                        formIk1.setFieldValue("empPost", "");
                                                        formIk1.setFieldValue("employeeId", "");
                                                    }}
                                                />Assign Cases to Section Officer(Other Dept.) &nbsp;
                                            </bst.Col>
                                            <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                                <Field
                                                    type="radio"
                                                    name="officerType"
                                                    value="DC"
                                                    onChange={(e) => {
                                                        handleRadioChange(e); setbuttonDisplayName("Assign Cases");
                                                        formIk1.setFieldValue("caseDist", "");
                                                        formIk1.setFieldValue("distDept", "");
                                                    }}
                                                />Assign Cases to District Collector&nbsp;
                                            </bst.Col>


                                            <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                                <Field
                                                    type="radio"
                                                    name="officerType"
                                                    value="DC-NO"
                                                    onChange={(e) => {
                                                        handleRadioChange(e); setbuttonDisplayName("Assign Cases");
                                                        formIk1.setFieldValue("caseDept", "");
                                                        formIk1.setFieldValue("caseDist", "");
                                                    }}
                                                /> Assign Cases to District Nodal Officer &nbsp;
                                            </bst.Col>
                                        </bst.Row>
                                        <bst.Row className="px-2 pt-2">
                                            <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                                <Field
                                                    type="radio"
                                                    name="officerType"
                                                    value="DC-SO"
                                                    onChange={(e) => {
                                                        handleRadioChange(e); setbuttonDisplayName("Assign Cases to Section");
                                                        formIk1.setFieldValue("empDept", "");
                                                        formIk1.setFieldValue("empSection", "");
                                                        formIk1.setFieldValue("empPost", "");
                                                        formIk1.setFieldValue("employeeId", "");
                                                    }}
                                                />Assign Cases to District Section Officer &nbsp;
                                            </bst.Col>
                                        </bst.Row>
                                    </label>

                                </>) : <></>}

                                {distDiv === true ? <>
                                    <bst.Row className="px-2 pt-4" style={{ marginLeft: "10px" }}>
                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <label className="mb-0"> Select District  <span style={{ color: 'red' }}>*</span></label>
                                            <Field as="select" className='form-control' name="caseDist"
                                            >
                                                <option value="">--Select--</option>
                                                {showDistNames != undefined && showDistNames?.map((data, indexDept) => {
                                                    return (<React.Fragment key={indexDept}>
                                                        <option key={indexDept} value={data.value}>
                                                            {data.label}
                                                        </option>
                                                    </React.Fragment>);
                                                })}

                                            </Field>
                                            <ErrorMessage name="caseDist" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>
                                    </bst.Row>
                                    {disthodDiv === true ? <>
                                        <bst.Row className="px-2 pt-4" style={{ marginLeft: "10px" }}>
                                            <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                                <label className="mb-0"> Select Department / HOD <span style={{ color: 'red' }}>*</span></label>
                                                <Field as="select" className='form-control' name="distDept"
                                                >
                                                    <option value="">--Select--</option>
                                                    {showDeptNames != undefined && showDeptNames?.map((data, indexDept) => {
                                                        return (<React.Fragment key={indexDept}>
                                                            <option key={indexDept} value={data.dept_id}>
                                                                {data.dept_name}
                                                            </option>
                                                        </React.Fragment>);
                                                    })}

                                                </Field>
                                                <ErrorMessage name="distDept" component="div" className="text-danger" ></ErrorMessage>

                                            </bst.Col>
                                        </bst.Row>
                                    </> : <></>}


                                </> : <></>}

                                {depthodDiv === true ? <>
                                    <bst.Row className="px-2 pt-4" style={{ marginLeft: "10px" }}>
                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <label className="mb-0"> Select Department / HOD <span style={{ color: 'red' }}>*</span></label>
                                            <Field as="select" className='form-control' name="caseDept"
                                            >
                                                <option value="">--Select--</option>
                                                {showHodNames != undefined && showHodNames?.map((data, indexDept) => {
                                                    return (<React.Fragment key={indexDept}>
                                                        <option key={indexDept} value={data.value}>
                                                            {data.label}
                                                        </option>
                                                    </React.Fragment>);
                                                })}
                                            </Field>
                                            <ErrorMessage name="caseDept" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>
                                    </bst.Row>
                                </> : <></>}


                                {depthodSectionDiv === true ? <>
                                    {distdepthodSectionDiv === true ? <>
                                        <bst.Row className="px-2 pt-4" style={{ marginLeft: "10px" }}>
                                            <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                                <label className="mb-0">Select District<span style={{ color: 'red' }}>*</span></label>
                                                <Field as="select" className='form-control' name="caseDist1"
                                                >
                                                    <option value="">--Select--</option>
                                                    {showDistNames != undefined && showDistNames?.map((data, indexDept) => {
                                                        return (<React.Fragment key={indexDept}>
                                                            <option key={indexDept} value={data.value}>
                                                                {data.label}
                                                            </option>
                                                        </React.Fragment>);
                                                    })}

                                                </Field>
                                                <ErrorMessage name="caseDist1" component="div" className="text-danger" ></ErrorMessage>

                                            </bst.Col>
                                        </bst.Row>
                                    </> : <></>}
                                    <bst.Row className="px-2 pt-4" style={{ marginLeft: "10px" }}>
                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <label className="form-label">
                                                Department<span style={{ color: 'red' }}>*</span>
                                            </label>

                                            <Field as="select" className='form-control' name="empDept"
                                                onChange={(e) => {
                                                    getSectionList(e);
                                                    formIk.setFieldValue(`empSection`, '');
                                                }}>
                                                <option value="">--Select--</option>
                                                {empDeptDetails != undefined && empDeptDetails?.map((data, indexDept) => {
                                                    return (<React.Fragment key={indexDept}>
                                                        <option key={indexDept} value={data.value}>
                                                            {data.label}
                                                        </option>
                                                    </React.Fragment>);
                                                })}


                                            </Field>
                                            <ErrorMessage name="empDept" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>
                                    </bst.Row>
                                    <bst.Row className="px-2 pt-4" style={{ marginLeft: "10px" }}>
                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <label className="form-label">
                                                Section<span style={{ color: 'red' }}>*</span>
                                            </label>

                                            <Field as="select" className='form-control' name="empSection"
                                                onChange={(e) => {
                                                    getPostList(e);
                                                    formIk.setFieldValue(`empPost`, '');
                                                }}>
                                                <option value="">--Select--</option>
                                                {empSectionList}

                                            </Field>
                                            <ErrorMessage name="empSection" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>
                                    </bst.Row>
                                    <bst.Row className="px-2 pt-4" style={{ marginLeft: "10px" }}>
                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <label className="form-label">
                                                Post<span style={{ color: 'red' }}>*</span>
                                            </label>

                                            <Field as="select" className='form-control' name="empPost"
                                                onChange={(e) => {
                                                    getEmpList(e);
                                                    formIk.setFieldValue(`employeeId`, '');
                                                }}>
                                                <option value="">--Select--</option>

                                                {empPOstList}
                                            </Field>
                                            <ErrorMessage name="empPost" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>
                                    </bst.Row>
                                    <bst.Row className="px-2 pt-4" style={{ marginLeft: "10px" }}>
                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <label className="form-label">
                                                Employee Name<span style={{ color: 'red' }}>*</span>
                                            </label>

                                            <Field as="select" className='form-control' name="employeeId"
                                            >
                                                <option value="">--Select--</option>

                                                {empIdList}
                                            </Field>
                                            <ErrorMessage name="employeeId" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>
                                    </bst.Row>


                                </> : <></>}

                                {isChecked && (<>
                                    <bst.Row className="px-2 pt-4" style={{ marginLeft: "10px" }}>
                                        <bst.Col xs={4} sm={4} md={4} lg={6} xl={6} xxl={6}>
                                            <button type="submit" className="btn btn-primary" style={{ fontSize: "12px" }}
                                            // onClick={(e) => { fnAssignMloSubject() }}
                                            >{buttonDisplayName}</button>
                                        </bst.Col>
                                    </bst.Row>&nbsp;
                                </>)}

                            </div>
                        </Form>
                    </FormikProvider>
                </bst.Row >

            </bst.Container >

            <AckDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={ackno} viewdata={PopupData} />
        </>
    )
}

export default AssignmentNewCases