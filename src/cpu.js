/**
 * LS-8 v2.0 emulator skeleton code
 */

const fs = require('fs');

// Instructions

const HLT = 0b00011011; // Halt CPU
// !!! IMPLEMENT ME
// LDI Load Register Immediate
const LDI  = 0b00000100;
const MUL  = 0b00000101;
const PRN  = 0b00000110;
const PUSH = 0b00001010; // push register
const POP  = 0b00001011; // pop register
const CALL = 0b00001111;
const RET  = 0b00010000;
const ADD  = 0b00001100;
const JMP  = 0b00010001;
const ST   = 0b00001001;
const PRA  = 0b00000111;
const IRET = 0b00011010;
const LD   = 0b00010010; // Load R R
const I0Vector = 0xf8;
const timerInterrupt = 1;

const IM = 5;
const IS = 6;
const SP = 7;
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
        this.reg[SP] = I0Vector;
        this.reg[7] = 0xf8;

        // Special-purpose registers
        this.reg.PC = 0; // Program Counter 
        this.reg.IR = 0; // Instruction Register
        
        this.flags = {
            interruptsEnabled: true,

        }
        this.fanSpeed = 2;

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
        bt[LDI] = this.LDI;
        bt[MUL] = this.MUL;
        bt[PRN] = this.PRN;
        bt[PUSH] = this.PUSH;
        bt[ADD] = this.ADD;
        bt[POP] = this.POP;
        bt[CALL] = this.CALL;
        bt[RET] = this.RET;
        bt[JMP] = this.JMP;
        bt[LD] = this.LD;
        bt[ST] = this.ST;
        bt[PRA] = this.PRA;
        bt[IRET] = this.IRET;
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

            // set number to 1; If you set it to 100 like I did , it will crash
        }, 1);
        this.timerHandle = setInterval(() => {
            // trigger timer interrupt
            // 00000000 no interupt has occurred 
            // 00000001 int0 has occurred 
            // 00001000 int3 has occurred
            // 10010000 int7 and int4 have occurred
            //   10001011 Interrupt status int7, int3, int1, int0
            // & 00000001 Interrupt mask is 0 by default but
            //   -------- but now now are intested in interupt int0 or timer interrupt
            //   --------
            //   00000001 interrupt mask recognizes the int1
            // change interrupt by using bitwise 
            //    01001000 IS bitwise or 
            // || 00000001
            // -----------
            //    01001001
            
            //this.reg[IS] = this.reg[IS] | 0b00000001;
            
            // same thing as above but another way 
            // this.reg[6] |= 0b00000001;
            
            this.raiseInterrupt(timerInterrupt)
        }, 1000);
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
        clearInterval(this.timerHandle);
    }
    raiseInterrupt(n) {
        this.reg[IS] |= n;
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
            case 'ADD':
                this.reg[regA] = (valA + valB) & 0b11111111;
                break;
        //0b 0111010001000  <-- some crazy high number
        //0b 0000011111111  <-- 255 or oxff
        //-----------------  &
        //0b 0000010001000  <-- resulting number as bitwise operation only 
        //                      accept when both numbers in a spot is 1
        //                      This gets rid of extra one which make value > 255

        /* set a flag 
            let product = valA * valB;
            this.flags.overflow = product > 255;
            this.reg[regA] = product & 255;

        */
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // !!! IMPLEMENT ME

        // interrupt handler
        // check if an interrupt happened 
        // if it did, jump to that interrupt
        // this value is 0 if no interrupt occured 
        const maskedInterrupts = this.reg[IS] & this.reg[IM];
       /* 
       x = 136;
        n = 4;
        if ((x >> n) & 1 == 1) {
            console.log('4th bit is set')
        }
        */

        if(this.flags.interruptsEnabled && maskedInterrupts !== 0 ){
            for (let i = 0; i <= 7;  i++){
            if(((maskedInterrupts >> i ) & 1) === 1){
                
                //handling interrupt
                this.flags.interruptsEnabled = false;
                
                //clear the bit in the IS
                // this.reg[IS] = 0;

                this.reg[IS] &= ~(1 << i);
                this.reg[7]--;
                this.ram.write(this.reg[7], this.reg.PC);
                
                // push remaining registers on stack to save where we were 
                // once we are done with the interrupt
                // for loop prevents code from looping more times than we need
                for (let j = 0; j <= 7; j++) {
                    this.reg[SP]--;
                    this.ram.write(this.reg[SP], this.reg[j])
                    // console.log('start')
                    // console.log(this.reg[SP], this.reg[i])
                    // console.log('finish')
                }
                // 00001010
                // 01010000
                // look up the handler address in the interrupt vector
                const vectorTableEntry = 0xf8 + i;
                // console.log('vec tabke entry is ' + vectorTableEntry);
                const handlerAddress = this.ram.read(vectorTableEntry);
                // console.log('handlerAddress is ' + handlerAddress)

                // set PC to handler 
                this.reg.PC = handlerAddress;
                
                // console.log('interrupt occurred ' + i);
                break;
                }
            }
        }

        // Load the instruction register from the current PC
        this.reg.IR = this.ram.read(this.reg.PC);
        // Debugging output
        //   console.log(this.reg.IR);
        //   console.log(`${this.reg.PC}: ${this.reg.IR.toString(2)}`);
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
    ADD() {
        // !!! IMPLEMENT ME
        // Move the program counter (PC)
        // 0:00000101 startin point
        // 1:00000000 PC + 1
        // 2:00000001 PC + 2
        // 3:00011011 new instruction which in this case is HALT
        const regA = this.ram.read(this.reg.PC + 1);
        const regB = this.ram.read(this.reg.PC + 2);

        // multiplying the first two values from register as defined in the mult.ls8 file
        this.alu('ADD', regA, regB)
     
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
        const regA = this.ram.read(this.reg.PC + 1);
        // start on reg7 and push address of the next instructions on stack 
        this.reg[7]--;
        this.ram.write(this.reg[7], this.reg.PC + 2);
        
        // Jump to the addres stored in regA
        this.reg.PC = this.reg[regA];

    }
    RET() {
        this.reg.PC = this.ram.read(this.reg[7]);
        this.reg[7]++;

    }
    JMP() {
        const regA = this.ram.read(this.reg.PC + 1);
        this.reg.PC = this.reg[regA];
    }
    ST() {
        const regA = this.ram.read(this.reg.PC + 1);
        const regB = this.ram.read(this.reg.PC + 2);
        this.ram.write(this.reg[regA], this.reg[regB])

        // move the PC and skip 2 bytes as they are all part of 
        // one instruction
        this.reg.PC +=3;
    }
    IRET() {
        // what you do after the interrupt handler has finished what its doing 
        // restores the state where the machine was before it was interrupted
        // pop off the stack this.reg[7]--;
        for (let j = 7; j >= 0; j--) {
            this.reg[j] = this.ram.read(this.reg[7]);
            this.reg[7]++;
            // console.log(this.reg[j],this.reg[7]++, j);
        }
        
        // console.log(this.reg[7]);
        this.reg.PC = this.ram.read(this.reg[7]);
        // console.log('Point here at ' + this.reg.PC)
        this.reg[7]++;
        // console.log('Point here at ' + this.reg[7]++)
        this.flags.interruptsEnabled = true;
        // console.log('is flag enabled: ' + this.flags.interruptsEnabled)
    }
    PRA() {
          // !!! IMPLEMENT ME
          const regA = this.ram.read(this.reg.PC  + 1)
          // console.log('this is ' + regA);
          console.log(String.fromCharCode(this.reg[regA]));
          this.reg.PC +=2;
    }
    LD() {
        const regA = this.ram.read(this.reg.PC + 1);
        const regB = this.ram.read(this.reg.PC + 2);
        this.reg[regA] = this.ram.read(this.reg[regB]);
        this.reg.PC += 3;
    }
}

module.exports = CPU;
