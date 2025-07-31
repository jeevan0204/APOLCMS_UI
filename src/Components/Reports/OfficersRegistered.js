import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import CommonReactTable from '../../CommonUtils/CommonReactTable';

function OfficersRegistered() {

    const [showDistNames, setShowDistNames] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [heading, setHeading] = useState([]);
    const [OfficerList, setOfficerList] = useState([]);


    useEffect(() => {
        formIk.setFieldValue("officerType", "MLO");
        changeReport();
        GetDistrictNames();
    }, []);

    const formIk = useFormik({
        initialValues: {
            officerType: "",
            districtId: "",
        },
        onSubmit: (values) => {
            changeReport();
        }

    });


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

    function changeReport() {
        const officerType = formIk?.values?.officerType;
        const distId = formIk?.values?.districtId;
        let url = config.url.local_URL + "OfficersRegistered?districtId=" + distId + "&officerType=" + officerType;
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                setOfficerList(res.data.EMPWISEDATA);
                setHeading(res?.data?.heading);
            } else {
                setOfficerList([]);
            }
        }).catch((error) => {
            console.error("Error fetching department names:", error);
        });

    }

    const columns = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            // Footer: 'Total',
        },
        {
            Header: 'Department Code', accessor: "dept_id"

        },
        {
            Header: 'Department', accessor: "description"

        },
        {
            Header: 'Employee Name', accessor: "fullname_en"

        },
        {
            Header: 'Designation', accessor: "designation_name_en"

        },
        {
            Header: 'Mobile No', accessor: "mobileno"

        },
        {
            Header: 'Email', accessor: "emailid"

        },


    ];

    return (
        <>
            <CommonFormHeader heading={heading} />
            <bst.Container className="outer-page-content-container">

                <bst.Row className="pt-2 pt-2 ">
                    <FormikProvider value={formIk}>
                        <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                            <div className="border px-13 pb-13 mb-4 pt-1">
                                <bst.Row className="px-4 pt-4 mb-4">
                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0"> Designation/ Role <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="officerType" >
                                            <option value="0">---SELECT---</option>
                                            <option value="MLO">Middle Level Officer (Legal)</option>
                                            <option value="NO">Nodal Officer (Legal)</option>
                                            <option value="DNO">Nodal Officer (Legal - District Level)</option>
                                            <option value="MLOSUBJECT">Middle Level Officer (MLO Subject)</option>

                                        </Field>
                                        <ErrorMessage name="officerType" component="div" className="text-danger" ></ErrorMessage>
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
                                        <button type="button" className='btn btn-success mt-4' onClick={(e) => { changeReport() }}
                                        >Show Details</button>
                                    </bst.Col>
                                </bst.Row>
                            </div>
                        </Form>
                    </FormikProvider>
                </bst.Row>

                {OfficerList?.length > 0 ? (
                    <div style={{ width: "98%" }}>
                        <CommonReactTable data={OfficerList} columns={columns} showFooter={"false"}
                            filename="Officer Details" headerName={heading} />
                    </div>
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}

            </bst.Container>

        </>
    )
}

export default OfficersRegistered