# Elgato Stream-Deck DCS FA-18C Controller

![Alt text](./resources/docs/dcs_logo_small.jpg?raw=true "Title")
![Alt text](./resources/docs/elgato_logo_small.jpg?raw=true "Title")

## Button box to control various switches and control inputs

...work in progress...

## Installation & Start

```js
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
