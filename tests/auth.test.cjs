const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');

function fixture() {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'portal-test-'));
  const config = path.join(folder, 'config.json');
  fs.writeFileSync(config, JSON.stringify({
    users: [{ name: 'Demo Operator', email: 'operator@example.invalid', password: 'synthetic-demo-value' }],
    reports: [{ id: 'demo', title: 'Fictitious report', url: 'https://example.invalid/report' }],
  }));
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '../netlify/functions/auth.js'), 'utf8');
  vm.runInNewContext(source, { exports, require, __dirname: path.join(__dirname, '../netlify/functions'),
    process: { env: { PORTAL_CONFIG_PATH: config } }, setTimeout, console: { error() {} } });
  return { handler: exports.handler, config, cleanup() {
    assert.equal(path.dirname(folder), path.resolve(os.tmpdir()));
    assert.ok(path.basename(folder).startsWith('portal-test-'));
    fs.rmSync(folder, { recursive: true, force: true });
  } };
}

test('rejects unsupported methods and incomplete credentials', async () => {
  const f = fixture();
  try {
    assert.equal((await f.handler({ httpMethod: 'GET' })).statusCode, 405);
    assert.equal((await f.handler({ httpMethod: 'POST', body: '{}' })).statusCode, 400);
  } finally { f.cleanup(); }
});

test('returns only the selected user and catalog, never the credential list', async () => {
  const f = fixture();
  try {
    const response = await f.handler({ httpMethod: 'POST', body: JSON.stringify({ email: 'operator@example.invalid', password: 'synthetic-demo-value' }) });
    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.user.name, 'Demo Operator');
    assert.equal(body.reports.length, 1);
    assert.equal(body.users, undefined);
    assert.equal(body.user.password, undefined);
  } finally { f.cleanup(); }
});

test('rejects a wrong password and returns a generic error for missing configuration', async () => {
  const f = fixture();
  try {
    const denied = await f.handler({ httpMethod: 'POST', body: JSON.stringify({ email: 'operator@example.invalid', password: 'wrong-synthetic-value' }) });
    assert.equal(denied.statusCode, 401);
    fs.unlinkSync(f.config);
    const failed = await f.handler({ httpMethod: 'POST', body: JSON.stringify({ email: 'operator@example.invalid', password: 'synthetic-demo-value' }) });
    assert.equal(failed.statusCode, 500);
    assert.equal(JSON.parse(failed.body).message, 'Internal Server Error');
  } finally { f.cleanup(); }
});
