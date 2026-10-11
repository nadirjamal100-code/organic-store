import { useState } from 'react';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Front-end-only email validation. There is no backend: a valid address
 * only produces a confirmation message (see README).
 */
export default function useEmailForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const onChange = (e) => {
    setEmail(e.target.value);
    if (status.type !== 'idle') setStatus({ type: 'idle', message: '' });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return setStatus({ type: 'error', message: 'Please enter your email address.' });
    if (!EMAIL.test(email.trim())) return setStatus({ type: 'error', message: 'Please enter a valid email address.' });
    setStatus({ type: 'success', message: 'Thanks for subscribing! (demo — no email was sent)' });
    return setEmail('');
  };

  return { email, status, onChange, onSubmit };
}
