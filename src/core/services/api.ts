class Api {
	#token: string
	#url: string

	constructor(...paths: string[]) {
		this.#token = ''
		this.#url = paths.join('/')
	}

	get token() {
		return this.#token
	}

	set token(value) {
		this.#token = value
	}

	request(path: string, options: RequestInit) {
		options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...(this.#token?.length ? { Authorization: `Bearer ${this.#token}` } : {})
			},
			...options
		}

		let url = this.#url
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

	get(path: string, options: RequestInit = {}) {
		return this.request(path, options)
	}

	post(path: string, payload: any, options: RequestInit = {}) {
		return this.request(path, {
			method: 'POST',
			body: JSON.stringify(payload),
			...options
		})
	}

	put(path: string, payload: any, options: RequestInit = {}) {
		return this.request(path, {
			method: 'PUT',
			body: JSON.stringify(payload),
			...options
		})
	}

	delete(path: string, payload: any, options: RequestInit = {}) {
		return this.request(path, {
			method: 'DELETE',
			body: payload ? JSON.stringify(payload) : undefined,
			...options
		})
	}
}

export default Api
