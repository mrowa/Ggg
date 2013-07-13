/*
 * This is Ggg to javascript compiler. Look for SPEC.md for language spec.
 * It is built after seeing http://tomi.panula-ont.to/brainfuck
 * by Tomi Panula-Ontto.
 *
 * This project is made purely for learning what the author hasn't yet learned
 * or tested, this is Turing-Complete language called Ggg, which bases 1:1 on
 * Brainfuck esoteric language.
 *
 * This software is license under MIT License.
 *
 * Copyright (C) 2013 Piotr Nalewajka (piotr.nalewajka@gmail.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
 */

(function(Ggg, undefined) {
    
    // Lexical analyzer
    // Checks if all symbols in source code are legal, prepares tokens
    // from source code.
    Ggg.Lexer = function() {        
        // Literals
        var LegalSymbols = ["g", "G", "gg", "gG", "Gg", "GG", "ggg", "GGG"];
        // Errors
        var NotLegalTokenError = "Lexical error: Remove this illegal token: ";
        var NoCodeError = "Lexical error: Provide some code.";
        var ImproperTypeError = "Lexer use error: The 'code' variable should be of type 'string'.";
        
        // Properties variables
        var Error;
        var ErrorText;
        
        // Analyzes code lexically, returns array of consecuting commands
        //  and symbols. Supports only code in string type.
        this.Analyze = function (code) {
            if (typeof(code) === "string") {
                // Cut code into tokens
                var tokens = code.match(new RegExp("[gG]+", "g"));
                
                if (!tokens) {
                    SetError(NoCodeError);
                    return null;
                }
                
                // Check if all tokens are legal
                if (tokens.some(IsNotLegal)) {
                    // last Checked is set in IsNotLegal
                    SetError(NotLegalTokenError + lastChecked);
                    return null;
                }
                
                // Lexing is done!
                return tokens;
            }
            
            SetError(ImproperTypeError);
            return null;
        };
        
        // not so nice, but works with array.some().
        var lastChecked;
        
        var IsNotLegal = function (symbol) {            
            lastChecked = symbol;
            return (LegalSymbols.indexOf(symbol) === -1);
        };
        
        var SetError = function(textValue) {
            Error = {};
            ErrorText = textValue;
        };
        
        this.HasError = function() {
            return typeof(Error) !== "undefined";
        };
        
        this.GetError = function() {
            return ErrorText;
        };
    };
    
    // Checks syntax of Ggg code using prepared tokens.
    Ggg.SyntaxChecker = function() {
        // Error literals    
        var GGTooEarlyError = "Syntax error: There is GG without corresponding, previous gg";
        var TooManyGGError = "Syntax error: GG lacks corresponding gg";
        var TooManyggError = "Syntax error: gg lacks corresponding GG";
        
        // Properties variables
        var Error;
        var ErrorText;
        
        // Check if syntax is ok. Read results using HasError function
        // if it's true, there is something to be aware of.
        this.CheckSyntax = function (tokens) {
            
            var level = 0;
            
            for (var i = 0; i < tokens.length; ++i) {
                var token = tokens[i];
                console.log("token" + token);
                
                // count levels of gg and GG
                switch (token) {
                    case "gg":
                        level++;
                        break;
                    case "GG":
                        level--;
                        break;
                }
                if (level < 0) {
                    SetError(GGTooEarlyError);
                }
            }
            
            // checks if error, otherwise one SetError would get overwritten
            if (!this.HasError()) {
                if (level !== 0) {
                    if (level > 0) {
                        SetError(TooManyggError);
                    } else { 
                        SetError(TooManyGGError);
                    }
                }
            }
        };
        
        var SetError = function(textValue) {
            Error = {};
            ErrorText = textValue;
        };
        
        this.HasError = function() {
            return typeof(Error) !== "undefined";
        };
        
        this.GetError = function() {
            return ErrorText;
        };
    };
    
    // Compiles Ggg tokens to javascript
    Ggg.Compiler = function() {    
        
        // Compile tokens (ordered array of strings) to javascript
        this.Compile = function(tokens) {
            var level = 0;
            var Program = "";
            
            // Add line with indentation and newline
            function add(code) {
                for (var l = 0; l < level; ++l) {
                    Program += "    ";
                }
                Program += code + "\n";
            }
            
            // Beginning of program
            add("Ggg.Runner.runProgram = function (read, write) {");
            level++;
            add("var memory = [];");
            add("for (var i = 0; i < 30000; ++i)");
            add("{");
            add("memory[i] = 0;");
            add("};");
            add("var ptr = 0");
            add("");
            
            // Create code
            for (var i = 0; i < tokens.length; ++i) {
                switch(tokens[i]) {
                    case "g":
                        add("memory[ptr]--;");
                        break;
                    case "G":
                        add("memory[ptr]++;");
                        break;                        
                    case "gG":
                        add("ptr++;");
                        break;
                    case "Gg":
                        add("ptr--;");
                        break;
                    case "gg":
                        add("while(memory[ptr] !== 0) {");
                        level++;
                        break;
                    case "GG":
                        level--;
                        add("};");
                        break;
                    case "ggg":
                        add("memory[ptr] = read();");
                        break;
                    case "GGG":
                        add("write(memory[ptr]);");
                        break;
                }
            }
            
            Program += "}\n";
            return Program;
        };
    };
    
    // Run Ggg code with IO
    Ggg.Interpreter = function() {
        // Default functions provided in case of generic problems
        var readFunction = function() { console.log("Read function undeclared."); };
        var writeFunction = function() { console.log("Write function undeclared."); };
        
        var runProgram = function() {
            console.log("Program not provided.");
            alert("There is no program to run.");
        };
        
        // Interprets Ggg using text Ggg code, returns object
        // { ok: true/false, js: code (if ok == true), error: error (if not ok)}
        this.Interpret = function(code) {            
            var lexer = new Ggg.Lexer();
            var syntaxChecker = new Ggg.SyntaxChecker();
            var compiler = new Ggg.Compiler();        
            
            var tokens = lexer.Analyze(code);
        
            if (!lexer.HasError()) {
                syntaxChecker.CheckSyntax(tokens);
                if (!syntaxChecker.HasError()) {                
                    var jsCode = compiler.Compile(tokens);
                    return { ok: true, js: jsCode };
                } else {
                    return { ok: false, error: syntaxChecker.GetError() };
                }
            } else {
                return { ok: false, error: lexer.GetError() };
            }
        };
        
        // Register readFunc and writeFunc
        this.RegisterIO = function(readFunc, writeFunc) {
            if (typeof(readFunc) == "function") {
                readFunction = readFunc;
            }
            if (typeof(writeFunc) == "function") {
                writeFunction = writeFunc;    
            }            
        };
        
        // Prepare object to run function from
        var PrepareFunctionSpace = function() {
            Ggg.Runner = {};
        }
        
        // Run ready function all at once.
        this.Run = function(js) {
            PrepareFunctionSpace();
            eval(js);
            Ggg.Runner.runProgram(readFunction, writeFunction);
        };
    };
    
})(window.Ggg = window.Ggg || {});