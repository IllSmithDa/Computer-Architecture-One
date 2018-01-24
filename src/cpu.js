/**
 * LS-8 v2.0 emulator skeleton code
 */

const fs = require('fs');

// Instructions

const HLT = 0b00011011; // Halt CPU
// !!! IMPLEMENT ME
// LDI Load Register Immediate
const LDI = 0b00000100;
// MUL
const MUL = 0b00000101;
// PRN
const PRN = 0b00000110;
const PUSH = 0b00001010; // push register
const POP = 0b00001011; // pop register
const CALL = 0b00001111;
/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers
        
        this.reg[7] = 0xf8;

        // Special-purpose registers
        this.reg.PC = 0; // Program Counter 
        this.reg.IR = 0; // Instruction Register

		this.setupBranchTable();
    }
	
	/**
	 * Sets up the branch table
	 */
	setupBranchTable() {
		let bt = {};

        // This maps the variables list above for the instructions are to be handled by 
        // the functions listed below. e.g const HLT is handled by the this.HLT function 
        // will handle HLT call from the machine code. Brach table works like a phone book. 
        bt[HLT] = this.HLT;
        // !!! IMPLEMENT ME
        // LDI
        bt[LDI] = this.LDI;
        // MUL
        bt[MUL] = this.MUL;
        // PRN
        bt[PRN] = this.PRN;

        // push 
        bt[PUSH] = this.PUSH;

        bt[POP] = this.POP;
        bt[CALL] = this.CALL;
		this.branchTable = bt;
	}

    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        const _this = this;

        this.clock = setInterval(() => {
            _this.tick();
        }, 1);
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     * 
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {

        // extracting the actual values contained in register A and register B
        let valA = this.reg[regA];
        let valB = this.reg[regB];
        switch (op) {
            case 'MUL':
                // !!! IMPLEMENT M
                //change value contianed in register A by multiple the two values
                this.reg[regA] = (valA * valB) & 0b11111111;
                break;
        //0b 0111010001000  <-- some crazy high number
        //0b 0000011111111  <-- 255 or oxff
        //-----------------  &
        //0b 0000010001000  <-- resulting number as bitwise operation only 
        //                      accept when both numbers in a spot is 1
        //                      This gets rid of extra one which make value > 255

        
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // !!! IMPLEMENT ME

        // Load the instruction register from the current PC
        this.reg.IR = this.ram.read(this.reg.PC);
        // Debugging output
           console.log(`${this.reg.PC}: ${this.reg.IR.toString(2)}`);
        // console.log(this.reg.PC);
        // Based on the value in the Instruction Register, jump to the
        // appropriate hander in the branchTable
        // this.brachtable gives access to branch table and this.reg.IR gives us 
        // the matching instruction register value given by the machine code 
         const handler = this.branchTable[this.reg.IR]

        // Check that the handler is defined, halt if not (invalid
        // instruction)
        // We need to use call() so we can set the "this" value inside
        // the handler (otherwise it will be undefined in the handler) 
        if (!handler) {

            // prints out error if the instruction does not exist or is invalid
            console.log(`Invalid instruction at address ${this.reg.PC}: ${this.reg.IR.toString(2)}`);
            // clears the interval that was running elminating all callbacks
            this.stopClock();
            // program exits based on invalid instruction
            return;
}
        handler.call(this);
    }

    // INSTRUCTION HANDLER CODE:

    /**
     * HLT
     */
    HLT() {
        // !!! IMPLEMENT ME
        this.stopClock();
    }

    /**
     * LDI R,I
     */
    LDI() {
        // !!! IMPLEMENT ME
        const regA = this.ram.read(this.reg.PC + 1);
        const val = this.ram.read(this.reg.PC + 2);
        this.reg[regA] = val;
        this.reg.PC += 3;
    }

    /**
     * MUL R,R
     */
    MUL() {
        // !!! IMPLEMENT ME
        // Move the program counter (PC)
        // 0:00000101 startin point
        // 1:00000000 PC + 1
        // 2:00000001 PC + 2
        // 3:00011011 new instruction which in this case is HALT
        const regA = this.ram.read(this.reg.PC + 1);
        const regB = this.ram.read(this.reg.PC + 2);

        // multiplying the first two values from register as defined in the mult.ls8 file
        this.alu('MUL', regA, regB)
        
        // move the PC here 
        this.reg.PC +=3;
        
    }

    /**
     * PRN R
     */
    PRN() {
        // !!! IMPLEMENT ME
        const regA = this.ram.read(this.reg.PC  + 1)
        console.log(this.reg[regA])
        this.reg.PC +=2;
    }
    PUSH() {
        this.reg[7]-- // decrement register 7 also inital point

        // this will read the register number we are interested in
        const regA = this.ram.read(this.reg.PC + 1);
        console.log(regA)
        
        // this.reg[regA] gets the actual value located in the register 
        // number as regA is the register number not the value in the 
        // register itself
        this.ram.write(this.reg[7], this.reg[regA]);

        //make sure to increment the PC
        this.reg.PC +=2;
    }
    POP() {
        // gives us the registry number we need.
        const regA = this.ram.read(this.reg.PC + 1);
        console.log(regA)
        // stack value 
        const stackValue = this.ram.read(this.reg[7]);
        this.reg[regA] = stackValue;
        this.reg[7]++;

        // the actual program counter moving down the machine code list of 
        // instructions 
        this.reg.PC +=2;
    }
    CALL() {
        // save the PC + 1 to regA
        const regA = this.ram.read(this.regPC + 1);
        
        // start on reg7 and push address of the next instructions on stack 
        this.reg[7]--;
        this.ram.write(this.reg[7], this.reg.PC + 2);
        
        // Jump to the addres stored in regA
        this.reg.PC = this.reg[regA]

    }
}

module.exports = CPU;
