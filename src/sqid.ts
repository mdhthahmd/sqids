/**
 * Greets someone by name.
 *
 * @param name - The name to greet.
 * @returns A greeting string.
 */
export function hello(name = "world"): string {
	return `Hello, ${name}!`;
}

/**
 * Adds two numbers.
 *
 * @param a - The first addend.
 * @param b - The second addend.
 * @returns The sum of `a` and `b`.
 */
export function add(a: number, b: number): number {
	return a + b;
}

/**
 * Subtracts one number from another.
 *
 * @param a - The number to subtract from.
 * @param b - The number to subtract.
 * @returns The difference of `a` and `b`.
 */
export function subtract(a: number, b: number): number {
	return a - b;
}
