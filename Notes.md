* In industry terms, how many months does it take for the number of transistors on a chip to double? 
  According to industry standards, the number of transistors of a chip will double roughly every two years.

* Why are registers necessary? Why not use RAM?
  Registers are just temporary are temporary storage that holds the data the processor (cpu) is working on
  Ram holds more memory but is much slower to access compared to the register as registers are much closer
  to the heart of the cpu. Registers also works as the variables that can be used to perform arithmetic functions. 
  In other words, you can add two registers but cannot add bits of memory from ram.

* Why is cache useful?
  Cache is also known as cpu memory is ramdom access memory that a computer microprocessor can access more
  quickly than it can regular ram. This memory is integrated directly onto the cpu chip or in some cases on a 
  separate chip with a separate bus interconnected with the cpu. It allows the computer to store program 
  instructions that are frequently re-referenced by software during operation. Fast access to these instructions 
  increases the overall speed of the software program. 

* Describe what L1, L2, and L3 caches are.
  L1 cache is the fastest but the smallest and usually embeded in the microprocessor chip. L2 cache has more space and can be either on the chip, a seperate chip or a coprocessor with high speed alternative bus interconnecting the cache of the cpu so it will not be slowed down by traffic on the main system bus. L3 cache is specialized memory that works to improve the performance of L1 and L2. While slower than the previous tiers, it still double the speed of ram. Multi core processors may have individual cores with its own L1 and L2 cache while all cores share the L3 cache. 

* Describe caching and storage from L1 through cloud storage.


* What are some examples of interrupts that might occur? 
  Some examples include hardrive interrupts such as a key on a keyboard which triggers hardware interrupt that causes processor to read the keystroke. For software, an interrupt is a special instruction in the instruction set what causes an interrupt when executed which is useful for handling errors by interrupts a program execution to call attention to the bug to the user if the program cannot handle on its own.  

* Describe what a CPU word is.
  A word is the natural unit of data used by a particular processor design. It is a fixed sized piece of data handled as a unit by the instruction set or hardware of the processor. # might need more info

* Describe what a CPU interrupt is and why are interrupts useful?
  Well first, an interrupt is a signal to the processor emitted by hardware or software indicating an event that needs immediate attention. The processor responds by suspending whatever current activities or actions are being performed, saving its state and executing a function called the interrupt handler. The interrupt of course is temporary and once the handler finishes, the processor resumes normal activity. In other words, interrupts are useful for when we need something that needs to be process by the cpu right away rather than being stored in memory or a register. 

* Describe what the system bus is and what size it is. 
  System bus is a single computer bus that connects the major components of a computer system combining the functions of a data bus, address bus, and control bus. It can therefore carry information (data bus), determine where the data should be sent (address bus) and determine its operation (control bus). 

* Describe what a CPU instruction is.
  The instruction set provides the commands to the processor and specifies the processor's functionality inlucding what operation it supports, what storage mechanisms it has and how they are accessed, and how the programmer/compiler communicates programs to the processor. 

* Describe what the CPU clock represents. 
  It represents the speed at which a microprocessor executes instruction. The cpu requires a fixed number of clock ticks to execute each instruction and the faster the clock, the more instructions the cpu can execute per minute. It is not the only factor in determining cpu's performance but is a important one nevertheless. 

* Describe what kinds of pins enter and exit the CPU.
  It is what makes up the cpu socket amd ot establishes the connections between a microprocessor and the printed circuit board. An lga or land grid array have typically large number of pins with newer microprocessors having 1151 pins. 

* Describe what DMA is. 
  Direct memory access (DMA) is a feature of computer systems that allows certain harware subsystems to access main system memory namely the random access memory indexpend of the central processing unit(cpu). 

* Say which peripherals are connected to the DMA bus.

* Say which peripherals are connected to the I/O bus.

* Describe what RAM is and its reponsibility in the system.
  Ramdom access memory (RAM) is a form of computer data storage that stores data and machine code being used. It allows data to be read or written in almost the same amount of time regardless of where the physical location of the data inside memory is. 

* Describe what the hard disk is and its responsibility in the system.
  Hard disk is a data storage devise that uses magnetic storage to store and retrieve digital information using one or more rapidly rotating disks called platters. Platters are paired with a magnetic head which will then read and write data. 

* Describe what the network interface card is responsible for in the system.
  Also known as a network interface controller, network adapter and a LAN adapter, it a computer hardware that basically connects the computer to a computer network. This essentially is responsible for connecting our computer to the internet. 

* Describe what the graphics card is responsible for in the system.
  It is an expansion card which generates a feed of output images to a display. At the core is a processing unit called a graphics processing unit which does actual computations. It is essentially responsible for rendering of data onto a screen such as a computer monitor and why we can see anything on the screen. 

* Suggest the role that graphics cards play in machine learning.
  GPUs are used to train these deep neural networks using far larger training sets, in an order of magnitude less time, usingfar less datacenter infrastructure.  GPUs are also being used torun these trained machine learning models to do classificationand prediction in the cloud, supporting far more data volume and throughput with less power and infrastructure.
