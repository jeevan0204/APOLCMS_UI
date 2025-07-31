import Swal from "sweetalert2";
import { config } from "./CommonApis";
import { CommonAxiosPostLogin } from "./CommonAxios";
import { InfoAlert } from "./SweetAlerts";

const SUPPORTED_FORMATS = ['image/jpeg']; // Correct MIME type
const MAX_FILE_SIZE = 1000000; // 1MB

function validateFileTypeAndSize(customefile) {
    let errormsg = "";

    if (customefile?.size > MAX_FILE_SIZE) {
        errormsg += "Please check your file size, it should be less than 1MB.\n";
    }
    if (!SUPPORTED_FORMATS.includes(customefile?.type)) {
        errormsg += "File format is invalid. Please upload only .jpg files.";
    }

    if (errormsg === "") {
        return true;
    } else {
        InfoAlert(errormsg, "info");
        return false;
    }
}

// AWS bucket
export default function ImageBucket(e, formIk, path, name, filename) {
    e.preventDefault();
    const file = e.target.files[0]; // Original file

    if (!file) {
        InfoAlert("No file selected. Please choose a file.", "info");
        return;
    }

    const type = file.type.split("/")[1]; // File type (e.g., "jpeg")
    const newFileName = `${filename}.${type}`; // New file name
    const modifiedFile = new File([file], newFileName, { type: file.type });

    if (validateFileTypeAndSize(file)) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", modifiedFile);

            CommonAxiosPostLogin(`${config.url.FILE_UPLOAD_URL}${path}`, formData)
                .then((response) => {
                    if (response?.data) {
                        formIk.setFieldValue(name, response.data);
                        resolve(response.data);
                    } else {
                        Swal.fire({
                            text: "Image upload failed.",
                            icon: "warning",
                            backdrop: true,
                            allowOutsideClick: false,
                        }).then((refresh) => {
                            if (refresh.isConfirmed) {
                                formIk.setFieldValue(name, "");
                            }
                        });
                        resolve(null);
                    }
                })
                .catch((error) => {
                    console.error("Upload Error:", error);
                    InfoAlert("Image upload failed. Please try again.", "error");
                    resolve(null);
                });
        });
    } else {
        e.target.value = ''; // Reset file input
    }
}


// export default function ImagesBase64(e, formIk, name, hiddenValue) {
//     e.preventDefault();
//     let fileValue = validateFileTypeAndSize(e.target.files[0]);
//     if (fileValue) {
//         const filevalue = e.target.value;
//         const file = e.target.files[0];
//         formIk.setFieldValue(name, filevalue);
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = (event) => {
//                 formIk.setFieldValue(hiddenValue, event.target.result);
//             };
//             reader.onerror = (err) => {
//                 reject(err);
//             };
//             reader.readAsDataURL(file);
//         });
//     }     else {
//         e.target.value = '';
//         formIk.setFieldValue(name, '');
//         formIk.setFieldValue(hiddenValue, '');
//     }
// }