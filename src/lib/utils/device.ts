export type DeviceType = 'android' | 'ios' | 'desktop'

export function get_device_type(): DeviceType {
	const user_agent = navigator.userAgent.toLowerCase()
	if (user_agent.includes('android')) return 'android'
	if (user_agent.includes('iphone') || user_agent.includes('ipad')) return 'ios'
	return 'desktop'
}

export function is_android(): boolean {
	return navigator.userAgent.toLowerCase().includes('android')
}
