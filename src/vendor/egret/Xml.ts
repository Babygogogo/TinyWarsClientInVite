
import * as web from "./WebCore";

export function parse(text: string): web.XML | null {
    return web.parseXML(text);
}
