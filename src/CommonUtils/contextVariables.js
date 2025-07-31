export const ERROR_MSG = " Required";
export const CONTEXT_NAME = "Jnb-Nivas";

export const IFSC_VALIDATION = /^[A-Z]{4}0[A-Z 0-9]{6}$/;
export const AADHAR_VALIDATION = /^[1-9]{1}[0-9]{11}$/
export const MOBILE_VALIDATION = /^[6-9]{1}[0-9]{9}$/;
export const PAN_VALIDATION = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const PINCODE = /^[1-9]{1}[0-9]{5}$/;
export const NUMERIC = /^\d+$/;
export const ALPHABETS_ONLY = /^[aA-zZ\s]+$/;
export const ALPHABETS_SPACE_ONLY = /^[A-Za-z\s]+$/;
export const STARTS_WITH_NO_WHITESPACE = /^(?!\s+$).*/;
export const PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const EMAIL_VALIDATION = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const RC_VALIDATION = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
export const GSTNUMBER = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const DOORNUMBER = /^[1-9]\d*(?:\s*[-/]\s*\d+)*(?:\s*[a-zA-Z]?)?$/;
export const ACADEMICYEAR = '2025-26';

// AadharAlgorithm.js
export const validateAadhaar = (aadhaar) => {
    var d = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
        [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
        [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
        [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
        [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
        [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
        [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
        [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    ];

    var p = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
    ];

    function invArray(array) {
        if (Object.prototype.toString.call(array) == "[object Number]") {
            array = String(array);
        }
        if (Object.prototype.toString.call(array) == "[object String]") {
            array = array.split("").map(Number);
        }
        return array.reverse();
    }

    function validate(array) {
        if (array !== undefined) {
            var c = 0;
            var invertedArray = invArray(array);
            for (var i = 0; i < invertedArray.length; i++) {
                c = d[c][p[i % 8][invertedArray[i]]];
            }
        }
        return c === 0;
    }

    return validate(aadhaar);
};

export const validatePAN = (pan) => {
    // PAN should follow this pattern: 5 letters, 4 digits, 1 letter
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panPattern.test(pan)) {
        return false; // Invalid PAN format
    }
    // Check the 4th character (type of PAN holder)
    const validHolderTypes = ['A', 'B', 'C', 'F', 'G', 'H', 'J', 'L', 'P', 'T'];
    if (!validHolderTypes.includes(pan.charAt(3))) {
        return false; // Invalid holder type
    }
    // If all checks pass, PAN is valid
    return true;
};