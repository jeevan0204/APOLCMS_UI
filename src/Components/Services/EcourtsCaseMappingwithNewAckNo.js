import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import * as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet, CommonAxiosGetPost } from '../../CommonUtils/CommonAxios';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';
import { failureAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';
import AckDetailsPopup from '../Popups/AckDetailsPopup';

function EcourtsCaseMappingwithNewAckNo() {
    const [caseTypesList, setCaseTypesList] = useState([]);
    const [showDeptNames, setShowDeptNames] = useState([]);
    const [showDistNames, setShowDistNames] = useState([]);
    const [categoryServiceList, setCategoryServiceList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);

    const [casesList, setCasesList] = useState([]);

    const [caseTypeShrtList, setCaseTypeShrtList] = useState([]);
    const [regYearList, setRegYearList] = useState([]);
    const [MainCaseNolist, setMainCaseNolist] = useState([]);
    const [CiNumber, setCiNumber] = useState({});

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);

    function regularPopStatus() { setregularPopupFlag(false); }

    const [ackno, setAckno] = useState([]);

    const [popupType, setPopupType] = useState("");

    function regularPopStatus() { setregularPopupFlag(false); }
    const hasFetchedData = useRef(false)

    useEffect(() => {
        if (!hasFetchedData.current) {

            GetCaseTypeShrtList();
            hasFetchedData.current = true
        }
    }, []);

    const formIk = useFormik({
        initialValues: {
            caseTypeId: "",
            deptId: "",
            districtId: "",
            dofFromDate: "",
            dofToDate: "",
            advocateName: "",
            categoryServiceId: ""
        },
        enableReinitialize: true,

        onSubmit: (values) => {
            console.log("-----" + values.caseTypeId)
            const url = config.url.local_URL + "EcourtsCaseMappingWithNewAckNo?caseTypeId=" + values.caseTypeId +
                "&deptId=" + values.deptId + "&districtId=" + values.districtId +
                "&dofFromDate=" + values.dofFromDate + "&dofToDate=" + values.dofToDate + "&advocateName=" + values.advocateName + "&categoryServiceId=" + values.categoryServiceId;

            GetCaseDetails(url);
        }

    })

    function GetCaseDetails(url) {
        CommonAxiosGet(url).then((res) => {
            if (res.data.scode === '01') {
                setCasesList(res.data.CASEWISEACKS);


            } else {
                setCasesList([]);
                seterrmsg(true);
            }
        }).catch((error) => {
            console.error("Error fetching getcases list names:", error);
        });
    }


    const formIkNew = useFormik({
        initialValues: {
            caseType1: "",
            regYear1: "",
            mainCaseNo: "",

        },
    })


    const GetCaseTypeShrtList = () => {
        let url = config.url.COMMONSERVICE_URL + "getCaseTypesListShrt";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setCaseTypeShrtList(res.data);

            } else {
                setCaseTypeShrtList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getCaseTypesListShrt names:", error);
        });
    };

    function GetRegYearList(caseType, ackNo) {
        let url = config.url.local_URL + "YearByCaseTypeYear?caseType=" + caseType;
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                let options = res.data.data.map((item, i) => {
                    return (
                        <option key={i} value={item.value}>
                            {item.label}
                        </option>
                    );
                });
                setRegYearList((prevState) => ({
                    ...prevState,
                    [ackNo]: options,
                }));

            } else {
                setRegYearList((prevState) => ({
                    ...prevState,
                    [ackNo]: [],
                }));
            }
        }).catch((error) => {
            console.error("Error fetching getYearsList names:", error);
        });
    };

    function GetMainCaseNolist(type, year, ackNo) {
        let url = config.url.local_URL + "NumberbyCaseType?caseType=" + type + "&regYear=" + year;
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                let options = res.data.data.map((item, i) => {
                    return (
                        <option key={i} value={item.value}>
                            {item.label}
                        </option>
                    );
                });
                setMainCaseNolist((prevState) => ({
                    ...prevState,
                    [ackNo]: options,
                }));

            } else {

                setMainCaseNolist((prevState) => ({
                    ...prevState,
                    [ackNo]: [],
                }));
            }
        }).catch((error) => {
            console.error("Error fetching maincaseno list:", error);
        });
    };



    useEffect(() => {

        GetCaseTypesList();
        GetDepartmentNames();
        GetDistrictNames();
        GetCategoryServiceList();
        GetMappingCasesList();

    }, []);

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

    function GetMappingCasesList() {
        //let url = config.url.local_URL + "EcourtsCaseMappingWithNewAckNo";
        const url = config.url.local_URL + "EcourtsCaseMappingWithNewAckNo?" +
            "caseTypeId=&deptId=&districtId=&dofFromDate=&dofToDate=&advocateName=&categoryServiceId=";

        CommonAxiosGet(url).then((res) => {
            if (res.data.scode === '01') {
                setCasesList(res.data.CASEWISEACKS);

            } else {
                setCasesList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getCategoryServiceList names:", error);
        });
    }


    function getCinNumber(casetype, year, maincase, ackNo) {
        let url = config.url.local_URL +
            "EcourtsCaseMappingWithNewAckNos?" +
            "case_type=" + casetype +
            "&case_year=" + year +
            "&case_number=" + maincase;
        CommonAxiosGet(url).then((res) => {
            if (res.data.scode === '01') {
                console.log("cino----", res.data.CASEWISECINOS[0].cino)
                setCiNumber(prev => ({
                    ...prev,
                    [ackNo]: res.data.CASEWISECINOS[0].cino // or whatever field you want to display
                }));
            } else {
                setCiNumber(prev => ({
                    ...prev,
                    [ackNo]: ""
                }));
            }
        }).catch((error) => {
            console.error("Error fetching getCategoryServiceList names:", error);
        });
    }


    const handleCinoClick = (cino) => {
        // alert("cino----" + cino)

        let url = config.url.local_URL + "AssignedCasesToSections?cino=" + cino + "&fileCino=&SHOWPOPUP=SHOWPOPUP";
        // console.log("url-----", url);
        CommonAxiosGet(url).then((res) => {
            if (res.data !== undefined) {
                alert("test")
                setcino(cino);
                setModelPopup(true);
                setPopupData(res.data);
                setPopupType("legacy");

            } else {
                setPopupData([]);
            }
        }).catch((error) => {
            console.error("Error fetching popup:", error);
        });
    };

    const handleAckPopup = (ackNo) => {

        let url = config.url.local_URL + "AckNoPopupView?SHOWPOPUP=SHOWPOPUP&cino=" + ackNo;

        console.log("url-----", url);
        CommonAxiosGet(url).then((res) => {
            if (res.data !== undefined) {
                alert("test-----new popup" + res?.data?.USERSLIST[0]?.ack_no)
                setAckno(res?.data?.USERSLIST[0]?.ack_no);
                setModelPopup(true);
                setPopupData(res.data);
                setPopupType("new");

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
            Cell: ({ row }) => {
                const ackNo = row.original.ack_no;
                const hcAckNo = row.original.hc_ack_no;

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                        <button
                            style={{
                                backgroundColor: '#74b9db',
                                color: '#000',
                                padding: '6px 12px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleAckPopup(ackNo)}
                        >
                            {ackNo}
                        </button>
                        <span style={{ color: '#00008B', fontWeight: 'bold', marginTop: '4px' }}>
                            {hcAckNo}
                        </span>
                    </div>
                );
            }
        }
        ,

        { Header: 'Date', accessor: "generated_date", },
        {
            Header: 'Download / Print', accessor: "",
            Cell: ({ row }) => {
                const data = row.original;
                console.log("Data:", data.ack_file_path);

                return (
                    <div>
                        {/* scanned document */}
                        {/* {
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
                        } */}

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
            Header: 'Legacy/Main Case No(CaseType/CaseYear/CaseNumber)',
            accessor: "",
            Cell: ({ row }) => {
                const ackNo = row.original.ack_no;

                return (
                    <FormikProvider value={formIkNew}>
                        <Form onChange={formIkNew.handleChange} onSubmit={formIkNew.handleSubmit} >
                            <bst.Row xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <Field as="select" className='form-control' name={`caseType1_${ackNo}`}
                                        onChange={(e) => {
                                            GetRegYearList(e.target.value, ackNo);
                                        }}>
                                        <option value="">--Select--</option>

                                        {caseTypeShrtList != undefined && caseTypeShrtList?.map((data, indexDept) => {
                                            return (<React.Fragment key={indexDept}>
                                                <option key={indexDept} value={data.value}>
                                                    {data.label}
                                                </option>
                                            </React.Fragment>);
                                        })}

                                    </Field>
                                    <ErrorMessage name={`caseType1_${ackNo}`} component="div" className="text-error" />
                                </bst.Col>
                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>

                                    <Field as="select" className='form-control' name={`regYear1_${ackNo}`}
                                        onChange={(e) => {
                                            const type = formIkNew?.values?.[`caseType1_${ackNo}`];
                                            GetMainCaseNolist(type, e.target.value, ackNo);
                                        }}>
                                        <option value="">--Select--</option>
                                        {regYearList[ackNo]}

                                    </Field>
                                    <ErrorMessage name={`regYear1_${ackNo}`} component="div" className="text-error" />
                                </bst.Col>
                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>

                                    <Field as="select" className='form-control' name={`mainCaseNo_${ackNo}`}
                                        onChange={(e) => {
                                            const casetype = formIkNew?.values?.[`caseType1_${ackNo}`];
                                            const year = formIkNew?.values?.[`regYear1_${ackNo}`];

                                            getCinNumber(casetype, year, e.target.value, ackNo);
                                        }}
                                    >
                                        <option value="">--Select--</option>
                                        {MainCaseNolist[ackNo]}

                                    </Field>

                                    <ErrorMessage name={`mainCaseNo_${ackNo}`} component="div" className="text-error" />
                                </bst.Col>
                            </bst.Row>
                        </Form>
                    </FormikProvider>
                )
            }
        },

        {
            Header: 'View Case Details',
            accessor: "",
            Cell: ({ row }) => {
                const ackNo = row.original.ack_no;
                const CiNo = CiNumber[ackNo];

                return (
                    <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleCinoClick(CiNo)}
                        disabled={!CiNo}
                    >
                        {CiNo || "View Case Details"}
                    </button>
                );
            }
        }
        ,

        {
            Header: 'Action',
            accessor: "",
            Cell: ({ row }) => {
                const ackNo = row.original.ack_no;
                const caseType = formIkNew?.values?.[`caseType1_${ackNo}`] || "";
                const regYear = formIkNew?.values?.[`regYear1_${ackNo}`] || "";
                const mainCaseNo = formIkNew?.values?.[`mainCaseNo_${ackNo}`] || "";

                return (
                    <div style={{ textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary btn-sm mt-2"
                            onClick={() => MappingLegacyNew(ackNo, caseType, regYear, mainCaseNo)}
                        >
                            Link
                        </button>
                    </div>
                );

            }
        }

    ];

    function MappingLegacyNew(ackNo, casetype, year, maincase) {


        if (!casetype || !year || !maincase) {
            alert("Please fill all fields before submitting.");
            return;
        }

        let url = config.url.local_URL + "submitDetailsForNewAckNo?caseType1=" + casetype + "&regYear1=" + year + "&mainCaseNo=" + maincase + "&ackNo=" + ackNo;
        CommonAxiosGet(url).then((res) => {

            if (res.data.scode === '01') {
                successAlert2(res?.data?.CASEWISEACKS);

            } else {
                failureAlert(res?.data?.CASEWISEACKS);
            }
        }).catch((error) => {
            console.error("Error fetching getCategoryServiceList names:", error);
        });
    }





    return (
        <>
            <CommonFormHeader heading={"Linking of Legacy & New Cases"} />

            <bst.Row className="pt-2 pt-2 " style={{ marginLeft: "50px" }}>
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
                                    <label className="mb-0"> From Date<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="date" name="dofFromDate" className="form-control" />
                                    <ErrorMessage name="dofFromDate" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0"> To Date<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="date" name="dofToDate" className="form-control" />
                                    <ErrorMessage name="dofToDate" component="div" className="text-error" />
                                </bst.Col>
                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0">Advocate Name<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="advocateName" />
                                    <ErrorMessage name="advocateName" component="div" className="text-error" />

                                </bst.Col>
                            </bst.Row>
                            <bst.Row className="px-4 pt-4">


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
            </bst.Row>

            <bst.Row className="pt-2 pt-2" style={{ marginLeft: "50px" }}>
                {
                    casesList?.length > 0 ? (
                        <div style={{ width: "98%", marginTop: "5%" }}>
                            <CommonReactTable data={casesList} columns={columns} showFooter={"false"}
                                filename="Cases List" heading="case details" />
                        </div>
                    ) : (errmsg && (<center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))

                }
            </bst.Row>


            {popupType === "legacy" && showModelPopup && (
                <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                    category={cino} viewdata={PopupData} />
            )}

            {popupType === "new" && showModelPopup && (
                <AckDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                    category={ackno} viewdata={PopupData} />
            )}
        </>
    )
}

export default EcourtsCaseMappingwithNewAckNo