function E(x){return new OmegaNum(x)};

function sc_format(ex, acc=4, max=4) {
	ex = E(ex)
    neg = ex.lt(0)?"-":""
    if (ex.mag == Infinity) return neg + 'Infinity'
    if (Number.isNaN(ex.mag)) return neg + 'NaN'
    if (ex.lt(0)) ex = ex.mul(-1)
    if (ex.eq(0)) return ex.toFixed(acc)
	let e = ex.log10().floor()

	if (ex.log10().lt(Math.min(-acc,0)) && acc > 0) {
		let e = ex.log10().ceil()
		let m = ex.div(e.eq(-1)?E(0.1):E(10).pow(e))
		let be = e.mul(-1).max(1).log10().gte(9)
		return neg+(be?'':m.toFixed(4))+'e'+sc_format(ex, 0)
	} else if (e.lt(max)) {
		let a = Math.max(Math.min(acc-e.toNumber(), acc), 0)
		return neg+(a>0?ex.toFixed(a):ex.toFixed(a).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
	} else {
		if (ex.gte("eeee10")) {
			let slog = ex.slog()
			return (slog.gte(1e9)?'':E(10).pow(slog.sub(slog.floor())).toFixed(4)) + "F" + sc_format(slog.floor(), 0)
		}
		let m = ex.div(E(10).pow(e))
		let be = e.log10().gte(9)
		return neg+(be?'':m.toFixed(4))+'e'+sc_format(e, 0, max)
	}
}

const ILLIONS = {
	1: {
		data: {
			o_s: ['', 'thousand', 'm', 'b', 'tr', 'quadr', 'quint', 'sext', 'sept', 'oct', 'non'],

			o: ['', 'un', 'duo', 'tre', 'quattour', 'quin', 'sex', 'septen', 'octo', 'novem'],
			t: ['', 'dec', 'vigint', 'trigint', 'quadragint', 'quinquagint', 'sexagint', 'septuagint', 'octogint', 'nonagint'],
			h: ['', 'cent', 'ducent', 'tricent', 'quadragent', 'quinquagent', 'sexagent', 'septuagent', 'octogent', 'nonagent'],
		},
		format(x) {
			x = Number(x)

			var hto = HTO(x)
			var d = this.data
			var o = hto.o
			var t = hto.t
			var h = hto.h

			return d.o[o]+d.t[t]+this.combineTen(t,h)+d.h[h]
		},
		combineTen(t, h) {
			if (t == 0 || h == 0) return ""
			if (t >= 3) return "a"
			return "i"
		},
	},
	2: {
		data: {
			o_s: ["", "mill", "micr", "nan", "pic", "fem", "att", "zept", "yoct", "xon"],

			o: ["", "me", "due", "trio", "tetre", "pente", "hexe", "hepte", "octe", "enne"],
			te: ["vec", "mec", "duec", "trec", "tetrec", "pentec", "hexec", "heptec", "octec", "ennec"],
			d: ["", "", "do", "tria", "tetra", "penta", "hexa", "hepta", "octa", "ennea"],	
		},
		format(x, end, v) {
			x = Number(x)

			var hto = HTO(x)
			var d = this.data
			var o = hto.o
			var t = hto.t
			var h = hto.h
			var r = ""

			if (t == 1) r += d.te[o]
			else if (o > 0) {
				if (x < 10) r = d.o_s[o]
				else r = d.o[o]
			}
			if (t >= 2) {
				if (t == 2) r += "icos"
				else r += d.d[t] + "cont"
			}
			if (h > 0) {
				if (t > 0) r += "e"
				r += d.d[h] + "hect"
			}

			if (end) {
				if (x == 1) r += "i"
				if (x >= 2) r += "o"
				if (x >= 1) r += "-"
			}

			return r
		},
	},
	3: {
		data: {
			o_s: ["", "kill", "meg", "gig", "ter", "pet", "ex", "zett", "yott", "xenn"],
			o_s2: ["", "", "d", "tr", "t", "p", "ex", "z", "y", "n"],

			o: ["", "en", "od", "tr", "ter", "pet", "ex", "zet", "you", "xen"],
			o2: ["", "hend", "dok"],

			te: ["", "dak", "ik", "trak", "tek", "pek", "exak", "zak", "yok", "nek"],
			te2: ["", "dak", "ic", "trac", "tec", "pec", "exac", "zac", "yoc", "nec"], // -c only 2,3,4,7,9 ones

			d: ["", "ho", "do", "to", "tro", "pot", "exo", "zo", "yoo", "no"], // -t only 0,1,2,6 ones
		},
		format(x, end, v, opt) {
			x = Number(x)

			var hto = HTO(x)
			var d = this.data
			var o = hto.o
			var t = hto.t
			var h = hto.h
			var r = ""

			r += d.d[h]
			if (h > 0) {
				if ([0,1,2,6].includes(o)) r += "t"
			}
			if (t == 1) {
				r += d[o>2?"o":"o2"][o]
			}
			if (t == 1?o==0||o>2:true) r += d[[2,3,4,7,9].includes(o)?"te2":"te"][t]
			if (t != 1) {
				if (x < 10) r += d[v==4?o > 1 && opt?"o_s2":"o":"o_s"][o]
				else r += d.o[o]
			}

			if (end) {
				if (x == 1) r += "i"
				if (x >= 2) r += "a"
				if (x >= 1) r += "-"
			}

			return r
		},
	},
	4: {
		data: {
			o_s: ["", "kal", "mej", "gij", "ast", "lun", "ferm", "jov", "sol", "bet", "gloc", "gax", "sup", "vers", "mult", "met", "xev", "hyp", "omniv", "out"],
			o: ["", "al", "ej", "ij", "est", "un", "erm", "ov", "ol", "eet", "oc", "ax", "up", "ers", "ult", "ett", "ev", "ohyp", "omni", "ut"],
			o3: ["", "al", "ej", "ij", "ast", "un", "erm", "ov", "esol", "et"],

			te: ["", "", "barr", "garr", "aarr", "lunarr", "fermarr", "jovarr", "solarr", "betarr"], // -r
			te2: ["", "", "arr", "ogarr", "astarr", "unarr", "ermarr", "ovarr", "olarr", "etarr"],

			d: ["", "hu", "mu", "gu", "astu", "lu", "fu", "ju", "su", "bu"], // -t
		},
		format(x, end, v, opt) {
			x = Number(x)

			var hto = HTO(x)
			var d = this.data
			var o = hto.o
			var t = hto.t
			var h = hto.h
			var r = ""

			r += d.d[h]
			if (h > 0) {
				if (t == 0 || o == 0) r += "t"
			}
			if (t > 1) r += d[opt?"te2":"te"][t]+"e"+(o==0?"l":"")
			if (t < 2) {
				r += d[opt&&v!=5?"o":"o_s"][o+t*10]
			} else r += d.o_s[o]

			return r
		},
	},
	5: {
		data: {
			o: ["", "hep", "ott", "neg", "deg", "ung", "ent", "fit", "syt", "bront"],

			te: ["", "geop", "amos", "hapr", "kyr", "pij", "sagan", "pectr", "nisab", "zotz"],
			tea: ["", "gea", "ama", "hapa", "kya", "pia", "saga", "prea", "nia", "zoza"],

			d: ["", "alph", "bex", "gamm", "delt", "thet", "iot", "kapp", "lambd", "sigm"],
			da: ["", "alfa", "befa", "gafa", "defa", "thefa", "iofa", "kafa", "lafa", "sifa"],
		},
		format(x, end, v, opt) {
			x = Number(x)

			var hto = HTO(x)
			var d = this.data
			var o = hto.o
			var t = hto.t
			var h = hto.h
			var r = ""

			r += h>0&&(o>0||t>0) ? (d.da[h]+"'") : d.d[h]
			r += t>0&&o>0 ? (d.tea[t]+"'") : d.te[t]
			r += d.o[o]

			if (end) r += "e"

			return r
		},
	},
	6: {
		data: {
			base: ["", "pax", "dis", "tris", "kis"],
			base2: ["", "paki", "disyn", "tirsyn", "kisyn"],

			o: ["", "hena", "dya", "trya", "tetra", "penta", "hexa", "hepta", "octa", "enna", "deca",
			"hendeca", "dodeca", "tria", "tetra", "penta", "hexa", "hepta", "octa", "ennea"], // deca- after 12
			o2: ["", "heke", "dyke", "tryke", "tetrke", "penke", "hexke", "eptike", "oceke", "eneke"], // mult tier-7 (end)

			te: ["", "deca", "icos", "tria", "tessara", "pente", "hexe", "hebdome", "ogdo", "enene"], // -conta after 2
			te2: ["", "decise", "icoise", "tria", "tessara", "pente", "hexe", "hebdome", "ogdo", "enene"], // -cone after 2  // mult tier-7 (end)

			d: ["", "hecatonta", "di", "tri", "tetr", "pent", "hex", "hept", "oct", "enne"], // -acos(a/i) after 1
			d2: ["", "hecatise", "di", "tri", "tetr", "pent", "hex", "hept", "oct", "enne"], // -acise after 1  // mult tier-7 (end)
		},
		format(x, end, v, opt) {
			x = Number(x)

			var hto = HTO(x)
			var d = this.data
			var o = hto.o
			var t = hto.t
			var h = hto.h
			var r = ""

			if (v==7 && opt) {
				if (o == 0 && t == 0) r += d.d2[h] + (h>1?"acise":"")
				else if (o == 0) {
					r += d.d[h] + (h>1?"acos"+(o>0||t>0?"i":"a"):"")
					r += d.te2[t] + (t>2?"cone":"")
				} else {
					r += d.d[h] + (h>1?"acos"+(o>0||t>0?"i":"a"):"")
					r += d.te[t] + (t>2?"conta":"")
					r += d.o2[o]
				}
			} else {
				r += d.d[h] + (h>1?"acos"+(o>0||t>0?"i":"a"):"")
				if (t > 2) r += d.te[t] + (t>2?"conta":"")
				if (o==1 && !opt) r += "ha"
				if (x > 3) r += t < 2 ? (o+t*10 > 12 ? "deca" : "") + d.o[o+t*10] : d.o[o]
				r += d[end?"base2":"base"][Math.min(x,4)]
			}

			if (end) r += "-"

			return r
		},
	},
	7: {
		data: {
			o: ["", "red", "rang", "llow", "lim", "green", "cyan", "blu", "purpl", "magent"],
			o_end: ["", "redona", "range", "llo", "lime", "gree", "cya", "blue", "purple", "mage"],
			o2: ["", "redo", "ra", "llo", "limi", "gre", "cyani", "blui", "puri", "magi"],

			t: ["", "pink", "dik", "trik", "teetik", "peetik", "heexik", "heetik", "cctik", "nnik"], // -ona
			t2: ["", "pi", "diki", "triki", "teeti", "peeti", "heexi", "heeti", "cctki", "nnki"],

			d: ["", "viole", "diole", "triole", "teetiole", "peetiole", "heexiole", "heetiole", "cctiole", "nniole"], // -t
		},
		format(x, end, v, opt) {
			x = Number(x)

			var hto = HTO(x)
			var d = this.data
			var o = hto.o
			var t = hto.t
			var h = hto.h
			var r = ""

			var t8 = v == 8 || end

			if ((o == 2 || o == 3) && !(opt && v != 8)) r += ["o","ye"][o-2]
			r += (t == 0 && h == 0 && t8) ? d.o_end[o] : d[t > 0 || h > 0 ? "o2" : "o"][o]
			if (t > 7 && !(o > 0 || opt)) r += ["o","e"][t-8]
			if (t > 0) r += d[h > 0 ? "t2" : "t"][t] + ((h == 0 && t8)?"ona":"")
			if (h > 7 && !(o > 0 || t > 0 || opt)) r += ["o","e"][h-8]
			if (h > 0) r += d.d[h] + (t8?"":"t")

			if (end) r += "-"

			return r
		},
	},
	8: {
		data: {
			o: ["", "hydr", "hel", "lith", "beryll", "bor", "carb", "nitr", "oxyg", "fluor", "neo",
			"sod", "manges", "alum", "silic", "phosph", "sulf", "chl", "arg", "potass"], // -o except sulf

			t: ["", "ne", "hene", "line", "beryne", "bone", "cane", "nine", "oxone", "fluone"], // -o

			d: ["", "krypt", "herypt", "lirypt", "berypt", "borypt", "carkpt", "nirypt", "oxypt", "fluypt"], // -o
		},
		format(x, end, v, opt) {
			x = Number(x)

			var hto = HTO(x)
			var d = this.data
			var o = hto.o
			var t = hto.t
			var h = hto.h
			var r = ""

			if (h > 0) r += d.d[h] + (o > 0 || t > 0 ? "e" : "")
			if (t > 1) r += d.t[t] + (o > 0 ? "e" : "")
			if (t < 2) r += d.o[t*10+o]
			else r += d.o[o]

			if (end) r += "o'"

			return r
		},
	},
	other: {
		3: "e",
		5: "e",
		6: "a-",
	},
}

function tier(t2, t1, t, p) {
	if (!ILLIONS[t]) return ""

	let s = 0
	let final = ""

	let nt = t2.logBase(1e3).floor()

	if (nt.gte(1000)) return tier(nt, t2, t+1, p) 

	let nts = Number(nt)

	let t2s = t2.div(E(1e3).pow(nt.sub(p))).floor()
	let t1s = t1.div(E(1e3).pow(t2)).floor()

	let end = t1s.gt(1)

	if (t1s.gt(1)) final = ILLIONS[t-2].format(t1s) + final // ... + (ILLIONS.other[t-1]?ILLIONS.other[t-1]:"") + ...

	while (t2s.gt(0)) {
		let t2d = t2s.div(1e3).floor()
		let t2m = Number(t2s.mod(1e3).floor())
		let ntss = nts+s-p
		let a = false

		//console.log(ntss, t2m, t1s.toString())

		if (t2m>0 && ntss >= 0) {
			if (nt.gt(0)) {
				a = true
				final = ILLIONS[t].format(ntss, end, t-1, t2m > 1) + final
			}
			if (t2m > 1) final = ILLIONS[t-1].format(t2m, false, t, a) + (t2m > 1 && s > 0 ?ILLIONS.other[t]?ILLIONS.other[t]:"":"") + final

			//console.log(s, t2m, a)

			end = true
		}
		t2s = t2d
		s++
	}

	//if (t1s.gt(1) && t < 8) final = ILLIONS[t-2].format(t1s) + (ILLIONS.other[t-1]?ILLIONS.other[t-1]:"") + final // ......

	return final
}

function HTO(x) {
	return {
		h: Math.floor(x / 100),
		t: Math.floor(x / 10) % 10,
		o: x % 10
	}
}

function getHyperE(x, p=0) {
	x = E(x)
	if (x.lt(1e6)) return {num: 0, tier: 0}
	x = x.div(1e3)

	let y = x.slog(1e3)

	p = y.floor().gt(p)?p:0

	let t = y.floor().sub(p).max(0).toNumber()
	let n = E(1e3).tetr(y.sub(t)).floor()

	return {num: n, tier: t}
}

function st_format(x,acc=4,p=5) {
	x = E(x)
    neg = x.lt(0)?"-":""
    if (x.lt(0)) x = x.mul(-1)
    if (x.eq(0)) return x.toFixed(acc)

	let e = x.log10()
	let t1 = x.logBase(1e3).floor()

	if (t1.lt(1)) {
		return sc_format(x,acc)
	} else {
		let final = ""
		let e3m = t1.mul(3)
		let ee = t1.log10().floor()

		if (t1.lte(10)) final = ILLIONS[1].data.o_s[Number(t1)]
		else {
			t1 = t1.sub(1)

			let t2 = t1.logBase(1e3).floor()

			if (t2.gte(1000)) final = tier(t2, t1, 3, p)
			else {
				let s = 0

				let t1s = t2.gt(0)?t1.div(E(1e3).pow(t2.sub(p))):t1

				let end = false

				while (t1s.gt(0)) {
					let t1d = t1s.div(1e3).floor()
					let t1m = Number(t1s.mod(1e3).floor())
					let t2ss = t2.add(s-p)

					//console.log(t2ss.toNumber(), t1m, t1m>(t2ss.gt(0)?1:0))

					if (t1m>0) {
						if (t2.gt(0) && t2ss.gte(0)) final = ILLIONS[2].format(t2ss, end) + final
						if (t1m>(t2ss.gt(0)?1:0) && (t2.gt(0) ? t2ss.gte(0) : true)) final = ILLIONS[1].format(t1m) + final
					}
					end = end || t1m > 0
					t1s = t1d
					s++
				}
			}
		}

		let m = x.div(E(10).pow(e3m))
		return neg+(ee.gte(4)?"":m.toFixed(E(3).sub(e.sub(e3m)).add(acc==0?0:1).toNumber())+" ")+final+(t1.gt(1)?"illion":"")
	}
}
}
