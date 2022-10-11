import Countly from 'countly-sdk-web'

Countly.q = Countly.q ?? []

/**
 * metrics consent and GDPR stuffs
 *
 * @see https://support.count.ly/hc/en-us/articles/360037441932-Web-analytics-JavaScript-#features-for-consent
 */
Countly.require_consent = true
Countly.app_key = '3c2c0819434074fc4d339ddd8e112a1e741ecb72'
Countly.url = 'https://countly.ipfs.io'

// Start pushing function calls to queue
// Track sessions automatically (recommended)
Countly.q.push(['track_sessions'])

// track web page views automatically (recommended)
Countly.q.push(['track_pageview'])

const metricsConsent = localStorage.getItem('metrics_consent')
function addConsent (): void {
  Countly.add_consent('all')
  const banner = document.querySelector('#metrics-notification')
  banner?.classList.add('hidden')
  localStorage.setItem('metrics_consent', 'true')
}
/**
 * Display the consent banner and handle the user's choice
 */
function displayConsentBanner (): void {
  const banner = document.querySelector('#metrics-notification')
  banner?.classList.remove('hidden')
  const acceptButton = document.querySelector('#metrics-notification-accept')
  acceptButton?.addEventListener('click', addConsent)
}

function loadCountly (): void {
  Countly.init()
  Countly.group_features({
    all: ['sessions', 'events', 'views'] // , 'scrolls', 'clicks', 'forms', 'crashes', 'attribution', 'users']
  })
  if (metricsConsent === 'true') {
    addConsent()
  } else {
    displayConsentBanner()
  }
}

document.querySelector('#metrics-notification')

export {
  loadCountly,
  Countly
}
