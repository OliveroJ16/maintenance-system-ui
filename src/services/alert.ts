import Swal from 'sweetalert2';

// Generic success alert
export const showSuccessAlert = (title: string, text: string = ''): void => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    confirmButtonColor: '#3085d6',
  });
};
