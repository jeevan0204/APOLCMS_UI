import React, { useEffect, useRef, useState } from 'react'
import * as bst from "react-bootstrap"
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { useDispatch, useSelector } from 'react-redux';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import AckDetailsPopup from '../Popups/AckDetailsPopup';

function HCCaseDocsUploadAbstractNewReport() {
    const [caseTypesList, setCaseTypesList] = useState([]);
    const [showDeptNames, setShowDeptNames] = useState([]);
    const [showDistNames, setShowDistNames] = useState([]);
    const [regYearList, setRegYearList] = useState([]);
    const [categoryServiceList, setCategoryServiceList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [legacyAbstarctList, setLegacyAbstarctList] = useState([]);
    const [hodWiseReportList, setHodWiseReportList] = useState([]);
    const [heading, setHeading] = useState([]);
    const [deptheading, setdeptHeading] = useState([]);

    const [headingCases, setHeadingCases] = useState([]);

    const [casesList, setCasesList] = useState([]);

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [ackno, setAckno] = useState([]);
    const [PopupData, setPopupData] = useState([]);

    function regularPopStatus() { setregularPopupFlag(false); }


    const [showDrillCount, setDrillCount] = useState();

    const [showdata, setData] = useState();
    const dispatch = useDispatch();

    const logindetails = useSelector((state) => state.reducers.loginreducer?.userLoginDetials);

    const formIk = useFormik({
        initialValues: {
            caseTypeId: "",
            deptId: "",
            distId: "",
            regYear: "",
            dofFromDate: "",
            dofToDate: "",
            petitionerName: "",
            advocateName: "",
            categoryServiceId: ""

        },
        enableReinitialize: true,

        onSubmit: (values) => {
            GetLegacyAbstractReportList();
        }

    })

    const GetCaseTypesList = () => {
        let url = config.url.local_URL + "getCaseTypesListOldTableWithSNO";
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

    const hasFetchedData = useRef(false)
    useEffect(() => {
        if (!hasFetchedData.current) {
            GetCaseTypesList();
            GetDepartmentNames();
            GetDistrictNames();
            GetRegYearList();
            GetCategoryServiceList();
            GetLegacyAbstractReportList();
            hasFetchedData.current = true
        }
    }, []);


    // **************level 1**********
    const [showR1, setR1] = useState(false);
    const [showR1ErrMsg, setR1ErrMsg] = useState(false);
    const [showR21, setR21] = useState(false);
    const [showR21ErrMsg, setR21ErrMsg] = useState(false);

    // **************level 2**********
    const [showR2, setR2] = useState(false);
    const [showR2ErrMsg, setR2ErrMsg] = useState(false);

    // **************level 3**********
    const [showR3, setR3] = useState(false);
    const [showR3ErrMsg, setR3ErrMsg] = useState(false);

    //***********direct level ******** 
    const [showR31, setR31] = useState(false);


    const GetLegacyAbstractReportList = () => {
        const caseTypeId = formIk?.values?.caseTypeId;
        const deptId = formIk?.values?.deptId;
        const distId = formIk?.values?.distId;
        const dofFromDate = formIk?.values?.dofFromDate;
        const dofToDate = formIk?.values?.dofToDate;
        const petitionerName = formIk?.values?.petitionerName;
        const advocateName = formIk?.values?.advocateName;
        const categoryServiceId = formIk?.values?.categoryServiceId;


        let url = config.url.local_URL + "HCCaseDocsUploadAbstractNew?dofFromDate=" + dofFromDate + "&dofToDate=" + dofToDate + "&caseTypeId=" + caseTypeId +
            "&districtId=" + distId + "&deptId=" + deptId + "&petitionerName=" + petitionerName + "&serviceType1=" + categoryServiceId +
            "&advocateName=" + advocateName;

        CommonAxiosGet(url)
            .then((res) => {
                if (res !== undefined && res.data.status === true) {
                    const firstData = res.data;
                    if (logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) {
                        setdeptHeading(firstData.HEADING);
                        setHodWiseReportList(firstData.hodData);
                        setR21(true);
                        setR1(false);
                        setR2(false);
                        setR3(false);
                        setR21ErrMsg(false);
                    } else {
                        setLegacyAbstarctList(res.data.secData);
                        setR1(true);
                        setR21(false);
                        setR2(false);
                        setR3(false);
                        setR1ErrMsg(false);
                    }
                } else {
                    if (logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) {
                        setHodWiseReportList([]);
                        setR21ErrMsg(true);
                    } else {
                        setLegacyAbstarctList([]);
                        setR1ErrMsg(true);
                    }

                }
            })
            .catch((error) => {
                console.error("Error fetching getLegacyAbstractReportList:", error);
            });
    };


    function ShowHODWise(deptCode, deptName) {
        let Url = config.url.local_URL + "HCCaseDocsUploadHODwisedetailsNew?deptCode=" + deptCode + "&deptName=" + deptName;
        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                setR2(true);
                setR1(false);
                setHodWiseReportList(res?.data?.hodData);
                setdeptHeading(res?.data?.Heading);
            }
            else {
                setR2ErrMsg(true);
                setHodWiseReportList([]);
            }
        })
    }

    function getCasesWiseList(deptId, deptDesc, respondenttype, status) {

        let Url = config.url.local_URL + "HCCaseDocsUploadCasesListNew?deptId1=" + deptId + "&deptName=" + deptDesc + "&respondenttype=" + respondenttype
            + "&caseStatus=" + status;
        dispatch({ type: "SHOW_SPINNER", payload: true });
        CommonAxiosGet(Url).then((res) => {
            dispatch({ type: 'HIDE_SPINNER', payload: { key: 'showSpinner', value: false } });
            if (res?.data?.status === true) {
                if (logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) {
                    setR3(true);
                    setR21(false);
                }
                else {
                    setR3(true);
                    setR21(false);
                    setR2(false);
                    setR1(false);
                }
                setCasesList(res?.data?.caseListData);
                setHeadingCases(res?.data?.HEADING)
            }
            else {
                setCasesList([]);
                setR3(true)
                setR21(false);
                setR2(false);
                setR1(false);
                setR3ErrMsg(true);
            }
        })

    }



    const columns = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Sect. Department Code', accessor: "dept_code"

        },
        {
            Header: 'Sect. Department Name', accessor: "description",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", textDecoration: "underline", color: "blue", textAlign: "left", }}
                    onClick={() => {
                        ShowHODWise(row.original.dept_code, row.original.description);
                        setR31(false);
                    }} >
                    {row.original.description}
                </div>
            ),
        },

        {
            Header: 'Cases Count (as Respondent One)', accessor: "cases_respondent_one",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, '1', 'ALL');
                        setR31(true);

                    }}
                >
                    {row.original.cases_respondent_one}
                </div>
            ),
            Footer: 'cases_respondent_one'
        },
        {
            Header: 'Cases Count (as Other Respondent)', accessor: "cases_respondent_other",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, '2', 'ALL');
                        setR31(true);
                    }}
                >
                    {row.original.cases_respondent_other}
                </div>
            ),
            Footer: 'cases_respondent_other'
        },
        {
            Header: 'Total Cases', accessor: "total",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'TOTAL');
                        setR31(true);

                    }}
                >
                    {row.original.total}
                </div>
            ),
            Footer: 'total'
        },
        {
            Header: 'Closed', accessor: "closed_cases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'CLOSED');
                        setR31(true);

                    }}
                >
                    {row.original.closed_cases}
                </div>
            ), Footer: 'closed_cases'
        },

        {
            Header: 'Parawise Remarks Uploaded', accessor: "pwrcounter_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'PWRUPLOADED');
                        setR31(true);
                    }}
                >
                    {row.original.pwrcounter_uploaded}
                </div>
            ),
            Footer: 'pwrcounter_uploaded'
        },
        {
            Header: 'Parawise Remarks not Uploaded', accessor: "pwrcounter_not_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'PWRNOTUPLOADED');
                        setR31(true);
                    }}
                >
                    {row.original.pwrcounter_not_uploaded}
                </div>
            ),
            Footer: 'pwrcounter_not_uploaded'
        },

        {
            Header: 'Parawise Remarks Approved by GP', accessor: "pwrcounter_approved_by_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'PWRAPPROVEDBYGP');
                        setR31(true);

                    }}
                >
                    {row.original.pwrcounter_approved_by_gp}
                </div>
            ),
            Footer: 'pwrcounter_approved_by_gp'
        },
        {
            Header: 'Parawise Remarks Reject by GP', accessor: "pwrcounter_rejected_by_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'PWRREJEDBYGP');
                        setR31(true);

                    }}
                >
                    {row.original.pwrcounter_rejected_by_gp}
                </div>
            ),
            Footer: 'pwrcounter_rejected_by_gp'
        },

        {
            Header: 'Counter file Uploaded', accessor: "counter_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'COUNTERUPLOADED');
                        setR31(true);

                    }}
                >
                    {row.original.counter_uploaded}
                </div>
            ),
            Footer: 'counter_uploaded'
        },
        {
            Header: 'Counter file not Uploaded', accessor: "counter_not_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'COUNTERNOTUPLOADED');
                        setR31(true);

                    }}
                >
                    {row.original.counter_not_uploaded}
                </div>
            ),
            Footer: 'counter_not_uploaded'
        },

        {
            Header: 'Counter Approved by GP', accessor: "counter_approved_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'GPCOUNTERAPPROVED');
                        setR31(true);

                    }}
                >
                    {row.original.counter_approved_gp}
                </div>
            ),
            Footer: 'counter_approved_gp'
        },

        {
            Header: 'Counter Not Approved by GP', accessor: "counter_rejected_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'GPCOUNTERREJECTED');
                        setR31(true);

                    }}
                >
                    {row.original.counter_rejected_gp}
                </div>
            ),
            Footer: 'counter_rejected_gp'
        }

    ];

    const columnsHod = [

        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Sect. Department Code', accessor: "dept_code"

        },
        {
            Header: 'Sect. Department Name', accessor: "description",

        },
        {
            Header: 'Cases Count (as Respondent One)', accessor: "cases_respondent_one",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, '1', 'ALL');


                    }}
                >
                    {row.original.cases_respondent_one}
                </div>
            ),
            Footer: 'cases_respondent_one'
        },
        {
            Header: 'Cases Count (as Other Respondent)', accessor: "cases_respondent_other",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, '2', 'ALL');

                    }}
                >
                    {row.original.cases_respondent_other}
                </div>
            ),
            Footer: 'cases_respondent_other'
        },
        {
            Header: 'Total Cases', accessor: "total",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'TOTAL');


                    }}
                >
                    {row.original.total}
                </div>
            ),
            Footer: 'total'
        },
        {
            Header: 'Closed', accessor: "closed_cases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'CLOSED');


                    }}
                >
                    {row.original.closed_cases}
                </div>
            ), Footer: 'closed_cases'
        },

        {
            Header: 'Parawise Remarks Uploaded', accessor: "pwrcounter_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'PWRUPLOADED');

                    }}
                >
                    {row.original.pwrcounter_uploaded}
                </div>
            ),
            Footer: 'pwrcounter_uploaded'
        },
        {
            Header: 'Parawise Remarks not Uploaded', accessor: "pwrcounter_not_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'PWRNOTUPLOADED');

                    }}
                >
                    {row.original.pwrcounter_not_uploaded}
                </div>
            ),
            Footer: 'pwrcounter_not_uploaded'
        },

        {
            Header: 'Parawise Remarks Approved by GP', accessor: "pwrcounter_approved_by_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'PWRAPPROVEDBYGP');


                    }}
                >
                    {row.original.pwrcounter_approved_by_gp}
                </div>
            ),
            Footer: 'pwrcounter_approved_by_gp'
        },
        {
            Header: 'Parawise Remarks Reject by GP', accessor: "pwrcounter_rejected_by_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'PWRREJEDBYGP');


                    }}
                >
                    {row.original.pwrcounter_rejected_by_gp}
                </div>
            ),
            Footer: 'pwrcounter_rejected_by_gp'
        },

        {
            Header: 'Counter file Uploaded', accessor: "counter_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'COUNTERUPLOADED');


                    }}
                >
                    {row.original.counter_uploaded}
                </div>
            ),
            Footer: 'counter_uploaded'
        },
        {
            Header: 'Counter file not Uploaded', accessor: "counter_not_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'COUNTERNOTUPLOADED');


                    }}
                >
                    {row.original.counter_not_uploaded}
                </div>
            ),
            Footer: 'counter_not_uploaded'
        },

        {
            Header: 'Counter Approved by GP', accessor: "counter_approved_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'GPCOUNTERAPPROVED');


                    }}
                >
                    {row.original.counter_approved_gp}
                </div>
            ),
            Footer: 'counter_approved_gp'
        },

        {
            Header: 'Counter Not Approved by GP', accessor: "counter_rejected_gp",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dept_code, row.original.description, 'ALL', 'GPCOUNTERREJECTED');


                    }}
                >
                    {row.original.counter_rejected_gp}
                </div>
            ),
            Footer: 'counter_rejected_gp'
        }

    ];

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
        {
            Header: 'Departments/Respondents',
            accessor: 'dept_descs',
            Cell: ({ value }) => {
                if (!value) return null;

                const items = value.split('<br>'); // Already numbered in data
                return (
                    <div>
                        {items.map((item, index) => (
                            <div key={index}>{item.trim()}</div>
                        ))}
                    </div>
                );
            },
        },
        { Header: 'Case Type', accessor: "case_full_name", },
        { Header: 'Main Case No.', accessor: "maincaseno" },
        { Header: 'Advocate CC No.', accessor: "advocateccno" },
        { Header: 'Advocate Name', accessor: "advocatename" },
        { Header: 'Mode Of Filing', accessor: "mode_filing" },

        {
            Header: 'Download / Print', accessor: "",
            Cell: ({ row }) => {
                const data = row.original;
                //console.log("Data:", data.ack_file_path);

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
                                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }}
                                        onClick={() => { viewBucketImage(row?.original?.barcode_file_path); }} >
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
    const handleAckPopup = (ackNo) => {

        let url = config.url.local_URL + "AckNoPopupView?SHOWPOPUP=SHOWPOPUP&cino=" + ackNo;

        // console.log("url-----", url);
        CommonAxiosGet(url).then((res) => {
            if (res.data !== undefined) {
                //    alert("test-----new popup" + res?.data?.USERSLIST[0]?.ack_no)
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

    function BacktoHodwise() {
        setR21(true);
        setR3(false);
    }

    function BacktoSecwise() {
        setR1(true);
        setR2(false);
        setR3(false);
    }
    function BacktoDeptwise() {
        setR2(true);
        setR3(false);
    }


    return (
        <>
            <CommonFormHeader heading={"High Court Cases Abstract Report"} />
            <bst.Container className="outer-page-content-container">

                <bst.Row className="pt-2 pt-2 " style={{ marginLeft: "2px" }}>
                    <FormikProvider value={formIk}>
                        <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                            <div className="border px-13 pb-13 mb-4 pt-1">
                                <bst.Row className="px-4 pt-4">
                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0"> Case Type <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="caseTypeId">
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
                                        <label className="mb-0"> Date of Registration (From Date)<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="date" name="dofFromDate" className="form-control" />
                                        <ErrorMessage name="dofFromDate" component="div" className="text-error" />
                                    </bst.Col>

                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0"> Date of Registration (To Date)<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="date" name="dofToDate" className="form-control" />
                                        <ErrorMessage name="dofToDate" component="div" className="text-error" />
                                    </bst.Col>

                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0">Petitioner Name<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="text" className="form-control me-1 mt-0" name="petitionerName" />
                                        <ErrorMessage name="petitionerName" component="div" className="text-error" />

                                    </bst.Col>
                                </bst.Row>
                                <bst.Row className="px-4 pt-4">
                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0">Advocate Name<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="text" className="form-control me-1 mt-0" name="advocateName" />
                                        <ErrorMessage name="advocateName" component="div" className="text-error" />
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

                    {showR1 && (
                        <>
                            {showR1ErrMsg ? (
                                <center className="text-danger h6">*** No Data Found ***</center>
                            ) : (<>
                                <div className="inner-herbpage-service-title-sub">
                                    <h1>Sect. Dept. Wise High Court Cases Abstract Report</h1>
                                </div>
                                <CommonReactTable data={legacyAbstarctList} columns={columns} showFooter={"true"}
                                    filename="HC ABSTRACT REPORT" />
                            </>)}
                        </>
                    )}


                    {showR21 ? (
                        <>
                            {showR21ErrMsg ? (
                                <>
                                    {![5, 9, 10].includes(logindetails.role) && (
                                        <bst.Row>
                                            <bst.Col xs={12} sm={12} md={12} lg={11} xl={11} xxl={11}></bst.Col>
                                            <bst.Col xs={12} sm={12} md={12} lg={1} xl={1} xxl={1} className="px-5 py-1">
                                                <button type="button" className="btn btn-sm btn-secondary" onClick={() => { BacktoSecwise(); }}>Back</button>
                                            </bst.Col>
                                        </bst.Row>
                                    )}
                                    <center className="text-danger h6">*** No Data Found ***</center>
                                </>
                            ) : (
                                <>
                                    {![5, 9, 10].includes(logindetails.role) && (
                                        <bst.Row>
                                            <bst.Col xs={12} sm={12} md={12} lg={11} xl={11} xxl={11}></bst.Col>
                                            <bst.Col xs={12} sm={12} md={12} lg={1} xl={1} xxl={1} className="px-5 py-1">
                                                <button type="button" className="btn btn-sm btn-secondary" onClick={() => { BacktoSecwise(); }}>Back</button>
                                            </bst.Col>
                                        </bst.Row>
                                    )}
                                    <div className="inner-herbpage-service-title-sub">
                                        <h1>{deptheading}</h1>

                                    </div>
                                    <CommonReactTable data={hodWiseReportList} columns={columnsHod} showFooter={"true"}
                                        filename="Deptwise Abstract Report" />

                                </>
                            )}
                        </>
                    ) : (showR2 ? (
                        <>
                            {showR2ErrMsg ? (
                                <>
                                    <bst.Row>
                                        <bst.Col xs={12} sm={12} md={12} lg={11} xl={11} xxl={11}></bst.Col>
                                        <bst.Col xs={12} sm={12} md={12} lg={1} xl={1} xxl={1} className="px-5 py-1">
                                            <button type="button" className="btn btn-sm btn-secondary" onClick={() => { BacktoSecwise(); }}>Back</button>
                                        </bst.Col>
                                    </bst.Row>

                                    <center className="text-danger h6">*** No Data Found ***</center>
                                </>
                            ) : (
                                <>
                                    <bst.Row>
                                        <bst.Col xs={12} sm={12} md={12} lg={11} xl={11} xxl={11}></bst.Col>
                                        <bst.Col xs={12} sm={12} md={12} lg={1} xl={1} xxl={1} className="px-5 py-1">
                                            <button type="button" className="btn btn-sm btn-secondary" onClick={() => { BacktoSecwise(); }}>Back</button>
                                        </bst.Col>
                                    </bst.Row>

                                    <div className="inner-herbpage-service-title-sub">
                                        <h1>{deptheading}</h1>
                                    </div>
                                    <CommonReactTable data={hodWiseReportList} columns={columnsHod} showFooter={"true"}
                                        filename="Deptwise Abstract Report" />

                                </>
                            )}
                        </>) : <></>)}



                    {showR3 ? (<>
                        {showR3ErrMsg ? (
                            <>
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={11} xl={11} xxl={11}></bst.Col>
                                    <bst.Col xs={12} sm={12} md={12} lg={1} xl={1} xxl={1} className="px-5 py-1">
                                        <button type="button" className="btn btn-sm btn-secondary"
                                            onClick={() => {
                                                if ([5, 9, 10].includes(logindetails.role)) {
                                                    BacktoHodwise();
                                                }
                                                else if (showR31 === true) {
                                                    BacktoSecwise();
                                                }
                                                else {
                                                    BacktoDeptwise();
                                                }
                                            }}>Back</button>
                                    </bst.Col>
                                </bst.Row>

                                <center className="text-danger h6">*** No Data Found ***</center>
                            </>
                        ) : (
                            <>
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={11} xl={11} xxl={11}></bst.Col>
                                    <bst.Col xs={12} sm={12} md={12} lg={1} xl={1} xxl={1} className="px-5 py-1">
                                        <button type="button" className="btn btn-sm btn-secondary"
                                            onClick={() => {
                                                if ([5, 9, 10].includes(logindetails.role)) {
                                                    BacktoHodwise();
                                                }
                                                else if (showR31 === true) {
                                                    BacktoSecwise();
                                                }
                                                else {
                                                    BacktoDeptwise();
                                                }
                                            }}>Back</button>
                                    </bst.Col>
                                </bst.Row>
                                <div className="inner-herbpage-service-title-sub">
                                    <h1>{headingCases}</h1>
                                </div>
                                <CommonReactTable data={casesList} columns={columnsList} showFooter={"true"}
                                    filename="HC ABSTRACT REPORT" />

                            </>
                        )}
                    </>
                    ) : (
                        <></>
                    )}

                </bst.Row>
            </bst.Container>

            <AckDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={ackno} viewdata={PopupData} />
        </>
    )
}

export default HCCaseDocsUploadAbstractNewReport