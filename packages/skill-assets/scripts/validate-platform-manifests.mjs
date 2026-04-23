import assert from 'node:assert/strict';
import { listManifestFiles, PLATFORMS_FROM_RAG_API, readManifest, readSchema } from './manifest-utils.mjs';

function validateType(value, schema, path) {
  if (!schema || typeof schema !== 'object') {
    return;
  }

  if (Array.isArray(schema.type)) {
    assert(schema.type.includes(typeof value), `${path}: type invalide`);
  } else if (schema.type === 'object') {
    assert.equal(typeof value, 'object', `${path}: doit etre un objet`);
    assert.notEqual(value, null, `${path}: ne doit pas etre null`);
    validateObject(value, schema, path);
    return;
  } else if (schema.type === 'array') {
    assert(Array.isArray(value), `${path}: doit etre un tableau`);
    return;
  } else if (schema.type === 'string') {
    assert.equal(typeof value, 'string', `${path}: doit etre une chaine`);
    if (schema.minLength !== undefined) {
      assert(value.length >= schema.minLength, `${path}: longueur minimale ${schema.minLength}`);
    }
    if (schema.enum) {
      assert(schema.enum.includes(value), `${path}: valeur hors enum (${schema.enum.join(', ')})`);
    }
    return;
  } else if (schema.type === 'boolean') {
    assert.equal(typeof value, 'boolean', `${path}: doit etre un booleen`);
    return;
  }

  if (schema.enum) {
    assert(schema.enum.includes(value), `${path}: valeur hors enum (${schema.enum.join(', ')})`);
  }
}

function validateObject(value, schema, path) {
  if (schema.required) {
    for (const key of schema.required) {
      assert(key in value, `${path}: champ requis manquant '${key}'`);
    }
  }

  const properties = schema.properties || {};

  if (schema.additionalProperties === false) {
    for (const key of Object.keys(value)) {
      assert(key in properties, `${path}: champ non autorise '${key}'`);
    }
  }

  for (const [key, subSchema] of Object.entries(properties)) {
    if (key in value) {
      validateType(value[key], subSchema, `${path}.${key}`);
    }
  }
}

function main() {
  const schema = readSchema();
  const files = listManifestFiles();
  const platformsInFiles = files.map((f) => f.replace(/\.json$/u, ''));

  assert.deepEqual(
    platformsInFiles,
    [...PLATFORMS_FROM_RAG_API].sort(),
    'La couverture des manifests ne correspond pas a la liste de plateformes RAG-API.md'
  );

  for (const file of files) {
    const manifest = readManifest(file);
    validateType(manifest, schema, file);
    assert.equal(manifest.platform, file.replace(/\.json$/u, ''), `${file}: platform doit matcher le nom de fichier`);
  }

  // Critere explicite T005: skillOrWorkflow invalide doit echouer.
  const sample = readManifest(files[0]);
  sample.skillOrWorkflow = 'InvalidValue';
  assert.throws(
    () => validateType(sample, schema, 'invalid-sample.json'),
    /enum/u,
    'Le validateur doit rejeter un skillOrWorkflow invalide'
  );

  console.log(`Validation OK: ${files.length} manifests plateforme valides.`);
}

main();
