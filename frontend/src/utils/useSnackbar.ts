import { useState, useCallback } from 'react';

export type SnackbarStatus = 'success' | 'error' | 'info' | 'warning';

interface SnackbarOptions {
  title?: string;
  description: string;
  status?: SnackbarStatus;
  duration?: number;
}

interface SnackbarState {
  visible: boolean;
  message: string;
  status: SnackbarStatus;
  duration: number;
}

const initialState: SnackbarState = {
  visible: false,
  message: '',
  status: 'info',
  duration: 3000,
};

/**
 * Minimal drop-in replacement for Chakra's useToast, backed by
 * React Native Paper's Snackbar. Call show(...) to display a message,
 * spread `snackbarProps` onto a single <Snackbar> rendered near the
 * root of the screen.
 */
export const useSnackbar = () => {
  const [state, setState] = useState<SnackbarState>(initialState);

  const show = useCallback((options: SnackbarOptions) => {
    const message = options.title
      ? `${options.title}: ${options.description}`
      : options.description;
    setState({
      visible: true,
      message,
      status: options.status || 'info',
      duration: options.duration ?? 3000,
    });
  }, []);

  const dismiss = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  return {
    show,
    dismiss,
    snackbarProps: {
      visible: state.visible,
      onDismiss: dismiss,
      duration: state.duration,
    },
    message: state.message,
    status: state.status,
  };
};
