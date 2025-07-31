import axios from "axios";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { store } from "../store";
import { config } from "./CommonApis";



export const
    CommonAxiosGet = async (url, values) => {
        var token = Cookies.get("token");
        var refreshToken = Cookies.get("refreshToken");

        let data = '';
        if (token === undefined && refreshToken !== undefined) {
            return await Refreshmethod(url, values, "get")
        } else if (token !== undefined) {
            try {
                let ress = await axios({
                    url: url,
                    method: 'get',
                    headers: { Authorization: "Bearer " + token },
                });

                if (ress.status === 200) {
                    data = ress;

                }
                return data;
            } catch (err) {
                catchErrorMessages(err, url, values, "get")
            }
        } else if (refreshToken === undefined) {
            Swal.fire("Session Expired", "warning").then(function () {
                window.location.href = "/LoginPage";
            })

        }
    };


export const
    CommonAxiosGetPost = async (url, values) => {
        var token = Cookies.get("token");
        var refreshToken = Cookies.get("refreshToken");

        let data = '';
        if (token === undefined && refreshToken !== undefined) {
            return await Refreshmethod(url, values, "get")
        } else if (token !== undefined) {
            try {
                let ress = await axios({
                    url: url,
                    method: 'get',
                    headers: { Authorization: "Bearer " + token },
                    params: values,
                });

                if (ress.status === 200) {
                    data = ress;
                    console.log("data----:", data);
                }
                return data;
            } catch (err) {
                catchErrorMessages(err, url, values, "get")
            }
        } else if (refreshToken === undefined) {

            Swal.fire("Session Expired", "warning")

        }
    };


export const CommonAxiosPost = async (url, values) => {
    var token = Cookies.get("token");
    var refreshToken = Cookies.get("refreshToken");

    let data = '';
    if (token === undefined && refreshToken !== undefined) {
        return await Refreshmethod(url, values, "post")
    } else if (token !== undefined) {
        try {
            let res = await axios({
                url: url,
                method: "post",
                data: values,
                headers: { Authorization: "Bearer " + token },
            });
            if (res.status === 200) {
                data = res;
            }
            return data;
        } catch (err) {
            catchErrorMessages(err, url, values, "post")
        }
    } else if (refreshToken === undefined) {
        Swal.fire("Session Expired", "warning");
    }
};

export const CommonAxiosPut = async (url, values) => {
    var token = Cookies.get("token");
    var refreshToken = Cookies.get("refreshToken");

    let data = '';
    if (token === undefined && refreshToken !== undefined) {
        return await Refreshmethod(url, values, "put")
    } else if (token !== undefined) {
        try {
            let res = await axios({
                url: url,
                method: "put",
                data: values,
                headers: { Authorization: "Bearer " + token },
            });
            if (res.status === 200) {
                data = res;
            }
            return data;
        } catch (err) {
            catchErrorMessages(err, url, values, "put")
        }
    } else if (refreshToken === undefined) {

        Swal.fire("Session Expired", "warning")
    }
};

// export const CommonAjaxPostWithFileUpload = async (url, values) => {
//   let res = '';
//   var token = Cookies.get("token");
//   try {
//     res = await axios({
//       url: url,
//       method: 'post',
//       async: false,
//       contentType: false,
//       processData: false,
//       data: values,
//       headers: { Authorization: "Bearer " + token },
//     })
//     if (res.status === 200) {
//     }
//     return res
//   }
//   catch (err) {
//     catchErrorMessages(err)
//   }
// };
export const CommonAxiosPostLogin = async (url, values) => {
    let data = "";
    try {
        let res = await axios({
            url: url,
            method: "post",
            data: values,
            //headers: { Authorization: "Bearer " + token },
        });
        if (res.status === 200) {
            data = res;
        }
        return data;
    } catch (err) {
        if (err.response && err.response.status === 401) {
            data = err.response;
        }
        return data;
    }
};
export const CommonAxiosDelete = async (url, values) => {
    var token = Cookies.get("token");
    var refreshToken = Cookies.get("refreshToken");

    let data = '';
    if (token === undefined && refreshToken !== undefined) {
        return await Refreshmethod(url, values, "delete")
    } else if (token !== undefined) {
        try {
            let res = await axios({
                url: url,
                method: "delete",
                data: values,
                headers: { Authorization: "Bearer " + token },
            });
            if (res.status === 200) {
                data = res;
            }
            return data;
        } catch (err) {
            catchErrorMessages(err, url, values, "delete")
        }
    } else if (refreshToken === undefined) {
        Swal.fire("Session Expired", "warning")
    }
};



//--------------Refresh Token ------------------------------
export const Refreshmethod = async (url, values, method) => {
    const { dispatch } = store;
    var refreshToken = Cookies.get("refreshToken");
    var requestData = {
        "refreshToken": refreshToken
    };

    try {
        let URL = config.url.COMMONSERVICE_URL + "auth/refresh-token";
        const res2 = await axios.post(URL, requestData)
        if (res2.data.responseCode === "01") {

            var decodedToken = jwtDecode(res2?.data?.token);
            var accessTokenTime = new Date(decodedToken.exp * 1000);

            var decoded_refresh = jwtDecode(res2.data.refreshtoken);
            var rfTokenTime = new Date(decoded_refresh.exp * 1000);

            Cookies.set("token", res2.data.token, { expires: accessTokenTime });
            Cookies.set("tokenTime", res2.data.jwtExpirationMs, { expires: accessTokenTime });

            Cookies.set("refreshToken", res2.data.refreshtoken, { expires: rfTokenTime });
            Cookies.set("refreshTokenTime", res2.data.jwtRefreshExpirationMs, { expires: rfTokenTime });

            if (method === "get") {
                return CommonAxiosGet(url)
            } else if (method === "post") {
                return CommonAxiosPost(url, values)
            } else if (method === "put") {
                return CommonAxiosPut(url, values)
            } else if (method === "delete") {
                return CommonAxiosDelete(url, values)
            }
        } else {
            dispatch({ type: "USER_LOGOUT" });
            dispatch({ type: "LOGIN_DETAILS", payload: {} });
            dispatch({ type: 'HIDE_LOADING_SPINNER' });
            dispatch({ type: "SHOW_DISTRICTS", payload: [] });
            Cookies.remove("token");
            Cookies.remove("tokenTime");
            Cookies.remove("refreshToken");
            Cookies.remove("refreshTokenTime");
            window.localStorage.clear();
            Swal.fire("Session Expired", "warning");
        }
    } catch (error) {
        console.log("exception::::", error);
    }
}

//----------------------------------------------------------
export const catchErrorMessages = async (err, url, values, method) => {
    if (err.response.status === 401) {
        return await Refreshmethod(url, values, method);
    } else if (err.response.status === 500) {
        Swal.fire("Internal Server Error,Try After Sometime", "warning");
    } else if (err.response.status === 404) {
        Swal.fire("Page Not Found", "warning");
    }
}
