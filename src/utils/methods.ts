export const methodsOf = (object: any) => {
	if (!object) return []
	let keys: string[] = []
	let _object = object // IMPORTANT: Needed to not throw error when accessing a getter

	const methods = (property: string, i: number, properties: string[]) =>
		typeof _object[property] === 'function' &&
		property !== 'constructor' &&
		(i === 0 || property !== properties[i - 1]) && // not overriding in this prototype
		keys.indexOf(property) === -1 // not overridden in a child

	do {
		const properties = Object.getOwnPropertyNames(_object).sort().filter(methods)
		keys = keys.concat(properties)
		_object = Object.getPrototypeOf(_object)
	} while (_object && Object.getPrototypeOf(_object))

	return keys
}
