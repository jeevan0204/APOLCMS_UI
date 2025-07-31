import React from 'react';

import Sweetalert from "./CommonUtils/SweetAlerts"


const ProtectedRoute = ({ component: Component, allowedRoles, userRole, ...rest }) => {

  if (!allowedRoles?.some(value => userRole?.includes(value))) {
    return Sweetalert("UnAuthorised Access!.", "error").then(function () {
      localStorage.clear();
      window.location.href = "/LoginPage";
    });

  }
  return <Component />;
};

export default ProtectedRoute;
