// lagrange.js

const fs = require("fs");

/*
=========================================================
This program:
1. Reads a JSON input (from file or stdin).
2. Extracts n (total points) and k (minimum required).
3. Converts given "value" from its "base" to decimal.
4. Uses Lagrange interpolation to find the constant term
   (coefficient of x^0 in the polynomial).
=========================================================
*/

// ---- Convert given value from base to decimal ----
function convertValue(base, valueStr) {
    return parseInt(valueStr, parseInt(base));
}

// ---- Lagrange Interpolation ----
// Returns constant term (f(0))
function lagrangeConstantTerm(points) {
    const k = points.length;
    let constant = 0;

    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;

        let liAt0 = 1; // L_i(0)
        for (let j = 0; j < k; j++) {
            if (j !== i) {
                liAt0 *= (0 - points[j].x) / (xi - points[j].x);
            }
        }

        constant += yi * liAt0;
    }
    return constant;
}

// ---- Main Execution ----
function main() {
    // If input.json exists, read from it; otherwise read stdin
    let rawData = "";
    try {
        rawData = fs.readFileSync("input.json", "utf8");
    } catch (e) {
        // fallback: read from stdin
        rawData = fs.readFileSync(0, "utf8");
    }

    const data = JSON.parse(rawData);

    const n = data.keys.n;
    const k = data.keys.k;

    let points = [];

    // Use first 'k' valid points dynamically
    let count = 0;
    for (let key of Object.keys(data)) {
        if (key === "keys") continue;
        if (count >= k) break;

        const base = data[key].base;
        const value = data[key].value;

        const x = parseInt(key); // the root index
        const y = convertValue(base, value);

        points.push({ x, y });
        count++;
    }

    const constant = lagrangeConstantTerm(points);
    console.log("Constant term of polynomial:", constant);
}

main();
