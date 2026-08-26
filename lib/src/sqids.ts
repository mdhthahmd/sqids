type SqidsInteger<Mode extends "number" | "bigint"> = Mode extends "bigint"
	? bigint
	: number;

/** Configuration options for a {@link Sqids} instance. */
export interface SqidsOptions<Mode extends "number" | "bigint" = "number"> {
	/**
	 * Characters used to generate IDs. Must contain at least three unique,
	 * single-byte characters.
	 *
	 * @defaultValue `defaultOptions.alphabet`
	 */
	alphabet?: string;
	/**
	 * Minimum length of generated IDs. Must be an integer between 0 and 255.
	 *
	 * @defaultValue 0
	 */
	minLength?: number;
	/**
	 * Words and IDs that generated IDs should avoid. Providing this option
	 * replaces the default blocklist; use an empty set to disable blocking.
	 *
	 * @defaultValue `defaultOptions.blocklist`
	 */
	blocklist?: ReadonlySet<string>;
	/**
	 * Integer type accepted by {@link Sqids.encode} and returned by
	 * {@link Sqids.decode}. BigInt mode supports values through `2n ** 64n - 1n`.
	 *
	 * @defaultValue `"number"`
	 */
	mode?: Mode;
}

const maxUint64 = (1n << 64n) - 1n;

export const defaultOptions = {
	alphabet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
	minLength: 0,
	mode: "number" as const,
	blocklist: new Set<string>([
		"0rgasm",
		"1d10t",
		"1d1ot",
		"1di0t",
		"1diot",
		"1eccacu10",
		"1eccacu1o",
		"1eccacul0",
		"1eccaculo",
		"1mbec11e",
		"1mbec1le",
		"1mbeci1e",
		"1mbecile",
		"a11upat0",
		"a11upato",
		"a1lupat0",
		"a1lupato",
		"aand",
		"ah01e",
		"ah0le",
		"aho1e",
		"ahole",
		"al1upat0",
		"al1upato",
		"allupat0",
		"allupato",
		"ana1",
		"ana1e",
		"anal",
		"anale",
		"anus",
		"arrapat0",
		"arrapato",
		"arsch",
		"arse",
		"ass",
		"b00b",
		"b00be",
		"b01ata",
		"b0ceta",
		"b0iata",
		"b0ob",
		"b0obe",
		"b0sta",
		"b1tch",
		"b1te",
		"b1tte",
		"ba1atkar",
		"balatkar",
		"bastard0",
		"bastardo",
		"batt0na",
		"battona",
		"bitch",
		"bite",
		"bitte",
		"bo0b",
		"bo0be",
		"bo1ata",
		"boceta",
		"boiata",
		"boob",
		"boobe",
		"bosta",
		"bran1age",
		"bran1er",
		"bran1ette",
		"bran1eur",
		"bran1euse",
		"branlage",
		"branler",
		"branlette",
		"branleur",
		"branleuse",
		"c0ck",
		"c0g110ne",
		"c0g11one",
		"c0g1i0ne",
		"c0g1ione",
		"c0gl10ne",
		"c0gl1one",
		"c0gli0ne",
		"c0glione",
		"c0na",
		"c0nnard",
		"c0nnasse",
		"c0nne",
		"c0u111es",
		"c0u11les",
		"c0u1l1es",
		"c0u1lles",
		"c0ui11es",
		"c0ui1les",
		"c0uil1es",
		"c0uilles",
		"c11t",
		"c11t0",
		"c11to",
		"c1it",
		"c1it0",
		"c1ito",
		"cabr0n",
		"cabra0",
		"cabrao",
		"cabron",
		"caca",
		"cacca",
		"cacete",
		"cagante",
		"cagar",
		"cagare",
		"cagna",
		"cara1h0",
		"cara1ho",
		"caracu10",
		"caracu1o",
		"caracul0",
		"caraculo",
		"caralh0",
		"caralho",
		"cazz0",
		"cazz1mma",
		"cazzata",
		"cazzimma",
		"cazzo",
		"ch00t1a",
		"ch00t1ya",
		"ch00tia",
		"ch00tiya",
		"ch0d",
		"ch0ot1a",
		"ch0ot1ya",
		"ch0otia",
		"ch0otiya",
		"ch1asse",
		"ch1avata",
		"ch1er",
		"ch1ng0",
		"ch1ngadaz0s",
		"ch1ngadazos",
		"ch1ngader1ta",
		"ch1ngaderita",
		"ch1ngar",
		"ch1ngo",
		"ch1ngues",
		"ch1nk",
		"chatte",
		"chiasse",
		"chiavata",
		"chier",
		"ching0",
		"chingadaz0s",
		"chingadazos",
		"chingader1ta",
		"chingaderita",
		"chingar",
		"chingo",
		"chingues",
		"chink",
		"cho0t1a",
		"cho0t1ya",
		"cho0tia",
		"cho0tiya",
		"chod",
		"choot1a",
		"choot1ya",
		"chootia",
		"chootiya",
		"cl1t",
		"cl1t0",
		"cl1to",
		"clit",
		"clit0",
		"clito",
		"cock",
		"cog110ne",
		"cog11one",
		"cog1i0ne",
		"cog1ione",
		"cogl10ne",
		"cogl1one",
		"cogli0ne",
		"coglione",
		"cona",
		"connard",
		"connasse",
		"conne",
		"cou111es",
		"cou11les",
		"cou1l1es",
		"cou1lles",
		"coui11es",
		"coui1les",
		"couil1es",
		"couilles",
		"cracker",
		"crap",
		"cu10",
		"cu1att0ne",
		"cu1attone",
		"cu1er0",
		"cu1ero",
		"cu1o",
		"cul0",
		"culatt0ne",
		"culattone",
		"culer0",
		"culero",
		"culo",
		"cum",
		"cunt",
		"d11d0",
		"d11do",
		"d1ck",
		"d1ld0",
		"d1ldo",
		"damn",
		"de1ch",
		"deich",
		"depp",
		"di1d0",
		"di1do",
		"dick",
		"dild0",
		"dildo",
		"dyke",
		"encu1e",
		"encule",
		"enema",
		"enf01re",
		"enf0ire",
		"enfo1re",
		"enfoire",
		"estup1d0",
		"estup1do",
		"estupid0",
		"estupido",
		"etr0n",
		"etron",
		"f0da",
		"f0der",
		"f0ttere",
		"f0tters1",
		"f0ttersi",
		"f0tze",
		"f0utre",
		"f1ca",
		"f1cker",
		"f1ga",
		"fag",
		"fica",
		"ficker",
		"figa",
		"foda",
		"foder",
		"fottere",
		"fotters1",
		"fottersi",
		"fotze",
		"foutre",
		"fr0c10",
		"fr0c1o",
		"fr0ci0",
		"fr0cio",
		"fr0sc10",
		"fr0sc1o",
		"fr0sci0",
		"fr0scio",
		"froc10",
		"froc1o",
		"froci0",
		"frocio",
		"frosc10",
		"frosc1o",
		"frosci0",
		"froscio",
		"fuck",
		"g00",
		"g0o",
		"g0u1ne",
		"g0uine",
		"gandu",
		"go0",
		"goo",
		"gou1ne",
		"gouine",
		"gr0gnasse",
		"grognasse",
		"haram1",
		"harami",
		"haramzade",
		"hund1n",
		"hundin",
		"id10t",
		"id1ot",
		"idi0t",
		"idiot",
		"imbec11e",
		"imbec1le",
		"imbeci1e",
		"imbecile",
		"j1zz",
		"jerk",
		"jizz",
		"k1ke",
		"kam1ne",
		"kamine",
		"kike",
		"leccacu10",
		"leccacu1o",
		"leccacul0",
		"leccaculo",
		"m1erda",
		"m1gn0tta",
		"m1gnotta",
		"m1nch1a",
		"m1nchia",
		"m1st",
		"mam0n",
		"mamahuev0",
		"mamahuevo",
		"mamon",
		"masturbat10n",
		"masturbat1on",
		"masturbate",
		"masturbati0n",
		"masturbation",
		"merd0s0",
		"merd0so",
		"merda",
		"merde",
		"merdos0",
		"merdoso",
		"mierda",
		"mign0tta",
		"mignotta",
		"minch1a",
		"minchia",
		"mist",
		"musch1",
		"muschi",
		"n1gger",
		"neger",
		"negr0",
		"negre",
		"negro",
		"nerch1a",
		"nerchia",
		"nigger",
		"orgasm",
		"p00p",
		"p011a",
		"p01la",
		"p0l1a",
		"p0lla",
		"p0mp1n0",
		"p0mp1no",
		"p0mpin0",
		"p0mpino",
		"p0op",
		"p0rca",
		"p0rn",
		"p0rra",
		"p0uff1asse",
		"p0uffiasse",
		"p1p1",
		"p1pi",
		"p1r1a",
		"p1rla",
		"p1sc10",
		"p1sc1o",
		"p1sci0",
		"p1scio",
		"p1sser",
		"pa11e",
		"pa1le",
		"pal1e",
		"palle",
		"pane1e1r0",
		"pane1e1ro",
		"pane1eir0",
		"pane1eiro",
		"panele1r0",
		"panele1ro",
		"paneleir0",
		"paneleiro",
		"patakha",
		"pec0r1na",
		"pec0rina",
		"pecor1na",
		"pecorina",
		"pen1s",
		"pendej0",
		"pendejo",
		"penis",
		"pip1",
		"pipi",
		"pir1a",
		"pirla",
		"pisc10",
		"pisc1o",
		"pisci0",
		"piscio",
		"pisser",
		"po0p",
		"po11a",
		"po1la",
		"pol1a",
		"polla",
		"pomp1n0",
		"pomp1no",
		"pompin0",
		"pompino",
		"poop",
		"porca",
		"porn",
		"porra",
		"pouff1asse",
		"pouffiasse",
		"pr1ck",
		"prick",
		"pussy",
		"put1za",
		"puta",
		"puta1n",
		"putain",
		"pute",
		"putiza",
		"puttana",
		"queca",
		"r0mp1ba11e",
		"r0mp1ba1le",
		"r0mp1bal1e",
		"r0mp1balle",
		"r0mpiba11e",
		"r0mpiba1le",
		"r0mpibal1e",
		"r0mpiballe",
		"rand1",
		"randi",
		"rape",
		"recch10ne",
		"recch1one",
		"recchi0ne",
		"recchione",
		"retard",
		"romp1ba11e",
		"romp1ba1le",
		"romp1bal1e",
		"romp1balle",
		"rompiba11e",
		"rompiba1le",
		"rompibal1e",
		"rompiballe",
		"ruff1an0",
		"ruff1ano",
		"ruffian0",
		"ruffiano",
		"s1ut",
		"sa10pe",
		"sa1aud",
		"sa1ope",
		"sacanagem",
		"sal0pe",
		"salaud",
		"salope",
		"saugnapf",
		"sb0rr0ne",
		"sb0rra",
		"sb0rrone",
		"sbattere",
		"sbatters1",
		"sbattersi",
		"sborr0ne",
		"sborra",
		"sborrone",
		"sc0pare",
		"sc0pata",
		"sch1ampe",
		"sche1se",
		"sche1sse",
		"scheise",
		"scheisse",
		"schlampe",
		"schwachs1nn1g",
		"schwachs1nnig",
		"schwachsinn1g",
		"schwachsinnig",
		"schwanz",
		"scopare",
		"scopata",
		"sexy",
		"sh1t",
		"shit",
		"slut",
		"sp0mp1nare",
		"sp0mpinare",
		"spomp1nare",
		"spompinare",
		"str0nz0",
		"str0nza",
		"str0nzo",
		"stronz0",
		"stronza",
		"stronzo",
		"stup1d",
		"stupid",
		"succh1am1",
		"succh1ami",
		"succhiam1",
		"succhiami",
		"sucker",
		"t0pa",
		"tapette",
		"test1c1e",
		"test1cle",
		"testic1e",
		"testicle",
		"tette",
		"topa",
		"tr01a",
		"tr0ia",
		"tr0mbare",
		"tr1ng1er",
		"tr1ngler",
		"tring1er",
		"tringler",
		"tro1a",
		"troia",
		"trombare",
		"turd",
		"twat",
		"vaffancu10",
		"vaffancu1o",
		"vaffancul0",
		"vaffanculo",
		"vag1na",
		"vagina",
		"verdammt",
		"verga",
		"w1chsen",
		"wank",
		"wichsen",
		"x0ch0ta",
		"x0chota",
		"xana",
		"xoch0ta",
		"xochota",
		"z0cc01a",
		"z0cc0la",
		"z0cco1a",
		"z0ccola",
		"z1z1",
		"z1zi",
		"ziz1",
		"zizi",
		"zocc01a",
		"zocc0la",
		"zocco1a",
		"zoccola",
	]),
};

const internalDefaultOptions = {
	alphabet: defaultOptions.alphabet,
	minLength: defaultOptions.minLength,
	mode: defaultOptions.mode,
	blocklist: new Set(defaultOptions.blocklist),
};

/**
 * Encodes one or more non-negative integers into short, deterministic IDs and
 * decodes those IDs back into their original values.
 *
 * Sqids is not encryption: generated IDs should not be used to hide secrets or
 * sensitive information. Use `mode: "bigint"` for values larger than
 * `Number.MAX_SAFE_INTEGER`.
 *
 * @example Basic usage
 * ```ts
 * const sqids = new Sqids();
 * const id = sqids.encode([1, 2, 3]);
 * const numbers = sqids.decode(id); // [1, 2, 3]
 * ```
 *
 * @example BigInt usage
 * ```ts
 * const sqids = new Sqids({ mode: "bigint" });
 * const id = sqids.encode([1n, 2n, 3n]);
 * const numbers = sqids.decode(id); // [1n, 2n, 3n]
 * ```
 */
export default class Sqids<Mode extends "number" | "bigint" = "number"> {
	private alphabet: string;
	private minLength: number;
	private blocklist: Set<string>;
	private mode: Mode;

	constructor(options?: SqidsOptions<Mode>) {
		if (
			options !== undefined &&
			(typeof options !== "object" ||
				options === null ||
				Array.isArray(options))
		) {
			throw new Error("Options must be an object");
		}

		const alphabet = options?.alphabet ?? internalDefaultOptions.alphabet;
		const minLength = options?.minLength ?? internalDefaultOptions.minLength;
		const blocklist = options?.blocklist ?? internalDefaultOptions.blocklist;
		const mode = options?.mode ?? internalDefaultOptions.mode;

		if (mode !== "number" && mode !== "bigint") {
			throw new Error('Mode must be either "number" or "bigint"');
		}
		this.mode = mode as Mode;

		if (typeof alphabet !== "string") {
			throw new Error("Alphabet must be a string");
		}

		if (new Blob([alphabet]).size !== alphabet.length) {
			throw new Error("Alphabet cannot contain multibyte characters");
		}

		const minAlphabetLength = 3;
		if (alphabet.length < minAlphabetLength) {
			throw new Error(`Alphabet length must be at least ${minAlphabetLength}`);
		}

		if (new Set(alphabet).size !== alphabet.length) {
			throw new Error("Alphabet must contain unique characters");
		}

		const minLengthLimit = 255;
		if (
			!Number.isInteger(minLength) ||
			minLength < 0 ||
			minLength > minLengthLimit
		) {
			throw new Error(
				`Minimum length has to be between 0 and ${minLengthLimit}`,
			);
		}

		if (!(blocklist instanceof Set)) {
			throw new Error("Blocklist must be a Set of strings");
		}

		const filteredBlocklist = new Set<string>();
		const alphabetChars = alphabet.toLowerCase().split("");
		for (const word of blocklist) {
			if (typeof word !== "string") {
				throw new Error("Blocklist must contain only strings");
			}
			if (word.length >= 3) {
				const wordLowercased = word.toLowerCase();
				const wordChars = wordLowercased.split("");
				const intersection = wordChars.filter((c) => alphabetChars.includes(c));
				if (intersection.length === wordChars.length) {
					filteredBlocklist.add(wordLowercased);
				}
			}
		}

		this.alphabet = this.shuffle(alphabet);
		this.minLength = minLength;
		this.blocklist = filteredBlocklist;
	}

	/**
	 * Encodes an array of non-negative integers into a deterministic ID.
	 *
	 * In the default number mode, every value must be a safe integer. In BigInt
	 * mode, every value must be between `0n` and `2n ** 64n - 1n`. An empty array
	 * produces an empty string.
	 *
	 * @param numbers - The integers to encode, in the order they should be recovered.
	 * @returns The encoded ID.
	 * @throws If a value has the wrong type or is outside the supported range.
	 *
	 * @example
	 * ```ts
	 * const sqids = new Sqids();
	 * const id = sqids.encode([1, 2, 3]); // "86Rf07"
	 * ```
	 */
	encode(numbers: readonly SqidsInteger<Mode>[]): string {
		if (numbers.length === 0) {
			return "";
		}

		const normalizedNumbers = numbers.map((number) => {
			if (this.mode === "bigint") {
				if (
					typeof number !== "bigint" ||
					number < 0n ||
					number > this.maxValue()
				) {
					throw new Error(
						`Encoding supports bigints between 0n and ${this.maxValue()}n`,
					);
				}

				return number;
			}

			if (
				typeof number !== "number" ||
				!Number.isSafeInteger(number) ||
				number < 0
			) {
				throw new Error(
					`Encoding supports numbers between 0 and ${this.maxValue()}`,
				);
			}

			return BigInt(number);
		});

		return this.encodeNumbers(normalizedNumbers);
	}

	/**
	 * Decodes an ID into its original integers.
	 *
	 * Returns an empty array when the ID is empty, contains a character outside
	 * the configured alphabet, or represents a value unsupported by the current
	 * mode. More than one ID can decode to the same values; re-encode the result
	 * and compare IDs when canonical input is required.
	 *
	 * @param id - The Sqids ID to decode.
	 * @returns The decoded values as numbers, or as bigints in BigInt mode.
	 *
	 * @example
	 * ```ts
	 * const sqids = new Sqids();
	 * const numbers = sqids.decode("86Rf07"); // [1, 2, 3]
	 * ```
	 */
	decode(id: string): SqidsInteger<Mode>[] {
		const ret: bigint[] = [];

		if (id === "") {
			return ret as SqidsInteger<Mode>[];
		}

		const alphabetChars = this.alphabet.split("");
		for (const c of id.split("")) {
			if (!alphabetChars.includes(c)) {
				return ret as SqidsInteger<Mode>[];
			}
		}

		const prefix = id.charAt(0);
		const offset = this.alphabet.indexOf(prefix);
		let alphabet = this.alphabet.slice(offset) + this.alphabet.slice(0, offset);
		alphabet = alphabet.split("").reverse().join("");
		let slicedId = id.slice(1);

		while (slicedId.length > 0) {
			const separator = alphabet.slice(0, 1);

			const chunks = slicedId.split(separator);
			if (chunks.length > 0) {
				const chunk = chunks[0];
				if (!chunk) {
					return (
						this.mode === "bigint" ? ret : ret.map(Number)
					) as SqidsInteger<Mode>[];
				}

				const number = this.toNumber(chunk, alphabet.slice(1));
				if (number > this.maxValue()) {
					return [] as SqidsInteger<Mode>[];
				}

				ret.push(number);
				if (chunks.length > 1) {
					alphabet = this.shuffle(alphabet);
				}
			}

			slicedId = chunks.slice(1).join(separator);
		}

		if (this.mode === "bigint") {
			return ret as SqidsInteger<Mode>[];
		}

		return ret.map(Number) as SqidsInteger<Mode>[];
	}

	private encodeNumbers(numbers: bigint[], increment = 0): string {
		if (increment > this.alphabet.length) {
			throw new Error("Reached max attempts to re-generate the ID");
		}

		const alphabetLength = BigInt(this.alphabet.length);
		let offset = Number(
			numbers.reduce((a, v, i) => {
				const alphabetIndex = Number(v % alphabetLength);
				const codePoint = this.alphabet.charCodeAt(alphabetIndex);

				return a + BigInt(codePoint + i);
			}, BigInt(numbers.length)) % alphabetLength,
		);

		offset = (offset + increment) % this.alphabet.length;
		let alphabet = this.alphabet.slice(offset) + this.alphabet.slice(0, offset);
		const prefix = alphabet.charAt(0);
		alphabet = alphabet.split("").reverse().join("");
		const ret = [prefix];

		for (const [i, num] of numbers.entries()) {
			ret.push(this.toId(num, alphabet.slice(1)));
			if (i < numbers.length - 1) {
				ret.push(alphabet.slice(0, 1));
				alphabet = this.shuffle(alphabet);
			}
		}

		let id = ret.join("");

		if (this.minLength > id.length) {
			id += alphabet.slice(0, 1);

			while (this.minLength - id.length > 0) {
				alphabet = this.shuffle(alphabet);
				id += alphabet.slice(
					0,
					Math.min(this.minLength - id.length, alphabet.length),
				);
			}
		}

		if (this.isBlockedId(id)) {
			id = this.encodeNumbers(numbers, increment + 1);
		}

		return id;
	}

	private shuffle(alphabet: string): string {
		const chars = alphabet.split("");

		for (let i = 0, j = chars.length - 1; j > 0; i++, j--) {
			const left = chars[i];
			const last = chars[j];
			if (left === undefined || last === undefined) {
				throw new Error("Reached an invalid alphabet index");
			}
			const r =
				(i * j + left.charCodeAt(0) + last.charCodeAt(0)) % chars.length;
			const right = chars[r];
			if (right === undefined) {
				throw new Error("Reached an invalid alphabet index");
			}
			chars[i] = right;
			chars[r] = left;
		}

		return chars.join("");
	}

	private toId(num: bigint, alphabet: string): string {
		const id = [];
		const chars = alphabet.split("");
		const alphabetLength = BigInt(chars.length);

		let result = num;

		do {
			id.unshift(chars[Number(result % alphabetLength)]);
			result /= alphabetLength;
		} while (result > 0n);

		return id.join("");
	}

	private toNumber(id: string, alphabet: string): bigint {
		const chars = alphabet.split("");
		const alphabetLength = BigInt(chars.length);

		return id
			.split("")
			.reduce((a, v) => a * alphabetLength + BigInt(chars.indexOf(v)), 0n);
	}

	private isBlockedId(id: string): boolean {
		const lowercaseId = id.toLowerCase();

		for (const word of this.blocklist) {
			if (word.length <= lowercaseId.length) {
				if (lowercaseId.length <= 3 || word.length <= 3) {
					if (lowercaseId === word) {
						return true;
					}
				} else if (/\d/.test(word)) {
					if (lowercaseId.startsWith(word) || lowercaseId.endsWith(word)) {
						return true;
					}
				} else if (lowercaseId.includes(word)) {
					return true;
				}
			}
		}

		return false;
	}

	private maxValue(): bigint {
		return this.mode === "bigint" ? maxUint64 : BigInt(Number.MAX_SAFE_INTEGER);
	}
}
