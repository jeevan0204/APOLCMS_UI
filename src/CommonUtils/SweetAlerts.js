import Swal from "sweetalert2";
export const successAlert = () => {
    Swal.fire({
        text: "Submitted Successfully",
        icon: "success",
    }).then((refresh) => {

        if (refresh.isConfirmed) {
            window.location.reload(true)
        }
    })
};

export const failureAlert = (responseDesc) => {
    Swal.fire({
        text: responseDesc,
        icon: "error",
    })
};
export default async function Sweetalert(text, icon) {
    const isConfirm = await Swal.fire({ text: text, icon: icon, confirmButtonColor: '#3085d6', allowEnterKey: false, allowEscapeKey: false, allowOutsideClick: false, confirmButtonText: "Ok" });
    return isConfirm;

}
export function SweetalertOKFunction(text, icon) {
    const isConfirm = Swal.fire({ text: text, icon: icon, showCancelButton: false, confirmButtonColor: '#3085d6', allowEnterKey: false, allowEscapeKey: false, allowOutsideClick: false, cancelButtonColor: '#d33', confirmButtonText: 'OK' });
    return isConfirm;

}

export const InfoAlert = (data, icon) => {
    Swal.fire({
        text: data,
        icon: icon,
    })
};

export const successAlert2 = (responseDesc) => {
    Swal.fire({
        text: responseDesc,
        icon: "success",
        backdrop: false,
    }).then((refresh) => {
        if (refresh.isConfirmed) {
            window.location.reload(true)
        }
    })
};

