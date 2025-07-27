import { renderHook, act } from '@testing-library/react';
import useModal from '../useModal';

describe('useModal Hook', () => {
  it('should initialize with default closed state', () => {
    const { result } = renderHook(() => useModal());
    
    expect(result.current.isOpen).toBe(false);
    expect(typeof result.current.openModal).toBe('function');
    expect(typeof result.current.closeModal).toBe('function');
    expect(typeof result.current.toggleModal).toBe('function');
  });

  it('should initialize with custom initial state', () => {
    const { result } = renderHook(() => useModal(true));
    
    expect(result.current.isOpen).toBe(true);
  });

  it('should open modal when openModal is called', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.openModal();
    });
    
    expect(result.current.isOpen).toBe(true);
  });

  it('should close modal when closeModal is called', () => {
    const { result } = renderHook(() => useModal(true));
    
    act(() => {
      result.current.closeModal();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle modal state when toggleModal is called', () => {
    const { result } = renderHook(() => useModal());
    
    // Initially closed, toggle to open
    act(() => {
      result.current.toggleModal();
    });
    expect(result.current.isOpen).toBe(true);
    
    // Now open, toggle to closed
    act(() => {
      result.current.toggleModal();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should maintain stable function references', () => {
    const { result, rerender } = renderHook(() => useModal());
    
    const initialOpenModal = result.current.openModal;
    const initialCloseModal = result.current.closeModal;
    const initialToggleModal = result.current.toggleModal;
    
    rerender();
    
    expect(result.current.openModal).toBe(initialOpenModal);
    expect(result.current.closeModal).toBe(initialCloseModal);
    expect(result.current.toggleModal).toBe(initialToggleModal);
  });
}); 