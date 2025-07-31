import React from 'react'
import *as bst from "react-bootstrap";
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { failureAlert, successAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';

function NatureofPetition() {

    const formIk = useFormik({
        initialValues: {
            caseFullName: ""
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            const url = config.url.local_URL + "NaturePetitionMst";
            CommonAxiosPost(url, values).then((res) => {
                if (res?.data?.scode === '01') {
                    successAlert2(res?.data?.sdesc);
                } else {
                    failureAlert(res?.data?.sdesc);
                }

            }).catch((error) => {
                console.error("Error fetching onsubmit:", error);
            });
        }

    })
    return (<>
        <CommonFormHeader heading={"Nature Petition Master (Case Type)"} />
        <bst.Container className="outer-page-content-container">
            <bst.Row className="pt-2 pt-2 ">
                <FormikProvider value={formIk}>
                    <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                        <div className="border px-13 pb-5 mb-6 pt-1">
                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0"> Case Full Name <span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="caseFullName" />
                                    <ErrorMessage name="caseFullName" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <button type="submit" className="btn btn-success" style={{ marginTop: "20px" }}>
                                        Submit</button>
                                </bst.Col>
                            </bst.Row>
                        </div>
                    </Form>
                </FormikProvider>
            </bst.Row>
        </bst.Container>

    </>)
}

export default NatureofPetition