import type { ToastContainerProps } from 'react-toastify';
import { Bounce } from 'react-toastify';

const toastifyConfig: ToastContainerProps = {
  position: 'bottom-left',
  autoClose: 5000,
  closeButton: true,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: false,
  rtl: false,
  draggable: true,
  transition: Bounce,
};

export default toastifyConfig;
