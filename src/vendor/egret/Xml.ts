
import { XML, parseXML } from "./WebCore";

export function parse(text: string): XML | null {
    return parseXML(text);
}
