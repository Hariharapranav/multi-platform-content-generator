import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
}

export default function CopyButton({ text, className = '', label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`btn-ghost text-xs ${className}`}
      title={`Copy ${label}`}
    >
      {copied ? (
        <>
          <Check size={13} className="text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={13} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
