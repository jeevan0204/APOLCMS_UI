import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap";
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet, CommonAxiosGetPost, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import { FaMinus, FaPlus } from 'react-icons/fa';
import * as Yup from "yup"
import { ERROR_MSG } from '../../CommonUtils/contextVariables';
import Swal from 'sweetalert2';
import { failureAlert, successAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';

function LegacyCaseAssignment() {
    const [regYearList, setRegYearList] = useState([]);
    const [showDeptNames, setShowDeptNames] = useState([]);
    const [showDistNames, setShowDistNames] = useState([]);
    const [empDeptDetails, SetEmpDeptDetails] = useState([]);
    const [showHodNames, SetShowHodNames] = useState([]);

    const [purposeList, setPurposeList] = useState([]);
    const [hcCasesList, setHcCasesList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [selectedCINos, setSelectedCINos] = useState([]);
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
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);

    function regularPopStatus() { setregularPopupFlag(false); }

    const userValidations = Yup.object().shape({
        mloSubjectId: Yup.string().when("officerType", {
            is: "MLO-SUB",
            then: () => Yup.string().required(ERROR_MSG).nullable(),
            otherwise: () => Yup.string().nullable(),
        }),
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




    useEffect(() => {
        console.log("MloSubDiv: ", mloSubDiv);
        console.log("DepthodDiv: ", depthodDiv);
        console.log("DepthodSectionDiv: ", depthodSectionDiv);
        console.log("DistDiv: ", distDiv);
        console.log("DisthodDiv: ", disthodDiv);
        console.log("DistdepthodSectionDiv: ", distdepthodSectionDiv);
    }, [mloSubDiv, depthodDiv, depthodSectionDiv, distDiv, disthodDiv, distdepthodSectionDiv]);


    const formIk = useFormik({
        initialValues: {
            regYear: "",
            dofFromDate: "",
            dofToDate: "",
            purpose: "",
            districtId: ""
        },
        onSubmit: (values) => {
            const url = config.url.local_URL + "getHighCourtCasesListdata&regYear=" + values.regYear +
                "&dofFromDate=" + values.dofFromDate + "&dofToDate=" + values.dofToDate + "&purpose=" + values.purpose + "&districtId=" + values.districtId;
            Getcasedetals(url);
        }

    });
    function Getcasedetals(url) {
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                setHcCasesList(res?.data?.data);

            } else {
                setHcCasesList([]);
                seterrmsg(true);
            }
        }).catch((error) => {
            console.error("Error fetching getcases list names:", error);
        });
    }


    const formIk1 = useFormik({
        initialValues: {
            officerType: "",
            mloSubjectId: "",
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

            if (!selectedCINos || selectedCINos.length === 0) {
                Swal.fire("Select at least one case to submit.");
                return; // Prevent submission
            }
            values.selectedCaseIds = selectedCINos.join(",");

            console.log(selectedCINos.length);
            // console.log(buttonDisplayName);
            // console.log(values);
            if (buttonDisplayName === "Assign Cases to MLO (Subject)") {
                Swal.fire({
                    title: `Are you sure you want to Assign Cases to MLO (Subject)?`,
                    icon: 'question',
                    showDenyButton: false,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: 'No',
                    backdrop: true,
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        let url = config.url.local_URL + "fnAssignMloSubject";

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
            else if (buttonDisplayName === "Assign Cases to Dept/HOD") {
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
                        let url = config.url.local_URL + "assign2DeptHOD";
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
                        let url = config.url.local_URL + "assignMultiCases2Section";
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
                        let url = config.url.local_URL + "assign2DistCollector";
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


    useEffect(() => {
        GetDepartmentNames();
        GetRegYearList();
        GetDistrictNames();
        GetPurposeList();
        GetHCCasesList();
        GetMLOList();

    }, []);

    const GetMLOList = () => {
        let url = config.url.local_URL + "getMLOSUBLIST";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setMloList(res.data);

            } else {
                setMloList([]);
            }
        }).catch((error) => {
            console.error("Error fetching setMloList names:", error);
        });
    };


    const GetDepartmentNames = () => {
        let url = config.url.COMMONSERVICE_URL + "getDepartmentList";
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

    const GetHCCasesList = () => {
        const url = config.url.local_URL + "getHighCourtCasesListdata&regYear=" + 0 +
            "&dofFromDate=" + 0 + "&dofToDate=" + 0 + "&purpose=" + 0 + "&districtId=" + 0;
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                setHcCasesList(res?.data?.data);

            } else {
                seterrmsg(true);
                setHcCasesList([]);
            }
        }).catch((error) => {
            console.error("Error fetching HcCasesList names:", error);
        });
    };

    const GetRegYearList = () => {
        let url = config.url.COMMONSERVICE_URL + "getYearsList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setRegYearList(res.data);

            } else {
                setRegYearList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getYearsList names:", error);
        });
    };

    const GetDistrictNames = () => {
        let url = config.url.COMMONSERVICE_URL + "getDistrictList";
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

    const GetPurposeList = () => {
        let url = config.url.local_URL + "getPurposeList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setPurposeList(res.data);

            } else {
                setPurposeList([]);
            }
        }).catch((error) => {
            console.error("Error fetching district names:", error);
        });
    };


    const columns = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,

        },
        {
            Header: 'CINo', accessor: "cino",
            Cell: ({ row }) => {
                const cino = row.original.cino;
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }} >
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
                            onClick={() => handleCinoClick(cino)}
                            style={{
                                backgroundColor: '#74b9db',
                                color: '#000',
                                padding: '6px 12px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                            {cino}
                        </button>
                    </div >
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
            Header: 'Filing Number', accessor: "fil_no",

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


    function handleRadioChange(e) {
        //  alert("hello---------:" + e.target.value);


        const chkdVal = e.target.value;

        // Reset all state values first to avoid any lingering state
        setMloSubDiv(false);
        setDepthodDiv(false);
        setDepthodSectionDiv(false);
        setDistDiv(false);
        setDisthodDiv(false);
        setDistdepthodSectionDiv(false);

        const { checked, value } = e.target;
        setIsChecked(checked);

        // Now set the appropriate state based on the checked value
        if (chkdVal === "MLO-SUB") {
            setMloSubDiv(true);
        } else if (chkdVal === "S-HOD" || chkdVal === "D-HOD") {
            setDepthodDiv(true);
            showDepts(chkdVal);
        } else if (chkdVal === "SD-SO" || chkdVal === "OD-SO") {
            setDepthodSectionDiv(true);
        } else if (chkdVal === "DC") {
            setDistDiv(true);
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



    return (<>

        <CommonFormHeader heading={"List of High Court Cases to be Assigned to Section Officer"} />
        <bst.Container className="outer-page-content-container">
            <bst.Row className="pt-2 pt-2 ">
                <FormikProvider value={formIk}>
                    <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                        <div className="border px-4 pb-13 mb-4 pt-1">
                            <bst.Row className="px-2 pt-4">
                                <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0"> Case Registration Year <span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="regYear"
                                    >
                                        <option value="ALL">--ALL--</option>
                                        {regYearList != undefined && regYearList?.map((data, indexDept) => {
                                            return (<React.Fragment key={indexDept}>
                                                <option key={indexDept} value={data.value}>
                                                    {data.label}
                                                </option>
                                            </React.Fragment>);
                                        })}

                                    </Field>
                                    <ErrorMessage name="regYear" component="div" className="text-error" />
                                </bst.Col>
                                <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0"> Date of Registration (From Date) <span style={{ color: 'red' }}>*</span></label>
                                    <Field type="date" name="dofFromDate" className="form-control" />
                                    <ErrorMessage name="dofFromDate" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0"> Date of Registration (To Date)<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="date" name="dofToDate" className="form-control" />
                                    <ErrorMessage name="dofToDate" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0"> Purpose <span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="purpose"
                                    >
                                        <option value="ALL">--ALL--</option>
                                        {purposeList != undefined && purposeList?.map((data, indexDept) => {
                                            return (<React.Fragment key={indexDept}>
                                                <option key={indexDept} value={data.value}>
                                                    {data.label}
                                                </option>
                                            </React.Fragment>);
                                        })}

                                    </Field>
                                    <ErrorMessage name="purpose" component="div" className="text-error" />
                                </bst.Col>


                            </bst.Row>

                            <bst.Row className="px-4 pt-4">

                                <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0"> District <span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="districtId"
                                    >
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

                            </bst.Row>

                            <bst.Row className="px-2 pt-2" style={{ marginLeft: "20px" }}>
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

                {hcCasesList?.length > 0 ? (
                    <CommonReactTable data={hcCasesList} columns={columns} showFooter={"true"}
                        filename="HC Cases REPORT" headerName="" />
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
            </bst.Row>&nbsp;&nbsp;







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
                                                value="MLO-SUB"
                                                onChange={(e) => { handleRadioChange(e); setbuttonDisplayName("Assign Cases to MLO (Subject)") }}
                                            /> Assign Cases to MLO (Subject) &nbsp;
                                        </bst.Col>
                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <Field
                                                type="radio"
                                                name="officerType"
                                                value="S-HOD"
                                                onChange={(e) => { handleRadioChange(e); setbuttonDisplayName("Assign Cases to Dept/HOD"); formIk1.setFieldValue("caseDept", ""); }}
                                            />Assign Cases to Department HOD&nbsp;
                                        </bst.Col>
                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <Field
                                                type="radio"
                                                name="officerType"
                                                value="D-HOD"
                                                onChange={(e) => { handleRadioChange(e); setbuttonDisplayName("Assign Cases to Dept/HOD"); formIk1.setFieldValue("caseDept", ""); }}
                                            /> Assign Cases to Other Department HOD &nbsp;

                                        </bst.Col>
                                    </bst.Row>
                                    <bst.Row className="px-2 pt-2">

                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <Field
                                                type="radio"
                                                name="officerType"
                                                value="SD-SO"
                                                onChange={(e) => { handleRadioChange(e); setbuttonDisplayName("Assign Cases to Section"); formIk1.setFieldValue("empDept", ""); formIk1.setFieldValue("empDept", ""); formIk1.setFieldValue("empSection", ""); formIk1.setFieldValue("empPost", ""); formIk1.setFieldValue("employeeId", ""); }}
                                            />Assign Cases to Section Officer(Dept.) &nbsp;
                                        </bst.Col>
                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <Field
                                                type="radio"
                                                name="officerType"
                                                value="OD-SO"
                                                onChange={(e) => { handleRadioChange(e); setbuttonDisplayName("Assign Cases to Section"); formIk1.setFieldValue("empDept", ""); formIk1.setFieldValue("empDept", ""); formIk1.setFieldValue("empSection", ""); formIk1.setFieldValue("empPost", ""); formIk1.setFieldValue("employeeId", ""); }}
                                            />Assign Cases to Section Officer(Other Dept.) &nbsp;
                                        </bst.Col>
                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <Field
                                                type="radio"
                                                name="officerType"
                                                value="DC"
                                                onChange={(e) => { handleRadioChange(e); setbuttonDisplayName("Assign Cases"); formIk1.setFieldValue("caseDist", ""); }}
                                            />Assign Cases to District Collector&nbsp;
                                        </bst.Col>
                                    </bst.Row>
                                    <bst.Row className="px-2 pt-2">

                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <Field
                                                type="radio"
                                                name="officerType"
                                                value="DC-NO"
                                                onChange={(e) => { handleRadioChange(e); setbuttonDisplayName("Assign Cases"); formIk1.setFieldValue("caseDept", ""); formIk1.setFieldValue("caseDist", ""); }}
                                            /> Assign Cases to District Nodal Officer &nbsp;
                                        </bst.Col>
                                        <bst.Col xs={8} sm={8} md={8} lg={4} xl={4} xxl={4}>
                                            <Field
                                                type="radio"
                                                name="officerType"
                                                value="DC-SO"
                                                onChange={(e) => { handleRadioChange(e); setbuttonDisplayName("Assign Cases to Section"); formIk1.setFieldValue("empDept", ""); formIk1.setFieldValue("empSection", ""); formIk1.setFieldValue("empPost", ""); formIk1.setFieldValue("employeeId", ""); }}
                                            />Assign Cases to District Section Officer &nbsp;
                                        </bst.Col>
                                    </bst.Row>
                                </label>

                            </>) : <></>}


                            {mloSubDiv === true ? <>
                                <bst.Row className="px-2 pt-4" style={{ marginLeft: "10px" }}>
                                    <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                        <label className="mb-0"> Select MLO (Subject) <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="mloSubjectId"
                                        >
                                            <option value="ALL">--ALL--</option>
                                            {mloList != undefined && mloList?.map((data, indexDept) => {
                                                return (<React.Fragment key={indexDept}>
                                                    <option key={indexDept} value={data.value}>
                                                        {data.label}
                                                    </option>
                                                </React.Fragment>);
                                            })}

                                        </Field>
                                        <ErrorMessage name="mloSubjectId" component="div" className="text-error" />
                                    </bst.Col>

                                </bst.Row>



                            </> : <></>}


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

        <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={cino} viewdata={PopupData} />

    </>)
}

export default LegacyCaseAssignment