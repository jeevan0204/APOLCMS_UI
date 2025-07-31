import React, { useEffect, useState } from 'react'
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';
import AckDetailsPopup from '../Popups/AckDetailsPopup';
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import * as bst from "react-bootstrap"
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import { config } from '../../CommonUtils/CommonApis';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';

function SectionOfficerWiseInstructionsReport() {
    const [errmsg, seterrmsg] = useState([]);
    const [reportDetails, setReportDetails] = useState([]);
    const [casesList, setCasesList] = useState([]);
    const [section, setSection] = useState([]);

    const [showModelPopup, setModelPopup] = useState(false);
    const [showModelPopupNew, setModelPopupNew] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }

    const [ackno, setAckno] = useState([]);
    const [showDrillCount, setDrillCount] = useState();


    const formIk = useFormik({
        initialValues: {
            section_code: "",
            FromDate: "",
            ToDate: "",

        },
        onSubmit: (values) => {
            GetProcessingReportList();
        }
    })

    useEffect(() => {
        formIk.setFieldValue("section_code", "L");
        GetProcessingReportList();
    }, []);


    function GetProcessingReportList() {
        const section_code = formIk?.values?.section_code;
        const FromDate = formIk?.values?.FromDate;
        const ToDate = formIk?.values?.ToDate;

        let url = config.url.local_URL + "SectionOfficerWiseInstructionsReport?fromDate=" + FromDate + "&toDate=" + ToDate +
            "&section_code=" + section_code;
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                setDrillCount(0);
                setReportDetails(res.data.CASESLIST);
                setSection(res?.data?.section);
            } else {
                setReportDetails([]);
            }
        }).catch((error) => {
            console.error("Error fetching Cases List:", error);
        });
    }

    const columns = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: "Section Officer Details",
            accessor: "",
            Cell: ({ row }) => {
                const map = row.original;
                return (
                    <td style={{ whiteSpace: "nowrap" }}>
                        {map.global_org_name}<br />
                        {map.fullname_en} - {map.designation_name_en}<br />
                        {map.mobile1} - {map.email}
                    </td>
                );
            },
        }
        ,
        {
            Header: 'Cases Count', accessor: "total",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", textDecoration: "underline", color: "blue", textAlign: "left", }}
                    onClick={() => {
                        getCasesList(row.original.email, section, 'TOT', 'DATE');
                    }}
                >
                    {row.original.total}
                </div>
            ),
            Footer: "total"
        },
        {
            Header: 'No of Instructions sent GP', accessor: "instructions",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", textDecoration: "underline", color: "blue", textAlign: "left", }}
                    onClick={() => {
                        getCasesList(row.original.email, section, 'INTS', 'DATE');
                    }}
                >
                    {row.original.instructions}
                </div>
            ),
            Footer: "instructions"
        },
        {
            Header: 'Balance', accessor: "balance",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", textDecoration: "underline", color: "blue", textAlign: "left", }}
                    onClick={() => {
                        getCasesList(row.original.email, section, 'BALANCE', 'DATE');
                    }}
                >
                    {row.original.balance}
                </div>
            ),
            Footer: "balance"
        },


    ];

    function getCasesList(email, section, ids, date) {
        let url = config.url.local_URL + "AllCasesDetailsInstReport?section_code=" + section + "&emailId=" + email + "&ids=" + ids + "&date=" + date;
        CommonAxiosGet(url).then((res) => {
            setDrillCount(1);

            if (res.data !== undefined) {
                setCasesList(res?.data?.CASESLISTDETAILS);
                setSection(res?.data?.section);
            } else {
                setCasesList([]);
            }
        }).catch((error) => {
            console.error("Error fetching popup:", error);
        });
    }

    const columnsListNew = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,

        },
        {
            Header: 'Ack No', accessor: "ack_no",
            Cell: ({ value, row }) => (
                <button onClick={() => handleAckPopup(value)}
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
            Header: 'Service Type', accessor: "servicetpye",
        },
        {
            Header: 'Advocate Name', accessor: "advocatename",
        },
        {
            Header: 'Advocate CC No', accessor: "advocateccno",

        },
        {
            Header: 'Case Type', accessor: "casetype",

        },
        {
            Header: 'Main Case No', accessor: "maincaseno",

        },
        {
            Header: 'Petitioner Name', accessor: "petitioner_name",

        },
        {
            Header: 'Date ', accessor: "inserted_time",
        },
    ];

    const columnlist = [
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
            Header: 'Date of Filing', accessor: "date_of_filing",

        },

        {
            Header: 'Case Reg No.', accessor: "reg_no",
        },

        {
            Header: 'Prayer', accessor: "prayer",

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
    function isBackFunction() {
        setDrillCount(showDrillCount - 1);
    }


    return (
        <>
            <CommonFormHeader heading="Section Officer Wise Instructions Report" />
            <bst.Container className='outer-page-content-container'>
                <bst.Row className="pt-2 pt-2 ">
                    <FormikProvider value={formIk}>
                        <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0"> Select Legacy / New<span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="section_code" >
                                        <option value="0">--SELECT--</option>
                                        <option value="L">Legacy Cases</option>
                                        <option value="N">New Cases</option>

                                    </Field>
                                    <ErrorMessage name="section_code" component="div" className="text-danger" ></ErrorMessage>
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0">From Date<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="date" name="FromDate" className="form-control" />
                                    <ErrorMessage name="FromDate" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                    <label className="mb-0"> To Date<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="date" name="ToDate" className="form-control" />
                                    <ErrorMessage name="ToDate" component="div" className="text-error" />
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
                        </Form>
                    </FormikProvider>
                </bst.Row>

                <bst.Row className="pt-2 pt-2" style={{ marginLeft: "5px" }}>
                    {showDrillCount === 0 && (<>
                        {reportDetails?.length > 0 ? (
                            <div style={{ width: "98%", marginTop: "5%" }}>
                                <CommonReactTable data={reportDetails} columns={columns} showFooter={"true"}
                                    filename="Section Officer Wise Instructions Report" />
                            </div>
                        ) : (errmsg && (<center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)

                    }

                    {showDrillCount === 1 && (<>
                        {section === 'L' && casesList?.length > 0 ? (
                            <div style={{ width: "98%", marginTop: "5%" }}>
                                <CommonReactTable data={casesList} columns={columnlist} showFooter={"true"}
                                    filename="Section Officer Wise Instructions Cases List" isBack={true} isBackFunction={isBackFunction} />
                            </div>
                        ) : (section === 'L' && errmsg && (<center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}

                    {showDrillCount === 1 && (<>
                        {section === 'N' && casesList?.length > 0 ? (
                            <div style={{ width: "98%", marginTop: "5%" }}>
                                <CommonReactTable data={casesList} columns={columnsListNew} showFooter={"true"}
                                    filename="Section Officer Wise Instructions Cases List" isBack={true} isBackFunction={isBackFunction} />
                            </div>
                        ) : (section === 'N' && errmsg && (<center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}
                </bst.Row>
            </bst.Container>
            <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={cino} viewdata={PopupData} />

            <AckDetailsPopup popupflagvalue={showModelPopupNew} setPopupflagvalue={setModelPopupNew} regularpopup={regularPopStatus}
                category={ackno} viewdata={PopupData} />
        </>
    )
}

export default SectionOfficerWiseInstructionsReport