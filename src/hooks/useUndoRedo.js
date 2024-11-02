import { useState, useCallback } from 'react';

export const useUndoRedo = (initialPresent) => {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(initialPresent);
  const [future, setFuture] = useState([]);

  const undo = useCallback(() => {
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setPast(newPast);
    setPresent(previous);
    setFuture([present, ...future]);
  }, [past, present, future]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setPast([...past, present]);
    setPresent(next);
    setFuture(newFuture);
  }, [past, present, future]);

  const set = useCallback((newPresent) => {
    setPast([...past, present]);
    setPresent(newPresent);
    setFuture([]);
  }, [past, present]);

  return [present, set, undo, redo, { past, future }];
}; 