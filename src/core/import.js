class Import {
	static raw(path) {
		return new Promise((resolve, reject) => {
			fetch(path)
				.then((response) => resolve(response.text()))
				.catch(reject)
		})
	}
}

export default Import
