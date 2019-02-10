# DCS F/A-18 & Elgato Stream-Deck

![Alt text](./resources/docs/dcs_logo_small.jpg?raw=true "DCS")
![Alt text](./resources/docs/elgato_logo_small.jpg?raw=true "ELGATO Stream Deck")
---


### Use the Elgato Stream-Deck to control the cockpit of your favourite DCS-Module

- This is currently a **work in progress**. The build might break or certain functions might not work.
Feel free to fork this repository and extend as you see fit.
 
- Many thanks to [Daniel Tian](https://github.com/danieltian) for writing the crucial components to interact with DCS and the Stream-Deck. 


First I will implement most of the F/A-18C controls that are typically not mapped to my HOTAS to reduce the use of the mouse.

Although there is a large overlap of button functionality for most aircraft (Button-Types: e.g. Switches, Led-Buttons, Radials etc.) they react to different DCS-BIOS events and makes configuration a very time consuming process. (Especially when control behaviour relates to other individual or groups of buttons)

If possible, I will refactor most of the logic to create buttons in a more practical way in a future release.


### Currently Supported Aircraft
![Alt text](./resources/images/menus/menu_fa_18c.png?raw=true "FA-18C Hornet")

#### Future (planned) Aircraft
![Alt text](./resources/images/menus/menu_f14.png?raw=true "F15 Tomcat")
![Alt text](./resources/images/menus/menu_aj37.png?raw=true "AJ37 Viggen")
![Alt text](./resources/images/menus/menu_m2000.png?raw=true "Mirage 2000")
![Alt text](./resources/images/menus/menu_av8b.png?raw=true "AV8B Harrier")


## Overview & Installation

### Requirements

The following Software must be installed on your computer to run this NodeJS application. 
 
- [NodeJS > v11.4.0](https://nodejs.org/en/)
- [NPM > 6.7.0](https://www.npmjs.com/get-npm)
- [GIT](https://git-scm.com/)
- [DCS-BIOS](https://github.com/dcs-bios/dcs-bios.git)
- [DCS by *Digital Combat Simulator*](https://www.digitalcombatsimulator.com/en/products/world/)
- [DCS F/A-18 Module by *Eagly Dynamics*](https://www.digitalcombatsimulator.com/en/products/planes/hornet/)

**Project Dependencies**:
These are installed automatically by building this project on your machine.
- [dcs-bios-api-mazeppa fork](https://github.com/mazeppashorse/dcs-bios-api.git)
- [dcs-stream-deck-api-mazeppa fork](https://github.com/mazeppashorse/stream-deck-api.git)

### Setup

![Alt text](resources/docs/elgato_dcs_fa18_architecture.png?raw=true "DCS")

### Further Reading

- [DCS-Forum: Elgato Stream Deck as a configurable button box](https://forums.eagle.ru/showthread.php?t=189194)

TODO: Full installation instructions

    
## Development Overview
* Buttons are arranged on **pages** from positions 1 to 15. 
* There can be only one page visible at any given time.
* Theoretically there is no limit to the number of pages.
* A Button can execute different actions upon **key-press** up or down.
* A Button can have **event-listeners** that react to dcs control changes or other button events related to itself.
* A Button can either be of an **image** or **text** type. Type *image* references a picture you would like to display. Type *text* lets you write a string to the button.
* The **text color** and **background color** of the button can also be set in *text* type.
* A Button of type image can display either one, two or more images (ex. up/down/on/off/state1/state2/state3 etc.)
* A Button can either be static (just display a text or an image) or have actions like page-navigation.
* Buttons can be grouped with other buttons or dcs game events.
* Experimental Timeout feature. (Go back to a page after a predetermined time. Useful to mimik the UFC behaviour)

# Implemented Features
## UFC Control Center
-  Buttons for (A/P, IFF, TCN, D/L, BCN, ILS, ON/OFF)
-  Full Number Keyboard with (CLR & ENT)

### AP
- The Autopilot display will switch between pages to simulate the actual workflow in the cockpit.
### TCN
- Similar to autopilot. UFC Displays will update their state (on/off) according to ingame updates. (Sometimes a bit buggy due to dcs events)
### Jettison select
 - Full implementation of the state buttons next to the IFEI to select the stations on the plane. 
 
##TODO:
- Dynamic status (text) display of selected jettison mode
- HUD Section of UFC
- COM1/COM2 of UFC
- Radial Buttons (3 buttons, 1 display, 1 up/right, 1 down/left)
- GRND Controls (Taxi Lights, Slip, etc)
- Weapons ARM (AA / AG)
- Cockpit Lights ()
- Ejection Seat
- Night Vision (incl. sens. adjust)
- External Views (F1 - F12) -> (Will require second stream deck with hot key-actions as of now)
- Carrier Ops (U-Button, Hook, Wings)
- Radio Controls (Will require second stream deck with hot key-actions as of now)


```
cd path/to/project-b
git remote add project-a path/to/project-a
git fetch project-a --tags
git merge --allow-unrelated-histories project-a/master # or whichever branch you want to merge
git remote remove project-a
```
