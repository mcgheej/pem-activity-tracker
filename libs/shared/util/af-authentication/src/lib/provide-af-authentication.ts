import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AfAuthenticationService } from './af-authentication.service';

export function provideAfAuthentication(): EnvironmentProviders {
  return makeEnvironmentProviders([AfAuthenticationService]);
}
