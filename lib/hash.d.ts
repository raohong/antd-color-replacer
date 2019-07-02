/// <reference types="node" />
import * as crypto from 'crypto';
export default function hash(content: string, digest?: crypto.HexBase64Latin1Encoding): string;
