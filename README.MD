# DCS F/A-18 & Elgato Stream-Deck
![Alt text](./resources/docs/dcs_logo_small.jpg?raw=true "DCS")
![Alt text](./resources/docs/elgato_logo_small.jpg?raw=true "ELGATO Stream Deck")
## Overview
### This is a NodeJs app to control parts of the *F/A-18 Hornet* cockpit with the *Elgato Stream-Deck* button box

- Using this application, DCS-World will work with [**DCS-BIOS**](https://github.com/dcs-bios/dcs-bios.git) and will require that you install some software (see below). **Alternatively** You can also map your cockpit controls using the [Elgato Stream-Deck supplied Software](https://www.elgato.com/en/gaming/downloads) but this is not covered here.

- This is currently a **work in progress** and largely a mess (js noob) until I get around to structure it better and add unit-testing. The build might break or certain functions might not work.
Feel free to fork this repository and extend as you see fit.
 
- Many thanks to [Daniel Tian](https://github.com/danieltian) for writing the crucial components to interact with DCS and the Stream-Deck. 

**Further Reading / Tools:**

- [DCS-Forum: Elgato Stream Deck as a configurable button box](https://forums.eagle.ru/showthread.php?t=189194)
- [DCS-BIOS Homepage](http://dcs-bios.a10c.de/)
- [Create Button Images Online](https://www.elgato.com/en/gaming/keycreator)


## Project Scope

I will try to implement most of the F/A-18C controls that are typically not mapped to my HOTAS to reduce the workload of the mouse. The left and right DDI are currently out of scope. A 5x5 version of the Stream-Deck would help in that regard.
Later on more aircraft will be added.

Although there is a large overlap of button functionality for most aircraft (Button types like Switches, Led-Buttons, Radials etc.) they ususally react to different aircraft control events and makes their configuration a very time consuming process.

Time permitting, I will refactor most of the logic to create and configure buttons in a more convenient way in a future release.


#### Currently (limited) supported Aircraft
![Alt text](./resources/images/menus/menu_fa_18c.png?raw=true "FA-18C Hornet")

#### Future (planned) Aircraft
![Alt text](./resources/images/menus/menu_f14.png?raw=true "F14 Tomcat")
![Alt text](./resources/images/menus/menu_aj37.png?raw=true "AJ37 Viggen")
![Alt text](./resources/images/menus/menu_m2000.png?raw=true "Mirage 2000")
![Alt text](./resources/images/menus/menu_av8b.png?raw=true "AV8B Harrier")

#### Example

//TODO: Video link

## Installation

### Prerequisits

The following Software must be installed on your computer to run this application. 
 
- [NodeJS >= v11.4.0](https://nodejs.org/en/)
- [NPM >= 6.7.0](https://www.npmjs.com/get-npm)
- [GIT](https://git-scm.com/)
- [DCS-BIOS](https://github.com/dcs-bios/dcs-bios.git)
- [DCS by *Digital Combat Simulator*](https://www.digitalcombatsimulator.com/en/products/world/)
- [DCS F/A-18 Module by *Eagly Dynamics*](https://www.digitalcombatsimulator.com/en/products/planes/hornet/)

**Project Dependencies**:
These are installed automatically by building this project on your machine.
- [dcs-bios-api-mazeppa fork](https://github.com/mazeppashorse/dcs-bios-api.git)
- [dcs-stream-deck-api-mazeppa fork](https://github.com/mazeppashorse/stream-deck-api.git)

### Application Context

![Alt text](resources/docs/elgato_dcs_fa18_architecture.png?raw=true "DCS")

### Setup

//TODO: Clean slate tutorial steps

```sh
git clone 

npm install

npm start
```
    
## Development Guide
* Buttons are arranged on **pages** from positions 1 to 15. 
* There can be only one page visible at any given time.
* Theoretically there is no limit to the number of pages.
* A Button can execute different actions (or do nothing) upon **key-press** events (up or down).
* A Button can have additional **event-listeners** attached that react to dcs control changes or other button events.
* A Button can either be of two main super-types: **image** and **text**. Type *image* references a picture you would like to display. Type *text* lets you write a string to the button (limited currently to 5 characters).
* The **text color** and **background color** of the button can also be set in *text* type.
* A Button of type image can display either one, two or more images (ex. up/down/on/off/state1/state2/state3 etc.)
* Buttons can be grouped with other buttons or dcs game events.
* Experimental Timeout feature. (Go back to a page after a predetermined time. Useful to mimik the UFC behaviour)

## Implemented Features
### UFC Control Center
-  Buttons for (A/P, IFF, TCN, D/L, BCN, ILS, ON/OFF)
-  Full Number Keyboard with (CLR & ENT)

### AP
- The Autopilot display will switch between pages to simulate the actual workflow in the cockpit.
### TCN
- Similar to autopilot. UFC Displays will update their state (on/off) according to ingame updates. (Sometimes a bit buggy due to dcs events)
### Jettison select
 - Full implementation of the state buttons next to the IFEI to select the stations on the plane. 
 
## TODO:
- Add caching to improve performance in text buttons
- Dynamic status (text) display of selected jettison mode
- Line Breaks and proper text alignment/sizing for text buttons
- Interface definitions; Refactoring of code base
- HUD Section of UFC
- COM1/COM2 of UFC
- Radial Buttons (3 buttons, 1 display, 1 up/right, 1 down/left)
- GRND Controls (Taxi Lights, Slip, etc)
- Weapons ARM (AA / AG)
- Cockpit Lights
- Ejection Seat
- Night Vision (incl. sens. adjust)
- External Views (F1 - F12) -> (Will require second stream deck with hot key-actions as of now)
- Carrier Ops (U-Button, Hook, Wings)
- Radio Controls (Will require second stream deck with hot key-actions as of now)
- Example Video / Screen-Shots
- High quality images of aircraft cockpit controls


## Release History

* 0.0.0
   
## Contributing

1. Fork it (<https://github.com/yourname/yourproject/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
