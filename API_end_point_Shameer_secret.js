import fetch from "node-fetch";
import readline from "readline";

/*
=========================================================
This program:
1. Asks the user to input a JSON endpoint URL.
2. Fetches the JSON from that URL.
3. Extracts n (total points) and k (minimum required).
4. Converts each "value" from its "base" to decimal.
5. Uses Lagrange interpolation to calculate the constant
   term (coefficient of x^0).
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
async function main(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

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

            const x = parseInt(key); // root index
            const y = convertValue(base, value);

            points.push({ x, y });
            count++;
        }

        const constant = lagrangeConstantTerm(points);
        console.log("Constant term of polynomial:", constant);
    } catch (err) {
        console.error("Error fetching JSON:", err.message);
    }
}

// ---- Ask user for URL ----
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter the JSON endpoint URL: ", (url) => {
    main(url);
    rl.close();
});
