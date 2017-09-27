const hashToTest = 'Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a'
const hashString = 'Hello from IPFS Gateway Checker'

const $results = document.querySelector('#results')

function addNode (gateway, online, title) {
	const para = document.createElement('div')
	let node
	if (online) {
		node = document.createElement('strong')
		node.innerText = '✅ - Online  - ' + gateway
	} else {
		node = document.createElement('div')
		node.innerText = '❌ - Offline - ' + gateway
	}
	node.setAttribute('title', title)
	para.appendChild(node)
	$results.appendChild(para)
}

function updateStats (total, checked) {
	document.getElementById('stats').innerText = checked + '/' + total + ' gateways checked'
}

function checkGateways (gateways) {
  const total = gateways.length
  let checked = 0
  gateways.forEach((gateway) => {
    const gatewayAndHash = gateway.replace(':hash', hashToTest)
    fetch(gatewayAndHash)
      .then(res => res.text())
      .then((text) => {
        const matched = text.trim() === hashString.trim()
        addNode(gatewayAndHash, matched, matched ? 'All good' : 'Output did not match expected output')
        checked++
        updateStats(total, checked)
      }).catch((err) => {
        window.err = err
        addNode(gatewayAndHash, false, err)
        checked++
        updateStats(total, checked)
      })
  })
}

fetch('./gateways.json')
  .then(res => res.json())
  .then(gateways => checkGateways(gateways))
