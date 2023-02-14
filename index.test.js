import { expect, test, beforeEach, afterEach, beforeAll } from '@jest/globals';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import http from 'node:http';
import url from 'node:url';

const TEST_DIR = './tmp';
const CACHE_DIR = path.join(os.tmpdir(), 'nwjs-installer-cache');
const EXEC_OPTS = { cwd: TEST_DIR };

beforeAll(() => {
	// Wipe cache directory in case it exists from a previous test run or development.
	if (fs.existsSync(CACHE_DIR))
		fs.rmdirSync(CACHE_DIR, { recursive: true });
});

beforeEach(() => {
	// Wipe test directory in case it exists from a previous test run.
	if (fs.existsSync(TEST_DIR))
		fs.rmdirSync(TEST_DIR, { recursive: true });

	fs.mkdirSync(TEST_DIR);
});

afterEach(() => {
	// Clean up the test directory.
	if (fs.existsSync(TEST_DIR))
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
	execSync(`nwjs`, EXEC_OPTS);

	// Expect the nw.js executable to be in the current working directory.
	if (process.platform === 'linux')
		expect(fs.existsSync(path.join(TEST_DIR, 'nw'))).toBe(true);
	else if (process.platform === 'win32')
		expect(fs.existsSync(path.join(TEST_DIR, 'nw.exe'))).toBe(true);
	else if (process.platform === 'darwin')
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app'))).toBe(true);

	const cacheFiles = fs.readdirSync(CACHE_DIR);
	expect(cacheFiles.length).toBe(1);
	expect(cacheFiles[0]).toMatch(/nwjs-v\d+\.\d+\.\d+-\w+-\w+\.(zip|tar\.gz)/);
});

test('cmd: nwjs --version 0.49.2', () => {
	// Expect the specified version to be installed.
	execSync(`nwjs --version 0.49.2`, EXEC_OPTS);

	if (process.platform === 'linux') {
		expect(fs.existsSync(path.join(TEST_DIR, 'nw'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'nw_100_percent.pak'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'nw_200_percent.pak'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'resources.pak'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'v8_context_snapshot.bin'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'crashpad_handler'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'credits.html'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'lib'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'locales'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'swiftshader'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'lib', 'libEGL.so'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'lib', 'libffmpeg.so'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'lib', 'libGLESv2.so'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'lib', 'libnw.so'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'lib', 'libnode.so'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'am.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'am.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ar.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ar.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'bg.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'bg.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'bn.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'bn.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ca.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ca.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'cs.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'cs.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'da.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'da.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'de.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'de.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'el.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'el.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'en-GB.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'en-GB.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'en-US.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'en-US.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'es.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'es.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'es-419.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'es-419.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'et.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'et.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fa.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fa.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fi.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fi.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fil.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fil.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fr.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fr.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'gu.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'gu.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'he.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'he.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'hi.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'hi.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'hr.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'hr.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'hu.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'hu.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'id.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'id.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'it.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'it.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ja.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ja.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'kn.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'kn.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ko.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ko.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'lt.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'lt.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'lv.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'lv.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ml.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ml.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'mr.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'mr.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ms.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ms.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'nb.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'nb.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'nl.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'nl.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'pl.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'pl.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'pt-BR.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'pt-BR.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'pt-PT.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'pt-PT.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ro.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ro.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ru.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ru.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sk.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sk.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sl.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sl.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sr.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sr.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sv.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sv.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sw.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sw.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ta.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ta.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'te.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'te.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'th.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'th.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'tr.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'tr.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'uk.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'uk.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'vi.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'vi.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'zh-CN.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'zh-CN.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'zh-TW.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'zh-TW.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'swiftshader', 'libEGL.so'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'swiftshader', 'libGLESv2.so'))).toBe(true);
	} else if (process.platform === 'win32') {
		expect(fs.existsSync(path.join(TEST_DIR, 'credits.html'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'd3dcompiler_47.dll'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'ffmpeg.dll'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'icudtl.dat'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'libEGL.dll'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'libGLESv2.dll'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'node.dll'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'notification_helper.exe'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'nw.exe'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'nw.dll'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'nw_100_percent.pak'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'nw_200_percent.pak'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'nw_elf.dll'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'resources.pak'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'v8_context_snapshot.bin'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'swiftshader', 'libEGL.dll'))).toBe(true);
        expect(fs.existsSync(path.join(TEST_DIR, 'swiftshader', 'libGLESv2.dll'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'am.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'am.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ar.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ar.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'bg.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'bg.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'bn.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'bn.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ca.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ca.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'cs.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'cs.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'da.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'da.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'de.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'de.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'el.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'el.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'en-GB.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'en-GB.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'en-US.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'en-US.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'es.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'es.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'es-419.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'es-419.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'et.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'et.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fa.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fa.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fi.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fi.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fil.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fil.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fr.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'fr.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'gu.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'gu.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'he.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'he.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'hi.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'hi.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'hr.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'hr.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'hu.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'hu.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'id.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'id.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'it.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'it.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ja.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ja.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'kn.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'kn.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ko.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ko.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'lt.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'lt.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'lv.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'lv.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ml.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ml.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'mr.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'mr.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ms.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ms.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'nb.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'nb.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'nl.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'nl.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'pl.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'pl.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'pt-BR.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'pt-BR.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'pt-PT.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'pt-PT.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ro.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ro.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ru.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ru.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sk.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sk.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sl.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sl.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sr.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sr.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sv.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sv.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sw.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'sw.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ta.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'ta.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'te.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'te.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'th.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'th.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'tr.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'tr.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'uk.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'uk.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'vi.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'vi.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'zh-CN.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'zh-CN.pak.info'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'zh-TW.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'locales', 'zh-TW.pak.info'))).toBe(true);
	} else if (process.platform === 'darwin') {
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'XPCServices', 'AlertNotificationService.xpc', 'Contents', 'MacOS', 'AlertNotificationService'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'app.icns'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Helpers', 'app_mode_loader'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'app_mode-Info.plist'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Helpers', 'chrome_crashpad_handler'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'credits.html'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', 'Current'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'document.icns'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Helpers'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'icudtl.dat'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Helpers', 'nwjs Helper (GPU).app', 'Contents', 'Info.plist'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Helpers', 'nwjs Helper (Plugin).app', 'Contents', 'Info.plist'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Helpers', 'nwjs Helper (Renderer).app', 'Contents', 'Info.plist'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Helpers', 'nwjs Helper.app', 'Contents', 'Info.plist'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'Info.plist'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'XPCServices', 'AlertNotificationService.xpc', 'Contents', 'Info.plist'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Info.plist'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'am.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'ar.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'bg.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'bn.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'ca.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'cs.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'da.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'de.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'el.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'en.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'en_GB.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'es.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'es_419.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'et.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'fa.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'fi.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'fil.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'fr.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'gu.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'he.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'hi.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'hr.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'hu.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'id.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'it.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'ja.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'kn.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'ko.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'lt.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'lv.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'ml.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'mr.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'ms.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'nb.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'nl.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'pl.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'pt_BR.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'pt_PT.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'ro.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'ru.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'sk.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'sl.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'sr.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'sv.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'sw.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'ta.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'te.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'th.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'tr.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'uk.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'vi.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'zh_CN.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'zh_TW.lproj', 'InfoPlist.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'install.sh'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'io.nwjs.nwjs.manifest', 'Contents', 'Resources', 'io.nwjs.nwjs.manifest'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Libraries', 'libEGL.dylib'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'libffmpeg.dylib'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Libraries', 'libGLESv2.dylib'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'libnode.dylib'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Libraries'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Libraries', 'libswiftshader_libEGL.dylib'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Libraries', 'libswiftshader_libGLESv2.dylib'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Libraries', 'libvk_swiftshader.dylib'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'am.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'ar.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'bg.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'bn.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'ca.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'cs.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'da.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'de.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'el.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'en.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'en_GB.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'es.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'es_419.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'et.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'fa.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'fi.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'fil.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'fr.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'gu.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'he.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'hi.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'hr.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'hu.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'id.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'it.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'ja.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'kn.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'ko.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'lt.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'lv.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'ml.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'mr.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'ms.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'nb.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'nl.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'pl.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'pt_BR.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'pt_PT.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'ro.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'ru.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'sk.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'sl.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'sr.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'sv.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'sw.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'ta.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'te.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'th.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'tr.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'uk.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'vi.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'zh_CN.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'zh_TW.lproj', 'locale.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'io.nwjs.nwjs.manifest', 'Contents', 'Resources', 'en.lproj', 'Localizable.strings'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Libraries', 'MEIPreload', 'manifest.json'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'nw_100_percent.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'nw_200_percent.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'MacOS', 'nwjs'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'nwjs Framework'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'nwjs Framework'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Helpers', 'nwjs Helper.app', 'Contents', 'MacOS', 'nwjs Helper'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Helpers', 'nwjs Helper (GPU).app', 'Contents', 'MacOS', 'nwjs Helper (GPU)'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Helpers', 'nwjs Helper (Plugin).app', 'Contents', 'MacOS', 'nwjs Helper (Plugin)'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Helpers', 'nwjs Helper (Renderer).app', 'Contents', 'MacOS', 'nwjs Helper (Renderer)'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Helpers', 'nwjs Helper (GPU).app', 'Contents', 'PkgInfo'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Helpers', 'nwjs Helper (Plugin).app', 'Contents', 'PkgInfo'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Helpers', 'nwjs Helper (Renderer).app', 'Contents', 'PkgInfo'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Helpers', 'nwjs Helper.app', 'Contents', 'PkgInfo'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'PkgInfo'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Libraries', 'MEIPreload', 'preloaded_data.pb'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'product_logo_32.png'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Resources'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'resources.pak'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources', 'scripting.sdef'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Resources', 'v8_context_snapshot.bin'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'Versions', '86.0.4240.111', 'Libraries', 'vk_swiftshader_icd.json'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Frameworks', 'nwjs Framework.framework', 'XPCServices'))).toBe(true);
	}

	// Cache should contain the exact version specified.
	const cacheFiles = fs.readdirSync(CACHE_DIR);
	expect(cacheFiles.find(e => e.match(/nwjs-v0\.49\.2-\w+-\w+\.(zip|tar\.gz)/))).not.toBeUndefined();
});

test('cmd: nwjs --version 0.49.2 (cache check)', () => {
	// Get the mtime of the cache file.
	const cacheFiles = fs.readdirSync(CACHE_DIR);
	const cacheFile = cacheFiles.find(e => e.match(/nwjs-v0\.49\.2-\w+-\w+\.(zip|tar\.gz)/));
	const cacheFileMtime = fs.statSync(path.join(CACHE_DIR, cacheFile)).mtimeMs;

	// Run the command.
	execSync(`nwjs --version 0.49.2`, EXEC_OPTS);

	// Cache file should not have been modified.
	expect(fs.statSync(path.join(CACHE_DIR, cacheFile)).mtimeMs).toBe(cacheFileMtime);

	// Check nw.js was installed.
	if (process.platform === 'linux')
		expect(fs.existsSync(path.join(TEST_DIR, 'nw'))).toBe(true);
	else if (process.platform === 'win32')
		expect(fs.existsSync(path.join(TEST_DIR, 'nw.exe'))).toBe(true);
	else if (process.platform === 'darwin')
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app'))).toBe(true);
});

test('cmd: nwjs --version 0.49.2 --no-cache', () => {
	// Purposely poison the cache so that we can test that it's not used.
	const cacheFiles = fs.readdirSync(CACHE_DIR);
	const cacheFile = cacheFiles.find(e => e.match(/nwjs-v0\.49\.2-\w+-\w+\.(zip|tar\.gz)/));
	fs.writeFileSync(path.join(CACHE_DIR, cacheFile), 'poisoned');

	// Run the command.
	execSync(`nwjs --version 0.49.2 --no-cache`, EXEC_OPTS);

	// Cache file should be untouched.
	expect(fs.readFileSync(path.join(CACHE_DIR, cacheFile), 'utf8')).toBe('poisoned');

	// Check nw.js was installed.
	if (process.platform === 'linux')
		expect(fs.existsSync(path.join(TEST_DIR, 'nw'))).toBe(true);
	else if (process.platform === 'win32')
		expect(fs.existsSync(path.join(TEST_DIR, 'nw.exe'))).toBe(true);
	else if (process.platform === 'darwin')
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app'))).toBe(true);

	// Delete the poisoned cache file.
	fs.unlinkSync(path.join(CACHE_DIR, cacheFile));
});

test('cmd: nwjs --version 0.49.2 --downloadServer=localhost', async () => {
	// Create a proxy server to test the download server option.
	const server = http.createServer((req, res) => {
		const proxyUrl = url.parse(`http://dl.nwjs.io${req.url}`);
			
		const options = {
			host: proxyUrl.host,
			path: proxyUrl.path,
			headers: req.headers,
			method: req.method,
		};
			
		const proxyReq = http.request(options, proxyRes => {
			res.writeHead(proxyRes.statusCode, proxyRes.headers);
			proxyRes.pipe(res);
		});
		
		req.pipe(proxyReq);
	});
		
	await new Promise(resolve => server.listen(0, resolve));
	const port = server.address().port;

	// Make sure the cache is empty.
	if (fs.existsSync(CACHE_DIR))
		fs.rmdirSync(CACHE_DIR, { recursive: true });

	// Run the command.
	execSync(`nwjs --version 0.49.2 --downloadServer=http://localhost:${port}`, EXEC_OPTS);

	// Stop the server.
	await new Promise(resolve => server.close(resolve));

	// Check nw.js was installed.
	if (process.platform === 'linux')
		expect(fs.existsSync(path.join(TEST_DIR, 'nw'))).toBe(true);
	else if (process.platform === 'win32')
		expect(fs.existsSync(path.join(TEST_DIR, 'nw.exe'))).toBe(true);
	else if (process.platform === 'darwin')
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app'))).toBe(true);

	// Cache should contain the exact version specified.
	const cacheFiles = fs.readdirSync(CACHE_DIR);
	expect(cacheFiles.find(e => e.match(/nwjs-v0\.49\.2-\w+-\w+\.(zip|tar\.gz)/))).not.toBeUndefined();
});

test('cmd: nwjs --version 0.49.2 --sdk', () => {
	// Run the command.
	execSync(`nwjs --version 0.49.2 --sdk`, EXEC_OPTS);

	// Check nw.js SDK was installed.
	if (process.platform === 'linux') {
		expect(fs.existsSync(path.join(TEST_DIR, 'nw'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjc'))).toBe(true);
	} else if (process.platform === 'win32') {
		expect(fs.existsSync(path.join(TEST_DIR, 'nw.exe'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjc.exe'))).toBe(true);
	} else if (process.platform === 'darwin') {
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app'))).toBe(true);
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjc'))).toBe(true);
	}

	// Cache should contain the exact SDK version specified.
	const cacheFiles = fs.readdirSync(CACHE_DIR);
	expect(cacheFiles.find(e => e.match(/nwjs-sdk-v0\.49\.2-\w+-\w+\.(zip|tar\.gz)/))).not.toBeUndefined();
});

test('cmd: nwjs --version 0.48.0-beta1 (pre-release)', () => {
	// Run the command.
	execSync(`nwjs --version 0.48.0-beta1`, EXEC_OPTS);

	// Check nw.js was installed.
	if (process.platform === 'linux')
		expect(fs.existsSync(path.join(TEST_DIR, 'nw'))).toBe(true);
	else if (process.platform === 'win32')
		expect(fs.existsSync(path.join(TEST_DIR, 'nw.exe'))).toBe(true);
	else if (process.platform === 'darwin')
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app'))).toBe(true);

	// Cache should contain the exact version specified.
	const cacheFiles = fs.readdirSync(CACHE_DIR);
	expect(cacheFiles.find(e => e.match(/nwjs-v0\.48\.0-beta1-\w+-\w+\.(zip|tar\.gz)/))).not.toBeUndefined();
});

test('cmd: nwjs --version 0.49.2 --platform win --arch x64', () => {
	// Run the command.
	execSync(`nwjs --version 0.49.2 --platform win --arch x64`, EXEC_OPTS);

	// Check nw.js was installed.
	expect(fs.existsSync(path.join(TEST_DIR, 'nw.exe'))).toBe(true);

	// Cache should contain the exact platform and arch specified.
	const cacheFiles = fs.readdirSync(CACHE_DIR);
	expect(cacheFiles.find(e => e.match(/nwjs-v0\.49\.2-win-x64\.zip/))).not.toBeUndefined();
});

test('cmd: nwjs --version 0.49.2 --platform win --arch ia32', () => {
	// Run the command.
	execSync(`nwjs --version 0.49.2 --platform win --arch ia32`, EXEC_OPTS);

	// Check nw.js was installed.
	expect(fs.existsSync(path.join(TEST_DIR, 'nw.exe'))).toBe(true);

	// Cache should contain the exact platform and arch specified.
	const cacheFiles = fs.readdirSync(CACHE_DIR);
	expect(cacheFiles.find(e => e.match(/nwjs-v0\.49\.2-win-ia32\.zip/))).not.toBeUndefined();
});

test('cmd: nwjs --version 0.49.2 --platform linux --arch x64', () => {
	// Run the command.
	execSync(`nwjs --version 0.49.2 --platform linux --arch x64`, EXEC_OPTS);

	// Check nw.js was installed.
	expect(fs.existsSync(path.join(TEST_DIR, 'nw'))).toBe(true);

	// Cache should contain the exact platform and arch specified.
	const cacheFiles = fs.readdirSync(CACHE_DIR);
	expect(cacheFiles.find(e => e.match(/nwjs-v0\.49\.2-linux-x64\.tar\.gz/))).not.toBeUndefined();
});

test('cmd: nwjs --version 0.49.2 --platform linux --arch ia32', () => {
	// Run the command.
	execSync(`nwjs --version 0.49.2 --platform linux --arch ia32`, EXEC_OPTS);

	// Check nw.js was installed.
	expect(fs.existsSync(path.join(TEST_DIR, 'nw'))).toBe(true);

	// Cache should contain the exact platform and arch specified.
	const cacheFiles = fs.readdirSync(CACHE_DIR);
	expect(cacheFiles.find(e => e.match(/nwjs-v0\.49\.2-linux-ia32\.tar\.gz/))).not.toBeUndefined();
});

test('cmd: nwjs --version 0.49.2 --platform osx --arch x64', () => {
	// Run the command.
	execSync(`nwjs --version 0.49.2 --platform osx --arch x64`, EXEC_OPTS);

	// Check nw.js was installed.
	expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app'))).toBe(true);

	// Cache should contain the exact platform and arch specified.
	const cacheFiles = fs.readdirSync(CACHE_DIR);
	expect(cacheFiles.find(e => e.match(/nwjs-v0\.49\.2-osx-x64\.zip/))).not.toBeUndefined();
});

test('cmd: nwjs --version 0.49.2 --target-dir="./test"', () => {
	// Run the command.
	execSync(`nwjs --version 0.49.2 --target-dir="./test"`, EXEC_OPTS);

	// Check nw.js was installed.
	if (process.platform === 'linux')
		expect(fs.existsSync(path.join(TEST_DIR, 'test', 'nw'))).toBe(true);
	else if (process.platform === 'win32')
		expect(fs.existsSync(path.join(TEST_DIR, 'test', 'nw.exe'))).toBe(true);
	else if (process.platform === 'darwin')
		expect(fs.existsSync(path.join(TEST_DIR, 'test', 'nwjs.app'))).toBe(true);
});

test('cmd: nwjs --version 0.49.2 --target-dir="./{version}/{platform}/{arch}/{flavor}"', () => {
	// Run the command.
	execSync(`nwjs --version 0.49.2 --target-dir="./{version}/{platform}/{arch}/{flavor}"`, EXEC_OPTS);

	// Check nw.js was installed.
	if (process.platform === 'linux')
		expect(fs.existsSync(path.join(TEST_DIR, '0.49.2', 'linux', 'x64', 'normal', 'nw'))).toBe(true);
	else if (process.platform === 'win32')
		expect(fs.existsSync(path.join(TEST_DIR, '0.49.2', 'win', 'x64', 'normal', 'nw.exe'))).toBe(true);
	else if (process.platform === 'darwin')
		expect(fs.existsSync(path.join(TEST_DIR, '0.49.2', 'osx', 'x64', 'normal', 'nwjs.app'))).toBe(true);
});

test('cmd: nwjs --version 0.49.2 --target-dir="./{version}/{platform}/{arch}/{flavor}" --sdk', () => {
	// Run the command.
	execSync(`nwjs --version 0.49.2 --target-dir="./{version}/{platform}/{arch}/{flavor}" --sdk`, EXEC_OPTS);

	// Check nw.js was installed.
	if (process.platform === 'linux')
		expect(fs.existsSync(path.join(TEST_DIR, '0.49.2', 'linux', 'x64', 'sdk', 'nw'))).toBe(true);
	else if (process.platform === 'win32')
		expect(fs.existsSync(path.join(TEST_DIR, '0.49.2', 'win', 'x64', 'sdk', 'nw.exe'))).toBe(true);
	else if (process.platform === 'darwin')
		expect(fs.existsSync(path.join(TEST_DIR, '0.49.2', 'osx', 'x64', 'sdk', 'nwjs.app'))).toBe(true);
});

test('cmd: nwjs --version 0.49.2 --target-dir="./{package}"', () => {
	// Run the command.
	execSync(`nwjs --version 0.49.2 --target-dir="./{package}"`, EXEC_OPTS);

	// Check nw.js was installed.
	if (process.platform === 'linux')
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs-v0.49.2-linux-x64', 'nw'))).toBe(true);
	else if (process.platform === 'win32')
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs-v0.49.2-win-x64', 'nw.exe'))).toBe(true);
	else if (process.platform === 'darwin')
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs-v0.49.2-osx-x64', 'nwjs.app'))).toBe(true);
});

test('cmd: nwjs --version 0.49.2 --target-dir="./{package}" --sdk', () => {
	// Run the command.
	execSync(`nwjs --version 0.49.2 --target-dir="./{package}" --sdk`, EXEC_OPTS);

	// Check nw.js was installed.
	if (process.platform === 'linux')
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs-sdk-v0.49.2-linux-x64', 'nw'))).toBe(true);
	else if (process.platform === 'win32')
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs-sdk-v0.49.2-win-x64', 'nw.exe'))).toBe(true);
	else if (process.platform === 'darwin')
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs-sdk-v0.49.2-osx-x64', 'nwjs.app'))).toBe(true);
});

test('cmd: nwjs --version 0.49.2 --locale "el,en-GB,en_US"', () => {
	// Run the command.
	execSync(`nwjs --version 0.49.2 --locale "el,en-GB,en_US"`, EXEC_OPTS);

	// Check if the locale files are the only ones downloaded.
	if (process.platform === 'linux' || process.platform === 'win32') {
		const localeFiles = fs.readdirSync(path.join(TEST_DIR, 'locales'));
		expect(localeFiles.length).toBe(6); // .pak + .pak.info

		expect(localeFiles.includes('el.pak')).toBe(true);
		expect(localeFiles.includes('el.pak.info')).toBe(true);
		expect(localeFiles.includes('en-GB.pak')).toBe(true);
		expect(localeFiles.includes('en-GB.pak.info')).toBe(true);
		expect(localeFiles.includes('en-US.pak')).toBe(true);
		expect(localeFiles.includes('en-US.pak.info')).toBe(true);
	} else if (process.platform === 'darwin') {
		const localeFiles = fs.readdirSync(path.join(TEST_DIR, 'nwjs.app', 'Contents', 'Resources'));
		expect(localeFiles.length).toBe(7);
		expect(localeFiles.includes('el.lproj')).toBe(true);
		expect(localeFiles.includes('en_GB.lproj')).toBe(true);
		expect(localeFiles.includes('en.lproj')).toBe(true); // OSX uses en.lproj for en-US.
		
		// Other things included are: io.nwjs.nwjs.manifest, app.icns, document.icns, scripting.sdef
		expect(localeFiles.includes('io.nwjs.nwjs.manifest')).toBe(true);
		expect(localeFiles.includes('app.icns')).toBe(true);
		expect(localeFiles.includes('document.icns')).toBe(true);
		expect(localeFiles.includes('scripting.sdef')).toBe(true);
	}
});

test('cmd: nwjs --version 0.49.2 --remove-pak-info', () => {
	// See: https://bitbucket.org/chromiumembedded/cef/issues/2375
	if (process.platform === 'linux' || process.platform === 'win32') {
		// Run the command.
		execSync(`nwjs --version 0.49.2 --remove-pak-info`, EXEC_OPTS);

		// Check there are no .pak.info files extracted to /locales
		const localeFiles = fs.readdirSync(path.join(TEST_DIR, 'locales'));
		expect(localeFiles.find(e => e.match(/\.pak\.info$/))).toBeUndefined();
	}
});

test('cmd: nwjs --version 0.49.2 --exclude "^credits.html$"', () => {
	// Use credits.html for testing since it's the only file that exists in the same
	// directory on all platforms.

	// Run the command.
	execSync(`nwjs --version 0.49.2 --exclude "^credits.html$"`, EXEC_OPTS);

	// Check nw.js was installed.
	if (process.platform === 'linux')
		expect(fs.existsSync(path.join(TEST_DIR, 'nw'))).toBe(true);
	else if (process.platform === 'win32')
		expect(fs.existsSync(path.join(TEST_DIR, 'nw.exe'))).toBe(true);
	else if (process.platform === 'darwin')
		expect(fs.existsSync(path.join(TEST_DIR, 'nwjs.app'))).toBe(true);

	// Check the credits.html file was excluded.
	expect(fs.existsSync(path.join(TEST_DIR, 'credits.html'))).toBe(false);
});

// This test should ideally be left until last.
test('cmd: nwjs --version 0.49.2 --clear-cache', () => {
	// Ensure cache directory exists.
	if (!fs.existsSync(CACHE_DIR))
		fs.mkdirSync(CACHE_DIR);

	// Create a random ZIP file just to ensure the cache has something in it.
	fs.writeFileSync(path.join(CACHE_DIR, 'cacheJunk.zip'), 'junk');

	// Run the command.
	execSync(`nwjs --version 0.49.2 --clear-cache`, EXEC_OPTS);

	const cacheFiles = fs.readdirSync(CACHE_DIR);
	expect(cacheFiles.length).toBe(1);
	expect(cacheFiles.find(e => e.match(/nwjs-v0\.49\.2-\w+-\w+\.(zip|tar\.gz)/))).not.toBeUndefined();
	expect(cacheFiles.find(e => e.match(/cacheJunk\.zip/))).toBeUndefined();
});