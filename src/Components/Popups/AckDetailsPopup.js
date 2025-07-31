import React, { useRef, useState } from 'react'
import * as bst from "react-bootstrap"
import { FaHandPointRight, FaPrint } from 'react-icons/fa'
import { useReactToPrint } from 'react-to-print';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';


const AckDetailsPopup = (propsAtCaseDetailsView) => {
    const [popupflagvalue, setPopupflagvalue] = useState(false);
    const [showPrintData, setPrintData] = useState(true);

    let componentRef = useRef();
    const handleprint = useReactToPrint({

        content: () => componentRef.current,
        documentTitle: "New Case- Details Print",

    });
    const handleCloseAtCaseDetails = () => {
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
                                <b>Petitioner Name :</b>&nbsp;
                                <i style={{ textAlign: "justify", color: 'black' }}>
                                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                        propsAtCaseDetailsView.viewdata.USERSLIST[0]?.petitioner_name}
                                </i>

                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Respondent Advocate No :</b>&nbsp;
                                <i style={{ textAlign: "justify", color: 'black' }}>
                                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                        propsAtCaseDetailsView.viewdata.USERSLIST[0]?.advocateccno}
                                </i>

                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                            <label className="w-100">
                                <b>Respondent Advocate Name :</b>&nbsp;
                                <i style={{ textAlign: "justify", color: 'black' }}>
                                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                        propsAtCaseDetailsView.viewdata.USERSLIST[0]?.advocatename}
                                </i>

                            </label>
                        </bst.Col>
                    </bst.Row>

                    <bst.Row>

                        {(() => {
                            const mainCaseNo = propsAtCaseDetailsView?.viewdata?.USERSLIST?.[0]?.maincaseno || "";
                            const [type = "", number = "", year = ""] = mainCaseNo.split("/");

                            return (
                                <>
                                    <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                        <label className="w-100">
                                            <b>Registration No :</b>&nbsp;
                                            <i style={{ textAlign: "justify", color: 'black' }}>
                                                {number}
                                            </i>

                                        </label>
                                    </bst.Col>

                                    <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                        <label className="w-100">
                                            <b> Registration Year :</b>&nbsp;
                                            <i style={{ textAlign: "justify", color: 'black' }}>
                                                {year}
                                            </i>

                                        </label>
                                    </bst.Col>

                                </>);
                        })()}
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b> Hc Entry Date :</b>&nbsp;
                                <i style={{ textAlign: "justify", color: 'black' }}>
                                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                        propsAtCaseDetailsView.viewdata.USERSLIST[0]?.inserted_time}
                                </i>

                            </label>
                        </bst.Col>
                    </bst.Row>

                    <bst.Row>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Case type :</b>&nbsp;
                                <i style={{ textAlign: "justify", color: 'black' }}>
                                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                        propsAtCaseDetailsView.viewdata.USERSLIST[0]?.case_type}
                                </i>

                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Main Case No :</b>&nbsp;
                                <i style={{ textAlign: "justify", color: 'black' }}>
                                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                        propsAtCaseDetailsView.viewdata.USERSLIST[0]?.maincaseno}
                                </i>

                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Hc Ack Number :</b>&nbsp;
                                <i style={{ textAlign: "justify", color: 'black' }}>
                                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                        propsAtCaseDetailsView.viewdata.USERSLIST[0]?.hc_ack_no}
                                </i>

                            </label>
                        </bst.Col>
                    </bst.Row>

                    <bst.Row>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Filing Mode :</b>&nbsp;
                                <i style={{ textAlign: "justify", color: 'black' }}>
                                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                        propsAtCaseDetailsView.viewdata.USERSLIST[0]?.mode_filing}
                                </i>

                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>District Name:</b>&nbsp;
                                <i style={{ textAlign: "justify", color: 'black' }}>
                                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                        propsAtCaseDetailsView.viewdata.USERSLIST[0]?.district_name}
                                </i>

                            </label>
                        </bst.Col>
                        <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                            <label className="w-100">
                                <b>Documents :</b>&nbsp;
                                <i style={{ textAlign: "justify", color: 'black' }}>
                                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                        propsAtCaseDetailsView.viewdata.USERSLIST[0]?.ack_file_path && <>
                                            <button type="button" class="btn btn-primary btn-sm rounded"
                                                onClick={() => { viewBucketImage(propsAtCaseDetailsView.viewdata.USERSLIST[0]?.ack_file_path) }} >
                                                Acknowledgement
                                            </button>&nbsp;
                                        </>}
                                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                        propsAtCaseDetailsView.viewdata.USERSLIST[0]?.barcode_file_path && <>
                                            <button type="button" class="btn btn-primary btn-sm rounded"
                                                onClick={() => { viewBucketImage(propsAtCaseDetailsView.viewdata.USERSLIST[0]?.barcode_file_path) }} >
                                                Barcode
                                            </button>
                                        </>}

                                </i>

                            </label>
                        </bst.Col>
                    </bst.Row>

                    <bst.Row>
                        <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                            <label className="w-100">
                                <b>Case Category :</b>&nbsp;
                                <i style={{ textAlign: "justify", color: 'black' }}>
                                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.USERSLIST) &&
                                        propsAtCaseDetailsView.viewdata.USERSLIST[0]?.case_category}
                                </i>

                            </label>
                        </bst.Col>
                    </bst.Row>


                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.Respodent) && <>
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
                                Respondents List
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>

                                                    <th>S.No</th>
                                                    <th>Department Name</th>

                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.Respodent) &&
                                                    propsAtCaseDetailsView.viewdata.Respodent.map((party, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{party?.description}</td>
                                                        </tr>
                                                    ))}
                                            </tbody>

                                        </table>
                                    </bst.Col>
                                </bst.Row>
                            </div>
                        </div>&nbsp;
                    </>}

                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.OtherRespodent) && <>
                        <div className="card">
                            <div style={{
                                backgroundColor: '#989b9c',
                                color: '#ffffff',
                                borderRadius: '10px',
                                boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                                display: 'inline-block',
                                width: '150px',
                                height: '60px',
                                marginTop: '20px',
                                marginLeft: '10px',
                                textAlign: 'center'
                            }}>
                                Other Respondents List
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>

                                                    <th>S.No</th>
                                                    <th>Respondents</th>

                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.OtherRespodent) &&
                                                    propsAtCaseDetailsView.viewdata.OtherRespodent.map((party, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{party?.other_selection_type}</td>
                                                        </tr>
                                                    ))}
                                            </tbody>

                                        </table>
                                    </bst.Col>
                                </bst.Row>
                            </div>
                        </div>
                    </>}

                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.ACTIVITIESDATA) && <>
                        <div className="card mt-4">
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
                        </div>
                    </>}
                </div>
            </div>
        </div >

    return (
        <>
            <bst.Modal show={propsAtCaseDetailsView?.popupflagvalue} onHide={handleCloseAtCaseDetails} className="modal-xl" backdrop="static">
                {propsAtCaseDetailsView?.viewdata?.USERSLIST?.length > 0 && (

                    <bst.Modal.Header className="bg-success bg-opacity-75 text-white" closeButton>
                        <bst.Modal.Title>View Case Details for ACK NO : {propsAtCaseDetailsView?.viewdata?.USERSLIST[0].ack_no} </bst.Modal.Title>
                    </bst.Modal.Header>
                )}
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
        </>
    )
}

export default AckDetailsPopup