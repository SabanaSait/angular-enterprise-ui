import { RoleLabelPipe } from './role-label.pipe';
import { ROLE_OPTIONS } from '../../core/auth/auth.constants';
import { Role } from '../../core/auth/auth.types';

describe('RoleLabelPipe', () => {
  let pipe: RoleLabelPipe;

  beforeEach(() => {
    pipe = new RoleLabelPipe();
  });

  it('should return mapped label for known role', () => {
    const role = ROLE_OPTIONS[0].value as Role;

    const result = pipe.transform(role);

    expect(result).toBe(ROLE_OPTIONS[0].label);
  });

  it('should return role value when role is unknown', () => {
    const unknownRole = 'UNKNOWN_ROLE' as Role;

    const result = pipe.transform(unknownRole);

    expect(result).toBe('UNKNOWN_ROLE');
  });

  it('should return "-" when role is null', () => {
    expect(pipe.transform(null)).toBe('-');
  });

  it('should return "-" when role is undefined', () => {
    expect(pipe.transform(undefined)).toBe('-');
  });
});
