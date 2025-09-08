//Handles larger values better

const fs = require("fs");

/*
=========================================================
This program:
1. Reads a JSON input.
2. Extracts n (total points) and k (minimum required).
3. Converts the "value" from its "base" to a decimal
   BigInt to handle arbitrary-precision integers.
4. Uses Lagrange interpolation with BigInt arithmetic
   to find the constant term (f(0)) of the polynomial.
=========================================================
*/

// ---- Custom base-to-decimal converter for BigInts ----
function convertValue(baseStr, valueStr) {
    const base = BigInt(baseStr);
    let decimalValue = 0n;
    const power = BigInt(valueStr.length - 1);

    for (let i = 0; i < valueStr.length; i++) {
        const char = valueStr[i];
        let digit;
        // Handle digits 0-9
        if (/[0-9]/.test(char)) {
            digit = BigInt(parseInt(char, 10));
        } else {
            // Handle letters 'a' through 'f' for bases > 10 (e.g., hex)
            digit = BigInt(char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 10);
        }
        decimalValue += digit * (base ** BigInt(valueStr.length - 1 - i));
    }
    return decimalValue;
}

// ---- Lagrange Interpolation with BigInts ----
// This function calculates f(0), the constant term.
function lagrangeConstantTerm(points) {
    const k = points.length;
    let constant = 0n;

    for (let i = 0; i < k; i++) {
        const xi = BigInt(points[i].x);
        const yi = points[i].y;

        let liAt0Numerator = 1n;
        let liAt0Denominator = 1n;

        // Calculate the numerator and denominator of L_i(0)
        for (let j = 0; j < k; j++) {
            if (j !== i) {
                const xj = BigInt(points[j].x);
                liAt0Numerator *= (0n - xj);
                liAt0Denominator *= (xi - xj);
            }
        }
        
        // Division must be performed on BigInts
        // Note: BigInt division truncates towards zero. For this problem,
        // the numerator is guaranteed to be divisible by the denominator.
        const liAt0 = liAt0Numerator / liAt0Denominator;
        constant += yi * liAt0;
    }
    return constant;
}

// ---- Main Execution ----
function main() {
    let rawData = "";
    try {
        rawData = fs.readFileSync("input.json", "utf8");
    } catch (e) {
        // Fallback to reading from stdin if 'input.json' doesn't exist
        rawData = fs.readFileSync(0, "utf8");
    }

    const data = JSON.parse(rawData);

    const k = data.keys.k;

    let points = [];

    // Select the first 'k' points as required for Lagrange interpolation
    let count = 0;
    for (const key of Object.keys(data)) {
        if (key === "keys") continue;
        if (count >= k) break;

        const base = data[key].base;
        const value = data[key].value;

        // The "key" is the index of the root (x-coordinate),
        // and the converted value is the y-coordinate.
        const x = parseInt(key, 10);
        const y = convertValue(base, value);

        points.push({ x, y });
        count++;
    }

    const constant = lagrangeConstantTerm(points);
    console.log(constant.toString());
}

main();
