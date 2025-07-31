import React, { useEffect, useState } from 'react'
import CommonReactTable from '../../CommonUtils/CommonReactTable'
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import { config } from '../../CommonUtils/CommonApis';
import * as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';
import { useSelector } from 'react-redux';

function NextListingDtAbstractReport() {

    const [nextListingDtAbstractList, setNextListingDtAbstractList] = useState([]);
    const [hodnextListingDtAbstractList, setHodnextListingDtAbstractList] = useState([]);
    const [heading, setHeading] = useState([]);
    const [casesList, setCasesList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [showdata, setData] = useState();


    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }

    const [showDrillCount, setDrillCount] = useState();

    const logindetails = useSelector((state) => state.reducers.loginreducer?.userLoginDetials);

    useEffect(() => {
        GetNextListingDtAbstract();
    }, []);



    const GetNextListingDtAbstract = () => {
        let url = config.url.local_URL + "NextListingDtAbstract";
        CommonAxiosGet(url).then((res) => {
            setDrillCount(0);
            if (res?.data?.status === true) {
                if (logindetails.role === 5 || logindetails.role === 9) {
                    setHodnextListingDtAbstractList(res?.data?.data);
                } else {
                    setNextListingDtAbstractList(res?.data?.data);
                }
            } else {
                seterrmsg(true);
                setNextListingDtAbstractList([]);

            }
        }).catch((error) => {
            console.error("Error fetching NextListingDtAbstractList names:", error);
        });
    };


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
            Header: 'Total Cases', accessor: "total",
            Footer: 'total'
        },
        {
            Header: 'Hearing Today', accessor: "today",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'today');

                    }}
                >
                    {row.original.today}
                </div>
            ),
            Footer: 'today'
        },
        {
            Header: 'Hearing Tomorrow', accessor: "tomorrow",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'tomorrow');

                    }}
                >
                    {row.original.tomorrow}
                </div>
            ),
            Footer: 'tomorrow'
        },
        {
            Header: 'With in this week', accessor: "week1",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'week1');

                    }}
                >
                    {row.original.week1}
                </div>
            ), Footer: 'week1'
        },

        {
            Header: '7 - 14 days', accessor: "week2",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'week2');

                    }}
                >
                    {row.original.week2}
                </div>
            ), Footer: 'week2'
        },
        {
            Header: '14 - 21 days', accessor: "week3",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'week3');

                    }}
                >
                    {row.original.week3}
                </div>
            ), Footer: 'week3'
        }
        , {
            Header: '21 - 28 days', accessor: "week4",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'week4');

                    }}
                >
                    {row.original.week4}
                </div>
            ), Footer: 'week4'
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
            Header: 'Total Cases', accessor: "total",
            Footer: 'total'
        },
        {
            Header: 'Hearing Today', accessor: "today",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'today');

                    }}
                >
                    {row.original.today}
                </div>
            ),
            Footer: 'today'
        },
        {
            Header: 'Hearing Tomorrow', accessor: "tomorrow",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'tomorrow');

                    }}
                >
                    {row.original.tomorrow}
                </div>
            ),
            Footer: 'tomorrow'
        },
        {
            Header: 'With in this week', accessor: "week1",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'week1');

                    }}
                >
                    {row.original.week1}
                </div>
            ), Footer: 'week1'
        },

        {
            Header: '7 - 14 days', accessor: "week2",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'week2');

                    }}
                >
                    {row.original.week2}
                </div>
            ), Footer: 'week2'
        },
        {
            Header: '14 - 21 days', accessor: "week3",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'week3');

                    }}
                >
                    {row.original.week3}
                </div>
            ), Footer: 'week3'
        }
        , {
            Header: '21 - 28 days', accessor: "week4",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.deptcode, row.original.description, 'week4');

                    }}
                >
                    {row.original.week4}
                </div>
            ), Footer: 'week4'
        }
    ];

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

        }

    ];

    function getCasesWiseList(deptCode, deptName, status) {
        let Url = config.url.local_URL + "NextListingDtCasesLists?deptCode=" + deptCode + "&deptName=" + deptName
            + "&caseStatus=" + status;
        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                if (logindetails.role === 5 || logindetails.role === 9) {
                    setDrillCount(1);
                }
                else {
                    setDrillCount(2);
                }
                setCasesList(res?.data?.data);
            }
            else {
                seterrmsg(true);
                setCasesList([]);
            }
        })

    }

    function ShowHODWise(deptCode, deptName) {
        let Url = config.url.local_URL + "HodWiseDetails?deptCode=" + deptCode + "&deptName=" + deptName;
        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                if (logindetails.role === 5 || logindetails.role === 9) {
                    setDrillCount(0);
                }
                else {
                    setDrillCount(1);
                    setData(1);
                }
                setHodnextListingDtAbstractList(res?.data?.data);
            }
            else {
                seterrmsg(true);
                setHodnextListingDtAbstractList([]);

            }
        })
    }

    function isBackFunction() {
        console.log("drillcounts-------", showDrillCount)
        if ((logindetails.role === 5 || logindetails.role === 9) && showDrillCount == 1) {
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

                {showDrillCount === 0 && (<>
                    {nextListingDtAbstractList?.length > 0 ? (
                        <CommonReactTable data={nextListingDtAbstractList} columns={columns} showFooter={"true"}
                            filename="HC ABSTRACT REPORT" headerName="Sect. Dept. Wise High Court Cases Abstract Report" />
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}

                {showDrillCount === 0 || showDrillCount === 1 && (<>
                    {
                        hodnextListingDtAbstractList?.length > 0 ? (
                            <CommonReactTable data={hodnextListingDtAbstractList} columns={columnsHod} showFooter={"true"}
                                filename="Deptwise Abstract Report" headerName={heading}
                                isBack={(logindetails.role === 5 || logindetails.role === 9) ? false : true} isBackFunction={isBackFunction} />
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))
                    }</>)}

                {showDrillCount === 1 || showDrillCount === 2 && (<>
                    {
                        casesList?.length > 0 ? (
                            <CommonReactTable data={casesList} columns={columnsList} showFooter={"false"}
                                filename="HC ABSTRACT REPORT" headerName={heading} isBack={true}
                                isBackFunction={isBackFunction} />
                        ) : (errmsg && (
                            <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))
                    }</>)}

            </bst.Row>
            <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={cino} viewdata={PopupData} />
        </>
    )
}

export default NextListingDtAbstractReport