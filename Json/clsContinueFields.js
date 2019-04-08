Number.prototype.pad = function(size) {
	var s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
}

module.exports.continueFields = jsonx => {
	let obj = JSON.parse( JSON.stringify( jsonx ) )
	Object.keys(obj).forEach(com => {
		let del = []
		Object.keys(obj[com]).forEach(item => {
			if(/\d{3}$/gi.test(item)){
				del.push(item)
			}
			if(/<CONTINUA>$/gi.test(obj[com][item]) && !/\d{3}$/gi.test(item)){
				let actual = item
				let next = item.match(/^(\w|\().+(?<!\d)/gm).join('') + 
					(!/\d{3}$/gi.test(item) ? '002' : (parseInt(item.match(/\d{3}$/gi).join(''))+1).pad(3))
				while(/<CONTINUA>$/gi.test(obj[com][actual]) && /^<CONTINUA>/gi.test(obj[com][next])){
					obj[com][item] = obj[com][item].replace(/<CONTINUA>$/gi,'')
					obj[com][next] = obj[com][next].replace(/^<CONTINUA>/gi,'')
					obj[com][item] = obj[com][item] + obj[com][next]
					actual = next
					next = actual.match(/^(\w|\().+(?<!\d)/gm).join('') + 
						(!/\d{3}$/gi.test(actual) ? '002' : (parseInt(actual.match(/\d{3}$/gi).join(''))+1).pad(3))
				}
				obj[com][item] = obj[com][item].replace(/<CONTINUA>$/gi,'')
			}
		})
		del.forEach(d => delete obj[com][d])
	})
	return obj
}

