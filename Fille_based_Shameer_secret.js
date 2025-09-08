import json
from fractions import Fraction

def convert_value(base, value_str):
    """
    Converts a value from a given base to a decimal integer.
    """
    return int(value_str, int(base))

def lagrange_constant_term(points):
    """
    Calculates the constant term (f(0)) of a polynomial using Lagrange interpolation.
    This function uses the fractions module to handle large numbers and
    maintain precision throughout the calculation.
    """
    k = len(points)
    constant = Fraction(0)

    for i in range(k):
        xi = Fraction(points[i]['x'])
        yi = Fraction(points[i]['y'])

        li_at_0 = Fraction(1)  # L_i(0)
        for j in range(k):
            if j != i:
                xj = Fraction(points[j]['x'])
                li_at_0 *= (Fraction(0) - xj) / (xi - xj)

        constant += yi * li_at_0
    
    # The result should be an integer, so we convert the final Fraction.
    return int(constant)

def main():
    """
    Main function to get JSON data, process it, and find the constant term.
    """
    # Hardcoded JSON data from the user's request
    raw_data = """
    {
        "keys": {
            "n": 10,
            "k": 7
        },
        "1": {
            "base": "6",
            "value": "13444211440455345511"
        },
        "2": {
            "base": "15",
            "value": "aed7015a346d635"
        },
        "3": {
            "base": "15",
            "value": "6aeeb69631c227c"
        },
        "4": {
            "base": "16",
            "value": "e1b5e05623d881f"
        },
        "5": {
            "base": "8",
            "value": "316034514573652620673"
        },
        "6": {
            "base": "3",
            "value": "2122212201122002221120200210011020220200"
        },
        "7": {
            "base": "3",
            "value": "20120221122211000100210021102001201112121"
        },
        "8": {
            "base": "6",
            "value": "20220554335330240002224253"
        },
        "9": {
            "base": "12",
            "value": "45153788322a1255483"
        },
        "10": {
            "base": "7",
            "value": "1101613130313526312514143"
        }
    }
    """
    data = json.loads(raw_data)

    try:
        n = data['keys']['n']
        k = data['keys']['k']
    except KeyError:
        print("Error: 'keys' or 'n' or 'k' not found in the JSON data.")
        return

    points = []
    
    count = 0
    for key in data:
        if key == "keys":
            continue
        if count >= k:
            break
        
        try:
            base = data[key]['base']
            value = data[key]['value']

            x = int(key)  # the root index
            y = convert_value(base, value)

            points.append({'x': x, 'y': y})
            count += 1
        except KeyError as e:
            print(f"Skipping entry for key '{key}'. Missing field: {e}")
        except ValueError as e:
            print(f"Skipping entry for key '{key}'. Data conversion error: {e}")
    
    if len(points) < k:
        print(f"Warning: Only found {len(points)} valid points, but a minimum of {k} were required. Calculation may be inaccurate.")
        if not points:
            print("No valid points found to perform the calculation.")
            return

    constant = lagrange_constant_term(points)
    print("Constant term of polynomial:", constant)

if __name__ == "__main__":
    main()
