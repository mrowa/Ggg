// This is validator and compiler for language Ggg

(function(Ggg, undefined) {
    
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
    
    Ggg.SyntaxChecker = function() {
        // Error literals    
        var GGTooEarlyError = "Syntax error: There is GG without corresponding, previous gg";
        var TooManyGGError = "Syntax error: GG lacks corresponding gg";
        var TooManyggError = "Syntax error: gg lacks corresponding GG";
        
        // Properties variables
        var Error;
        var ErrorText;
        
        this.CheckSyntax = function (tokens) {
            
            var level = 0;
            
            for (var i = 0; i < tokens.length; ++i) {
                var token = tokens[i];
                console.log("token" + token);
                
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
    
    Ggg.Compiler = function() {    
        
        this.Compile = function(tokens) {
            var level = 0;
            var Program = "";
            
            function add(code) {
                for (var l = 0; l < level; ++l) {
                    Program += "    ";
                }
                Program += code + "\n";
            }
            
            add("function runProgram(read, write) {");
            level++;
            add("var memory = [];");
            add("for (var i = 0; i < 30000; ++i)");
            add("{");
            add("memory[i] = 0;");
            add("};");
            add("var ptr = 0");
            add("");
            
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
    
    Ggg.Interpreter = function() {        
        var readFunction = function() { console.log("Read function undeclared."); };
        var writeFunction = function() { console.log("Write function undeclared."); };
        
        var runProgram = function() {
            console.log("Program not provided.");
            alert("There is no program to run.");
        };
        
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
        
        this.RegisterIO = function(readFunc, writeFunc) {
            if (typeof(readFunc) == "function") {
                readFunction = readFunc;
            }
            if (typeof(writeFunc) == "function") {
                writeFunction = writeFunc;    
            }            
        };
        
        this.Run = function(js) {
            eval(js);
            runProgram(readFunction, writeFunction);
        };
    };
    
})(window.Ggg = window.Ggg || {});