class Raw {
	static import(path) {
		return new Promise((resolve, reject) => {
			fetch(path)
				.then((response) => resolve(response.text()))
				.catch(reject)
		})
	}
}

export default Raw
