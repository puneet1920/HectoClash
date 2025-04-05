#include <bits/stdc++.h>
using namespace std;

vector<char> ops = {'+', '-', '*', '/', '^'};

// Apply operation between two numbers
double applyOp(double a, double b, char op) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return (b == 0) ? 1e9 : a / b;
        case '^': return pow(a, b);
    }
    return 1e9;
}

// Operator precedence
int precedence(char op) {
    if (op == '+' || op == '-') return 1;
    if (op == '*' || op == '/') return 2;
    if (op == '^') return 3;
    return 0;
}

// Safe expression evaluator using stacks
bool evaluate(const string &expr, double &res) {
    stack<double> nums;
    stack<char> ops;

    auto apply = [&]() {
        if (nums.size() < 2 || ops.empty()) return;
        double b = nums.top(); nums.pop();
        double a = nums.top(); nums.pop();
        char op = ops.top(); ops.pop();
        nums.push(applyOp(a, b, op));
    };

    for (int i = 0; i < expr.size(); i++) {
        if (isdigit(expr[i])) {
            double num = expr[i] - '0';
            while (i + 1 < expr.size() && isdigit(expr[i + 1])) {
                num = num * 10 + (expr[i + 1] - '0');
                i++;
            }
            nums.push(num);
        } else if (expr[i] == '(') {
            ops.push('(');
        } else if (expr[i] == ')') {
            while (!ops.empty() && ops.top() != '(') apply();
            if (!ops.empty()) ops.pop(); // pop '('
        } else {
            while (!ops.empty() && precedence(ops.top()) >= precedence(expr[i]))
                apply();
            ops.push(expr[i]);
        }
    }

    while (!ops.empty()) apply();

    if (nums.empty()) return false;
    res = nums.top();
    return fabs(res - 100.0) < 1e-6;
}

// Backtracking to generate expressions
void backtrack(string digits, string expr, int idx, vector<string> &answers) {
    if (idx == digits.size()) {
        double val;
        if (evaluate(expr, val)) {
            answers.push_back(expr);
        }
        return;
    }

    // Add operators between current expr and next digit
    for (char op : ops) {
        string next_digit(1, digits[idx]);
        // Normal operation
        backtrack(digits, expr + op + next_digit, idx + 1, answers);
        // Add parentheses around new operation
        backtrack(digits, "(" + expr + op + next_digit + ")", idx + 1, answers);
    }

    // Concatenate next digit
    backtrack(digits, expr + digits[idx], idx + 1, answers);
}

int main() {
    string digits;
    cout << "Enter 6-digit number: ";
    cin >> digits;

    if (digits.size() != 6 || !all_of(digits.begin(), digits.end(), ::isdigit)) {
        cout << "Invalid input. Please enter exactly 6 digits.\n";
        return 1;
    }

    vector<string> expressions;
    backtrack(digits, string(1, digits[0]), 1, expressions);

    if (expressions.empty()) {
        cout << "No expression found that evaluates to 100.\n";
    } else {
        cout << "Expressions that evaluate to 100:\n";
        for (auto &e : expressions)
            cout << e << " = 100\n";
    }

    return 0;
}
