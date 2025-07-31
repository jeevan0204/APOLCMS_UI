import React, { useEffect, useState } from 'react'
import *as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik'
import { CommonAxiosGet, CommonAxiosGetPost } from '../../CommonUtils/CommonAxios';
import { config } from '../../CommonUtils/CommonApis';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';

function HCCaseDistWiseAbstractReport() {

    const [showDeptNames, setShowDeptNames] = useState([]);
    const [showDistNames, setShowDistNames] = useState([]);
    const [categoryServiceList, setCategoryServiceList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [heading, setHeading] = useState([]);
    const [distFinalorderReportList, setDistFinalorderReportList] = useState([]);
    const [casesList, setCasesList] = useState([]);

    const [showDrillCount, setDrillCount] = useState();


    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }

    const formIk = useFormik({
        initialValues: {
            deptId: "",
            distId: "",
            categoryServiceId: ""
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            // alert("hlo")
            console.log("heloo-----", values);
            const url = config.url.local_URL + "CasesReportList";
            CommonAxiosGetPost(url, values).then((res) => {
                if (res?.data?.status === true) {
                    // console.log("heading----", res?.data?.heading)
                    setHeading(res?.data?.heading);

                    setDistFinalorderReportList(res?.data?.data);
                }
                else {
                    setDistFinalorderReportList([]);

                    seterrmsg(true);

                }

            })
                .catch((error) => {
                    console.error("Error fetching getLegacyAbstractReportList:", error);
                });
        }

    })



    useEffect(() => {
        GetDepartmentNames();
        GetDistrictNames();
        GetCategoryServiceList();
        GetDistWiseFinalOrderReport();

    }, []);

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



    function GetDistWiseFinalOrderReport() {
        let url = config.url.local_URL + "HCCaseDistWiseAbstract";
        CommonAxiosGet(url).then((res) => {
            setDrillCount(0);
            if (res?.data?.status === true) {
                setDistFinalorderReportList(res?.data?.data);

            } else {
                setDistFinalorderReportList([]);
            }
        }).catch((error) => {
            console.error("Error fetching DistFinalorderReportList:", error);
        });
    };

    const columnsDist = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'District Name', accessor: "district_name"

        },
        {
            Header: 'Total Cases', accessor: "total_cases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'ALL');

                    }}
                >
                    {row.original.total_cases}
                </div>
            ),
            Footer: 'total_cases'
        },
        {
            Header: 'Pending at Dist. Collector Login', accessor: "pending_dc",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'DC');
                    }}
                >
                    {row.original.pending_dc}
                </div>
            ),
            Footer: 'pending_dc'
        },
        {
            Header: 'Pending at Dist. Nodal Officer', accessor: "pending_dno",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'DNO');

                    }}
                >
                    {row.original.pending_dno}
                </div>
            ),
            Footer: 'pending_dno'
        },
        {
            Header: 'Pending at Dist. Section Officer', accessor: "pending_dsec",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'DSEC');

                    }}
                >
                    {row.original.pending_dsec}
                </div>
            ), Footer: 'pending_dsec'
        },

        {
            Header: 'Scanned by APOLCMS Cell', accessor: "olcms_uploads",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'SCANNEDDOC');

                    }}
                >
                    {row.original.olcms_uploads}
                </div>
            ), Footer: 'olcms_uploads'
        },

        {
            Header: 'Petition Uploaded by Dept.', accessor: "petition_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'PET');

                    }}
                >
                    {row.original.petition_uploaded}
                </div>
            ), Footer: 'petition_uploaded'
        },

        {
            Header: 'Parawise Remarks Uploaded', accessor: "pwrcounter_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'PWRUPLOADED');
                    }}
                >
                    {row.original.pwrcounter_uploaded}
                </div>
            ),
            Footer: 'pwrcounter_uploaded'
        },

        {
            Header: 'Counter filed', accessor: "counter_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'COUNTERUPLOADED');

                    }}
                >
                    {row.original.counter_uploaded}
                </div>
            ),
            Footer: 'counter_uploaded'
        },

        {
            Header: 'Final Order Implemented', accessor: "final_order",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'FINALORDER');

                    }}
                >
                    {row.original.final_order}
                </div>
            ),
            Footer: 'final_order'
        },
        {
            Header: 'Appeal Filed', accessor: "appeal_order",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'APPEALORDER');
                    }}
                >
                    {row.original.appeal_order}
                </div>
            ),
            Footer: 'appeal_order'
        },
        {
            Header: 'Dismissed', accessor: "dismissed_order",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'DISMISSEDORDER');

                    }}
                >
                    {row.original.dismissed_order}
                </div>
            ),
            Footer: 'dismissed_order'
        },

        {
            Header: 'Closed', accessor: "closed_cases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'CLOSED');
                    }}
                >
                    {row.original.closed_cases}
                </div>
            ),
            Footer: 'closed_cases'
        },


        {
            Header: 'Private Cases', accessor: "private_cases",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "left", }}
                    onClick={() => {
                        getCasesWiseList(row.original.district_id, row.original.district_name, 'PRIVATE');

                    }}
                >
                    {row.original.private_cases}
                </div>
            ),
            Footer: 'private_cases'
        },

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

    function getCasesWiseList(distCode, distName, status) {

        let Url = config.url.local_URL + "getCasesListHCCaseStatusAbstract?distid=" + distCode + "&distName=" + distName
            + "&caseStatus=" + status;
        CommonAxiosGet(Url).then((res) => {
            setDrillCount(1);
            if (res?.data?.status === true) {
                console.log("heading----", res?.data?.heading)
                setHeading(res?.data?.heading);
                setCasesList(res?.data?.data);
                setDistFinalorderReportList([]);

            }
            else {

                setCasesList([]);
                seterrmsg(true);

            }
        })

    }

    function isBackFunction() {
        setDrillCount(showDrillCount - 1)
    }

    return (<>
        <CommonFormHeader heading={"District Wise Final Order Implemented Status"} />
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
            </bst.Row>&nbsp;&nbsp;

            {showDrillCount === 0 && (<>
                {distFinalorderReportList?.length > 0 ? (
                    <CommonReactTable data={distFinalorderReportList} columns={columnsDist} showFooter={"true"}
                        filename="Distwise Abstract Final Order Report" />
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}


            {showDrillCount === 1 && (<>
                {casesList?.length > 0 ? (
                    <CommonReactTable data={casesList} columns={columnsList} showFooter={"true"}
                        filename="Final Order ABSTRACT REPORT" headerName={heading} isBack={true}
                        isBackFunction={isBackFunction} />
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}
        </bst.Container>


        <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={cino} viewdata={PopupData} />


    </>)
}

export default HCCaseDistWiseAbstractReport