import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import *as bst from "react-bootstrap";
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { CommonAxiosGet, CommonAxiosGetPost, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { config } from '../../CommonUtils/CommonApis';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import Swal from 'sweetalert2';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';
import { useSelector } from 'react-redux';

function HCAbstractReport() {
    const [caseTypesList, setCaseTypesList] = useState([]);
    const [showDeptNames, setShowDeptNames] = useState([]);
    const [showDistNames, setShowDistNames] = useState([]);
    const [regYearList, setRegYearList] = useState([]);
    const [categoryServiceList, setCategoryServiceList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [legacyAbstarctList, setLegacyAbstarctList] = useState([]);
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
            respodentName: "",
            categoryServiceId: ""


        },
        enableReinitialize: true,

        onSubmit: (values) => {
            const url = config.url.local_URL + "getLegacyAbstractReportList";
            CommonAxiosGetPost(url, values).then((res) => {
                if (res !== undefined && res.data.status === true) {
                    const firstData = res.data.data[0];
                    setDrillCount(0);
                    if (logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) {
                        setHeading(firstData.HEADING);
                        setHodWiseReportList(firstData.data);
                    } else {
                        setLegacyAbstarctList(res.data.data);
                    }

                } else {
                    setLegacyAbstarctList([]);
                }
            })
                .catch((error) => {
                    console.error("Error fetching getLegacyAbstractReportList:", error);
                });
        }

    })



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


    const GetLegacyAbstractReportList = () => {
        let url = config.url.local_URL + "getLegacyAbstractReportList";

        CommonAxiosGet(url)
            .then((res) => {
                console.log(res.data.status);
                setDrillCount(0);
                if (res !== undefined && res.data.status === true) {
                    const firstData = res.data.data[0];
                    if (logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) {
                        setHeading(firstData.HEADING);
                        setHodWiseReportList(firstData.data);
                    } else {
                        setLegacyAbstarctList(res.data.data);
                    }
                } else {
                    setLegacyAbstarctList([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching getLegacyAbstractReportList:", error);
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
            Header: 'Sect. Department Name', accessor: "description",
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
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'ALL', 'SD');

                    }}
                >
                    {row.original.total_cases}
                </div>
            ),
            Footer: 'total_cases'
        },
        {
            Header: 'Pending With Sect.Dept', accessor: "withsectdept",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        if (row.original.withsectdept === 0) {
                            Swal.fire("No Data Found");
                        }
                        else {
                            getCasesWiseList(row.original.deptcode, row.original.description, 'withSD', 'SD');
                        }
                    }}
                >
                    {row.original.withsectdept}
                </div>
            ),
            Footer: 'withsectdept'
        },
        {
            Header: 'Pending With MLO', accessor: "withmlo",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withMLO', 'SD');

                    }}
                >
                    {row.original.withmlo}
                </div>
            ),
            Footer: 'withmlo'
        },
        {
            Header: 'Pending With HOD', accessor: "withhod",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withHOD', 'SD');

                    }}
                >
                    {row.original.withhod}
                </div>
            ), Footer: 'withhod'
        },

        {
            Header: 'Pending With Nodal', accessor: "withnodal",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withNO', 'SD');

                    }}
                >
                    {row.original.withnodal}
                </div>
            ), Footer: 'withnodal'
        },

        {
            Header: 'Pending With Section(Sect. Dept.)', accessor: "withsection",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withSDSec', 'SD');

                    }}
                >
                    {row.original.withsection}
                </div>
            ), Footer: 'withsection'
        },

        {
            Header: 'Pending With Section(HOD)', accessor: "withsectionhod",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {

                        getCasesWiseList(row.original.deptcode, row.original.description, 'withHODSec', 'SD');

                    }}
                >
                    {row.original.withsectionhod}
                </div>
            ),
            Footer: 'withsectionhod'
        },

        {
            Header: 'Pending With District Collector', accessor: "withdc",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withDC', 'SD');

                    }}
                >
                    {row.original.withdc}
                </div>
            ),
            Footer: 'withdc'
        },

        {
            Header: 'Pending With District Nodal Officer', accessor: "withdistno",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withDistNO', 'SD');

                    }}
                >
                    {row.original.withdistno}
                </div>
            ),
            Footer: 'withdistno'
        },
        {
            Header: 'Pending With Section(District)', accessor: "withsectiondist",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withDistSec', 'SD');

                    }}
                >
                    {row.original.withsectiondist}
                </div>
            ),
            Footer: 'withsectiondist'
        },
        {
            Header: 'Pending With GPO', accessor: "withgpo",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withGP', 'SD');

                    }}
                >
                    {row.original.withgpo}
                </div>
            ),
            Footer: 'withgpo'
        },

        {
            Header: 'Closed Cases', accessor: "closedcases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'closed', 'SD');

                    }}
                >
                    {row.original.closedcases}
                </div>
            ),
            Footer: 'closedcases'
        },

        {
            Header: 'GoI', accessor: "goi",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'goi', 'SD');

                    }}
                >
                    {row.original.goi}
                </div>
            ),
            Footer: 'goi'
        },
        {
            Header: 'PSU', accessor: "psu",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'psu', 'SD');

                    }}
                >
                    {row.original.psu}
                </div>
            ),
            Footer: 'psu'
        },
        {
            Header: 'Private', accessor: "privatetot",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "left", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'Private', 'SD');

                    }}
                >
                    {row.original.privatetot}
                </div>
            ),
            Footer: 'privatetot'
        },

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
            Header: 'Department Name', accessor: "description",

        },
        {
            Header: 'Total Cases', accessor: "total_cases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'ALL', 'HOD');

                    }}
                >
                    {row.original.total_cases}
                </div>
            ),
            Footer: 'total_cases'
        },
        {
            Header: 'Pending With Sect.Dept', accessor: "withsectdept",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withSD', 'HOD');

                    }}
                >
                    {row.original.withsectdept}
                </div>
            ),
            Footer: 'withsectdept'
        },
        {
            Header: 'Pending With MLO', accessor: "withmlo",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withMLO', 'HOD');

                    }}
                >
                    {row.original.withmlo}
                </div>
            ),
            Footer: 'withmlo'
        },
        {
            Header: 'Pending With HOD', accessor: "withhod",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withHOD', 'HOD');

                    }}
                >
                    {row.original.withhod}
                </div>
            ), Footer: 'withhod'
        },

        {
            Header: 'Pending With Nodal', accessor: "withnodal",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withNO', 'HOD');

                    }}
                >
                    {row.original.withnodal}
                </div>
            ), Footer: 'withnodal'
        },

        {
            Header: 'Pending With Section(Sect. Dept.)', accessor: "withsection",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withSDSec', 'HOD');

                    }}
                >
                    {row.original.withsection}
                </div>
            ), Footer: 'withsection'
        },

        {
            Header: 'Pending With Section(HOD)', accessor: "withsectionhod",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withHODSec', 'HOD');

                    }}
                >
                    {row.original.withsectionhod}
                </div>
            ),
            Footer: 'withsectionhod'
        },

        {
            Header: 'Pending With District Collector', accessor: "withdc",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withDC', 'HOD');

                    }}
                >
                    {row.original.withdc}
                </div>
            ),
            Footer: 'withdc'
        },

        {
            Header: 'Pending With District Nodal Officer', accessor: "withdistno",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withDistNO', 'HOD');

                    }}
                >
                    {row.original.withdistno}
                </div>
            ),
            Footer: 'withdistno'
        },
        {
            Header: 'Pending With Section(District)', accessor: "withsectiondist",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withDistSec', 'HOD');

                    }}
                >
                    {row.original.withsectiondist}
                </div>
            ),
            Footer: 'withsectiondist'
        },
        {
            Header: 'Pending With GPO', accessor: "withgpo",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'withGP', 'HOD');

                    }}
                >
                    {row.original.withgpo}
                </div>
            ),
            Footer: 'withgpo'
        },

        {
            Header: 'Closed Cases', accessor: "closedcases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'closed', 'HOD');

                    }}
                >
                    {row.original.closedcases}
                </div>
            ),
            Footer: 'closedcases'
        },

        {
            Header: 'GoI', accessor: "goi",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'goi', 'HOD');

                    }}
                >
                    {row.original.goi}
                </div>
            ),
            Footer: 'goi'
        },
        {
            Header: 'PSU', accessor: "psu",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'psu', 'HOD');

                    }}
                >
                    {row.original.psu}
                </div>
            ),
            Footer: 'psu'
        },
        {
            Header: 'Private', accessor: "privatetot",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "left", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'Private', 'HOD');

                    }}
                >
                    {row.original.privatetot}
                </div>
            ),
            Footer: 'privatetot'
        },
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
            Footer: 'Total',
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
            Header: 'Currently Pending at', accessor: "fullname",
        },
        {
            Header: 'Office Name', accessor: "org_unit_name_en",

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
        let Url = config.url.local_URL + "HCCHODwisedetails?deptCode=" + deptCode + "&deptName=" + deptName;
        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                const list = res?.data?.data?.[0]?.data || [];
                if (logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) {
                    setDrillCount(0);
                }
                else {
                    setDrillCount(1);
                    setData(1);
                }
                setHeading(res?.data?.data?.[0]?.HEADING);
                setHodWiseReportList(list);
            }
            else {
                setHodWiseReportList([]);
            }
        })
    }
    function getCasesWiseList(deptCode, deptName, status, level) {
        let Url = config.url.local_URL + "HCCgetCasesList?deptCode=" + deptCode + "&deptName=" + deptName
            + "&status=" + status + "&level=" + level;
        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                const list = res?.data?.data?.[0]?.data || [];
                if (logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) {
                    setDrillCount(1);
                }
                else {
                    setDrillCount(2);
                }
                setHeading(res?.data?.data?.[0]?.HEADING);
                setCasesList(list);
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
    useEffect(() => {

        GetCaseTypesList();
        GetDepartmentNames();
        GetDistrictNames();
        GetRegYearList();
        GetCategoryServiceList();
        GetLegacyAbstractReportList();

    }, []);

    return (
        <>
            <CommonFormHeader heading={"High Court Cases Abstract Report"} />
            <bst.Row className="pt-2 pt-2 " style={{ marginLeft: "50px" }}>
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

                {showDrillCount === 0 && (<>
                    {legacyAbstarctList?.length > 0 ? (
                        <CommonReactTable data={legacyAbstarctList} columns={columns} showFooter={"true"}
                            filename="HC ABSTRACT REPORT" headerName="Sect. Dept. Wise High Court Cases Abstract Report"
                        />
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
                </>)}
                {console.log("dssssss----", showDrillCount, hodWiseReportList?.length)}

                {(showDrillCount === 0 || showDrillCount === 1) && (<>
                    {hodWiseReportList?.length > 0 ? (
                        <CommonReactTable data={hodWiseReportList} columns={columnsHod} showFooter={"true"}
                            filename="Deptwise Abstract Report" headerName="Dept. Wise High Court Cases Abstract Report"
                            isBack={(logindetails.role === 5 || logindetails.role === 9 || logindetails.role === 10) ? false : true} isBackFunction={isBackFunction} />
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}


                {(showDrillCount === 1 || showDrillCount === 2) && (<>
                    {casesList?.length > 0 ? (
                        <CommonReactTable data={casesList} columns={columnsList} showFooter={"true"}
                            filename="HC ABSTRACT Cases REPORT" headerName={heading} isBack={true}
                            isBackFunction={isBackFunction} />
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}

            </bst.Row>
            <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={cino} viewdata={PopupData} />
        </>)
}

export default HCAbstractReport