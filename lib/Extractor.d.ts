import { AntdColorReplacerOptions } from './plugin';
export default class Extactor {
    private options;
    private colorRegs;
    private ruleChecker;
    constructor(options: AntdColorReplacerOptions);
    exec(assets: string): Promise<string>;
    /**
     * 提取 rule
     * @param assets
     */
    extractRule(assets: string): string;
}
