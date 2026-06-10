import Swal from 'sweetalert2';

// // Generic success alert
export const showSuccessAlert = (title: string, text: string = ''): void => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    confirmButtonColor: '#3085d6',
  });
};

// Generic error alert
export const showErrorAlert = (title: string, text: string = 'Ocurrió un error inesperado'): void => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonColor: '#d33',
  });
};

// Generic confirmation alert for deletions or other destructive actions
export const showConfirmDeleteAlert = (
  title: string = '¿Estás seguro?', 
  text: string = 'Esta acción no se puede deshacer'
) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
};