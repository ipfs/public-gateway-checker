import { Log } from './Log'

const log = new Log('onScriptLoaded')

const onScriptLoaded = (src: ConstructorParameters<typeof URL>[0]) => {
  // eslint-disable-next-line no-alert
  alert('dont see me')
  log.error('You should never see this')
  throw new Error('THIS NEVER RUNS')
  // try {
  //   const url = new URL(src)
  //   const index = url.searchParams.get('i')
  //   if (index != null) {
  //     const node = window.checker.nodes[Number(index)]
  //     if (node != null) {
  //       log.debug(node.link.innerText)
  //       // node.checked()
  //     }
  //   }
  // } catch (e) {
  //   // this is a URL exception, we can do nothing, user is probably using Internet Explorer
  //   log.error(e)
  // }
}
export { onScriptLoaded }
