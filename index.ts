#!/usr/bin/env node
import { parse } from '@kogs/argv';
import log, { formatArray } from '@kogs/logger';
import info from './package.json' assert { type: 'json' };
import path from 'node:path';
import tar from 'tar';
import jszip from 'jszip';
import os from 'node:os';
import fs from 'node:fs';

try {
	const argv = parse();

	log.info('nwjs-installer {%s}', info.version);
	log.blank();

	argv.help({
		usage: 'Usage: $ nwjs-installer [{options}]',
		url: info.homepage,
		entries: [
			{ name: '--help', description: 'Show this help message and exit.' },
			{ name: '--target-dir', description: 'Specify a target directory to install to.' },
			{ name: '--version', description: 'Specify a version to install (e.g 0.49.2)' },
			{ name: '--sdk', description: 'Install the SDK flavor instead of the normal flavor.' },
			{ name: '--no-cache', description: 'Disable caching of downloaded builds.' },
			{ name: '--clear-cache', description: 'Clears the cache of downloaded builds.' },
			{ name: '--platform <{string}>', description: 'Override the platform to install for.' },
			{ name: '--arch <{string}>', description: 'Override the architecture to install for.' },
			{ name: '--exclude <{pattern}>', description: 'Exclude files matching the given pattern.' },
			{ name: '--download-server', description: 'Override the default download server to use.' },
			{ name: '--locale <{a},{b},{c}..>', description: 'Define which locales to include in the build (defaults: all).' },
			{ name: '--remove-pak-info', description: 'Remove .pak.info files to reduce the size of the build.' }
		]
	});

	const cacheDir: string = path.join(os.tmpdir(), 'nwjs-installer-cache');
	if (argv.options.asBoolean('clearCache')) {
		log.info('Clearing build cache ({--clear-cache})...');
		fs.rmdirSync(cacheDir, { recursive: true });
		log.success('Cleared build cache {%s}', cacheDir);
	}

	const downloadServer = argv.options.asString('downloadServer') ?? 'https://dl.nwjs.io';

	let didAutoDetectVersion: boolean = false;
	let targetVersion: string = argv.options.asString('version');
	if (targetVersion === undefined) {
		// Target version not provided, attempt to auto-detect latest version.
		const dirList = await fetch(downloadServer).then(res => res.text());

		let latest = null;
		
		// Match all anchor tags that contain a version number.
		const matches = dirList.matchAll(/<a href="v([^"]+)\/">v[^<]+\/<\/a>/g);
		for (const match of matches) {
			const versionString = match[1];

			// Match version parts: major.minor.patch[-tag].
			const parts = versionString.match(/^(\d+)\.(\d+)\.(\d+)(-[a-z0-9]+)?$/);
			if (parts) {
				// Skip pre-releases (e.g. v0.11.1-beta1) when auto-detecting latest version.
				if (parts[4] !== undefined)
					continue;

				const version = versionString.split('.').map(Number);

				if (latest === null || version[0] > latest[0] || version[1] > latest[1] || version[2] > latest[2])
					latest = version;
			}
		}

		if (latest === null)
			throw new Error('Failed to auto-detect latest version.');

		targetVersion = latest.join('.');
		didAutoDetectVersion = true;
	}

	let didAutoDetectPlatform: boolean = false;
	let didAutoDetectArch: boolean = false;

	let platform: string = argv.options.asString('platform');
	if (platform === undefined) {
		// Automatically detect platform if not provided.
		didAutoDetectPlatform = true;
		platform = process.platform;
	}

	if (platform === 'win32') // win32 (node.js) -> win (nw.js)
		platform = 'win';
	else if (platform === 'darwin') // darwin (node.js) -> osx (nw.js)
		platform = 'osx';

	let arch: string = argv.options.asString('arch');
	if (arch === undefined) {
		// Automatically detect arch if not provided.
		didAutoDetectArch = true;
		arch = process.arch;
	}

	let targetDir: string = argv.options.asString('targetDir') ?? process.cwd();
	const useCache: boolean = !argv.options.asBoolean('noCache');
	const isSDK: boolean = argv.options.asBoolean('sdk') ?? false;
	const locale: string[] = argv.options.asArray('locale') ?? [];
	const removePakInfo: boolean = argv.options.asBoolean('removePakInfo') ?? false;
	const excludePattern: string | undefined = argv.options.asString('exclude') ?? undefined;

	const archiveType: string = platform === 'linux' ? 'tar' : 'zip'; // TODO: Allow custom archive type to be provided.
	const extension: string = archiveType === 'tar' ? '.tar.gz' : '.zip'; // TODO: Allow custom extension to be provided.

	const tokens = {
		'{version}': targetVersion,
		'{platform}': platform,
		'{arch}': arch,
		'{flavor}': isSDK ? 'sdk' : 'normal',
		'{package}': `nwjs${isSDK ? '-sdk' : ''}-v${targetVersion}-${platform}-${arch}`,
	};

	// Replace all tokens
	targetDir = targetDir.replace(/{version}|{platform}|{arch}|{flavor}|{package}/g, (match) => tokens[match]);

	log.info('Installing nw.js in {%s}', targetDir);
	log.info('Target Version: {%s}' + (didAutoDetectVersion ? ' (auto-detected)' : ''), targetVersion);
	log.info('Target Platform: {%s}' + (didAutoDetectPlatform ? ' (auto-detected)' : ''), platform);
	log.info('Target Arch: {%s}' + (didAutoDetectArch ? ' (auto-detected)' : ''), arch);
	log.info('Locale: ' + (locale.length > 0 ? formatArray(locale) : '{all}') + (removePakInfo ? ' (removing pak info)' : ''));
	log.info('Using SDK: {%s}', isSDK ? 'yes' : 'no');
	if (excludePattern !== undefined)
		log.info('Excluding: {%s}', excludePattern);

	log.blank();

	if (!useCache)
		log.warn('You have disabled caching with {--no-cache}, distribution will be downloaded every time.');

	const versionTag: string = 'v' + targetVersion;

	// TODO: Sanitize fileName for caching to prevent file system issues.
	const versionName: string = ['nwjs', isSDK ? 'sdk' : '', versionTag, platform, arch].filter(Boolean).join('-');
	const fileName: string = versionName + extension;


	const downloadURL = downloadServer + '/' + versionTag + '/' + fileName;
	const cachePath: string = path.join(cacheDir, fileName);

	// Ensure cache directory exists.
	fs.mkdirSync(cacheDir, { recursive: true });

	let data: Buffer | undefined;
	if (useCache && fs.existsSync(cachePath)) {
		log.info('Using cached version {%s}', cachePath);
		data = fs.readFileSync(cachePath);
	} else {
		log.info('Downloading archive from {%s}', downloadURL);

		const res = await fetch(downloadURL);
		if (!res.ok)
			throw new Error('Download server returned HTTP {' + res.status + '}: ' + res.statusText);

		data = Buffer.from(await res.arrayBuffer());

		if (useCache) {
			fs.writeFileSync(cachePath, data);
			log.info('Caching archive at {%s}', cachePath);
		}
	}

	// Lowercase all provided locales for comparison.
	let localeStrings = locale.map(e => e.toLowerCase());
	
	// OSX uses underscores instead of hyphens, and 'en-US' is 'en'.
	// See: https://chromium.googlesource.com/chromium/src/build/config/+/refs/heads/main/locales.gni#250
	localeStrings = localeStrings.map(platform === 'osx' ? e => e.replace('-', '_') : e => e.replace('_', '-'));
	if (platform === 'osx') {
		if (localeStrings.includes('en_us'))
			localeStrings.push('en');
	}

	const localeFilter = (entry: string) => {
		const skipLocale = locale.length === 0;
		if (skipLocale && !removePakInfo)
			return true;

		let match: RegExpMatchArray | null;
		if (platform === 'osx') {
			match = entry.match(/^nwjs.app\/Contents\/Resources\/([^.]+)\.lproj\/InfoPlist.strings$/);
		} else {
			match = entry.match(/^locales\/([^.]+)\.pak(\.info|)$/);

			// Remove .pak.info files if --remove-pak-info is set.
			// See: https://bitbucket.org/chromiumembedded/cef/issues/2375
			if (removePakInfo && match?.[2] === '.info')
				return false;
		}

		return skipLocale || (match ? localeStrings.includes(match[1].toLowerCase()) : true);
	};

	const excludeRegExp = excludePattern ? new RegExp(excludePattern, 'i') : undefined;
	if (archiveType === 'tar') {
		const extract = tar.list({
			onentry: (entry: tar.Header) => {
				if (entry.type !== 'File')
					return;

				// Drop the root directory from the path.
				const entryPath = entry.path.split('/').splice(1).join('/');

				const filePath = path.join(targetDir, entryPath);
				const fileDir = path.dirname(filePath);

				if (!localeFilter(entryPath)) {
					log.info('Skipping {%s} (does not match --locale)', filePath);
					return;
				}

				if (excludeRegExp && excludeRegExp.test(entryPath)) {
					log.info('Skipping {%s} (matches --exclude)', filePath);
					return;
				}

				// Ensure directory exists.
				fs.mkdirSync(fileDir, { recursive: true });

				// Write file.
				entry.on('end', () => log.success('Extracted {%s}', filePath));
				entry.pipe(fs.createWriteStream(filePath));
			}
		});

		await new Promise(resolve => {
			extract.on('end', resolve);
			extract.end(data);
		});
	} else if (archiveType === 'zip') {
		const zip = await jszip.loadAsync(data);
		const promises = [];

		zip.folder(versionName).forEach((entryPath, entry) => {
			const filePath = path.join(targetDir, entryPath);
			const fileDir = path.dirname(filePath);

			if (!localeFilter(entryPath)) {
				log.info('Skipping {%s} (does not match --locale)', filePath);
				return;
			}

			if (excludeRegExp && excludeRegExp.test(entryPath)) {
				log.info('Skipping {%s} (matches --exclude)', filePath);
				return;
			}

			// Ensure directory exists.
			fs.mkdirSync(fileDir, { recursive: true });

			// Write file.
			const stream = entry.nodeStream();
			promises.push(new Promise<void>(resolve => {
				stream.on('end', () => {
					log.success('Extracted {%s}', filePath);
					resolve();
				});
			}));

			stream.pipe(fs.createWriteStream(filePath));
		});

		await Promise.all(promises);
	} else {
		throw new Error('Archive format {' + archiveType + '} not implemented');
	}
} catch (err) {
	log.error('{Failed} %s: ' + err.message, err.name);
	process.exit(1);
}