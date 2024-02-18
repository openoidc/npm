import type {AuthConfig} from '@auth/core/types';
import GitHub from '@auth/express/providers/github';
export const authConfig: Omit<AuthConfig, 'raw'> = {
  providers: [GitHub],
};
