import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DemoStartModal from './DemoStartModal';
import { useDemoModal } from '../contexts/DemoModalContext';

/**
 * Mounts `DemoStartModal` once at the app root and drives it from
 * `DemoModalContext`, so every `شاهد الديمو` button on the site opens the
 * same instance.
 *
 * Also preserves the existing `?demo=1` deep link, which used to be handled
 * inside `Hero`. The parameter is consumed on arrival so a refresh does not
 * reopen the modal.
 */
const GlobalDemoModal: React.FC = () => {
  const { isOpen, open, close } = useDemoModal();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('demo') !== '1') return;
    open();
    const next = new URLSearchParams(searchParams);
    next.delete('demo');
    setSearchParams(next, { replace: true });
  }, [searchParams, open, setSearchParams]);

  return <DemoStartModal isOpen={isOpen} onClose={close} />;
};

export default GlobalDemoModal;
