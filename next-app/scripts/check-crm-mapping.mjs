import {readFileSync} from 'node:fs';
import {publicIntegrationCatalog, validateIntegrationMap} from '../lib/integration/catalog-map.mjs';

const mapping = process.argv[2] ? JSON.parse(readFileSync(process.argv[2], 'utf8')) : {venues:{}, offerings:{}};
const report = validateIntegrationMap(mapping, publicIntegrationCatalog());
console.log(JSON.stringify(report, null, 2));
if (!report.valid) process.exitCode = 1;
