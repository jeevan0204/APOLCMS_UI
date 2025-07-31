import React, { useState } from 'react'
import * as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import * as Yup from "yup"
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import AckDetailsPopup from '../Popups/AckDetailsPopup';

function DeleteCasesList() {
    const [heading, setHeading] = useState([]);
    const [deletedlist, setDeletedlist] = useState([]);
    const [errmsg, seterrmsg] = useState(false);

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [ackno, setAckno] = useState([]);
    const [PopupData, setPopupData] = useState([]);

    function regularPopStatus() { setregularPopupFlag(false); }

    const currentDate = new Date().toISOString().split('T')[0];

    function convertDateFormat(dateStringAttdReport) {
        const [year, month, day] = dateStringAttdReport?.split('-');
        return `${day}-${month}-${year}`;
    }

    const formIk = useFormik({
        initialValues: {
            dofFromDate: '',
            dofToDate: '',
        },
        validationSchema: Yup.object().shape({
            dofFromDate: Yup.string().required("required").nullable(),
            dofToDate: Yup.string().required("required").nullable(),
        }),
        onSubmit: (values) => {
            getDeletedList(formIk?.values?.dofFromDate, formIk?.values?.dofToDate);
        }
    })

    function getDeletedList(fromdate, todate) {
        let url = config.url.local_URL + "DeleteCasesListData?dofFromDate=" + convertDateFormat(fromdate) + "&dofToDate=" + convertDateFormat(todate);
        CommonAxiosGet(url).then((res) => {
            if (res !== null && res !== undefined) {
                if (res?.data?.status === true) {
                    setHeading(res?.data?.HEADING);
                    setDeletedlist(res?.data?.DATA);
                }
                else {
                    seterrmsg(true);
                    setDeletedlist([]);
                }

            }
        })
    }

    const handleAckPopup = (ackNo) => {

        let url = config.url.local_URL + "AckNoPopupView?SHOWPOPUP=SHOWPOPUP&cino=" + ackNo;

        console.log("url-----", url);
        CommonAxiosGet(url).then((res) => {
            if (res.data !== undefined) {
                alert("test-----new popup" + res?.data?.USERSLIST[0]?.ack_no)
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

    const columns = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
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
            Header: 'Advocate Name', accessor: "advocatename"

        },
        {
            Header: 'Case Number', accessor: "maincaseno"

        },
        {
            Header: 'Petitioner Name', accessor: "petitioner_name"

        },
        {
            Header: 'Date', accessor: "inserted_time"

        },
        {
            Header: 'User Id', accessor: "inserted_by"

        },

    ];

    return (
        <>
            <CommonFormHeader heading={"Deleted Cases List Report"} />
            <bst.Container className="outer-page-content-container">
                <bst.Row className="pt-2 pt-2 ">
                    <FormikProvider value={formIk}>
                        <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                            <div className="border px-13 pb-13 mb-4 pt-1">
                                <bst.Row className="px-4 pt-4">
                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0"> Date of Registration (From Date)<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="date" name="dofFromDate" className="form-control" max={currentDate} onKeyDown={(e) => e.preventDefault()} />
                                        <ErrorMessage name="dofFromDate" component="div" className="text-error" />
                                    </bst.Col>

                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0"> Date of Registration (To Date)<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="date" name="dofToDate" className="form-control" min={formIk?.values?.dofFromDate || ''}
                                            max={currentDate} onKeyDown={(e) => e.preventDefault()} />
                                        <ErrorMessage name="dofToDate" component="div" className="text-error" />
                                    </bst.Col>

                                    <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                        <button type="submit" className='btn btn-primary mt-4' style={{ marginBottom: "40px" }}
                                        >Submit</button>
                                    </bst.Col>
                                </bst.Row>
                            </div>
                        </Form>
                    </FormikProvider>
                </bst.Row>


                {deletedlist?.length > 0 ? (
                    <CommonReactTable data={deletedlist} columns={columns} showFooter={"true"}
                        filename="Deleted Cases List Report" headerName={heading} />
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}

            </bst.Container>

            <AckDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
                category={ackno} viewdata={PopupData} />

        </>
    )
}

export default DeleteCasesList