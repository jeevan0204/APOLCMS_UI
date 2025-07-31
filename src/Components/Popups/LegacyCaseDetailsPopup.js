import React, { useRef, useState } from 'react'
import * as bst from "react-bootstrap"
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import { BsPrinter } from 'react-icons/bs';
import { useReactToPrint } from 'react-to-print';
import { FaHandPointRight, FaPrint } from 'react-icons/fa';

const LegacyCaseDetailsPopup = (propsAtCaseDetailsView) => {

    const [popupflagvalue, setPopupflagvalue] = useState(false);
    const [showPrintData, setPrintData] = useState(true);

    let componentRef = useRef();
    const handleprint = useReactToPrint({

        content: () => componentRef.current,
        documentTitle: "Case- Details Print",
        // pageStyle: `
        //     @media print {
        //         body {
        //             -webkit-print-color-adjust: exact;
        //             print-color-adjust: exact;
        //             font-size: 12px;
        //         }
        //         table {
        //             width: 100% !important;
        //             table-layout: fixed !important;
        //             border-collapse: collapse !important;
        //             page-break-inside: avoid;
        //             margin-bottom: 15px !important;
        //         }
        //         th, td {
        //             padding: 6px !important;
        //             border: 1px solid #ddd !important;
        //             word-wrap: break-word;
        //             vertical-align: top;
        //         }
        //         th {
        //             background-color: #f2f2f2 !important;
        //             font-weight: bold;
        //             }
        //               .personal-head span {
        //               background-color: #ececec !important;
        //               color: #000 !important;
        //                 }
        //               .personal-block{
        //                 page-break-inside: avoid;
        //               }
        //         .personal-head {

        //             padding: 8px !important;
        //             margin-top: 15px !important;
        //             margin-bottom: 10px !important;
        //             font-weight: bold;
        //         }
        //         img {
        //             max-width: 130px !important;
        //             max-height: 150px !important;
        //             display: block !important;
        //             margin: 0 auto !important;
        //         }
        //         .photo-cell {
        //             width: 150px !important;
        //             text-align: center !important;
        //             vertical-align: middle !important;
        //         }
        //     }
        // `
    });


    // console.log("test", propsAtCaseDetailsView)
    const handleCloseAtCaseDetails = () => {
        //  propsAtCaseDetailsView?.popupflagvalue === false;
        propsAtCaseDetailsView?.setPopupflagvalue(false);

    }

    let PrintContent = () =>
        <div ref={componentRef} className='mt-1'>
            <div className="card">
                <div style={{
                    backgroundColor: '#989b9c',
                    color: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                    display: 'inline-block',
                    width: '120px',
                    height: '30px',
                    marginTop: '20px',
                    marginLeft: '10px',
                    textAlign: 'center'
                }}>
                    Case Details
                </div>
                <div className="card-body RowColorForLeave">
                    <bst.Row>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Date of filing :</b>&nbsp;
                                <i style={{ textAlign: "justify", color: 'red' }}>
                                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                        propsAtCaseDetailsView.viewdata.USERSLIST[0]?.date_of_filing}
                                </i>

                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Case Type :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.type_name_reg}

                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Filing No. :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.fil_no}
                            </label>
                        </bst.Col>

                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Filing Year :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.fil_year}
                            </label>
                        </bst.Col>
                    </bst.Row>
                    <bst.Row>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Main Case No :</b>&nbsp;

                                <i style={{ textAlign: "justify" }}>
                                    {propsAtCaseDetailsView?.viewdata?.USERSLIST?.[0]?.type_name_reg}/
                                    {propsAtCaseDetailsView?.viewdata?.USERSLIST?.[0]?.reg_no}/
                                    {propsAtCaseDetailsView?.viewdata?.USERSLIST?.[0]?.reg_year}
                                </i>

                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Est Code :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.est_code}
                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Case Type :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.case_type_id}
                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Cause List Type :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.causelist_type}
                            </label>
                        </bst.Col>
                    </bst.Row>
                    <bst.Row>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Bench Name :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.bench_name}
                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Judicial Branch :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.judicial_branch}
                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Coram :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.coram}
                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Court Est Name:</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.court_est_name}
                            </label>
                        </bst.Col>
                    </bst.Row>

                    <bst.Row>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>State Name :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.state_name}
                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>District :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.dist_name}
                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Date Of First List :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.date_first_list}
                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Date Of Next List :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.date_next_list}
                            </label>
                        </bst.Col>
                    </bst.Row>
                    <bst.Row>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Date Of Decision :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.date_of_decision}
                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Purpose  :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.purpose_name}
                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Petitioner Name :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.pet_name}
                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Petitioner Advocate:</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.pet_adv}
                            </label>
                        </bst.Col>
                    </bst.Row>
                    <bst.Row>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Petitioner Legal Heir :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.pet_legal_heir}
                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Respondent Name :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.res_name}
                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Respondent Advocate :</b>&nbsp;
                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                    propsAtCaseDetailsView.viewdata.USERSLIST[0]?.res_adv}
                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Documents : </b>&nbsp;
                                <i style={{ textAlign: "justify" }}>{ }</i>
                            </label>
                        </bst.Col>
                    </bst.Row>

                </div>
            </div>&nbsp;
            <div className="card">
                <bst.Row>
                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <label className="w-100" style={{ marginLeft: '10px' }}>
                            <b>Prayer :</b>&nbsp;
                            {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                propsAtCaseDetailsView.viewdata.USERSLIST[0]?.prayer}

                        </label>
                    </bst.Col>
                </bst.Row>
            </div>&nbsp;
            {Array.isArray(propsAtCaseDetailsView?.viewdata?.DocumentsList) &&
                (propsAtCaseDetailsView?.viewdata?.DocumentsList?.hc_ack_no !== undefined && propsAtCaseDetailsView?.viewdata?.DocumentsList?.hc_ack_no !== '-') ? <>
                <div className="card">
                    <bst.Row>
                        <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <label className="w-100" style={{ marginLeft: '10px' }}>
                                <b>Other Related Documents:</b>&nbsp;


                                <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage() }} >
                                    View Document
                                </button>


                            </label>
                        </bst.Col>
                    </bst.Row>
                </div>&nbsp;
            </> : <>
            </>

            }

            <div className="card">
                <div style={{
                    backgroundColor: '#989b9c',
                    color: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(41, 18, 18, 0.2)',
                    display: 'inline-block',
                    width: '120px',
                    height: '30px',
                    marginTop: '20px',
                    marginLeft: '10px',
                    textAlign: 'center'
                }}>
                    Act List
                </div>
                <div className="card-body RowColorForLeave">
                    <bst.Row>
                        <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                    <tr>

                                        <th>S.No</th>
                                        <th>Act</th>
                                        <th width="600px" >Act Name</th>
                                        <th width="600px" >Section</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: "left" }}>
                                    <tr>
                                        <td>{1}</td>
                                        <td>{propsAtCaseDetailsView?.viewdata?.actlist?.[0]?.act}</td>
                                        <td>{propsAtCaseDetailsView?.viewdata?.actlist?.[0]?.actname}</td>
                                        <td>{propsAtCaseDetailsView?.viewdata?.actlist?.[0]?.section}</td>
                                    </tr>

                                </tbody>
                            </table>
                        </bst.Col>
                    </bst.Row>
                </div>
            </div>&nbsp;
            {Array.isArray(propsAtCaseDetailsView?.viewdata?.PETEXTRAPARTYLIST) && <>
                <div className="card">
                    <div style={{
                        backgroundColor: '#989b9c',
                        color: '#ffffff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                        display: 'inline-block',
                        width: '150px',
                        height: '30px',
                        marginTop: '20px',
                        marginLeft: '10px',
                        textAlign: 'center'
                    }}>
                        Petitioner's List
                    </div>
                    <div className="card-body RowColorForLeave">
                        <bst.Row>
                            <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                    <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                        <tr>

                                            <th>S.No</th>
                                            <th>Party No</th>
                                            <th width="600px" >Party Name</th>

                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "left" }}>
                                        {Array.isArray(propsAtCaseDetailsView?.viewdata?.PETEXTRAPARTYLIST) &&
                                            propsAtCaseDetailsView.viewdata.PETEXTRAPARTYLIST.map((party, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{party?.party_no}</td>
                                                    <td>{party?.party_name}</td>
                                                </tr>
                                            ))}
                                    </tbody>

                                </table>
                            </bst.Col>
                        </bst.Row>
                    </div>
                </div>&nbsp;
            </>}

            {Array.isArray(propsAtCaseDetailsView?.viewdata?.RESEXTRAPARTYLIST) && <>
                <div className="card">
                    <div style={{
                        backgroundColor: '#989b9c',
                        color: '#ffffff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                        display: 'inline-block',
                        width: '180px',
                        height: '30px',
                        marginTop: '20px',
                        marginLeft: '10px',
                        textAlign: 'center'
                    }}>
                        Respondent List
                    </div>
                    <div className="card-body RowColorForLeave">
                        <bst.Row>
                            <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                    <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                        <tr>

                                            <th>S.No</th>
                                            <th>Party No</th>
                                            <th width="400px" >Party Name</th>
                                            <th width="600px" >Address</th>

                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "left" }}>
                                        {Array.isArray(propsAtCaseDetailsView?.viewdata?.RESEXTRAPARTYLIST) &&
                                            propsAtCaseDetailsView.viewdata.RESEXTRAPARTYLIST.map((party, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{party?.party_no}</td>
                                                    <td>{party?.party_name}</td>
                                                    <td>{party?.address}</td>
                                                </tr>
                                            ))}
                                    </tbody>

                                </table>
                            </bst.Col>
                        </bst.Row>
                    </div>
                </div>&nbsp;

            </>}

            {Array.isArray(propsAtCaseDetailsView?.viewdata?.IAFILINGLIST) && <>
                <div className="card">
                    <div style={{
                        backgroundColor: '#989b9c',
                        color: '#ffffff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                        display: 'inline-block',
                        width: '180px',
                        height: '30px',
                        marginTop: '20px',
                        marginLeft: '10px',
                        textAlign: 'center'
                    }}>
                        IAFilling List
                    </div>
                    <div className="card-body RowColorForLeave">
                        <bst.Row>
                            <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                    <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                        <tr>

                                            <th>S.No</th>
                                            <th>Sr No</th>
                                            <td>IA NO</td>
                                            <td>IA Petitioner Name</td>
                                            <td>IA Pending/Disposed</td>
                                            <td>IA Date of Filling</td>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "left" }}>
                                        {Array.isArray(propsAtCaseDetailsView?.viewdata?.IAFILINGLIST) &&
                                            propsAtCaseDetailsView.viewdata.IAFILINGLIST.map((party, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{party?.sr_no}</td>
                                                    <td>{party?.ia_number}</td>
                                                    <td>{party?.ia_pet_name}</td>
                                                    <td>{party?.ia_pend_disp}</td>
                                                    <td>{party?.date_of_filing}</td>
                                                </tr>
                                            ))}
                                    </tbody>

                                </table>
                            </bst.Col>
                        </bst.Row>
                    </div>
                </div>&nbsp;
            </>}

            {Array.isArray(propsAtCaseDetailsView?.viewdata?.INTERIMORDERSLIST) && <>
                <div className="card">
                    <div style={{
                        backgroundColor: '#989b9c',
                        color: '#ffffff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                        display: 'inline-block',
                        width: '180px',
                        height: '30px',
                        marginTop: '20px',
                        marginLeft: '10px',
                        textAlign: 'center'
                    }}>
                        InterimOrder List
                    </div>
                    <div className="card-body RowColorForLeave">
                        <bst.Row>
                            <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                    <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                        <tr>

                                            <th>S.No</th>
                                            <th>Sr No</th>
                                            <th>Order NO</th>
                                            <th>Order Date</th>
                                            <th width="400px" >Order Details</th>
                                            <th width="600px" >Order Document</th>

                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "left" }}>
                                        {Array.isArray(propsAtCaseDetailsView?.viewdata?.INTERIMORDERSLIST) &&
                                            propsAtCaseDetailsView.viewdata.INTERIMORDERSLIST.map((party, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{party?.sr_no}</td>
                                                    <td>{party?.order_no}</td>
                                                    <td>{party?.order_date}</td>
                                                    <td>{party?.order_details}</td>
                                                    <td>
                                                        <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(party?.order_document_path) }} >
                                                            View Document
                                                        </button>

                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>

                                </table>
                            </bst.Col>
                        </bst.Row>
                    </div>
                </div>&nbsp;
            </>}

            {Array.isArray(propsAtCaseDetailsView?.viewdata?.LINKCASESLIST) && <>
                <div className="card">
                    <div style={{
                        backgroundColor: '#989b9c',
                        color: '#ffffff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                        display: 'inline-block',
                        width: '180px',
                        height: '30px',
                        marginTop: '20px',
                        marginLeft: '10px',
                        textAlign: 'center'
                    }}>
                        Case Link List
                    </div>
                    <div className="card-body RowColorForLeave">
                        <bst.Row>
                            <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                    <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                        <tr>

                                            <th>S.No</th>
                                            <th>Sr No</th>
                                            <th>Filling NO</th>
                                            <th>Case Number</th>

                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "left" }}>
                                        {Array.isArray(propsAtCaseDetailsView?.viewdata?.LINKCASESLIST) &&
                                            propsAtCaseDetailsView.viewdata.LINKCASESLIST.map((party, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{party?.sr_no}</td>
                                                    <td>{party?.filing_number}</td>
                                                    <td>{party?.case_number}</td>

                                                </tr>
                                            ))}
                                    </tbody>

                                </table>
                            </bst.Col>
                        </bst.Row>
                    </div>
                </div>&nbsp;
            </>}

            {Array.isArray(propsAtCaseDetailsView?.viewdata?.LINKCASESLIST) && <>
                <div className="card">
                    <div style={{
                        backgroundColor: '#989b9c',
                        color: '#ffffff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                        display: 'inline-block',
                        width: '180px',
                        height: '30px',
                        marginTop: '20px',
                        marginLeft: '10px',
                        textAlign: 'center'
                    }}>
                        Objections List
                    </div>
                    <div className="card-body RowColorForLeave">
                        <bst.Row>
                            <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                    <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                        <tr>

                                            <td>Sl No.</td>
                                            <td>Objection Number</td>
                                            <td>Objection Description</td>
                                            <td>Scrunity Date</td>
                                            <td>Compliance Date</td>
                                            <td>Receipt Date</td>

                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "left" }}>
                                        {Array.isArray(propsAtCaseDetailsView?.viewdata?.OBJECTIONSLIST) &&
                                            propsAtCaseDetailsView.viewdata.OBJECTIONSLIST.map((party, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{party?.objection_no}</td>
                                                    <td>{party?.objection_desc}</td>
                                                    <td>{party?.scrutiny_date}</td>
                                                    <td>{party?.objections_compliance_by_date}</td>
                                                    <td>{party?.obj_reciept_date}</td>

                                                </tr>
                                            ))}
                                    </tbody>

                                </table>
                            </bst.Col>
                        </bst.Row>
                    </div>
                </div>&nbsp;
            </>}

            {Array.isArray(propsAtCaseDetailsView?.viewdata?.CASEHISTORYLIST) && <>
                <div className="card">
                    <div style={{
                        backgroundColor: '#989b9c',
                        color: '#ffffff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                        display: 'inline-block',
                        width: '180px',
                        height: '30px',
                        marginTop: '20px',
                        marginLeft: '10px',
                        textAlign: 'center'
                    }}>
                        Case History Details
                    </div>
                    <div className="card-body RowColorForLeave">
                        <bst.Row>
                            <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                    <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                        <tr>
                                            <td>Sl No.</td>
                                            <td>Sr No</td>
                                            <td>Judge Name</td>
                                            <td>Business Date</td>
                                            <td>Hearing Date</td>
                                            <td>Purpose of Listing</td>
                                            <td>Cause Type</td>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "left" }}>
                                        {Array.isArray(propsAtCaseDetailsView?.viewdata?.CASEHISTORYLIST) &&
                                            propsAtCaseDetailsView.viewdata.CASEHISTORYLIST.map((party, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{party?.sr_no}</td>
                                                    <td>{party?.judge_name}</td>
                                                    <td>{party?.business_date}</td>
                                                    <td>{party?.hearing_date}</td>
                                                    <td>{party?.purpose_of_listing}</td>
                                                    <td>{party?.causelist_type}</td>

                                                </tr>
                                            ))}
                                    </tbody>

                                </table>
                            </bst.Col>
                        </bst.Row>
                    </div>
                </div>&nbsp;
            </>}
            {Array.isArray(propsAtCaseDetailsView?.viewdata?.orderlist) && <>
                <div className="card">
                    <div style={{
                        backgroundColor: '#989b9c',
                        color: '#ffffff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                        display: 'inline-block',
                        width: '180px',
                        height: '30px',
                        marginTop: '20px',
                        marginLeft: '10px',
                        textAlign: 'center'
                    }}>
                        Final Order Details
                    </div>
                    <div className="card-body RowColorForLeave">
                        <bst.Row>
                            <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                    <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                        <tr>
                                            <td>Sl No.</td>
                                            <td>Sr No</td>
                                            <td>Order NO</td>
                                            <td>Order Date</td>
                                            <td>Order Details</td>
                                            <td>Order Document</td>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "left" }}>
                                        {Array.isArray(propsAtCaseDetailsView?.viewdata?.orderlist) &&
                                            propsAtCaseDetailsView.viewdata.orderlist.map((party, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{party?.sr_no}</td>
                                                    <td>{party?.order_no}</td>
                                                    <td>{party?.order_date}</td>
                                                    <td>{party?.order_details}</td>
                                                    <td>
                                                        <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(party?.order_document_path) }} >
                                                            {party?.order_details}-{party?.order_no}
                                                        </button></td>

                                                </tr>
                                            ))}
                                    </tbody>

                                </table>
                            </bst.Col>
                        </bst.Row>
                    </div>
                </div>&nbsp;
            </>}

            {Array.isArray(propsAtCaseDetailsView?.viewdata?.ACTIVITIESDATA) && <>
                <div className="card">
                    <div style={{
                        backgroundColor: '#989b9c',
                        color: '#ffffff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                        display: 'inline-block',
                        width: '180px',
                        height: '30px',
                        marginTop: '20px',
                        marginLeft: '10px',
                        textAlign: 'center'
                    }}>
                        Case Activities
                    </div>
                    <div className="card-body RowColorForLeave">
                        <bst.Row>
                            <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                    <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                        <tr>
                                            <th>Sl No.</th>
                                            <th>Date</th>
                                            <th>Activity</th>
                                            <th>Updated By</th>
                                            <th>Assigned to</th>
                                            <th>Remarks</th>
                                            <th>Uploaded Document</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "left" }}>
                                        {Array.isArray(propsAtCaseDetailsView?.viewdata?.ACTIVITIESDATA) &&
                                            propsAtCaseDetailsView.viewdata.ACTIVITIESDATA.map((party, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{party?.inserted_on}</td>
                                                    <td>{party?.action_type}</td>
                                                    <td>{party?.inserted_by}</td>
                                                    <td>{party?.assigned_to}</td>
                                                    <td>{party?.remarks}</td>
                                                    <td>
                                                        <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(party?.uploaded_doc_path) }} >
                                                            View Uploaded File
                                                        </button></td>

                                                </tr>
                                            ))}
                                    </tbody>

                                </table>
                            </bst.Col>
                        </bst.Row>
                    </div>
                </div>&nbsp;
            </>}

            {propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA && <>
                <div className="card">
                    <div style={{
                        backgroundColor: '#989b9c',
                        color: '#ffffff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                        display: 'inline-block',
                        width: '180px',
                        height: '30px',
                        marginTop: '20px',
                        marginLeft: '10px',
                        textAlign: 'center'
                    }}>
                        Uploaded Details
                    </div>
                    <div className="card-body RowColorForLeave">
                        <bst.Row>
                            <bst.Col >
                                <table className="table  table-bordered  table-responsive" style={{ width: "100%" }}>

                                    <tbody style={{ textAlign: "left" }}>
                                        <tr>
                                            <td>Uploaded Petition :</td>
                                            <td> <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.petition_document) }} >
                                                View Uploaded File
                                            </button></td>
                                            <td>Case Status :</td>
                                            <td>{propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.ecourts_case_status}</td>
                                            <td>Uploaded Judgement Order :</td>
                                            <td><button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.judgement_order) }} >
                                                View Uploaded File
                                            </button></td>
                                        </tr>

                                        <tr>
                                            <td>PWR Submitted Date:</td>
                                            <td>{propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.pwr_submitted_date}</td>
                                            <td>Uploaded Counter Filed :</td>
                                            <td> <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.counter_filed_document) }} >
                                                View Uploaded File
                                            </button></td>


                                            <td>Remarks :</td>
                                            <td>{propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.remarks}</td>
                                        </tr>
                                        <tr>
                                            <td>Corresponding GP :</td>
                                            <td>{propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.corresponding_gp}</td>
                                            <td>PWR Uploaded :</td>
                                            <td>{propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.pwr_uploaded}</td>
                                            <td>Action Taken Order :</td>
                                            <td> <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.action_taken_order) }} >
                                                View Uploaded File
                                            </button></td>
                                        </tr>

                                        <tr>
                                            <td>PWR Received Date:</td>
                                            <td>{propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.pwr_received_date}</td>
                                            <td>PWR Approved GP:</td>
                                            <td>{propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.pwr_approved_gp}</td>
                                            <td>PWR Approved GP Date:</td>
                                            <td>{propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.pwr_gp_approved_date}</td>
                                        </tr>


                                        <tr>
                                            <td>Uploaded Appeal Filed:</td>
                                            <td><button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.appeal_filed_copy) }} >
                                                View Uploaded File
                                            </button></td>
                                            <td>Appeal Filed:</td>
                                            <td>{propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.appeal_filed}</td>
                                            <td>Uploaded PWR File:</td>
                                            <td><button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.pwr_uploaded_copy) }} >
                                                View Uploaded File
                                            </button></td>
                                        </tr>
                                        <tr>
                                            <td>Appeal Filed Date:</td>
                                            <td>{propsAtCaseDetailsView?.viewdata?.OLCMSCASEDATA?.[0]?.appeal_filed_date}</td>
                                        </tr>
                                    </tbody>

                                </table>
                            </bst.Col>
                        </bst.Row>
                    </div>
                </div>&nbsp;
            </>}
        </div>;

    return (<>
        <bst.Modal show={propsAtCaseDetailsView?.popupflagvalue} onHide={handleCloseAtCaseDetails} className="modal-xl" backdrop="static">
            <bst.Modal.Header className="bg-success bg-opacity-75 text-white" closeButton>
                <bst.Modal.Title>View Case Details for CINO: {propsAtCaseDetailsView?.viewdata?.fileCino} </bst.Modal.Title>
            </bst.Modal.Header>
            <bst.Modal.Body>

                {showPrintData && <>
                    <div className='mt-4'><h5 onClick={handleprint}  >
                        <b > Click Here </b> <FaHandPointRight size={30} />&nbsp;
                        <button className="btn btn-primary" variant="primary">Print&nbsp;
                            <FaPrint title="Print" style={{ fontSize: '22px' }} />
                        </button>
                    </h5></div>
                    <PrintContent /></>}


            </bst.Modal.Body>
        </bst.Modal>

    </>)
}

export default LegacyCaseDetailsPopup