import type { ToastContainerProps } from 'react-toastify';
import { Bounce } from 'react-toastify';

const toastifyConfig: ToastContainerProps = {
  position: 'bottom-left',
  autoClose: 50000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: false,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  transition: Bounce,
};

export default toastifyConfig;
