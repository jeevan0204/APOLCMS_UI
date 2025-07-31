
import { TbArrowsExchange } from 'react-icons/tb';
import { MdFormatListBulletedAdd } from 'react-icons/md';

import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from 'react-pro-sidebar';

import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import Header from './Header/Header';
import { IoHome } from 'react-icons/io5';
import { useEffect, useState } from 'react';



function SidebarForm({ children }) {
  const { collapseSidebar } = useProSidebar();
  const logindetails = useSelector((state) => state.reducers.loginreducer);

  const [data, setdata] = useState([]);

  useEffect(() => {
    if (logindetails?.userLoginDetials?.role) {
      setdata(JSON.stringify(logindetails?.userLoginDetials.role));
    }
  }, [logindetails]);

  return (
    <>
      <div className='bg-white' style={{ display: 'flex' }}>
        <Sidebar defaultCollapsed={true}>
          <Menu style={{ textAlign: 'left', fontSize: '13px' }}>
            <button variant="dark" onClick={() => collapseSidebar()} style={{ width: '100%' }} >
              <main> <p style={{ fontWeight: '600', opacity: '0.7', letterSpacing: '0.5px', fontSize: '12px', margin: '0px auto', padding: '10px' }}>
                <TbArrowsExchange style={{ fontSize: "22px", Color: '#ffffff' }} />
              </p></main></button>

            {data ? (<>
              <SubMenu
                label={
                  <Link to="/Dashboard" style={{ textDecoration: "none", color: "inherit" }}>
                    Home
                  </Link>
                }
                icon={<IoHome style={{ fontSize: "22px" }} />}
              />
            </>) : null}


            <SubMenu label="Services " icon={<MdFormatListBulletedAdd style={{ fontSize: "22px" }} />} >

              {data && data === "13" ? (<>
                {/* {services.map((<>
                  <MenuItem component={<Link to="/GPOAcknowledgementForm" />}>{service_name}</MenuItem>
                </>))} */}
                <MenuItem component={<Link to="/GPOAcknowledgementForm" />}>Generate Acknowledgement</MenuItem>
                <MenuItem component={<Link to="/BarcodeGenerationLegacy" />}>Generate Barcode for Existing Case</MenuItem>
                <MenuItem component={<Link to="/NatureofPetition" />}>Nature Petition Master (Case Type)</MenuItem>
                <MenuItem component={<Link to="/AddAdvocate" />}>Add Advocate Master</MenuItem>
              </>) : null}

              {data && data === "26" ? (<>

                <MenuItem component={<Link to="/PPOAcknowledgementForm" />}>Generate Acknowledgement</MenuItem>
                <MenuItem component={<Link to="/PPBarcodeGenerationLegacy" />}>Generate Barcode for Existing Case</MenuItem>
              </>) : null}

              {data && (data === "5" || data === "4" || data === "10") ? (<>
                <MenuItem component={<Link to="/SectionOfficerChange" />}>SectionOfficer Change Request</MenuItem>
              </>) : null}

              {data ? (<>
                <MenuItem component={<Link to="/EcourtsDeptInstructionNew" />}> Instructions to GP</MenuItem>
                <MenuItem component={<Link to="/EcourtsDeptInstructiontoPP" />}> Instructions to PP</MenuItem>
                <MenuItem component={<Link to="/EcourtsCaseSearch" />}>Search Case Details</MenuItem>


              </>) : null}

              {data && (data === "5" || data === "4" || data === "10" || data === "2") ? (<>
                <MenuItem component={<Link to="/LegacyCaseAssignment" />}>Legacy Cases Assignment</MenuItem>
                <MenuItem component={<Link to="/EcourtsCaseMappingwithNewAckNo" />}> High Court Legacy-New Cases Mapping</MenuItem>


              </>) : null}

              {data && (data === "3" || data === "4" || data === "5" || data === "8" || data === "9" || data === "10" || data === "11" || data === "12") ? (<>

                <MenuItem component={<Link to="/AssignedCasesToSection" />}>Assigned Cases</MenuItem>
                <MenuItem component={<Link to="/AssignedNewCases" />}>Assigned New Cases</MenuItem>

                <MenuItem component={<Link to="/AssignmentNewCases" />}> New Cases Assignment</MenuItem>


              </>) : null}

              {data && (data === "6" || data === "29") ? (<>
                <MenuItem component={<Link to="/GPReportPWR" />}>Approve Parawise Remarks</MenuItem>
                <MenuItem component={<Link to="/GPReportCounter" />}>Approve Counter File</MenuItem>
                <MenuItem component={<Link to="/GPInstructions" />}>Instructions Received</MenuItem>


              </>) : null}

              {/* {data && (data === "1" || data === "3" || data === "4" || data === "5" || data === "9") ? (<>
                <MenuItem component={<Link to="/HighCourtCasesCategoryUpdationReport" />}> Case Category Updation (Finance)</MenuItem>
              </>) : null} */}

              {data && (data === "5" || data === "9" || data === "10") ? (<>
                <MenuItem component={<Link to="/HCFinalOrdersImplementedCaseStatusUpdate" />}> Final Orders implementation</MenuItem>
                <MenuItem component={<Link to="/InterimOrdersImplementedCaseStatusUpdate" />}> Interim Orders implementation</MenuItem>
              </>) : null}

              {data && data === "9" ? (<>
                <MenuItem component={<Link to="/StandingCounsel" />}> Standing Counsel</MenuItem>
              </>) : null}

              {data && data === "3" ? (<>
                <MenuItem component={<Link to="/RegisterMLO" />}> MID Level Officer(Legal)</MenuItem>
                <MenuItem component={<Link to="/RegisterMLOSubject" />}> MID Level Officer(Subject)</MenuItem>
              </>) : null}

              {data === "2" || data === "3" || data === "9" ? (<>
                <MenuItem component={<Link to="/RegisterNodal" />}> Nodal Officer(Legal)</MenuItem>
              </>) : null}

            </SubMenu>




            <SubMenu label="Reports " icon={<MdFormatListBulletedAdd style={{ fontSize: "22px" }} />} >

              {data ? (<>
                <MenuItem component={<Link to="/HodWiseReport" />}>HodWiseReport</MenuItem>

                <MenuItem component={<Link to="/HCAbstractReport" />}>Cases Abstract Report(Legacy)</MenuItem>
                <MenuItem component={<Link to="/ContemptCasesAbstractReport" />}>Contempt Cases Abstract Report</MenuItem>
                <MenuItem component={<Link to="/HCCaseDocsUploadAbstractReport" />}>Case Processing Status Report(Legacy)</MenuItem>
                <MenuItem component={<Link to="/HCCaseDocsUploadAbstractNewReport" />}>New Case Processing Status Report</MenuItem>

                <MenuItem component={<Link to="/HCOrdersIssuedReport" />}>HC Orders Issued Report</MenuItem>
                <MenuItem component={<Link to="/NextListingDtAbstractReport" />}>Upcoming Hearing Cases Report</MenuItem>
                <MenuItem component={<Link to="/ClosedCasesReport" />}>Closed Cases Report</MenuItem>


                <MenuItem component={<Link to="/HCFinalOrdersImplementedReport" />}>Final Orders Implementation Report</MenuItem>
                <MenuItem component={<Link to="/HCInterimOrdersImplementedReport" />}>Interim Orders Implementation Report</MenuItem>

                < MenuItem component={<Link to="/SectionOfficerWiseCaseProcessingReport" />}>Section Officer Wise Case Processing Report</MenuItem>
                < MenuItem component={<Link to="/SectionOfficerWiseInstructionsReport" />}>Section Officer Wise Instructions Report</MenuItem>
                < MenuItem component={<Link to="/DistrictWiseAssigmentCasesListReport" />}>District Wise Assigment Cases Report</MenuItem>


                {/* New cases reports */}
                <MenuItem component={<Link to="/AcksAbstractReport" />}>New Cases Abstract Report</MenuItem>
                <MenuItem component={<Link to="/HCNewCasesAbstractReport" />}>Cases Abstract Report(New)</MenuItem>
                < MenuItem component={<Link to="/EcourtsLeacyCaseMappedWithNewAckNoReport" />}>Report-Mapping of Legacy Cases & New Cases</MenuItem>
              </>) : null}

              {data && data === "5" || data === "9" ? (<>

                <MenuItem component={<Link to="/HodWiseReport" />}>HodWiseReport</MenuItem>
                <MenuItem component={<Link to="/HCAbstractReport" />}>Cases Abstract Report(Legacy)</MenuItem>
                <MenuItem component={<Link to="/ContemptCasesAbstractReport" />}>Contempt Cases Abstract Report</MenuItem>
                <MenuItem component={<Link to="/HCCaseDistWiseAbstractReport" />}>District Wise Final Order Implementation Report</MenuItem>
                <MenuItem component={<Link to="/YearWisePendingCasesReport" />}> Year Wise Pending Cases Report</MenuItem>

              </>) : null}

              {data === "7" || data === "3" ? (<>
                <MenuItem component={<Link to="/InstructionsreplyCount" />}>Instructions Reply Count Report</MenuItem>
                <MenuItem component={<Link to="/CaseAssignmentStatusReport" />}>Cases Assignment Status Report</MenuItem>
              </>) : null}

              {data === "2" && data === "4" && data === "5" && data === "10" && data === "12" ? (<>
                < MenuItem component={<Link to="/EcourtsLeacyCaseMappedWithNewAckNoReport" />}>Report-Mapping of Legacy Cases & New Cases</MenuItem>
              </>) : null}
            </SubMenu>

            <SubMenu label="Employee Reports " icon={<MdFormatListBulletedAdd style={{ fontSize: "22px" }} />} >
              {
                data ? (<>
                  <MenuItem component={<Link to="/OfficersRegistered" />}>Officers Registered</MenuItem>

                </>) : null
              }
              {data && data === "5" ? (<>

                <MenuItem component={<Link to="/PullBackLegacyCasesReport" />}>Pull Back Assigned Cases(Legacy) Report</MenuItem>
                <MenuItem component={<Link to="/PullBackNewCasesReport" />}>Pull Back Assigned Cases(New) Report</MenuItem>
              </>) : null}


              {data && (data === "3" || data === "4" || data === "5" || data === "2" || data === "7" || data === "9" || data === "17") ? (<>

                <MenuItem component={<Link to="/DistrictNodalOfficerAbstactReport" />}>District Nodal Officer Abstact Report</MenuItem>
              </>) : null}
            </SubMenu>

            {data && data === "13" || data === "14" ? (<>
              <MenuItem component={<Link to="/AcksReport" />}>New Cases Report</MenuItem>
              <MenuItem component={<Link to="/PendingCaseReport" />}>Total Pending Cases Report</MenuItem>
              <MenuItem component={<Link to="/DeleteCasesList" />}>Delete Cases List Report</MenuItem>


            </>) : null}

            {data && data === "14" ? (<>

              <MenuItem component={<Link to="/ScannedAffidavitCountsReport" />}>Scan Document Affidavit Count</MenuItem>

            </>) : null}

          </Menu>

        </Sidebar >

        <Container fluid className='content-container  px-0' >
          <Header />
          <div className='p-4 ' style={{ height: '80vh' }}>{children}</div>
        </Container>
      </div >
    </>
  );
}

export default SidebarForm;