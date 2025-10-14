import {
    createWindow,
    newSystemStatus,
    WINMASK_CLOSABLE,
    WINMASK_RESIZABLE,
    WINMASK_MOVABLE
} from "./windows.js";

let calculatorShown = false;

function calculatorWindow() {

    if (!calculatorShown) {
        // Defines vars for calculator

        let operator = "";
        let valueLast = "";
        let value = "";
        let operated = false;

        // Defines callback functions

        function clearMemory() {
            valueLast = "";
            operator = "";
            value = "";
            operated = false;
            updateLcdDisplay("");
        }

        function calcPercent() {
            if (value) {
                if (operator) {
                    let newvalue = eval(valueLast + operator + "(" + value + "/100)");
                    value = newvalue.toString();
                    operated = true;
                }
                valueLast = "";
                operator = "";
                updateLcdDisplay(value);
            }
        }

        function calcDivide() {
            if (value) {
                if (operator) {
                    let newvalue = eval(valueLast + operator + value);
                    value = newvalue.toString();
                    operated = true;
                }
                valueLast = value;
                operator = "/";
                value = "";
                updateLcdDisplay(valueLast);
            }
        }

        function calcMultiply() {
            if (value) {
                if (operator) {
                    let newvalue = eval(valueLast + operator + value);
                    value = newvalue.toString();
                    operated = true;
                }
                valueLast = value;
                operator = "*";
                value = "";
                updateLcdDisplay(valueLast);
            }
        }

        function calcSubstract() {
            if (value) {
                if (operator) {
                    let newvalue = eval(valueLast + operator + value);
                    value = newvalue.toString();
                    operated = true;
                }
                valueLast = value;
                operator = "-";
                value = "";
                updateLcdDisplay(valueLast);
            }
        }

        function calcAddition() {
            if (value) {
                if (operator) {
                    let newvalue = eval(valueLast + operator + value);
                    value = newvalue.toString();
                    operated = true;
                }
                valueLast = value;
                operator = "+";
                value = "";
                updateLcdDisplay(valueLast);
            }
        }

        function calcEval() {
            if (value) {
                if (operator) {
                    let newvalue = eval(valueLast + operator + value);
                    value = newvalue.toString();
                    operated = true;
                }
                valueLast = "";
                operator = "";
                updateLcdDisplay(value);
            }
        }

        function inputNumber(nb) {
            if (operated) {
                operated = false;
                value = nb;
                updateLcdDisplay(value);
            }
            else {
                if ((nb != "0") && (value == "0")) {
                    value = nb;
                    updateLcdDisplay(value);
                    return;
                }

                if (value != "0") {
                    value += nb;
                    updateLcdDisplay(value);
                }
            }
        }

        function calcNumpad0() {
            inputNumber("0");
        }

        function calcNumpad1() {
            inputNumber("1");
        }

        function calcNumpad2() {
            inputNumber("2");
        }

        function calcNumpad3() {
            inputNumber("3");
        }

        function calcNumpad4() {
            inputNumber("4");
        }

        function calcNumpad5() {
            inputNumber("5");
        }

        function calcNumpad6() {
            inputNumber("6");
        }

        function calcNumpad7() {
            inputNumber("7");
        }

        function calcNumpad8() {
            inputNumber("8");
        }

        function calcNumpad9() {
            inputNumber("9");
        }

        function calcDecimal() {
            if (operated) {
                operated = false;
                value = "0.";
                updateLcdDisplay(value);
            }
            else {
                if (value != "") {
                    if (!value.includes('.')) {
                        value += ".";
                        updateLcdDisplay(value);
                    }
                }
                else {
                    value = "0.";
                    updateLcdDisplay(value);
                }
            }
        }

        function onCloseCalculator() {
            calculatorShown = false;

            // Free all event listeners
            document.getElementById("calcClear").removeEventListener('click', clearMemory);
            document.getElementById("calcPercent").removeEventListener('click', calcPercent);
            document.getElementById("calcDivide").removeEventListener('click', calcDivide);
            document.getElementById("calcMutiply").removeEventListener('click', calcMultiply);
            document.getElementById("calcSubstract").removeEventListener('click', calcSubstract);
            document.getElementById("calcAdd").removeEventListener('click', calcAddition);
            document.getElementById("calcEval").removeEventListener('click', calcEval);
            document.getElementById("calc0").removeEventListener('click', calcNumpad0);
            document.getElementById("calc2").removeEventListener('click', calcNumpad2);
            document.getElementById("calc1").removeEventListener('click', calcNumpad1);
            document.getElementById("calc3").removeEventListener('click', calcNumpad3);
            document.getElementById("calc4").removeEventListener('click', calcNumpad4);
            document.getElementById("calc5").removeEventListener('click', calcNumpad5);
            document.getElementById("calc6").removeEventListener('click', calcNumpad6);
            document.getElementById("calc7").removeEventListener('click', calcNumpad7);
            document.getElementById("calc8").removeEventListener('click', calcNumpad8);
            document.getElementById("calc9").removeEventListener('click', calcNumpad9);
            document.getElementById("calcDecimal").removeEventListener('click', calcDecimal);

            // Allow window to close
            return true;
        }

        let newWin = createWindow("calculatorWindow", "Calculator",
            -1, -1, 290, 430,
            WINMASK_MOVABLE | WINMASK_CLOSABLE,
            onCloseCalculator
        );

        /* Initialize keypad interactions */

        function updateLcdDisplay(val) {
            if (val != "")
                document.getElementById("calcLcd").innerText = val;
            else
                document.getElementById("calcLcd").innerText = "0";
        }

        document.getElementById("calcClear").addEventListener('click', clearMemory);
        document.getElementById("calcPercent").addEventListener('click', calcPercent);
        document.getElementById("calcDivide").addEventListener('click', calcDivide);
        document.getElementById("calcMutiply").addEventListener('click', calcMultiply);
        document.getElementById("calcSubstract").addEventListener('click', calcSubstract);
        document.getElementById("calcAdd").addEventListener('click', calcAddition);
        document.getElementById("calcEval").addEventListener('click', calcEval);
        document.getElementById("calc0").addEventListener('click', calcNumpad0);
        document.getElementById("calc1").addEventListener('click', calcNumpad1);
        document.getElementById("calc2").addEventListener('click', calcNumpad2);
        document.getElementById("calc3").addEventListener('click', calcNumpad3);
        document.getElementById("calc4").addEventListener('click', calcNumpad4);
        document.getElementById("calc5").addEventListener('click', calcNumpad5);
        document.getElementById("calc6").addEventListener('click', calcNumpad6);
        document.getElementById("calc7").addEventListener('click', calcNumpad7);
        document.getElementById("calc8").addEventListener('click', calcNumpad8);
        document.getElementById("calc9").addEventListener('click', calcNumpad9);
        document.getElementById("calcDecimal").addEventListener('click', calcDecimal);

        newSystemStatus("Opening calculator...");

        calculatorShown = true;
    }
}

export { calculatorWindow };
