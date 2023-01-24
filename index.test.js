import { expect, test, beforeEach, afterEach, beforeAll } from '@jest/globals';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

const TEST_DIR = './tmp';
const CACHCE_DIR = path.join(os.tmpdir(), 'kogs-nwjs-cache');
const EXEC_OPTS = { cwd: TEST_DIR };

beforeAll(() => {
	// Wipe cache directory in case it exists from a previous test run or development.
	if (fs.existsSync(CACHCE_DIR))
		fs.rmdirSync(CACHCE_DIR, { recursive: true });
});

beforeEach(() => {
	// Wipe test directory in case it exists from a previous test run.
	if (fs.existsSync(TEST_DIR))
		fs.rmdirSync(TEST_DIR, { recursive: true });

	fs.mkdirSync(TEST_DIR);
});

afterEach(() => {
	// Clean up the test directory.
	fs.rmdirSync(TEST_DIR, { recursive: true });
});

test('cmd: nwjs', () => {
	// Expect default behavior:
	// - nw.js will be installed into the current working directory (which is TEST_DIR).
	// - Latest version of nw.js will automatically be downloaded.
	// - Architecture / platform will be automatically detected.
	// - ZIP/TAR will be cached in the operating system's temp directory.
	// - Build flavor should be "normal" not "sdk".
	// - Build should not be a pre-release.
	execSync(`nwjs install`, EXEC_OPTS);

	// Expect the nw.js executable to be in the current working directory.
	if (process.platform === 'linux')
		expect(fs.existsSync(path.join(TEST_DIR, 'nw'))).toBe(true);
	else if (process.platform === 'win32')
		expect(fs.existsSync(path.join(TEST_DIR, 'nw.exe'))).toBe(true);
	else if (process.platform === 'darwin')
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app'))).toBe(true);

	const cacheFiles = fs.readdirSync(CACHCE_DIR);
	expect(cacheFiles.length).toBe(1);
	expect(cacheFiles[0]).toMatch(/nwjs-v\d+\.\d+\.\d+-\w+-\w+\.(zip|tar\.gz)/);
});