import React from 'react';
import Icon from './Icon';

type Props = {
  onSuggestRole: () => void;
  onFillDemo: (role?: string) => void;
  onSuggestForRole?: (role: string) => void;
};

export default function AIHelper({ onSuggestRole, onFillDemo }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="absolute right-4 bottom-4 z-50">
      <div className="relative">
        {open && (
          <div className="mb-3 w-64 bg-white rounded-lg shadow-lg p-3 text-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon name="Zap" className="h-5 w-5 text-green-600" />
                <div className="font-semibold">AI Assistant</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-xs text-gray-500">
                Close
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onSuggestRole();
                  setOpen(false);
                }}
                className="w-full text-left px-2 py-1 rounded hover:bg-gray-50"
              >
                Suggest role for me
              </button>
              <button
                onClick={() => {
                  onFillDemo();
                  setOpen(false);
                }}
                className="w-full text-left px-2 py-1 rounded hover:bg-gray-50"
              >
                Fill demo data
              </button>
              <div className="text-xs text-gray-400">
                Tip: the assistant can pre-fill the form or recommend a role.
              </div>
            </div>
          </div>
        )}

        <button
          aria-label="AI assistant"
          title="AI assistant"
          onClick={() => setOpen((o) => !o)}
          className="h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center shadow-lg"
        >
          <Icon name="Zap" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
