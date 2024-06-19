import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(
  Swal.mixin({
    confirmButtonColor: "#3f50b5",
    cancelButtonColor: "#a6aaab",
  })
);

MySwal.showLoader = ({ title = "", text = "" }) => {
  MySwal.fire({
    title,
    text,
    allowEscapeKey: false,
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      MySwal.showLoading();
    },
    willClose: () => {
      MySwal.hideLoading();
    },
  });
};

MySwal.showError = ({ title = "", text = "" }) => {
  MySwal.fire({
    title,
    text,
    icon: "error",
  });
};

MySwal.showSuccess = ({ title = "", text = "" }) => {
  MySwal.fire({
    title,
    text,
    icon: "success",
    allowEscapeKey: false,
    showConfirmButton: false,
    timer: 4000,
  });
};

MySwal.toast = ({ title = "" }) => {
  MySwal.fire({
    icon: "info",
    title,
    toast: true,
    position: "bottom",
    showConfirmButton: false,
    timer: 3000,
  });
};

export default MySwal;
