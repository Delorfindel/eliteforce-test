type RecoveryParamValue = string | string[] | undefined;

export type RecoveryParams = {
  access_token?: string;
  refresh_token?: string;
  token_hash?: string;
  type?: string;
};

type RecoveryParamsInput = {
  access_token?: RecoveryParamValue;
  refresh_token?: RecoveryParamValue;
  token_hash?: RecoveryParamValue;
  type?: RecoveryParamValue;
};

function normalizeParamValue(value: RecoveryParamValue) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseParamString(value: string) {
  const result: Partial<RecoveryParams> = {};

  for (const pair of value.split('&')) {
    if (!pair) {
      continue;
    }

    const [rawKey, rawValue = ''] = pair.split('=');
    const key = decodeURIComponent(rawKey.replace(/\+/g, ' '));
    const decodedValue = decodeURIComponent(rawValue.replace(/\+/g, ' '));

    if (!decodedValue) {
      continue;
    }

    if (
      key === 'access_token' ||
      key === 'refresh_token' ||
      key === 'token_hash' ||
      key === 'type'
    ) {
      result[key] = decodedValue;
    }
  }

  return result;
}

function parseRecoveryParamsFromUrl(url?: string) {
  if (!url) {
    return {};
  }

  const queryIndex = url.indexOf('?');
  const hashIndex = url.indexOf('#');
  const segments: string[] = [];

  if (queryIndex >= 0) {
    const queryEnd = hashIndex >= 0 && hashIndex > queryIndex ? hashIndex : url.length;
    segments.push(url.slice(queryIndex + 1, queryEnd));
  }

  if (hashIndex >= 0) {
    segments.push(url.slice(hashIndex + 1));
  }

  return segments.reduce<Partial<RecoveryParams>>(
    (accumulator, segment) => ({
      ...accumulator,
      ...parseParamString(segment),
    }),
    {},
  );
}

export function resolveRecoveryParams(params: RecoveryParamsInput, url?: string): RecoveryParams {
  const fallback = parseRecoveryParamsFromUrl(url);

  return {
    access_token: normalizeParamValue(params.access_token) ?? fallback.access_token,
    refresh_token: normalizeParamValue(params.refresh_token) ?? fallback.refresh_token,
    token_hash: normalizeParamValue(params.token_hash) ?? fallback.token_hash,
    type: normalizeParamValue(params.type) ?? fallback.type,
  };
}
