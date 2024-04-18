const metricsConsent = localStorage.getItem('metrics_consent')

const metricsNotificationModal = document.querySelector('.js-metrics-notification-modal')
const metricsAgreementContent = document.querySelector('.js-metrics-agreement')
const metricsManagePreferencesContent = document.querySelector('.js-metrics-preferences')

const closeNotificationModalX = document.querySelector('.js-modal-close')
const confirmMetricNoticeBtn = document.querySelector('.js-metrics-notification-confirm')

const saveMetricPreferencesBtn = document.querySelector('.js-metrics-notification-preferences-save')

const managePreferencesBtn = document.querySelector('.js-metrics-notification-manage')
const necessaryMetricsToggle = document.querySelector('.js-necessary-toggle') as HTMLInputElement
const metricsModalToggle = document.querySelector('.js-metrics-modal-toggle')

function addConsent (consent: string[]): void {
  // TODO: add consent to metrics provider

  if (Array.isArray(consent)) {
    localStorage.setItem('metrics_consent', JSON.stringify(consent))
  } else {
    localStorage.setItem(
      'metrics_consent',
      JSON.stringify([consent]),
    )
  }
}

function addConsentEventHandler (): void {
  metricsNotificationModal?.classList.add('hidden')

  addConsent(['minimal'])
}

function updateNecessaryMetricPreferences (): void {
  const necessaryMetricsAccepted = necessaryMetricsToggle.checked

  if (necessaryMetricsAccepted) {
    addConsent(['minimal'])
  } else {
    // TODO: remove consent from metrics provider
    localStorage.setItem('metrics_consent', JSON.stringify([]))
  }
}

function initMetricsModal (): void {
  metricsNotificationModal?.classList.remove('hidden')
  confirmMetricNoticeBtn?.classList.remove('hidden')
  managePreferencesBtn?.classList.remove('hidden')
  metricsAgreementContent?.classList.remove('hidden')
  closeNotificationModalX?.addEventListener('click', hideMetricsModal)
  confirmMetricNoticeBtn?.addEventListener('click', addConsentEventHandler)
  managePreferencesBtn?.addEventListener('click', managePreferencesClicked)
}

function hideMetricsModal (): void {
  metricsNotificationModal?.classList.add('hidden')
  metricsManagePreferencesContent?.classList.add('hidden')
  metricsAgreementContent?.classList.remove('hidden')
}

function managePreferencesClicked (): void {
  const metricsConsent = localStorage.getItem('metrics_consent')
  if (metricsConsent != null) necessaryMetricsToggle.checked = JSON.parse(metricsConsent)[0] === 'minimal'
  metricsAgreementContent?.classList.add('hidden')
  saveMetricPreferencesBtn?.classList.remove('hidden')
  metricsManagePreferencesContent?.classList.remove('hidden')

  necessaryMetricsToggle.addEventListener('click', updateNecessaryMetricPreferences)
  saveMetricPreferencesBtn?.addEventListener('click', hideMetricsModal)
}

function metricsModalToggleEventHandler (): void {
  initMetricsModal()
}

function loadMetrics (): void {
  metricsModalToggle?.addEventListener('click', metricsModalToggleEventHandler)
  // TODO: initialize metrics provider

  if (metricsConsent != null) {
    addConsent(JSON.parse(metricsConsent))
  } else {
    addConsent(['minimal'])
  }
}

export { loadMetrics }
