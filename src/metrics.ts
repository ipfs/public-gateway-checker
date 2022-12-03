import Countly from 'countly-sdk-web'

const metricsConsent = localStorage.getItem('metrics_consent')

const banner = document.querySelector('.js-metrics-notification')
const declineWarning = document.querySelector('.js-metrics-notification-decline-warning')
const acceptButton = document.querySelector('.js-metrics-notification-accept')
const declineButton = document.querySelector('.js-metrics-notification-decline')
const declineWarningClose = document.querySelector('.js-metrics-notification-warning-close')

function addConsent (consent: string[]): void {
  banner?.classList.add('hidden')
  Countly.add_consent(consent)

  if (Array.isArray(consent)) {
    localStorage.setItem('metrics_consent', JSON.stringify(consent))
  } else {
    localStorage.setItem('metrics_consent', JSON.stringify([consent]))
  }
}

function addConsentEventHandler (): void {
  acceptButton?.removeEventListener('click', addConsentEventHandler)

  addConsent(['all'])
}

function declineConsentEventHandler (): void {
  acceptButton?.removeEventListener('click', addConsentEventHandler)
  banner?.classList.add('hidden')
  declineWarning?.classList.remove('hidden')

  addConsent(['necessary'])
}

function declineWarningCloseEventHandler (): void {
  declineWarningClose?.removeEventListener('click', declineWarningCloseEventHandler)
  declineWarning?.classList.add('hidden')
}

/**
 * Display the consent banner and handle the user's choice
 */
function displayConsentBanner (): void {
  banner?.classList.remove('hidden')
}
function loadCountly (): void {
  acceptButton?.addEventListener('click', addConsentEventHandler)
  declineButton?.addEventListener('click', declineConsentEventHandler)
  declineWarningClose?.addEventListener('click', declineWarningCloseEventHandler)
  Countly.init({
    app_key: '3c2c0819434074fc4d339ddd8e112a1e741ecb72',
    url: 'https://countly.ipfs.io',
    require_consent: true // this true means consent is required
  })
  /**
   * @see https://support.count.ly/hc/en-us/articles/360037441932-Web-analytics-JavaScript-#features-for-consent
   */
  const necessaryFeatures = ['sessions', 'views']
  const marketingFeatures = ['attribution', 'users', 'location']
  const performanceFeatures = ['events', 'crashes', 'apm']
  const trackingFeatures = ['scrolls', 'clicks', 'forms', 'star-rating', 'feedback']

  Countly.group_features({
    all: [...necessaryFeatures, ...marketingFeatures, ...performanceFeatures, ...trackingFeatures],
    necessary: necessaryFeatures,
    marketing: marketingFeatures,
    tracking: trackingFeatures,
    performance: performanceFeatures
  })

  /**
   * we can call all the helper methods we want, they won't record until consent is provided for specific features
   */
  //
  Countly.track_clicks()
  Countly.track_errors()
  Countly.track_forms()
  Countly.track_links()
  Countly.track_pageview()
  Countly.track_scrolls()
  Countly.track_sessions()
  Countly.track_view()

  if (metricsConsent != null) {
    try {
      addConsent(JSON.parse(metricsConsent))
    } catch {
      displayConsentBanner()
    }
  } else {
    displayConsentBanner()
  }
}

export {
  loadCountly,
  Countly
}
