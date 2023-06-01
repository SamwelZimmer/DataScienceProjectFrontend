import toast from 'react-hot-toast';

export const errorToast = (message) => {
    toast.error(message, {
        style: {
          border: '1px solid #A0420F',
          padding: '16px',
          color: '#A0420F',
        },
        iconTheme: {
          primary: '#A0420F',
          secondary: '#FFFFFF',
        },
    });
}

export const successToast = (message, time=2000) => {
    toast.success(message, {
        style: {
          border: '1px solid #234640',
          padding: '16px',
          color: '#234640',
        },
        iconTheme: {
          primary: '#234640',
          secondary: '#FFFFFF',
        },
        duration: time
    });
}

export const messageToast = (message, time=2000) => {
  toast(message, {
    style: {
      border: '1px solid #333333',
      padding: '16px',
      color: '#333333',
    },
    iconTheme: {
      primary: '#333333',
      secondary: '#FFFFFF',
    },
      duration: time,
    });
}