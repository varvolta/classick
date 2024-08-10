class Import {
	static raw(path: string) {
		return new Promise((resolve, reject) => {
			fetch(path)
				.then((response) => resolve(response.text()))
				.catch(reject)
		})
	}
}

export default Import
