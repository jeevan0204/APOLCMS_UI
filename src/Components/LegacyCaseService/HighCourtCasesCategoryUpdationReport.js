import React, { useEffect, useRef, useState } from 'react'
import * as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';

function HighCourtCasesCategoryUpdationReport() {
    const [regYearList, setRegYearList] = useState([]);
    const [showDistNames, setShowDistNames] = useState([]);
    const [purposeList, setPurposeList] = useState([]);
    const [visible, setVisible] = useState(true);

    const hasFetchedData = useRef(false)


    const formIk = useFormik({
        initialValues: {
            caseType1: "",
            regYear1: "",
            mainCaseNo: "",

        },
    })
    useEffect(() => {
        if (!hasFetchedData.current) {
            GetRegYearList();
            GetDistrictNames();
            GetPurposeList();

            hasFetchedData.current = true
        }
    }, []);


    const GetRegYearList = () => {
        let url = config.url.COMMONSERVICE_URL + "getYearsList";
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

    const GetDistrictNames = () => {
        let url = config.url.COMMONSERVICE_URL + "getDistrictList";
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

    const GetPurposeList = () => {
        let url = config.url.local_URL + "getPurposeList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setPurposeList(res.data);

            } else {
                setPurposeList([]);
            }
        }).catch((error) => {
            console.error("Error fetching district names:", error);
        });
    };

    return (
        <>
            <CommonFormHeader heading="Category Updation for High Court Cases" />
            <bst.Container className="outer-page-content-container">
                <bst.Row className="pt-2 pt-2 ">
                    <FormikProvider value={formIk}>
                        <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                            <div className="border px-13 pb-13 mb-4 pt-1">
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
                                        <label className="mb-0"> Date of Filing From Date<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="date" name="dofFromDate" className="form-control" />
                                        <ErrorMessage name="dofFromDate" component="div" className="text-error" />
                                    </bst.Col>

                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0">Date of Filing To Date<span style={{ color: 'red' }}>*</span></label>
                                        <Field type="date" name="dofToDate" className="form-control" />
                                        <ErrorMessage name="dofToDate" component="div" className="text-error" />
                                    </bst.Col>

                                </bst.Row>
                                <bst.Row className="px-4 pt-4">
                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0"> Purpose <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="purpose"
                                        >
                                            <option value="ALL">--ALL--</option>
                                            {purposeList != undefined && purposeList?.map((data, indexDept) => {
                                                return (<React.Fragment key={indexDept}>
                                                    <option key={indexDept} value={data.value}>
                                                        {data.label}
                                                    </option>
                                                </React.Fragment>);
                                            })}

                                        </Field>
                                        <ErrorMessage name="purpose" component="div" className="text-error" />
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

                <div className="pt-2 mt-14">
                    {visible && (
                        <div className="alert alert-info alert-dismissible fade show" role="alert">
                            <button
                                type="button"
                                className="close" // Use 'btn-close' for Bootstrap 5
                                onClick={() => setVisible(false)}
                                aria-label="Close"
                                style={{ marginLeft: '1200px' }}
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>

                            <strong>A1:</strong> All contempt cases where bills are uploaded in CFMS and waiting for fund clearance.<br />
                            <strong>A2:</strong> Contempt cases where bills are <u>not uploaded</u> in CFMS due to lack of budget/HOA.<br />
                            <strong>B1:</strong> Writ Petitions with payment orders where bills are uploaded & waiting for funds.<br />
                            <strong>B2:</strong> Writ Petitions where bills are <u>not uploaded</u> due to lack of budget/HOA.<br />
                            <strong>C1:</strong> Fresh writs with bills uploaded & pending clearance.<br />
                            <strong>C2:</strong> Fresh writs where bills are <u>not uploaded</u> due to budget/HOA issues.
                        </div>
                    )}
                </div>
            </bst.Container>
        </>
    )
}

export default HighCourtCasesCategoryUpdationReport