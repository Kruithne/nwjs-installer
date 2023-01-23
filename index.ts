import { parse } from '@kogs/argv';
import log from '@kogs/logger';
import path from 'node:path';
import tar from 'tar';
import jszip from 'jszip';
import os from 'node:os';
import fs from 'node:fs';

try {
	const argv = parse();

	switch (argv.arguments[0]) {
		case 'install': {
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
				if (platform === 'win32') // win32 (node.js) -> win (nw.js)
					platform = 'win';
				else if (platform === 'darwin') // darwin (node.js) -> osx (nw.js)
					platform = 'osx';
			}

			let arch: string = argv.options.asString('arch');
			if (arch === undefined) {
				// Automatically detect arch if not provided.
				didAutoDetectArch = true;
				arch = process.arch;
			}

			const useCache: boolean = !argv.options.asBoolean('noCache');
			const isSDK: boolean = argv.options.asBoolean('sdk') ?? false;
			const targetDir: string = path.join(process.cwd(), 'tmp'); // TODO: Allow target dir to be provided?

			const archiveType: string = platform === 'linux' ? 'tar' : 'zip'; // TODO: Allow custom archive type to be provided.
			const extension: string = archiveType === 'tar' ? '.tar.gz' : '.zip'; // TODO: Allow custom extension to be provided.

			log.info('Installing nw.js in {%s}', targetDir);
			log.info('Target Version: {%s}' + (didAutoDetectVersion ? ' (auto-detected)' : ''), targetVersion);
			log.info('Target Platform: {%s}' + (didAutoDetectPlatform ? ' (auto-detected)' : ''), platform);
			log.info('Target Arch: {%s}' + (didAutoDetectArch ? ' (auto-detected)' : ''), arch);
			log.info('Using SDK: {%s}', isSDK ? 'yes' : 'no');
			log.blank();

			if (!useCache)
				log.warn('You have disabled caching with {--no-cache}, distribution will be downloaded every time.');

			const versionTag: string = 'v' + targetVersion;

			// TODO: Sanitize fileName for caching to prevent file system issues.
			const versionName: string = ['nwjs', isSDK ? 'sdk' : '', versionTag, platform, arch].filter(Boolean).join('-');
			const fileName: string = versionName + extension;

			// TODO: Allow custom URL to be provided.
			const downloadURL: string = 'https://dl.nwjs.io/' + versionTag + '/' + fileName;

			const cacheDir: string = path.join(os.tmpdir(), 'kogs-nwjs-cache');
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

			if (archiveType === 'tar') {
				const extract = tar.list({
					onentry: (entry: tar.Header) => {
						if (entry.type !== 'File')
							return;

						// TODO: Implement filter.

						// Drop the root directory from the path.
						const entryPath = entry.path.split('/').splice(1).join('/');

						const filePath = path.join(targetDir, entryPath);
						const fileDir = path.dirname(filePath);

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
					// TODO: Implement filter.

					const filePath = path.join(targetDir, entryPath);
					const fileDir = path.dirname(filePath);

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

			// nwjs-v072.0-win-x64/locales/zh-TW.pak.info
			// TODO: Handle --exclude parameter to drop certain files.
			// TODO: Handle --locale to drop certain locale files (comma-separate)?
			// TODO: Handle --no-pak-info option to drop .pak.info files (link bug report).
			// TODO: Clear cache.

			break;
		}

		default:
			throw new Error(`Unknown command: {${argv.arguments[0]}}`); // TODO: Add help.
	}
} catch (err) {
	log.error('{Failed} %s: ' + err.message, err.name);
	process.exit(1);
}