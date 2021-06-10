import { Environment } from './models/environment.model';

export const environment: Environment = {
  production: true,
  occBaseUrl:
    buildProcess.env.CX_BASE_URL ??
    'https://spartacus-devci767.eastus.cloudapp.azure.com:9002',
  occApiPrefix: '/occ/v2/',
  cds: buildProcess.env.CX_CDS,
  b2b: buildProcess.env.CX_B2B,
  cdc: buildProcess.env.CX_CDC,
  digitalPayments: buildProcess.env.CX_DIGITAL_PAYMENTS ?? false,
};
