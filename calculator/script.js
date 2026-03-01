let input = document.getElementById('inputbox');
let buttons = document.querySelectorAll('button');

let string = "";
let arr = Array.from(buttons);

// ✅ Percentage handler
function fixPercentage(expr) {
    // A%B → (A*B)/100
    expr = expr.replace(/(\d+(\.\d+)?)%(\d+(\.\d+)?)/g, '($1*$3)/100');

    // A% → A/100
    expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    return expr;
}

arr.forEach(button => {
    button.addEventListener('click', (e) => {
        let value = e.target.innerHTML;

        if (value === '=') {
            try {
                let expression = fixPercentage(string);
                string = eval(expression).toString();
                input.value = string;
            } catch {
                string = "Error";
                input.value = string;
            }
        }
        else if (value === 'AC') {
            string = "";
            input.value = string;
        }
        else if (value === 'DEL') {
            string = string.substring(0, string.length - 1);
            input.value = string;
        }
        else {
            string += value;
            input.value = string;
        }
    });
});
