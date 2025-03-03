import Swal from 'sweetalert2';
export const SwalPopup = (title, text, type, callback = false) => {
    if (typeof callback === 'function') {
        Swal.fire({
            title,
            text,
            icon: type
        }).then(callback);
    } else {
        Swal.fire({
            title,
            text,
            icon: type
        })
    }
}
export const ConfirmationSwalPopup = (title, text, type, confirmButtonText, confirmationCallBack) => {
    Swal.fire({
        title: title,
        text: text,
        icon: type,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: confirmButtonText,
    }).then((result) => {
        if (result.isConfirmed) {
            confirmationCallBack()
        }
    });
}