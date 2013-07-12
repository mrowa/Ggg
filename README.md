Ggg programming language & interpreter

Ggg is programming language built on top of brainfuck, which is built on top of
`P′′` programming language. It's very simple with just a few constructs and
symbols. Main reason of creation of this language is extending of brainfuck with
some quite needed features.

Valid symbols:
Symbols in tokens: `G`, `g`, other characters are used to break sets of symbols into tokens.

In brainfuck there are 8 commands:

`>` increment the data pointer

`<`	decrement the data pointer

`+`	increment the byte at the data pointer
    
`-`	decrement the byte at the data pointer
    
`.`	output the byte at the data pointer

`,`	accept one byte of input, storing its value in the byte at the data pointer

`[`	if the byte at the data pointer is zero, then instead of moving the instruction pointer forward to the next command, jump it forward to the command after the matching `]` command
    
`]`	if the byte at the data pointer is nonzero, then instead of moving the instruction pointer forward to the next command, jump it back to the command after the matching `[` command

In Ggg version g there are 8 basic commands which are also only valid tokens, based on those from brainfuck:

`G`   as `+` (increment byte)

`g`   as `-` (decrement byte)

`gG`  as `>` (increment pointer, go right)

`Gg`  as `<` (decrement pointer, go left)

`gg`  as `[` (if data byte zero, jump to forward `GG`)

`GG`  as `]` (if data byte nonzero, jump backward to `gg`)

`GGG` as `.` (output byte)

`ggg` as `,` (input byte)

Commands should be divided by other characters or whitespace (including line
feed). Minimal requirement for the compilable program: 
- there is either `gg` and `GG` in order, either there are none of those commands 
    in the code. There is no need for having a parity of those tokens, only 
    the order and having at least one `gg` and `GG` is needed. Programs breaking 
    this rule would not compile. Not adhering to the rule results with
    syntax error.
- there are no symbols containing `g` and `G` without other characters that are also
    not a command. So in Ggg g the symbol `gGg` is illegal and creates compilation
    error, similar situation is with longer chains of `g`s and `G`s, like `gggg`.
    Not adhering to the rule results with lexical error.

Ggg is extensible, so there is possibility to add more commands, like declaring 
constants.
Proposed additional functionalities:
 -  Integer literals
 -  Simple macros
 -  Different I/O functions

Ggg G integer literals known as g-binary
Literals are created using symbols g and G as one word without any other
characters inbetween. G symbol means g-binary 1 and g symbol means g-binary 0.
Scheme for creating integer g-binary literal:
g-binary-command address g-binary-value
Both address and g-binary-value can contain any number of (reasonable)
values, including not paired gg and GG.

Issues:
- improper gg GG definition (do we need GOTO or loops?)
- Interpreter and Read/write code in entry.html
