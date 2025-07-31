import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';
import AckDetailsPopup from '../Popups/AckDetailsPopup';

function EcourtsLeacyCaseMappedWithNewAckNoReport() {
    const [caseTypesList, setCaseTypesList] = useState([]);
    const [showDeptNames, setShowDeptNames] = useState([]);
    const [showDistNames, setShowDistNames] = useState([]);
    const [categoryServiceList, setCategoryServiceList] = useState([]);
    const [errmsg, seterrmsg] = useState();

    const [DistrictWiseReport, setDistrictWiseReport] = useState([]);
    const [DeptWiseReport, setDeptWiseReport] = useState([]);
    const [DistinctDeptWiseReport, setDistinctDeptWiseReport] = useState();
    const [UserWiseReport, setUserWiseReport] = useState([]);
    const [casesList, setCasesList] = useState([]);

    const [showModelPopup, setModelPopup] = useState(false);
    const [showModelPopupNew, setModelPopupNew] = useState(false);

    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }

    const [showUser, setshowUser] = useState([]);
    const [showDrillCount, setDrillCount] = useState();
    const [reportType, setReportType] = useState();

    console.log("showDrillCount", showDrillCount, errmsg, DistinctDeptWiseReport)
    const [ackno, setAckno] = useState([]);

    const formIk = useFormik({
        initialValues: {
            deptId: "",
            districtId: "",
            caseTypeId: "",
            advcteName: "",
            fromDate: "",
            toDate: "",
            petitionerName: "",
            serviceType1: ""
        },
        enableReinitialize: true,

        onSubmit: (values) => {
            GetCasesList("", "");
        }

    })

    function isBackFunction() {
        setDrillCount(showDrillCount - 1)
    }


    useEffect(() => {
        GetCaseTypesList();
        GetDepartmentNames();
        GetDistrictNames();
        GetCategoryServiceList();
        GetMappedReportList();

    }, []);

    function GetMappedReportList() {

        const deptId = formIk?.values?.deptId;
        const distId = formIk?.values?.districtId;
        const caseTypeId = formIk?.values?.caseTypeId;
        const advcteName = formIk?.values?.advcteName;
        const fromDate = formIk?.values?.fromDate;
        const toDate = formIk?.values?.toDate;
        const petitionerName = formIk?.values?.petitionerName;
        const serviceType1 = formIk?.values?.serviceType1;

        let url = config.url.local_URL + "DeptWiseMAPslno?districtId=" + distId + "&deptId=" + deptId +
            "&fromDate=" + fromDate + "&toDate=" + toDate + "&advcteName=" + advcteName +
            "&petitionerName=" + petitionerName + "&serviceType1=" + serviceType1 + "&caseTypeId=" + caseTypeId;

        CommonAxiosGet(url).then((res) => {
            if (res.data.status === true) {
                setDrillCount(0);
                setReportType("distinct");
                alert(showDrillCount + "-----")
                setDistinctDeptWiseReport(res.data.DEPTWISEACKSslno);
                setshowUser(res.data.SHOWUSERWISE);
            } else {
                setDistinctDeptWiseReport([]);
            }
        }).catch((error) => {
            console.error("Error fetching Mapped Cases Report:", error);
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
        let url = config.url.COMMONSERVICE_URL + "getServiceTypesList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setCategoryServiceList(res.data);

            } else {
                setCategoryServiceList([]);
            }
        }).catch((error) => {
            console.error("Error fetching servicetype names:", error);
        });
    };

    function DeptWiseReportList() {
        const deptId = formIk?.values?.deptId;
        const distId = formIk?.values?.districtId;
        const caseTypeId = formIk?.values?.caseTypeId;
        const advcteName = formIk?.values?.advcteName;
        const fromDate = formIk?.values?.fromDate;
        const toDate = formIk?.values?.toDate;
        const petitionerName = formIk?.values?.petitionerName;
        const serviceType1 = formIk?.values?.serviceType1;

        setReportType("dept");

        let url = config.url.local_URL + "DeptWiseMAP?districtId=" + distId + "&deptId=" + deptId +
            "&fromDate=" + fromDate + "&toDate=" + toDate + "&advcteName=" + advcteName +
            "&petitionerName=" + petitionerName + "&serviceType1=" + serviceType1 + "&caseTypeId=" + caseTypeId;
        CommonAxiosGet(url).then((res) => {
            if (res.data.status === true) {
                setDeptWiseReport(res.data.data);

            } else {
                setDeptWiseReport([]);
            }
        }).catch((error) => {
            console.error("Error fetching Dept Wise Report names:", error);
        });
    }

    function DistrictWiseReportList() {
        const deptId = formIk?.values?.deptId;
        const distId = formIk?.values?.districtId;
        const caseTypeId = formIk?.values?.caseTypeId;
        const advcteName = formIk?.values?.advcteName;
        const fromDate = formIk?.values?.fromDate;
        const toDate = formIk?.values?.toDate;
        const petitionerName = formIk?.values?.petitionerName;
        const serviceType1 = formIk?.values?.serviceType1;
        setReportType("dist");


        let url = config.url.local_URL + "DistWiseMAP?districtId=" + distId + "&deptId=" + deptId +
            "&fromDate=" + fromDate + "&toDate=" + toDate + "&advcteName=" + advcteName +
            "&petitionerName=" + petitionerName + "&serviceType1=" + serviceType1 + "&caseTypeId=" + caseTypeId;
        CommonAxiosGet(url).then((res) => {
            if (res.data.status === true) {
                setDistrictWiseReport(res.data.DISTWISEACKS);

            } else {
                setDistrictWiseReport([]);
            }
        }).catch((error) => {
            console.error("Error fetching Dist Wise Report names:", error);
        });
    }

    function UserWiseReportList() {
        const deptId = formIk?.values?.deptId;
        const distId = formIk?.values?.districtId;
        const caseTypeId = formIk?.values?.caseTypeId;
        const advcteName = formIk?.values?.advcteName;
        const fromDate = formIk?.values?.fromDate;
        const toDate = formIk?.values?.toDate;
        const petitionerName = formIk?.values?.petitionerName;
        const serviceType1 = formIk?.values?.serviceType1;

        setReportType("user");

        let url = config.url.local_URL + "UserWiseMAP?districtId=" + distId + "&deptId=" + deptId +
            "&fromDate=" + fromDate + "&toDate=" + toDate + "&advcteName=" + advcteName +
            "&petitionerName=" + petitionerName + "&serviceType1=" + serviceType1 + "&caseTypeId=" + caseTypeId;

        CommonAxiosGet(url).then((res) => {
            if (res.data.status === true) {
                setUserWiseReport(res.data.USERWISEACKS);

            } else {
                setUserWiseReport([]);
            }
        }).catch((error) => {
            console.error("Error fetching Dist Wise Report names:", error);
        });
    }

    function GetCasesList(deptIds, districtIds) {
        const deptId = deptIds !== undefined && deptIds !== null && deptIds !== ""
            ? deptIds
            : (formIk?.values?.deptId ?? "");

        const distId = districtIds !== undefined && districtIds !== null && districtIds !== ""
            ? districtIds
            : (formIk?.values?.distId ?? "");

        const caseTypeId = formIk?.values?.caseTypeId ?? "";
        const advcteName = formIk?.values?.advcteName ?? "";
        const dofFromDate = formIk?.values?.fromDate ?? "";
        const dofToDate = formIk?.values?.toDate ?? "";
        const petitionerName = formIk?.values?.petitionerName ?? "";
        const serviceType1 = formIk?.values?.serviceType1 ?? "";
        setReportType("caseslist");

        let url = config.url.local_URL + "CaseWiseAcksAbstractMAPslno?districtId=" + distId + "&deptId=" + deptId +
            "&fromDate=" + dofFromDate + "&toDate=" + dofToDate + "&advcteName=" + advcteName +
            "&petitionerName=" + petitionerName + "&serviceType1=" + serviceType1 + "&caseTypeId=" + caseTypeId;
        CommonAxiosGet(url).then((res) => {
            setDrillCount(1);
            if (res.data?.scode === '01') {
                setCasesList(res?.data?.CASEWISEACKS);

            } else {
                setCasesList([]);
            }
        }).catch((error) => {
            console.error("Error fetching setCasesList names:", error);
        });
    }


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

    const handleAckPopup = (ackNo) => {
        let url = config.url.local_URL + "AckNoPopupView?SHOWPOPUP=SHOWPOPUP&cino=" + ackNo;
        CommonAxiosGet(url).then((res) => {
            if (res.data !== undefined) {
                setAckno(res?.data?.USERSLIST[0]?.ack_no);
                setModelPopupNew(true);
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
            Header: 'Primary Respondent / Department', accessor: "dept_code",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", textDecoration: "underline", color: "blue", textAlign: "left", }}
                    onClick={() => {
                        GetCasesList(row.original.dept_code, "");
                    }}
                >
                    {row.original.dept_code}-{row.original.description}
                </div>
            ),

        },
        {
            Header: 'Mapped Cases', accessor: "acks",
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
            Header: 'District', accessor: "distid",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", textDecoration: "underline", color: "blue", textAlign: "left", }}
                    onClick={() => {
                        GetCasesList("", row.original.distid);
                    }}
                >
                    {row.original.district_name}
                </div>
            ),

        },
        {
            Header: 'Mapped Cases', accessor: "acks",
            Footer: 'acks'

        },
    ];

    const columnsList = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,

        },
        {
            Header: 'CINo',
            accessor: "cino",
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
            Header: 'Ack No./HC Ack No',
            accessor: "ack_no_list",
            Cell: ({ value }) => {
                if (!value) return null;

                return (
                    <>
                        {value.split(';').map((splt, index) => (
                            <React.Fragment key={index}>
                                <a
                                    href="#"
                                    style={{ color: '#00008B', fontWeight: 'bold' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAckPopup(splt);
                                    }}
                                >
                                    {splt}
                                </a>
                                {index !== value.split(';').length - 1 && '; '}
                            </React.Fragment>
                        ))}
                    </>
                );
            }
        }
        ,
        { Header: 'Main Case No.', accessor: "maincaseno" },

    ];

    const columnsUser = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,

        },
        {
            Header: "User", accessor: "inserted_by",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", textDecoration: "underline", color: "blue", textAlign: "left", }}
                    onClick={() => {
                        showUserWise(row.original.inserted_by);
                    }}
                >
                    {row.original.inserted_by}
                </div>
            ),
        },
        {
            Header: "Mapped Cases", accessor: "acks",
        }
    ];

    function showUserWise() {
        const deptId = formIk?.values?.deptId;
        const distId = formIk?.values?.districtId;
        const caseTypeId = formIk?.values?.caseTypeId;
        const advcteName = formIk?.values?.advcteName;
        const fromDate = formIk?.values?.fromDate;
        const toDate = formIk?.values?.toDate;
        const petitionerName = formIk?.values?.petitionerName;
        const serviceType1 = formIk?.values?.serviceType1;
        setReportType("userwise");


        let url = config.url.local_URL + "ShowCaseWiseAcksAbstractMAP?districtId=" + distId + "&deptId=" + deptId +
            "&fromDate=" + fromDate + "&toDate=" + toDate + "&advcteName=" + advcteName +
            "&petitionerName=" + petitionerName + "&serviceType1=" + serviceType1 + "&caseTypeId=" + caseTypeId;
        CommonAxiosGet(url).then((res) => {
            if (res.data.status === true) {
                setUserWiseReport(res.data.CASEWISEACKS);
            } else {
                setUserWiseReport([]);
            }
        }).catch((error) => {
            console.error("Error fetching Dist Wise Report names:", error);
        });
    }


    return (
        <>
            <CommonFormHeader heading={"Report-Mapping of Legacy Cases & New Cases"} />
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
                                        <ErrorMessage name="districtId" component="div" className="text-danger" ></ErrorMessage>
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
                                        <Field as="select" className='form-control' name="serviceType1"
                                        >
                                            <option value="ALL">--ALL--</option>
                                            <option value="NON-SERVICES">NON-SERVICES</option>
                                            {categoryServiceList != undefined && categoryServiceList?.map((data, indexDept) => {
                                                return (<React.Fragment key={indexDept}>
                                                    <option key={indexDept} value={data.value}>
                                                        {data.label}
                                                    </option>
                                                </React.Fragment>);
                                            })}

                                        </Field>
                                        <ErrorMessage name="serviceType1" component="div" className="text-error" />
                                    </bst.Col>
                                </bst.Row>
                                <bst.Row className="pt-2 mt-2" style={{ marginLeft: "20px", marginBottom: "2%" }}>
                                    <div className="d-flex flex-wrap" style={{ gap: "25px" }}>
                                        <button type="submit" className='btn btn-success mt-4'>
                                            Submit
                                        </button>

                                        <button type="button" className='btn btn-success mt-4' onClick={GetMappedReportList}>
                                            Show Department Wise(Distinct)
                                        </button>

                                        <button type="button" className='btn btn-success mt-4' onClick={DeptWiseReportList}>
                                            Show Department Wise
                                        </button>

                                        <button type="button" className='btn btn-success mt-4' onClick={DistrictWiseReportList}>
                                            Show District Wise
                                        </button>
                                        {showUser && <>
                                            <button type="button" className='btn btn-success mt-4' onClick={UserWiseReportList}>
                                                Show User Wise
                                            </button>
                                        </>}
                                    </div>
                                </bst.Row>

                            </div>
                        </Form>
                    </FormikProvider>

                    {DistrictWiseReport?.length > 0 ? (
                        <CommonReactTable data={DistrictWiseReport} columns={columnsDist} showFooter={"true"}
                            filename="Dist Wise Ecourts Legacy New Mapping REPORT" />
                    ) : (reportType === "dist" && errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}

                    {showDrillCount === 0 && (<>
                        {DistinctDeptWiseReport !== "" ? (
                            <CommonReactTable data={DistinctDeptWiseReport} columns={columns} showFooter={"true"}
                                filename="Ecourts Legacy New Mapping Report" />
                        ) : (reportType === "distinct" && errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}

                    {DeptWiseReport?.length > 0 ? (

                        <CommonReactTable data={DeptWiseReport} columns={columns} showFooter={"true"}
                            filename="Ecourts Legacy New Mapping Report" />
                    ) : (reportType === "dept" && errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}

                    {reportType === "user" && UserWiseReport?.length > 0 ? (
                        <CommonReactTable data={UserWiseReport} columns={columnsUser} showFooter={"true"}
                            filename="Ecourts Legacy New Mapping Report" />
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}

                    {showDrillCount === 1 && (<>
                        {casesList?.length > 0 ? (
                            <CommonReactTable data={casesList} columns={columnsList} showFooter={"true"}
                                filename="Mapped Cases List REPORT" isBack={true}
                                isBackFunction={isBackFunction} />
                        ) : (reportType === "caseslist" && errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}

                </bst.Row>
            </bst.Container>

            <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={cino} viewdata={PopupData} />

            <AckDetailsPopup popupflagvalue={showModelPopupNew} setPopupflagvalue={setModelPopupNew} regularpopup={regularPopStatus}
                category={ackno} viewdata={PopupData} />
        </>
    )
}

export default EcourtsLeacyCaseMappedWithNewAckNoReport