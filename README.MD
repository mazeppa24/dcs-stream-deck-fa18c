# Elgato Stream-Deck & DCS 

![Alt text](./resources/docs/dcs_logo_small.jpg?raw=true "DCS")
![Alt text](./resources/docs/elgato_logo_small.jpg?raw=true "ELGATO Stream Deck")
---


### Use the Elgato Stream-Deck to control the cockpit of your favourite DCS-Module

This is a **work in progress**. First I will implement most of the F/A-18C controls that are typically not mapped to a HOTAS to reduce the use of the mouse.

Although there is a large overlap of button functionality for most aircraft (Button-Types: e.g. Switches, Led-Buttons, Radials etc.) they react to different DCS-BIOS events and makes configuration a very time consuming process. (Especially when control behaviour relates to other individual or groups of buttons)

If possible, I will refactor most of the logic to generically create buttons in a future release so that others don't have to go through the same amount of time and effort.


### Currently Supported Aircraft
![Alt text](./resources/images/menus/menu_fa_18c.png?raw=true "FA-18C Hornet")

#### Future (planned) Aircraft
![Alt text](./resources/images/menus/menu_f14.png?raw=true "F15 Tomcat")
![Alt text](./resources/images/menus/menu_aj37.png?raw=true "AJ37 Viggen")
![Alt text](./resources/images/menus/menu_m2000.png?raw=true "Mirage 2000")
![Alt text](./resources/images/menus/menu_av8b.png?raw=true "AV8B Harrier")


## Installation & Start

### Requirements 
- NodeJS > v11.4.0
- NPM > 6.7.0
- DCS (Release or OpenBeta)
- DCS-BIOS
  
```
    npm install
    
    node app.js // or npm start
```

## Development Overview

* Control individual cockipt controls by button presses
* Buttons can react to changes in the in-game controls (See TCN, AP, UFC and Jettison Select)
* Mulitple buttons types (Buttons with state, Switches, FA18 Specific Buttons/Displays) 
* Buttons and/or dcs-events can be linked to other buttons or page actions

# Implemented Features
## UFC Control Center
-  Buttons for (A/P, IFF, TCN, D/L, BCN, ILS, ON/OFF)
-  Full Number Keyboard with (CLR & ENT)

## AP
The Autopilot display will switch between pages to simulate the actual workflow in the cockpit

## TCN
Similar to autopilot. UFC Displays will update their state (on/off) according to ingame updates (Sometimes a bit buggy due to dcs events)

## Jettison select
 - Full implementation of the state buttons next to the IFEI to select the stations on the plane 
 
##TODO:
- Dynamic status (text) display of selected jettison mode
- HUD Section of UFC
- COM1/COM2 of UFC
- Radial Buttons (3 buttons, 1 display, 1 up/right, 1 down/left)
- GRND Controls (Taxi Lights, Slip, etc)
- Weapons ARM (AA / AG)
- Cockpit Lights
- Night Vision
- External Views (F1 - F12) -> (Will require second stream deck with hot key-actions as of now)
- Carrier Ops (Salut, U-Button)
- Radio Controls (Will require second stream deck with hot key-actions as of now)


```
cd path/to/project-b
git remote add project-a path/to/project-a
git fetch project-a --tags
git merge --allow-unrelated-histories project-a/master # or whichever branch you want to merge
git remote remove project-a
```
