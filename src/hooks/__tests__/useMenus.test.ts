
import { renderHook } from '@testing-library/react';
import { useMenus } from '../useMenus';
import { describe, it, expect } from 'vitest';

describe('useMenus', () => {
  it('should return menus data', async () => {
    const { result } = renderHook(() => useMenus({ location: 'header' }));
    expect(result.current.menus).toBeDefined();
  });

  it('should handle loading state', () => {
    const { result } = renderHook(() => useMenus({ location: 'header' }));
    expect(result.current.isLoading).toBeDefined();
  });

  it('should handle error state', () => {
    const { result } = renderHook(() => useMenus({ location: 'header' }));
    expect(result.current.error).toBeDefined();
  });
});
