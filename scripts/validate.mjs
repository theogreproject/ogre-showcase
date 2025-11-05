import { readFileSync } from 'node:fs';
import { globSync } from 'glob';
import yaml from 'js-yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const schema = JSON.parse(readFileSync('submission.schema.json', 'utf8'));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const files = globSync('solutions/**/*.{yml,yaml}');
let hasErrors = false;

for (const f of files) {
  const doc = yaml.load(readFileSync(f, 'utf8'));
  const ok = validate(doc);
  if (!ok) {
    hasErrors = true;
    console.error(`❌ ${f}`);
    for (const err of validate.errors ?? []) {
      console.error(`  - ${err.instancePath} ${err.message}`);
    }
  } else {
    console.log(`✅ ${f}`);
  }
}

if (hasErrors) process.exit(1);
