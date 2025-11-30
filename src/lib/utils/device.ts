type DeviceType = 'android' | 'ios' | 'desktop'

function is_android(): boolean {
	return navigator.userAgent.toLowerCase().includes('android')
}

function is_iphone(): boolean {
	return navigator.userAgent.toLowerCase().includes('iphone')
}

function is_ipad(): boolean {
	return navigator.userAgent.toLowerCase().includes('ipad')
}

function is_ios(): boolean {
	return is_iphone() || is_ipad()
}

function get_device_type(): DeviceType {
	if (is_ios()) return 'ios'
	if (is_android()) return 'android'
	return 'desktop'
}

export const device = {
	get_device_type,
	is_android,
	is_iphone,
	is_ipad,
	is_ios,
}

export type { DeviceType }
