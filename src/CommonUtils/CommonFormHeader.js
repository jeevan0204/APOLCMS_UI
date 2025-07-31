import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import * as bst from 'react-bootstrap';
import { HiOutlineHome } from "react-icons/hi";
import { useSelector } from 'react-redux';
import Header from '../Components/Header/Header';

export const CommonFormHeader = ({ heading, sub1, sub2, sub3, mandatoryForm }) => {

    let navigate = useNavigate();
    const location = useLocation();
    let pageName = location?.state?.page;
    const redirectTo = location?.state?.targetTo;
    let mainName = location?.state?.mainName;
    let serviceId = location?.state?.serviceId;
    let rowData = location?.state?.rowData;
    const loginreducer = useSelector((state) => state?.reducers?.loginreducer?.userLoginDetials);

    return (<>

        <div className="main_section"></div>
        <bst.Container className='page-titlespacing d-fle justify-content-between px-0' style={{ maxWidth: '90%' }}>
            <bst.Row className='m-0'>
                <bst.Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={12} className=" text-start">
                    <div className="inner-herbpage-service-title1">
                        <h1>{heading}</h1>
                    </div>
                </bst.Col>
                {/* {!mandatoryForm && (<>
                    <bst.Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={12} className="dite pt-3">
                        <nav aria-label="breadcrumb ">
                            <ol className="breadcrumb float-end">
                                <li className="breadcrumb-item"><a href="/Dashboard">Home</a></li>
                                {sub1 && sub2 && sub3 ? (<>
                                    <li className="breadcrumb-item" ><u style={{ "color": "#0d6efd", "cursor": "pointer" }} onClick={() => {
                                        navigate(-2)
                                    }}>{sub1}</u></li>
                                    <li className="breadcrumb-item" ><u style={{ "color": "#0d6efd", "cursor": "pointer" }} onClick={() => {
                                        navigate(-1)
                                    }}>{sub2}</u></li>
                                    <li className="breadcrumb-item active" aria-current="page">{sub3}</li>
                                </>) :
                                    sub1 && sub2 ? <>
                                        {['prl_secy_sw_ap', 'rnit_frs'].includes(loginreducer?.userId) ? (<>
                                            <li className="breadcrumb-item" ><u style={{ "color": "#0d6efd", "cursor": "pointer" }} onClick={() => {
                                                navigate('/nivasDashboard')
                                            }}>{sub1}</u></li>
                                            <li className="breadcrumb-item active" aria-current="page">{sub2}</li>
                                        </>) : (<>
                                            <li className="breadcrumb-item" ><u style={{ "color": "#0d6efd", "cursor": "pointer" }} onClick={() => {
                                                navigate(-1)
                                            }}>{sub1}</u></li>
                                            <li className="breadcrumb-item active" aria-current="page">{sub2}</li>
                                        </>)}
                                    </> : <>
                                        <li className="breadcrumb-item" ><u style={{ "color": "#0d6efd", "cursor": "pointer" }} onClick={() => {
                                            navigate("/nivasDashboard", { state: { backTo: mainName, service_Id: serviceId, rowData: rowData } })
                                        }}>{mainName}</u></li>
                                        <li className="breadcrumb-item active" aria-current="page">{pageName}</li>
                                    </>}
                            </ol>
                        </nav>
                    </bst.Col></>)} */}
            </bst.Row>
        </bst.Container>
    </>)
}
