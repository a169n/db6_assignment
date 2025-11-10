import fs from 'fs';
import path from 'path';

const source = path.resolve(__dirname, '../../../../docs/openapi.yaml');
const targetDir = path.resolve(__dirname, '../../dist');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
fs.copyFileSync(source, path.join(targetDir, 'openapi.yaml'));
// eslint-disable-next-line no-console
console.log('OpenAPI spec copied to dist/openapi.yaml');
