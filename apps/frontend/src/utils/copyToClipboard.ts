import { toast } from 'react-toastify';

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  } catch (err) {
    toast.error('Failed to copy');
  }
};
