type DeviceType = 'android' | 'ios' | 'desktop'

function get_device_type(): DeviceType {
	const user_agent = navigator.userAgent.toLowerCase()
	if (user_agent.includes('android')) return 'android'
	if (user_agent.includes('iphone') || user_agent.includes('ipad')) return 'ios'
	return 'desktop'
}

function is_android(): boolean {
	return navigator.userAgent.toLowerCase().includes('android')
}

function is_iphone(): boolean {
	return navigator.userAgent.toLowerCase().includes('iphone')
}

export const device = {
	get_device_type,
	is_android,
	is_iphone,
}

export type { DeviceType }
