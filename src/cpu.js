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

        bt[HLT] = this.HLT;
        // !!! IMPLEMENT ME
        // LDI
        bt[LDI] = this.LDI;
        // MUL
        bt[MUL] = this.MUL;
        // PRN
        bt[PRN] = this.PRN;

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
        let valA = this.reg[regA];
        let valB = this.reg[regB];
        switch (op) {
            case 'MUL':
                // !!! IMPLEMENT M
                this.reg[regA] = (valA * valB) & 0b11111111;
                break;
        
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
        //console.log(`${this.reg.PC}: ${this.reg.IR.toString(2)}`);
       //  console.log(this.reg.PC);
        // Based on the value in the Instruction Register, jump to the
        // appropriate hander in the branchTable
        //const handler = this.reg.IR; 
        // Check that the handler is defined, halt if not (invalid
        // instruction)
        const handler = this.branchTable[this.reg.IR]

        // We need to use call() so we can set the "this" value inside
        // the handler (otherwise it will be undefined in the handler)
        if (!handler) {
            console.log(`Invalid instruction at address ${this.reg.PC}: ${this.reg.IR.toString(2)}`);
            this.stopClock();
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
}

module.exports = CPU;
