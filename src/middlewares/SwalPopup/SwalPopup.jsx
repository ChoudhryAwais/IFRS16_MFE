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