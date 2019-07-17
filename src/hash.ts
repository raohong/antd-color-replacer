import * as crypto from 'crypto';

export default function hash(
  content: string,
  digest: crypto.HexBase64Latin1Encoding = 'hex'
): string {
  const m = crypto.createHash('md5');

  m.update(content);

  return m.digest(digest);
}
