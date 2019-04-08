exports.toJson = txt => {

	let obj = {}

	if (!/^\[.*?(?:\]$)/gm.test(txt)) return obj

	let comps = txt.match(/^\[.*?\]((\r|\n)((?!\[.*?\]).*))+/gm)

	comps.forEach(comp => {

		let compTitle = comp.match(
			/^\[.*?(?:\]$)/gm
		).join().replace('[','').replace(']','')

		if(/^(\w|\().*/gm.test(comp)) {
			obj[compTitle] = {}
			let lines = comp.match(/^(\w|\().*/gm)
			lines.forEach(line => {
				let field = line.match(/^.*?=/gm)
				field = field ? field.join('').replace(/=$/gm,'').replace(/'/gm,"''") : 'NULL'
				let value = line.match(/(?!\w)=.*/gm)
				value = value ? value.join('').replace(/^=/gm,'').replace(/'/gm,"''") : 'NULL'
				if(obj[compTitle][field] == undefined) {
					obj[compTitle][field] = value.trim()
				}
			})
		}
	})
	return obj
}