import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet, CommonAxiosGetPost } from '../../CommonUtils/CommonAxios';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function HCOrdersIssuedReport() {

    const [caseTypesList, setCaseTypesList] = useState([]);
    const [showDeptNames, setShowDeptNames] = useState([]);
    const [showDistNames, setShowDistNames] = useState([]);
    const [regYearList, setRegYearList] = useState([]);
    const [judgeNamesList, setJudgeNamesList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [hcOrdersList, setHcOrdersList] = useState([]);
    const [hodWiseReportList, setHodWiseReportList] = useState([]);
    const [heading, setHeading] = useState([]);
    const [casesList, setCasesList] = useState([]);

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }

    const [showDrillCount, setDrillCount] = useState();
    const [showdata, setData] = useState();


    const logindetails = useSelector((state) => state.reducers.loginreducer.userLoginDetials);


    const formIk = useFormik({
        initialValues: {
            caseTypeId: "",
            deptId: "",
            distId: "",
            regYear: "",
            dofFromDate: "",
            dofToDate: "",
            petitionerName: "",
            respodentName: "",
            judgeName: ""


        },
        enableReinitialize: true,

        onSubmit: (values) => {
            // alert("hlo")
            console.log("heloo-----", values);
            const url = config.url.local_URL + "getCasesListNewHcOrder";
            CommonAxiosGetPost(url, values).then((res) => {
                if (res !== undefined && res?.data?.status === true) {
                    setCasesList(res?.data?.data);
                } else {
                    setCasesList([]);
                }

            })
                .catch((error) => {
                    console.error("Error fetching getLegacyAbstractReportList:", error);
                });
        }

    })

    useEffect(() => {

        GetCaseTypesList();
        GetDepartmentNames();
        GetDistrictNames();
        GetRegYearList();
        GetJudgeNamesList();
        GetHCOrdersReportList();

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

    const GetRegYearList = () => {
        let url = config.url.local_URL + "getYearsList";
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

    const GetJudgeNamesList = () => {
        let url = config.url.local_URL + "getJudgesList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setJudgeNamesList(res.data);

            } else {
                setJudgeNamesList([]);
            }
        }).catch((error) => {
            console.error("Error fetching JudgeNamesList names:", error);
        });
    };

    const GetHCOrdersReportList = () => {
        let url = config.url.local_URL + "HCOrdersIssuedReport";
        CommonAxiosGet(url).then((res) => {
            setDrillCount(0);
            if (res?.data?.status === true) {
                if (logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) {
                    setHodWiseReportList(res?.data?.data);
                } else {
                    setHcOrdersList(res?.data?.data);
                }
            } else {
                setHcOrdersList([]);
            }
        }).catch((error) => {
            console.error("Error fetching HCOrdersList names:", error);
        });
    };


    const columns = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Sect. Department Code', accessor: "deptcode"

        },
        {
            Header: 'Department Name', accessor: "description",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", textDecoration: "underline", color: "blue", textAlign: "left", }}
                    onClick={() => {

                        ShowHODWise(row.original.deptcode, row.original.description);

                    }}
                >
                    {row.original.description}
                </div>
            ),
        },
        {
            Header: 'Total Cases', accessor: "total_cases",
            Footer: 'total_cases'
        },
        {
            Header: 'Interim Orders Cases', accessor: "interim_order_cases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'IO', 'SD');

                    }}
                >
                    {row.original.interim_order_cases}
                </div>
            ),
            Footer: 'interim_order_cases'
        },
        {
            Header: 'Interim Orders Issued', accessor: "interim_orders",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'IO', 'SD');

                    }}
                >
                    {row.original.interim_orders}
                </div>
            ),
            Footer: 'interim_orders'
        },
        {
            Header: 'Final Orders Cases', accessor: "final_order_cases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'FO', 'SD');

                    }}
                >
                    {row.original.final_order_cases}
                </div>
            ), Footer: 'final_order_cases'
        },

        {
            Header: 'Final Orders Issued', accessor: "final_orders",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'FO', 'SD');

                    }}
                >
                    {row.original.final_orders}
                </div>
            ), Footer: 'final_orders'
        }
    ];

    const columnsHod = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Department Code', accessor: "deptcode"

        },
        {
            Header: 'Department Name', accessor: "description"

        },
        {
            Header: 'Total Cases', accessor: "total_cases",
            Footer: 'total_cases'
        },
        {
            Header: 'Interim Orders Cases', accessor: "interim_order_cases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'IO', 'HOD');

                    }}
                >
                    {row.original.interim_order_cases}
                </div>
            ),
            Footer: 'interim_order_cases'
        },
        {
            Header: 'Interim Orders Issued', accessor: "interim_orders",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'IO', 'HOD');

                    }}
                >
                    {row.original.interim_orders}
                </div>
            ),
            Footer: 'interim_orders'
        },
        {
            Header: 'Final Orders Cases', accessor: "final_order_cases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'FO', 'HOD');

                    }}
                >
                    {row.original.final_order_cases}
                </div>
            ), Footer: 'final_order_cases'
        },

        {
            Header: 'Final Orders Issued', accessor: "final_orders",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'FO', 'HOD');

                    }}
                >
                    {row.original.final_orders}
                </div>
            ), Footer: 'final_orders'
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
    const columnsList = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,

        },
        {
            Header: 'CINo', accessor: "cino",
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
            Header: 'Orders', accessor: "orderpaths",
            Cell: ({ row }) => {
                const orderList = row?.original?.orderpaths?.split("<br/>-") || [];
                return (
                    <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                        {orderList.map((item, index) => (
                            <li key={index}>{item.trim()}</li>
                        ))}
                    </ul>
                );
            }
        },

    ];


    function ShowHODWise(deptCode, deptName) {
        let Url = config.url.local_URL + "HODwisedetailsHCOrdersIssued?deptCode=" + deptCode + "&deptName=" + deptName;
        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                if (logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) {
                    setDrillCount(0);
                }
                else {
                    setDrillCount(1);
                    setData(1);
                }
                setHodWiseReportList(res?.data?.data);
            }
            else {
                setHodWiseReportList([]);

            }
        })
    }

    function getCasesWiseList(deptCode, deptName, status, level) {
        let Url = config.url.local_URL + "CasesListHCOrdersIssue?deptCode=" + deptCode + "&deptName=" + deptName
            + "&caseStatus=" + status + "&reportLevel=" + level;
        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                if (logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) {
                    setDrillCount(1);
                }
                else {
                    setDrillCount(2);
                }
                setCasesList(res?.data?.data);
            }
            else {
                setCasesList([]);
            }
        })
    }

    function isBackFunction() {
        console.log("drillcounts-------", showDrillCount)
        if ((logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) && showDrillCount == 1) {
            setDrillCount(showDrillCount - 1)
        }
        else if (!showdata && showDrillCount === 2) {
            setDrillCount(showDrillCount - 2);
        }
        else {
            setDrillCount(showDrillCount - 1);
        }
    }

    useEffect(() => {
        if (showDrillCount === 0) {
            setData();
        }
    })
    return (
        <>
            <CommonFormHeader heading={"Orders Issued Report"} />
            <bst.Row className="pt-2 pt-2 " style={{ marginLeft: "50px" }}>
                <FormikProvider value={formIk}>
                    <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                        <div className="border px-13 pb-13 mb-4 pt-1">
                            <bst.Row className="px-4 pt-4">
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
                            </bst.Row>
                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0"> Reg Year <span style={{ color: 'red' }}>*</span></label>
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

                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0"> Date of Registration (From Date)<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="date" name="dofFromDate" className="form-control" />
                                    <ErrorMessage name="dofFromDate" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0"> Date of Registration (To Date)<span style={{ color: 'red' }}>*</span></label>
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
                                    <label className="mb-0">Respondent Name<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="respodentName" />
                                    <ErrorMessage name="respodentName" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0">Select Judge Name  <span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="judgeName"
                                    >
                                        <option value="ALL">--ALL--</option>
                                        {judgeNamesList != undefined && judgeNamesList?.map((data, indexDept) => {
                                            return (<React.Fragment key={indexDept}>
                                                <option key={indexDept} value={data.value}>
                                                    {data.label}
                                                </option>
                                            </React.Fragment>);
                                        })}

                                    </Field>
                                    <ErrorMessage name="judgeName" component="div" className="text-error" />
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

                {showDrillCount === 0 && (<>
                    {hcOrdersList?.length > 0 ? (
                        <CommonReactTable data={hcOrdersList} columns={columns} showFooter={"true"}
                            filename="HC ABSTRACT REPORT" headerName="Sect. Dept. Wise High Court Cases Abstract Report" />
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}

                {showDrillCount === 0 || showDrillCount === 1 && (<>
                    {hodWiseReportList?.length > 0 ? (
                        <CommonReactTable data={hodWiseReportList} columns={columnsHod} showFooter={"true"}
                            filename="Deptwise Abstract Report" headerName={heading}
                            isBack={(logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) ? false : true} isBackFunction={isBackFunction} />
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}


                {showDrillCount === 1 || showDrillCount === 2 && (<>
                    {casesList?.length > 0 ? (
                        <CommonReactTable data={casesList} columns={columnsList} showFooter={"false"}
                            filename="HC ABSTRACT REPORT" headerName={heading}
                            isBack={true}
                            isBackFunction={isBackFunction} />
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}

            </bst.Row>
            <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={cino} viewdata={PopupData} />

        </>
    )
}

export default HCOrdersIssuedReport