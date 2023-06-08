// import { Log } from './Log'
// const log = new Log('checkViaImgSrc')
async function checkViaImgSrc(imgUrl) {
    // we check if gateway is up by loading 1x1 px image:
    // this is more robust check than loading js, as it won't be blocked
    // by privacy protections present in modern browsers or in extensions such as Privacy Badger
    const imgCheckTimeout = 15000;
    await new Promise((resolve, reject) => {
        const img = new Image();
        const timer = setTimeout(() => {
            // clearTimeout(timer)
            reject(new Error(`Timeout when attempting to load img from '${img.src}`));
        }, imgCheckTimeout);
        // const timeout = () => {
        //   if (timer == null) {
        //     return false
        //   }
        //   clearTimeout(timer)
        //   // timer = null
        //   return true
        // }
        const onImageError = (event, source, lineno, colno, error) => {
            clearTimeout(timer);
            if (error == null) {
                reject(new Error(`Unknown Error when attempting to load img from '${img.src}`));
            }
            else {
                reject(error);
            }
        };
        img.onerror = onImageError;
        img.onload = () => {
            // subdomain works
            // timeout()
            clearTimeout(timer);
            resolve();
        };
        img.src = imgUrl.toString();
    });
}
export { checkViaImgSrc };
//# sourceMappingURL=checkViaImgSrc.js.map