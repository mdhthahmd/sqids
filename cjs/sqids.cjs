Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/sqids.ts
/**
* Greets someone by name.
*
* @param name - The name to greet.
* @returns A greeting string.
*/
function hello(name = "world") {
	return `Hello, ${name}!`;
}
/**
* Adds two numbers.
*
* @param a - The first addend.
* @param b - The second addend.
* @returns The sum of `a` and `b`.
*/
function add(a, b) {
	return a + b;
}
/**
* Subtracts one number from another.
*
* @param a - The number to subtract from.
* @param b - The number to subtract.
* @returns The difference of `a` and `b`.
*/
function subtract(a, b) {
	return a - b;
}
//#endregion
exports.add = add;
exports.hello = hello;
exports.subtract = subtract;
