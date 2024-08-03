class Api {
	#token

	constructor(...paths) {
		this.url = paths.join('/')
	}

	set token(value) {
		this.#token = value
	}

	get token() {
		return this.#token
	}

	request(path, options) {
		options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...(this.#token ? { Authorization: `Bearer ${this.#token}` } : {})
			},
			...options
		}

		let url = this.url
		if (path?.length) url += '/' + path

		return new Promise((resolve, reject) => {
			fetch(url, options)
				.then((res) => {
					if (!res.ok) throw new Error(res.statusText)
					return res.json()
				})
				.then((res) => resolve(res))
				.catch((err) => reject(err))
		})
	}

	get(path, options = {}) {
		return this.request(path, options)
	}

	post(path, payload, options = {}) {
		return this.request(path, {
			method: 'POST',
			body: JSON.stringify(payload),
			...options
		})
	}

	put(path, payload, options = {}) {
		return this.request(path, {
			method: 'PUT',
			body: JSON.stringify(payload),
			...options
		})
	}

	delete(path, payload, options = {}) {
		return this.request(path, {
			method: 'DELETE',
			body: payload ? JSON.stringify(payload) : undefined,
			...options
		})
	}
}

export default Api
