// The generated adapter stays untouched. This version-controlled entry wraps it.
import openNext from "../.open-next/worker.js";
export {
  DOQueueHandler,
  DOShardedTagCache,
  BucketCachePurge,
} from "../.open-next/worker.js";
import { createSiteWorker } from "./lib/site-worker.ts";
export default createSiteWorker(openNext);
