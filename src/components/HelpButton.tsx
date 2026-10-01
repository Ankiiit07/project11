import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Bot } from 'lucide-react';
import ChatBot from './ChatBot';
import { analytics } from '../utils/analytics';

const WHATSAPP_NUMBER = '917979837079';
const WHATSAPP_MESSAGE = "Hi! I'm interested in Cafe at Once products.";

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/** One floating Help button: a small menu with WhatsApp and the quick-answers chat. */
const HelpButton: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const open = menuOpen || chatOpen;

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const toggle = () => {
    if (chatOpen) setChatOpen(false);
    else setMenuOpen((v) => !v);
  };

  return (
    <div ref={ref}>
      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      <div
        className="fixed right-4 sm:right-6 z-50 flex flex-col items-end gap-3"
        style={{ bottom: 'max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))' }}
      >
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="help-menu"
              role="menu"
              className="w-56 bg-white rounded-2xl shadow-2xl border border-border p-2"
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              style={{ transformOrigin: 'bottom right' }}
            >
              <a
                role="menuitem"
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  analytics.contact('whatsapp');
                }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary"
                data-testid="whatsapp-button"
              >
                <span className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-foreground">WhatsApp us</span>
                  <span className="block text-xs text-foreground/60">Talk to our team</span>
                </span>
              </a>
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setChatOpen(true);
                  analytics.contact('chatbot');
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary text-left"
                data-testid="chatbot-button"
              >
                <span className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-foreground">Quick answers</span>
                  <span className="block text-xs text-foreground/60">Shipping, usage, offers</span>
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggle}
          aria-label={open ? 'Close help' : 'Help'}
          aria-expanded={menuOpen}
          aria-controls="help-menu"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 flex items-center justify-center transition-transform active:scale-95"
          data-testid="help-button"
        >
          {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

export default HelpButton;
