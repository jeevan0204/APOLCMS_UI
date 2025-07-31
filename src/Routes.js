
import React, { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import { PersistGate } from "redux-persist/integration/react";
import { ProSidebarProvider } from "react-pro-sidebar";
import { persister } from "./store";
import OutHeader from "./Components/OutHeader";
import Dashboard from "./Components/Dashboard";
import GPOAckForm from "./Components/NewCaseServices/GPOAckForm";
import HomePage from "./Components/Header/HomePage";
import HodWiseReport from "./Components/Reports/HodWiseReport";
import HCAbstractReport from "./Components/Reports/HCAbstractReport";
import SectionOfficerChange from "./Components/Services/SectionOfficerChange";
import ContemptCasesAbstractReport from "./Components/Reports/ContemptCasesAbstractReport";
import HCCaseDocsUploadAbstractReport from "./Components/Reports/HCCaseDocsUploadAbstractReport";
import HCOrdersIssuedReport from "./Components/Reports/HCOrdersIssuedReport";
import NextListingDtAbstractReport from "./Components/Reports/NextListingDtAbstractReport";
import ClosedCasesReport from "./Components/Reports/ClosedCasesReport";
import LegacyCaseAssignment from "./Components/LegacyCaseService/LegacyCaseAssignment";
import AssignedCasesToSection from "./Components/LegacyCaseService/AssignedCasesToSection";
import CaseStatusUpdation from "./Components/LegacyCaseService/CaseStatusUpdation";
import HCCaseDistWiseAbstractReport from "./Components/Reports/HCCaseDistWiseAbstractReport";
import PullBackLegacyCasesReport from "./Components/Reports/PullBackLegacyCasesReport";
import PullBackNewCasesReport from "./Components/ReportsNew/PullBackNewCasesReport";
import LegacyCaseDetailsPopup from "./Components/Popups/LegacyCaseDetailsPopup";
import DistrictNodalOfficerAbstactReport from "./Components/Reports/DistrictNodalOfficerAbstactReport";
// import './jnanabhumi.css';
import GPReportLegacyPWR from "./Components/LegacyCaseService/GPReportLegacyPWR";
import GPReportPWR from "./Components/Services/GPReportPWR";
import InstructionPopup from "./Components/Popups/InstructionPopup";
import GPReportNew from "./Components/Services/GPReportNewPWR";
import GPReportCounter from "./Components/Services/GPReportCounter";
import ShowAckDetails from "./Components/NewCaseServices/ShowAckDetails";
import BarcodeGenerationLegacy from "./Components/NewCaseServices/BarcodeGenerationLegacy";
import PPOAckForm from "./Components/NewCaseServices/PPOAckForm";
import PPBarcodeGenerationLegacy from "./Components/NewCaseServices/PPBarcodeGenerationLegacy";
import ShowAckDetailsPP from "./Components/NewCaseServices/ShowAckDetailsPP";
import NatureofPetition from "./Components/LegacyCaseService/NatureofPetition";
import AddAdvocate from "./Components/LegacyCaseService/AddAdvocate";
import AcksReport from "./Components/ReportsNew/AcksReport";
import PendingCaseReport from "./Components/ReportsNew/PendingCaseReport";
import DeleteCasesList from "./Components/ReportsNew/DeleteCasesList";
import ScannedAffidavitCountsReport from "./Components/ReportsNew/ScannedAffidavitCountsReport";
import AssignmentNewCases from "./Components/NewCaseServices/AssignmentNewCases";
import AssignedNewCases from "./Components/NewCaseServices/AssignedNewCases";
import AckDetailsPopup from "./Components/Popups/AckDetailsPopup";
import CaseStatusUpdationNew from "./Components/NewCaseServices/CaseStatusUpdationNew";
import GPReportNewPWR from "./Components/Services/GPReportNewPWR";
import EcourtsDeptInstructionNew from "./Components/Services/EcourtsDeptInstructionNew";
import Loader from "./CommonUtils/Loader";
import GPInstructions from "./Components/Services/GPInstructions";
import AcksAbstractReport from "./Components/ReportsNew/AcksAbstractReport";
import HCNewCasesAbstractReport from "./Components/Reports/HCNewCasesAbstractReport";
import EcourtsDeptInstructiontoPP from "./Components/Services/EcourtsDeptInstructiontoPP";
import EcourtsCaseMappingwithNewAckNo from "./Components/Services/EcourtsCaseMappingwithNewAckNo";
import HighCourtCasesCategoryUpdationReport from "./Components/LegacyCaseService/HighCourtCasesCategoryUpdationReport";
import HCFinalOrdersImplementedCaseStatusUpdate from "./Components/Services/HCFinalOrdersImplementedCaseStatusUpdate";
import CaseStatusUpdateFinalOrder from "./Components/Services/CaseStatusUpdateFinalOrder";
import InterimOrdersImplementedCaseStatusUpdate from "./Components/Services/InterimOrdersImplementedCaseStatusUpdate";
import CaseStatusUpdateInterim from "./Components/Services/CaseStatusUpdateInterim";
import HCFinalOrdersImplementedReport from "./Components/Reports/HCFinalOrdersImplementedReport";
import HCInterimOrdersImplementedReport from "./Components/Reports/HCInterimOrdersImplementedReport";
import EcourtsLeacyCaseMappedWithNewAckNoReport from "./Components/Reports/EcourtsLeacyCaseMappedWithNewAckNoReport";
import OfficersRegistered from "./Components/Reports/OfficersRegistered";
import EofficeEmployeeReport from "./Components/ReportsNew/EofficeEmployeeReport";
import SectionOfficerWiseCaseProcessingReport from "./Components/Reports/SectionOfficerWiseCaseProcessingReport";
import YearWisePendingCasesReport from "./Components/Reports/YearWisePendingCasesReport";
import StandingCounsel from "./Components/Services/StandingCounsel";
import RegisterNodal from "./Components/Services/RegisterNodal";
import RegisterMLO from "./Components/Services/RegisterMLO";
import InstructionsreplyCount from "./Components/Reports/InstructionsreplyCount";
import CaseAssignmentStatusReport from "./Components/Reports/CaseAssignmentStatusReport";
import DistrictWiseAssigmentCasesListReport from "./Components/Reports/DistrictWiseAssigmentCasesListReport";
import SectionOfficerWiseInstructionsReport from "./Components/Reports/SectionOfficerWiseInstructionsReport";
import EcourtsCaseSearch from "./Components/Services/EcourtsCaseSearch";
import HCCaseDocsUploadAbstractNewReport from "./Components/Reports/HCCaseDocsUploadAbstractNewReport";
import RegisterMLOSubject from "./Components/Services/RegisterMLOSubject";

// Lazy-loaded component
const SidebarForm = lazy(() => import("./Components/sidebarnew"));

const RoutesComponent = () => (
    <PersistGate loading={null} persistor={persister}>
        <ProSidebarProvider>
            <Router>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="*" element={<LoginPage />} />
                        <Route path="/MainHeader" element={<OutHeader />} />
                        <Route path="/Sidebar" element={<SidebarForm />} />
                        <Route path="/Dashboard" element={<SidebarForm><Dashboard /></SidebarForm>} />
                        <Route path="/GPOAcknowledgementForm" element={<SidebarForm><GPOAckForm /></SidebarForm>} />
                        <Route path="/ShowAckDetails" element={<SidebarForm><ShowAckDetails /></SidebarForm>} />

                        <Route path="/PPOAcknowledgementForm" element={<SidebarForm><PPOAckForm /></SidebarForm>} />
                        <Route path="/ShowAckDetailsPP" element={<SidebarForm><ShowAckDetailsPP /></SidebarForm>} />

                        <Route path="/SectionOfficerChange" element={<SidebarForm><SectionOfficerChange /></SidebarForm>} />
                        <Route path="/EcourtsDeptInstructionNew" element={<SidebarForm><EcourtsDeptInstructionNew /></SidebarForm>} />
                        <Route path="/EcourtsDeptInstructiontoPP" element={<SidebarForm><EcourtsDeptInstructiontoPP /></SidebarForm>} />

                        <Route path="/EcourtsCaseMappingwithNewAckNo" element={<SidebarForm><EcourtsCaseMappingwithNewAckNo /></SidebarForm>} />
                        {/* <Route path="/HighCourtCasesCategoryUpdationReport" element={<SidebarForm><HighCourtCasesCategoryUpdationReport /></SidebarForm>} /> */}
                        <Route path="/HCFinalOrdersImplementedCaseStatusUpdate" element={<SidebarForm><HCFinalOrdersImplementedCaseStatusUpdate /></SidebarForm>} />
                        <Route path="/CaseStatusUpdateFinalOrder" element={<SidebarForm><CaseStatusUpdateFinalOrder /></SidebarForm>}></Route>
                        <Route path="/HCFinalOrdersImplementedReport" element={<SidebarForm><HCFinalOrdersImplementedReport /></SidebarForm>}></Route>


                        <Route path="/InterimOrdersImplementedCaseStatusUpdate" element={<SidebarForm><InterimOrdersImplementedCaseStatusUpdate /></SidebarForm>} />
                        <Route path="/CaseStatusUpdateInterim" element={<SidebarForm><CaseStatusUpdateInterim /></SidebarForm>}></Route>
                        <Route path="/HCInterimOrdersImplementedReport" element={<SidebarForm><HCInterimOrdersImplementedReport /></SidebarForm>}></Route>


                        <Route path="/LegacyCaseAssignment" element={<SidebarForm><LegacyCaseAssignment /></SidebarForm>}></Route>
                        <Route path="/AssignedCasesToSection" element={<SidebarForm><AssignedCasesToSection /></SidebarForm>}></Route>
                        <Route path="/AssignmentNewCases" element={<SidebarForm><AssignmentNewCases /></SidebarForm>}></Route>
                        <Route path="/AssignedNewCases" element={<SidebarForm><AssignedNewCases /></SidebarForm>}></Route>
                        <Route path="/CaseStatusUpdation" element={<SidebarForm><CaseStatusUpdation /></SidebarForm>}></Route>
                        <Route path="/CaseStatusUpdationNew" element={<SidebarForm><CaseStatusUpdationNew /></SidebarForm>}></Route>

                        <Route path="/GPInstructions" element={<SidebarForm><GPInstructions /></SidebarForm>}></Route>


                        <Route path="/GPReportPWR" element={<SidebarForm><GPReportPWR /></SidebarForm>}></Route>
                        <Route path="/GPReportCounter" element={<SidebarForm><GPReportCounter /></SidebarForm>}></Route>


                        <Route path="/GPReportLegacyPWR" element={<SidebarForm><GPReportLegacyPWR /></SidebarForm>}></Route>
                        <Route path="/GPReportNewPWR" element={<SidebarForm><GPReportNewPWR /></SidebarForm>}></Route>
                        <Route path="/BarcodeGenerationLegacy" element={<SidebarForm><BarcodeGenerationLegacy /></SidebarForm>}></Route>
                        <Route path="/PPBarcodeGenerationLegacy" element={<SidebarForm><PPBarcodeGenerationLegacy /></SidebarForm>}></Route>



                        <Route path="/NatureofPetition" element={<SidebarForm><NatureofPetition /></SidebarForm>}></Route>
                        <Route path="/AddAdvocate" element={<SidebarForm><AddAdvocate /></SidebarForm>}></Route>

                        <Route path="/AcksReport" element={<SidebarForm><AcksReport /></SidebarForm>}></Route>
                        <Route path="/PendingCaseReport" element={<SidebarForm><PendingCaseReport /></SidebarForm>}></Route>
                        <Route path="/DeleteCasesList" element={<SidebarForm><DeleteCasesList /></SidebarForm>}></Route>
                        <Route path="/ScannedAffidavitCountsReport" element={<SidebarForm><ScannedAffidavitCountsReport /></SidebarForm>}></Route>


                        {/* legacy reports */}
                        <Route path="/HodWiseReport" element={<SidebarForm><HodWiseReport /></SidebarForm>}></Route>
                        <Route path="/HCAbstractReport" element={<SidebarForm><HCAbstractReport /></SidebarForm>}></Route>
                        <Route path="/ContemptCasesAbstractReport" element={<SidebarForm><ContemptCasesAbstractReport /></SidebarForm>}></Route>
                        <Route path="/HCCaseDocsUploadAbstractReport" element={<SidebarForm><HCCaseDocsUploadAbstractReport /></SidebarForm>}></Route>
                        <Route path="/HCOrdersIssuedReport" element={<SidebarForm><HCOrdersIssuedReport /></SidebarForm>}></Route>
                        <Route path="/NextListingDtAbstractReport" element={<SidebarForm><NextListingDtAbstractReport /></SidebarForm>}></Route>
                        <Route path="/ClosedCasesReport" element={<SidebarForm><ClosedCasesReport /></SidebarForm>}></Route>

                        <Route path="/HCCaseDistWiseAbstractReport" element={<SidebarForm><HCCaseDistWiseAbstractReport /></SidebarForm>}></Route>
                        <Route path="/PullBackLegacyCasesReport" element={<SidebarForm><PullBackLegacyCasesReport /></SidebarForm>}></Route>
                        <Route path="/PullBackNewCasesReport" element={<SidebarForm><PullBackNewCasesReport /></SidebarForm>}></Route>
                        <Route path="/DistrictNodalOfficerAbstactReport" element={<SidebarForm><DistrictNodalOfficerAbstactReport /></SidebarForm>}></Route>
                        <Route path="/OfficersRegistered" element={<SidebarForm><OfficersRegistered /></SidebarForm>}></Route>
                        <Route path="/EofficeEmployeeReport" element={<SidebarForm><EofficeEmployeeReport /></SidebarForm>}></Route>
                        <Route path="/SectionOfficerWiseCaseProcessingReport" element={<SidebarForm><SectionOfficerWiseCaseProcessingReport /></SidebarForm>}></Route>
                        <Route path="/YearWisePendingCasesReport" element={<SidebarForm><YearWisePendingCasesReport /></SidebarForm>}></Route>
                        <Route path="/SectionOfficerWiseInstructionsReport" element={<SidebarForm><SectionOfficerWiseInstructionsReport /></SidebarForm>}></Route>

                        <Route path="/StandingCounsel" element={<SidebarForm><StandingCounsel /></SidebarForm>}></Route>
                        <Route path="/RegisterNodal" element={<SidebarForm><RegisterNodal /></SidebarForm>}></Route>
                        <Route path="/RegisterMLO" element={<SidebarForm><RegisterMLO /></SidebarForm>}></Route>
                        <Route path="/RegisterMLOSubject" element={<SidebarForm><RegisterMLOSubject /></SidebarForm>}></Route>


                        <Route path="/EcourtsCaseSearch" element={<SidebarForm><EcourtsCaseSearch /></SidebarForm>}></Route>


                        <Route path="/InstructionsreplyCount" element={<SidebarForm><InstructionsreplyCount /></SidebarForm>}></Route>
                        <Route path="/CaseAssignmentStatusReport" element={<SidebarForm><CaseAssignmentStatusReport /></SidebarForm>}></Route>
                        <Route path="/DistrictWiseAssigmentCasesListReport" element={<SidebarForm><DistrictWiseAssigmentCasesListReport /></SidebarForm>}></Route>

                        <Route path="/EcourtsLeacyCaseMappedWithNewAckNoReport" element={<SidebarForm><EcourtsLeacyCaseMappedWithNewAckNoReport /></SidebarForm>}></Route>


                        {/* New Cases Reports */}

                        <Route path="/AcksAbstractReport" element={<SidebarForm><AcksAbstractReport /></SidebarForm>}></Route>
                        <Route path="/HCNewCasesAbstractReport" element={<SidebarForm><HCNewCasesAbstractReport /></SidebarForm>}></Route>
                        <Route path="/HCCaseDocsUploadAbstractNewReport" element={<SidebarForm><HCCaseDocsUploadAbstractNewReport /></SidebarForm>}></Route>

                        <Route path="/AckDetailsPopup" element={<AckDetailsPopup />}></Route>
                        <Route path="/LegacyCaseDetailsPopup" element={<LegacyCaseDetailsPopup />}></Route>
                        <Route path="/InstructionPopup" element={<InstructionPopup />}></Route>

                    </Routes>
                    <Loader />
                </Suspense>
            </Router>
        </ProSidebarProvider >
    </PersistGate >
);

export default RoutesComponent;

