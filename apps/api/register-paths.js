const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

const hookKey = Symbol.for('nosql-reco.api.paths');
if (global[hookKey]) {
  return;
}
global[hookKey] = true;

const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');
const srcRoot = path.resolve(__dirname, 'src');
const distRoot = path.resolve(__dirname, 'dist');

function normalizePattern(pattern) {
  if (pattern.endsWith('/*')) {
    return { prefix: pattern.slice(0, -2), wildcard: true };
  }
  return { prefix: pattern, wildcard: false };
}

function createMapping(aliasPattern, targetPattern, baseDir) {
  const alias = normalizePattern(aliasPattern);
  const target = normalizePattern(targetPattern);
  const srcPath = path.resolve(baseDir, target.prefix);
  const relativeFromSrc = path.relative(srcRoot, srcPath);
  const distPath =
    relativeFromSrc && !relativeFromSrc.startsWith('..')
      ? path.resolve(distRoot, relativeFromSrc)
      : srcPath;
  return {
    alias,
    srcPath,
    distPath,
    wildcard: target.wildcard
  };
}

let config;
try {
  config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
} catch {
  config = null;
}

if (!config || !config.compilerOptions) {
  return;
}

const { baseUrl = '.', paths = {} } = config.compilerOptions;
const absoluteBase = path.resolve(__dirname, baseUrl);

const mappings = Object.entries(paths)
  .map(([aliasPattern, targets]) => {
    if (!Array.isArray(targets) || targets.length === 0) {
      return null;
    }
    return createMapping(aliasPattern, targets[0], absoluteBase);
  })
  .filter(Boolean);

if (mappings.length === 0) {
  return;
}

const originalResolveFilename = Module._resolveFilename;

function tryResolveCandidates(moduleInstance, candidates, parent, isMain, options) {
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      return originalResolveFilename.call(moduleInstance, candidate, parent, isMain, options);
    } catch (err) {
      if (err && err.code === 'MODULE_NOT_FOUND') {
        continue;
      }
      throw err;
    }
  }
  return null;
}

Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  for (const mapping of mappings) {
    const { alias, srcPath, distPath } = mapping;
    if (alias.wildcard) {
      if (request === alias.prefix) {
        const resolved = tryResolveCandidates(
          this,
          [distPath, srcPath],
          parent,
          isMain,
          options
        );
        if (resolved) return resolved;
      } else if (request.startsWith(`${alias.prefix}/`)) {
        const remainder = request.slice(alias.prefix.length + 1);
        const candidates = [path.join(distPath, remainder), path.join(srcPath, remainder)];
        const resolved = tryResolveCandidates(this, candidates, parent, isMain, options);
        if (resolved) return resolved;
      }
    } else if (request === alias.prefix) {
      const resolved = tryResolveCandidates(this, [distPath, srcPath], parent, isMain, options);
      if (resolved) return resolved;
    }
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};
