import * as web from "./WebCore";
import * as sys from "./SysCore";
import * as processor from "./ProcessorCore";
import { initializeRuntime } from "./Runtime";

// Wire reverse dependencies only after all core class definitions have evaluated.
initializeRuntime({ web, sys, processor });
