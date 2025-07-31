import React, { useEffect, useRef, useState } from 'react'
import * as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik'
import { config } from '../../CommonUtils/CommonApis'
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios'
import CommonReactTable from '../../CommonUtils/CommonReactTable'
import { viewBucketImage } from '../../CommonUtils/ViewImagelm'
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup'
import AckDetailsPopup from '../Popups/AckDetailsPopup'

function DistrictWiseAssigmentCasesListReport() {
    const [LegacycasesList, setLegacycasesList] = useState([]);
    const [showDrillCount, setDrillCount] = useState();
    const [errmsg, seterrmsg] = useState([]);
    const [sectionValue, setsectionValue] = useState([]);

    const [ackno, setAckno] = useState([]);
    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }

    const hasFetchedData = useRef(false)
    useEffect(() => {
        formIk.setFieldValue("section_code", "L");
        if (!hasFetchedData.current) {
            showGetData();
            hasFetchedData.current = true
        }
    }, []);

    const formIk = useFormik({
        initialValues: {
            section_code: ""
        }
    })

    function showGetData() {
        const section = formIk?.values?.section_code;
        alert("section--------", section);
        let Url = config.url.local_URL + "?section_code=" + section;
        CommonAxiosGet(Url).then((res) => {
            setDrillCount(0);
            if (res?.data?.status === true) {
                setLegacycasesList(res?.data?.CASESLIST);
            }
            else {
                setLegacycasesList([]);
                seterrmsg(true);
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
            Header: 'District Name/HOD', accessor: "district_name",
        },
        {
            Header: 'Total', accessor: "total",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dist_id, row.original.section, "");

                    }}
                >
                    {row.original.total}
                </div>
            ),
            Footer: 'total'
        },
        {
            Header: 'Uploaded', accessor: "uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dist_id, row.original.section, 'U');

                    }}
                >
                    {row.original.uploaded}
                </div>
            ),
            Footer: 'uploaded'
        }
        ,
        {
            Header: 'Not Uploaded (PWR/Counter)', accessor: "not_uploaded",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.dist_id, row.original.section);

                    }}
                >
                    {row.original.not_uploaded}
                </div>
            ),
            Footer: 'not_uploaded'
        }
    ];


    function getCasesWiseList(distId, section, uploaded) {
        let Url = config.url.local_URL + "DistrictWiseAssigmentCasesDetails?dist_id=" + distId + "&section=" + section + "&uploadedValue=" + uploaded;
        CommonAxiosGet(Url).then((res) => {
            setDrillCount(1);
            if (res?.data?.status === true) {
                setLegacycasesList(res?.data?.CASESLISTDETAILS);
                setsectionValue(res?.data?.section);
            }
            else {
                setLegacycasesList([]);
                seterrmsg(true);
            }
        })
    }

    const columnsListNew = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,

        },
        {
            Header: 'Acknowledge Number', accessor: "ack_no",
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

    const columnLegacy = [
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

    return (<>

        <CommonFormHeader heading="District Wise Assignment Cases Abstract Report" />
        <bst.Container className='outer-page-content-container'>
            <bst.Row className="pt-2 pt-2 ">
                <FormikProvider value={formIk}>
                    <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                        <bst.Row className="px-4 pt-4">
                            <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                <label className="mb-0"> Select Legacy / New<span style={{ color: 'red' }}>*</span></label>
                                <Field as="select" className='form-control' name="section_code" >
                                    <option value="0">--SELECT--</option>
                                    <option value="L">Legacy Cases</option>
                                    <option value="N">New Cases</option>

                                </Field>
                                <ErrorMessage name="section_code" component="div" className="text-danger" ></ErrorMessage>
                            </bst.Col>
                            <bst.Col xs={6} sm={6} md={6} lg={2} xl={2} xxl={2}>
                                <button type="submit" className='btn btn-primary btn-md rounded mt-4' >Show Report</button>
                            </bst.Col>
                        </bst.Row>
                    </Form>
                </FormikProvider>
            </bst.Row>
            <bst.Row className="pt-2 pt-2 ">
                {showDrillCount === 0 && (<>
                    {LegacycasesList?.length > 0 ? (
                        <div style={{ width: "98%" }}>
                            <CommonReactTable data={LegacycasesList} columns={columns} showFooter={"false"}
                                filename="Interim Order Impl Report" headerName="Interim Order Impl Report" />
                        </div>
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}

                {/* {showDrillCount === 1 && (<>
                    {casesList?.length > 0 ? (
                        <div style={{ width: "98%" }}>
                            <CommonReactTable data={LegacycasesList} columns={columns} showFooter={"false"}
                                filename="Interim Order Impl Report" headerName="Interim Order Impl Report" />
                        </div>
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}

                {showDrillCount === 1 && (<>
                    {NewcasesList?.length > 0 ? (
                        <div style={{ width: "98%" }}>
                            <CommonReactTable data={LegacycasesList} columns={columns} showFooter={"false"}
                                filename="Interim Order Impl Report" headerName="Interim Order Impl Report" />
                        </div>
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)} */}
            </bst.Row>
        </bst.Container>

        <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={cino} viewdata={PopupData} />

        <AckDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={ackno} viewdata={PopupData} />
    </>)
}

export default DistrictWiseAssigmentCasesListReport