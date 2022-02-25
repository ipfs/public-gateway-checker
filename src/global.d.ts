import { Tag } from './Tag';
import { create } from 'ipfs-http-client'

interface Check {
    tag: Tag;

    // @todo: Update to async/await
    // check(): Promise<void>
    check(): void
    checked(): void

    onerror(): void
}
declare global {
    interface Window {
        IpfsHttpClient: typeof create
    }
}
