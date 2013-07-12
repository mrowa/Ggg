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
        var ggMissessGGError = "Syntax error: gg misses its corresponding GG";
        var GGMissessggError = "Syntax error: GG misses its corresponding gg";
        var GGBeforeggError = "Syntax error: GG is before first gg";
        var ggAfterGGError = "Syntax error: gg is after last GG";
        
        // Properties variables
        var Error;
        var ErrorText;
        
        this.CheckSyntax = function (tokens) {
            var ggIndex = tokens.indexOf("gg");
            var GGIndex = tokens.indexOf("GG");
            
            if (ggIndex === -1 && GGIndex === -1) {
                return;
            } else {
                if (GGIndex === -1) {
                    // show error
                    // gg misses its corresponding GG
                    SetError(ggMissessGGError);
                } else if (ggIndex === -1) {
                    // show error
                    // GG misses it corresponding gg
                    SetError(GGMissessggError);
                } else if (ggIndex > GGIndex) {
                    //show error
                    // there is GG before gg
                    SetError(GGBeforeggError);
                } else {
                    ggIndex = tokens.lastIndexOf("gg");
                    GGIndex = tokens.lastIndexOf("GG");
                    
                    if (GGIndex < ggIndex) {
                        // show error
                        // there is gg after GG
                        SetError(ggAfterGGError);
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
        // Literals - index is a code.
        var Symbols = ["g", "G", "gg", "gG", "Gg", "GG", "ggg", "GGG"];         
        
        this.Compile = function(tokens) {
            var Program = 
            "function runProgram(read, write) {" + "\n" +
            "   var memory = [];" + "\n" +
            "   for (var i = 0; i < 30000; ++i) { memory[i] = 0; };" + "\n" +
            "   var ptr = 0" + "\n";
            
            
            for (var i = 0; i < tokens.length; ++i) {
                switch(tokens[i]) {
                    case "g":
                        Program += "memory[ptr]--;" + "\n";
                        break;
                    case "G":
                        Program += "memory[ptr]++;" + "\n";
                        break;                        
                    case "gG":
                        Program += "ptr++;" + "\n";
                        break;
                    case "Gg":
                        Program += "ptr--;" + "\n";
                        break;
                    case "gg":
                        Program += "while(ptr !== 0) {" + "\n";
                        break;
                    case "GG":
                        Program += "};" + "\n";
                        break;
                    case "ggg":
                        Program += "memory[ptr] = read();" + "\n";
                        break;
                    case "GGG":
                        Program += "write(memory[ptr]);" + "\n";
                        break;
                }
            }
            
            Program += "}\n";
            return Program;
        };      
    };
    
})(window.Ggg = window.Ggg || {});