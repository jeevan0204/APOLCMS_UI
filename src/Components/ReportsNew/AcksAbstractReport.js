import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet, CommonAxiosGetPost } from '../../CommonUtils/CommonAxios';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import AckDetailsPopup from '../Popups/AckDetailsPopup';
import { useNavigate } from 'react-router-dom';

export default function AcksAbstractReport() {
    const [caseTypesList, setCaseTypesList] = useState([]);
    const [showDeptNames, setShowDeptNames] = useState([]);
    const [showDistNames, setShowDistNames] = useState([]);
    const [categoryServiceList, setCategoryServiceList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);

    const [DISTWISEACKSList, setDISTWISEACKSList] = useState([]);
    const [DEPTWISEACKSList, setDEPTWISEACKSList] = useState([]);
    const [UserWiseList, setUserWiseList] = useState([]);
    const [casesList, setCasesList] = useState([]);

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [ackno, setAckno] = useState([]);
    const [PopupData, setPopupData] = useState([]);

    function regularPopStatus() { setregularPopupFlag(false); }

    const navigate = useNavigate();

    const formIk = useFormik({
        initialValues: {
            deptId: "",
            distId: "",
            caseTypeId: "",
            advcteName: "",
            dofFromDate: "",
            dofToDate: "",
            petitionerName: "",
            categoryServiceId: ""
        },
        enableReinitialize: true,

        onSubmit: (values) => {
            showCaseWiseAcksAbstractList("", "", "");
        }

    })

    useEffect(() => {
        GetCaseTypesList();
        GetDepartmentNames();
        GetDistrictNames();
        GetCategoryServiceList();
        GetNewAbstractReportList();

    }, []);

    // **********level 1*********

    const [showL1, setL1] = useState(false);
    const [showType, setType] = useState('');
    function GetNewAbstractReportList() {

        const deptId = formIk?.values?.deptId ?? "";
        const distId = formIk?.values?.distId ?? "";
        const caseTypeId = formIk?.values?.caseTypeId ?? "";
        const advcteName = formIk?.values?.advcteName ?? "";
        const dofFromDate = formIk?.values?.dofFromDate ?? "";
        const dofToDate = formIk?.values?.dofToDate ?? "";
        const petitionerName = formIk?.values?.petitionerName ?? "";
        const categoryServiceId = formIk?.values?.categoryServiceId ?? "";

        setType("dept");
        let url = config.url.local_URL + "AcksAbstractReport?districtId=" + distId + "&deptId=" + deptId +
            "&fromDate=" + dofFromDate + "&toDate=" + dofToDate + "&advcteName=" + advcteName +
            "&petitionerName=" + petitionerName + "&serviceType1=" + categoryServiceId + "&caseTypeId=" + caseTypeId;

        CommonAxiosGet(url).then((res) => {
            if (res.data?.scode === '01') {
                setDEPTWISEACKSList(res?.data?.DEPTWISEACKS);
                setL2(false);
                setL1(true);
                setL1Dist(false);
                setL1user(false);
            } else {
                setDEPTWISEACKSList([]);
                setL2(false);
                setL1(true);
                setL1Dist(false);
                setL1user(false);
            }
        }).catch((error) => {
            console.error("Error fetching setCasesList names:", error);
        });

    }

    //*************level 1 dist *************
    const [showL1Dist, setL1Dist] = useState(false);
    function DistrictWiseCases() {
        const deptId = formIk?.values?.deptId ?? "";
        const distId = formIk?.values?.distId ?? "";
        const caseTypeId = formIk?.values?.caseTypeId ?? "";
        const advcteName = formIk?.values?.advcteName ?? "";
        const dofFromDate = formIk?.values?.dofFromDate ?? "";
        const dofToDate = formIk?.values?.dofToDate ?? "";
        const petitionerName = formIk?.values?.petitionerName ?? "";
        const categoryServiceId = formIk?.values?.categoryServiceId ?? "";

        setType("dist")
        let url = config.url.local_URL + "showDistWise?districtId=" + distId + "&deptId=" + deptId +
            "&fromDate=" + dofFromDate + "&toDate=" + dofToDate + "&advcteName=" + advcteName +
            "&petitionerName=" + petitionerName + "&serviceType1=" + categoryServiceId + "&caseTypeId=" + caseTypeId;
        CommonAxiosGet(url).then((res) => {
            if (res.data?.scode === '01') {
                setDISTWISEACKSList(res?.data?.DISTWISEACKS);
                setL1Dist(true);
                setL1(false);
                setL2(false);
                setL1user(false);
            } else {
                setDISTWISEACKSList([]);
                setL1Dist(true);
                setL1(false);
                setL2(false);
                setL1user(false);
            }
        }).catch((error) => {
            console.error("Error fetching setCasesList names:", error);
        });
    }

    //*************level 1 user *********
    const [showL1user, setL1user] = useState(false);

    function UserWiseCases() {
        const deptId = formIk?.values?.deptId ?? "";
        const distId = formIk?.values?.distId ?? "";
        const caseTypeId = formIk?.values?.caseTypeId ?? "";
        const advcteName = formIk?.values?.advcteName ?? "";
        const dofFromDate = formIk?.values?.dofFromDate ?? "";
        const dofToDate = formIk?.values?.dofToDate ?? "";
        const petitionerName = formIk?.values?.petitionerName ?? "";
        const categoryServiceId = formIk?.values?.categoryServiceId ?? "";
        setType("user");
        let url = config.url.local_URL + "showUserWise?districtId=" + distId + "&deptId=" + deptId +
            "&fromDate=" + dofFromDate + "&toDate=" + dofToDate + "&advcteName=" + advcteName +
            "&petitionerName=" + petitionerName + "&serviceType1=" + categoryServiceId + "&caseTypeId=" + caseTypeId;
        CommonAxiosGet(url).then((res) => {
            if (res.data?.scode === '01') {
                setUserWiseList(res?.data?.USERWISEACKS);
                setL1user(true);
                setL1Dist(false);
                setL1(false);
                setL2(false);
            } else {
                setUserWiseList([]);
                setL1user(true);
                setL1Dist(false);
                setL1(false);
                setL2(false);
            }
        }).catch((error) => {
            console.error("Error fetching setCasesList names:", error);
        });
    }

    //*************level 2 *************
    const [showL2, setL2] = useState(false);
    function showCaseWiseAcksAbstractList(deptIds, districtIds, inserted_by) {
        const deptId = deptIds !== undefined && deptIds !== null && deptIds !== ""
            ? deptIds
            : (formIk?.values?.deptId ?? "");

        const distId = districtIds !== undefined && districtIds !== null && districtIds !== ""
            ? districtIds
            : (formIk?.values?.distId ?? "");

        const caseTypeId = formIk?.values?.caseTypeId ?? "";
        const advcteName = formIk?.values?.advcteName ?? "";
        const dofFromDate = formIk?.values?.dofFromDate ?? "";
        const dofToDate = formIk?.values?.dofToDate ?? "";
        const petitionerName = formIk?.values?.petitionerName ?? "";
        const categoryServiceId = formIk?.values?.categoryServiceId ?? "";


        let url = config.url.local_URL + "showCaseWiseAcksAbstract?districtId=" + distId + "&deptId=" + deptId +
            "&fromDate=" + dofFromDate + "&toDate=" + dofToDate + "&advcteName=" + advcteName +
            "&petitionerName=" + petitionerName + "&serviceType1=" + categoryServiceId + "&caseTypeId=" + caseTypeId + "&inserted_by=" + inserted_by;
        CommonAxiosGet(url).then((res) => {
            if (res.data?.scode === '01') {
                setCasesList(res?.data?.CASEWISEACKS);
                setL2(true);
                setL1(false);
                setL1Dist(false);
                setL1user(false);
            } else {
                setCasesList([]);
                setL2(true);
                setL1(false);
                setL1Dist(false);
                setL1user(false);
            }
        }).catch((error) => {
            console.error("Error fetching setCasesList names:", error);
        });
    }


    const GetCaseTypesList = () => {
        let url = config.url.local_URL + "getCaseTypesList";
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



    const GetCategoryServiceList = () => {
        let url = config.url.COMMONSERVICE_URL + "getCategoryServiceList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setCategoryServiceList(res.data);
            } else {
                setCategoryServiceList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getCategoryServiceList names:", error);
        });
    };

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


    const columnsList = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,

        },
        {
            Header: 'Ack No.',
            accessor: "ack_no",
            Cell: ({ value, row }) => (
                <button
                    onClick={() => handleAckPopup(value)}
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
        { Header: 'Departments/Respondents', accessor: "depart_descs", },
        { Header: 'Case Type', accessor: "case_full_name", },
        { Header: 'Main Case No.', accessor: "maincaseno" },
        { Header: 'Advocate CC No.', accessor: "advocateccno" },
        { Header: 'Advocate Name', accessor: "advocatename" },
        { Header: 'Petitioner', accessor: "petitioner_name" },
        { Header: 'Mode Of Filing', accessor: "mode_filing" },

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

    ];

    const columns = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Primary Respondent / Department', accessor: "dept_code",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", textDecoration: "underline", color: "blue", textAlign: "left", }}
                    onClick={() => {
                        showCaseWiseAcksAbstractList(row.original.dept_code, "", "");
                    }}
                >
                    {row.original.dept_code}-{row.original.description}
                </div>
            ),
        },
        {
            Header: 'New Cases Registered', accessor: "acks",
            Footer: 'acks'

        },

    ];

    const columnsDist = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'District', accessor: "district_name",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", textDecoration: "underline", color: "blue", textAlign: "left", }}
                    onClick={() => {

                        showCaseWiseAcksAbstractList("", row.original.distid, "");
                    }}
                >
                    {row.original.district_name}
                </div>
            ),


        },
        {
            Header: 'New Cases Registered', accessor: "acks",
            Footer: 'acks'

        },
    ];


    const columnsUser = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'User', accessor: "inserted_by",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", textDecoration: "underline", color: "blue", textAlign: "left", }}
                    onClick={() => {
                        showCaseWiseAcksAbstractList("", "", row.original.inserted_by);
                    }}
                >
                    {row.original.inserted_by}
                </div>
            ),
        },
        {
            Header: 'New Cases Registered', accessor: "acks",
            Footer: 'acks'

        },
    ];



    return (
        <>
            <CommonFormHeader heading={"New Cases Abstract Report"} />
            <bst.Container className="outer-page-content-container">
                <bst.Row className="pt-2 pt-2 ">
                    <FormikProvider value={formIk}>
                        <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                            <div className="border px-13 pb-13 mb-4 pt-1">
                                <bst.Row className="px-4 pt-4">

                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
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

                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0"> District <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="distId" >
                                            <option value="ALL">--ALL--</option>
                                            {showDistNames != undefined && showDistNames?.map((data, indexDept) => {
                                                return (<React.Fragment key={indexDept}>
                                                    <option key={indexDept} value={data.value}>
                                                        {data.label}
                                                    </option>
                                                </React.Fragment>);
                                            })}

                                        </Field>
                                        <ErrorMessage name="distId" component="div" className="text-danger" ></ErrorMessage>
                                    </bst.Col>

                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0"> Case Type <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="caseTypeId"
                                        >
                                            <option value="ALL">--ALL--</option>

                                            {caseTypesList != undefined && caseTypesList?.map((data, indexDept) => {
                                                return (<React.Fragment key={indexDept}>
                                                    <option key={indexDept} value={data.value}>
                                                        {data.label}
                                                    </option>
                                                </React.Fragment>);
                                            })}
                                        </Field>
                                        <ErrorMessage name="caseTypeId" component="div" className="text-error" />
                                    </bst.Col>
                                </bst.Row>
                                <bst.Row className="px-4 pt-4">
                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0">Advocate Name<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="text" className="form-control me-1 mt-0" name="advcteName" />
                                        <ErrorMessage name="advcteName" component="div" className="text-error" />
                                    </bst.Col>

                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0"> From Date<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="date" name="dofFromDate" className="form-control" />
                                        <ErrorMessage name="dofFromDate" component="div" className="text-error" />
                                    </bst.Col>

                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0"> To Date<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="date" name="dofToDate" className="form-control" />
                                        <ErrorMessage name="dofToDate" component="div" className="text-error" />
                                    </bst.Col>
                                </bst.Row>
                                <bst.Row className="px-4 pt-4">
                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0">Petitioner Name<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="text" className="form-control me-1 mt-0" name="petitionerName" />
                                        <ErrorMessage name="petitionerName" component="div" className="text-error" />

                                    </bst.Col>

                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0">Service Category <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="categoryServiceId"
                                        >
                                            <option value="ALL">--ALL--</option>
                                            {categoryServiceList != undefined && categoryServiceList?.map((data, indexDept) => {
                                                return (<React.Fragment key={indexDept}>
                                                    <option key={indexDept} value={data.value}>
                                                        {data.label}
                                                    </option>
                                                </React.Fragment>);
                                            })}

                                        </Field>
                                        <ErrorMessage name="categoryServiceId" component="div" className="text-error" />
                                    </bst.Col>
                                </bst.Row>
                                <bst.Row className="pt-2 mt-2" style={{ marginLeft: "20px", marginBottom: "2%" }}>
                                    <div className="d-flex flex-wrap" style={{ gap: "25px" }}>
                                        <button type="submit" className='btn btn-success mt-4'>
                                            Submit
                                        </button>

                                        <button type="button" className='btn btn-success mt-4' onClick={GetNewAbstractReportList}>
                                            Show Department Wise
                                        </button>

                                        <button type="button" className='btn btn-success mt-4' onClick={DistrictWiseCases}>
                                            Show District Wise
                                        </button>

                                        <button type="button" className='btn btn-success mt-4' onClick={UserWiseCases}>
                                            Show User Wise
                                        </button>
                                    </div>
                                </bst.Row>

                            </div>
                        </Form>
                    </FormikProvider>
                    {showL1Dist && <>
                        {DISTWISEACKSList?.length > 0 ? (
                            <CommonReactTable data={DISTWISEACKSList} columns={columnsDist} showFooter={"true"}
                                filename="Dist Abstract REPORT" headerName="Sect. Dept. Wise High Court Cases Abstract Report" />
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>}

                    {showL1 && <>
                        {DEPTWISEACKSList?.length > 0 ? (
                            <CommonReactTable data={DEPTWISEACKSList} columns={columns} showFooter={"true"}
                                filename="Deptwise Abstract Report" />
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>}

                    {showL1user && <>
                        {UserWiseList?.length > 0 ? (
                            <CommonReactTable data={UserWiseList} columns={columnsUser} showFooter={"true"}
                                filename="User Wise Abstract Report" />
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>}

                    {showL2 && <>
                        {casesList?.length > 0 ? (<>
                            <bst.Row>
                                <bst.Col xs={12} sm={12} md={12} lg={11} xl={11} xxl={11}></bst.Col>
                                <bst.Col xs={12} sm={12} md={12} lg={1} xl={1} xxl={1} className="px-5 py-1">
                                    <button type="button" className="btn btn-sm btn-secondary"
                                        onClick={() => {
                                            if (showType === "dist") {
                                                setL2(false);
                                                setL1Dist(true);

                                            } else if (showType === "user") {
                                                setL2(false);
                                                setL1user(true);
                                            } else {
                                                setL2(false);
                                                setL1(true);
                                            }

                                        }
                                        }>Back</button>
                                </bst.Col>
                            </bst.Row>
                            <CommonReactTable data={casesList} columns={columnsList} showFooter={"true"}
                                filename="New Cases ABSTRACT REPORT" />
                        </>) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>}

                </bst.Row>
            </bst.Container >

            <AckDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={ackno} viewdata={PopupData} />
        </>
    )
}
