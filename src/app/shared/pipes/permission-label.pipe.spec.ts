import { PermissionLabelPipe } from './permission-label.pipe';
import { PERMISSIONS_META } from '../../core/auth/auth.constants';
import { Permission } from '../../core/auth/auth.types';

describe('PermissionLabelPipe', () => {
  let pipe: PermissionLabelPipe;

  beforeEach(() => {
    pipe = new PermissionLabelPipe();
  });

  it('should return mapped label when permission exists in metadata', () => {
    const permission = Object.keys(PERMISSIONS_META)[0] as Permission;

    const result = pipe.transform(permission);

    expect(result).toBe(PERMISSIONS_META[permission].label);
  });

  it('should return permission value when no metadata exists', () => {
    const unknownPermission = 'UNKNOWN_PERMISSION' as Permission;

    const result = pipe.transform(unknownPermission);

    expect(result).toBe('UNKNOWN_PERMISSION');
  });

  it('should handle undefined metadata safely', () => {
    const permission = '' as Permission;

    const result = pipe.transform(permission);

    expect(result).toBe('');
  });
});
