import React from 'react';
import AIChat from './AIChat';
import Icon from './Icon';

type AIChatLauncherProps = {
  initialContext?: string;
  positionClassName?: string;
};

const AIChatLauncher: React.FC<AIChatLauncherProps> = ({
  initialContext = '',
  positionClassName = 'fixed bottom-6 right-6 z-40',
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={positionClassName}>
      {open && (
        <div className="mb-3">
          <AIChat initialContext={initialContext} onClose={() => setOpen(false)} />
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-lime-400 shadow-lg flex items-center justify-center border border-white text-white hover:scale-105 active:scale-95 transition-transform duration-150"
        aria-label={open ? 'Hide AI assistant' : 'Open AI assistant'}
      >
        <Icon name="Sparkles" className="h-6 w-6" />
      </button>
    </div>
  );
};

export default AIChatLauncher;
