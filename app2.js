'use strict';

const StreamDeckApi = require('stream-deck-api-mazeppa');
const DcsBiosApi = require('dcs-bios-api-mazeppa');
const Path = require('path');
const Logger = require('logplease');

const logger = Logger.create('dcs-stream-deck-fa18');
const api = new DcsBiosApi({logLevel: 'INFO'});
const streamDeck = StreamDeckApi.getStreamDeck();

const IMAGE_FOLDER = './resources/images/';


// connect to dcs-bios
api.startListening();

// handle interrupts
process.on('SIGINT', () => {
    streamDeck.reset();
    api.stopListening();
    process.exit(1);
});

// initial reset
if (streamDeck) {
    streamDeck.reset();
} else {
    logger.error('No Streamdeck connected! Please make sure Streamdeck is plugged in to you computer');
    process.exit(1);
}

// init
var aircraftPages = {'NONE': {MAIN: {}}};

// fa-18 config
aircraftPages['FA-18C'] = {
    MAIN: {
        1: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey1.png'},
            action: {type: 'page', page: 'MENU'}
        },
        2: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey2.png'},
            action: {type: 'page', page: 'MENU'}
        },
        3: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey3.png'},
            action: {type: 'page', page: 'MENU'}
        },
        4: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey4.png'},
            action: {type: 'page', page: 'MENU'}
        },
        5: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey5.png'},
            action: {type: 'page', page: 'MENU'}
        },
        6: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey6.png'},
            action: {type: 'page', page: 'MENU'}
        },
        7: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey7.png'},
            action: {type: 'page', page: 'MENU'}
        },
        8: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey8.png'},
            action: {type: 'page', page: 'MENU'}
        },
        9: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey9.png'},
            action: {type: 'page', page: 'MENU'}
        },
        10: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey10.png'},
            action: {type: 'page', page: 'MENU'}
        },
        11: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey11.png'},
            action: {type: 'page', page: 'MENU'}
        },
        12: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey12.png'},
            action: {type: 'page', page: 'MENU'}
        },
        13: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey13.png'},
            action: {type: 'page', page: 'MENU'}
        },
        14: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey14.png'},
            action: {type: 'page', page: 'MENU'}
        },
        15: {
            view: {type: 'page_image', page: 'MAIN', image: '/background/sdkey1.png', selImage: '/background/sdkey15.png'},
            action: {type: 'page', page: 'MENU'}
        },
    },
    MENU:{

        6: {
            view: {type: 'page_image', page: 'MENU', image: '', selImage: '/menus/menu_m2000.png'},
            action: {type: 'page', page: 'MENU'}
        },
        7: {
            view: {type: 'page_image', page: 'MENU', image: '', selImage: '/menus/menu_aj37.png'},
            action: {type: 'page', page: 'MENU'}
        },
        8: {
            view: {type: 'page_image', page: 'MENU', image: '', selImage: '/menus/menu_fa_18c.png'},
            action: {type: 'page', page: 'FA18'}
        },
        9: {
            view: {type: 'page_image', page: 'MENU', image: '', selImage: '/menus/menu_f14.png'},
            action: {type: 'page', page: 'MENU'}
        },
        10: {
            view: {type: 'page_image', page: 'MENU', image: '', selImage: '/menus/menu_av8b.png'},
            action: {type: 'page', page: 'MENU'}
        },
    },
    FA18:{
        1:{
            //streamDeck.drawText(key.text, key.textColor, key.buttonColor, key.number);
            view: {type: 'page_image', page: 'MENU', image: '/menus/button_back.png', selImage: '/menus/button_back.png'},
            action: { type: 'page', page: 'MENU' }
        },
        2:{
            //streamDeck.drawText(key.text, key.textColor, key.buttonColor, key.number);
            view: { type: 'page_text', text: 'UFC', textColor: 'blue', buttonColor: 'red'},
            action: { type: 'page', page: 'UFC' }
        }
    },
    UFC:{

        /*

        1:  {type: 'page', page: 'MAIN', image: '/menus/button_back.png'},
        2: {type: 'text', text: 'UFC', textColor: 'white', buttonColor: 'black'},
        6:  {type: 'buttonGotoPage', button: 'UFC_AP', upImage: '/ufc/ufc_ap.png', downImage: '/ufc/ufc_ap_down.png', page: 'UFC_AP'},
        7:  {type: 'button', button: 'UFC_IFF', upImage: '/ufc/ufc_iff.png', downImage: '/ufc/ufc_iff_down.png'},

        11:  {type: 'buttonGotoPage', button: 'UFC_TCN', upImage: '/ufc/ufc_tcn.png', downImage: '/ufc/ufc_tcn_down.png', page: 'UFC_TCN'},
        12: {type: 'button', button: 'UFC_ILS', upImage: '/ufc/ufc_ils.png', downImage: '/ufc/ufc_ils_down.png'},
        13: {type: 'button', button: 'UFC_DL', upImage: '/ufc/ufc_dl.png', downImage: '/ufc/ufc_dl_down.png'},
        14: {type: 'button', button: 'UFC_BCN', upImage: '/ufc/ufc_bcn.png', downImage: '/ufc/ufc_bcn_down.png'},
        15: {type: 'button', button: 'UFC_ONOFF', upImage: '/ufc/ufc_on_off.png', downImage: '/ufc/ufc_on_off_down.png'},


         */
        1:{
            //streamDeck.drawText(key.text, key.textColor, key.buttonColor, key.number);
            view: {type: 'page_image', page: 'MENU', image: '/menus/button_back.png', selImage: '/menus/button_back.png'},
            action: { type: 'page', page: 'MENU' }
        },
        2:{
            view: { type: 'page_text', text: 'UFC', textColor: 'white', buttonColor: 'black'},
        },
        6:{
            //streamDeck.drawText(key.text, key.textColor, key.buttonColor, key.number);
            view: {type: 'page_image', page: 'UFC_AP', image: '/ufc/ufc_ap.png', selImage: '/ufc/ufc_ap_down.png'},
            action: { type: 'page', page: 'UFC_AP' }
        },

        7: {
            view: { type: 'state_image', input: 'UFC_AP',  states: { '0': '/ufc/ufc_ap.png', '1': '/ufc/ufc_ap_down.png' } },
            action: { type: 'push_button', output: 'UFC_AP' }
        },
    },
    UFC_AP:{
        1:{
            //streamDeck.drawText(key.text, key.textColor, key.buttonColor, key.number);
            view: {type: 'page_image', page: 'UFC_AP', image: '/menus/button_back.png', selImage: '/menus/button_back.png'},
            action: { type: 'page', page: 'UFC' }
        },
    }
}

// current page
let currentPage;

// pages of current aircraft
let pages

/**
 * Initialization functions for button views.
 */
let initializeViewFn = {}

/**
 * Initialization functions for button actions.
 */
let initializeActionFn = {}



/*
 View function definitions
 */

/**
 *
 * @param view
 * @param key
 */
initializeViewFn['image'] = function(view, key) {
    // Draw a static image
    view.currentImage = Path.resolve(IMAGE_FOLDER + view.image);
    draw(view);
}
/**
 *
 * @param view
 * @param key
 */
initializeViewFn['state_image'] = function(view, key) {

    // Draw a different image for each control value
    // view: { type: 'state_image', input: 'ANTI_SKID_SWITCH', states: { '0': 'AP_B_off.png', '1': 'AP_B_on.png' }},
    var fn = function(currentValue) {
        view.currentImage = Path.resolve(IMAGE_FOLDER + view.states[currentValue]);
        draw(view);
    }
    api.on(view.input, fn);
    // initial state: the first one
    fn(api.getControlValue(view.input) || Object.keys(view.states)[0]);
}
/**
 *
 * @param view
 * @param key
 */
initializeViewFn['state_label'] = function (view, key) {
    // Draw a different text label for each control value
    // view: { type: 'state_label', text: 'LIGHTS', input: 'LANDING_LIGHTS', states: { '0': 'TAXI', '1': 'OFF', '2': 'LAND' }},
    view.text = view.text.centerJustify(7, ' ')
    var fn = function(currentValue) {
        renderText(view.text + "  " + view.states[currentValue].centerJustify(5, ' '), Object.assign({x: 3},view))
            .then((buffer) => {
                view.currentImageBuffer = buffer;
                draw(view)
            }).catch((buffer) => {
            console.log(error)
        })
    }
    api.on(view.input, fn)
    // initial state: the first one
    fn(api.getControlValue(view.input) || Object.keys(view.states)[0]);
}
/**
 *
 * @param view
 * @param key
 */
initializeViewFn['page_label'] = function (view, key) {
    // Draw the page  name on white background if the page is selected
    // view: { type: 'page_label', text: 'NMSP', page: 'NMSP'},

    renderText(view.text,
        Object.assign(
            {
                x: 4
            },
            view,
            {
                fontColor: view._page == view.page ? 'black' : 'white',
                backgroundColor: view._page == view.page ? (view.onColor || 0xffffff00) : 0x00000000
            }
        )
    ).then((buffer) => {
        view.currentImageBuffer = buffer;
        draw(view)
    }).catch((buffer) => {
        console.log(error)
    })

}
/**
 *
 * @param view
 * @param key
 */
initializeViewFn['page_text'] = function(view, key) {

    // Draw the page  name on white background if the page is selected
    // view: { type: 'page_label', page: 'NMSP', image: 'xxx.png', selImage: 'xxx-sel.png'},
    //view.currentImage = path.resolve(IMAGE_FOLDER + (view._page == view.page ? view.selImage : view.image));
    draw(view);
}
/**
 *
 * @param view
 * @param key
 */
initializeViewFn['page_image'] = function(view, key) {

    // Draw the page  name on white background if the page is selected
    // view: { type: 'page_label', page: 'NMSP', image: 'xxx.png', selImage: 'xxx-sel.png'},
    view.currentImage = Path.resolve(IMAGE_FOLDER + (view._page == view.page ? view.selImage : view.image));
    draw(view);
}

/**
 *
 * @param view
 * @param key
 */
initializeViewFn['led_label'] = function (view, key) {
    // Draw a label with different colors based on the control value. 0 => off (white text on black background), 1 => on (black text on color background)
    // view: { type: 'led_label', text: 'MASTER CAUTION', input: 'MASTER_CAUTION', onColor: 0xFFA50000, onValue: '2' },
    var onValue = view.onValue || '1'
    var fn = function(currentValue) {
        renderText(view.text,
            Object.assign(
                {
                    fontName: 'open-sans',
                    fontSize: '14',
                    x: 3
                },
                view,
                {
                    fontColor: currentValue == onValue ? 'black' : 'white',
                    backgroundColor: currentValue == onValue ? (view.onColor || 0xffffff00) : 0x00000000
                })
        ).then((buffer) => {
            view.currentImageBuffer = buffer;
            draw(view)
        }).catch((buffer) => {
            console.log(error)
        })
    }
    api.on(view.input, fn)
    // initial state: off
    fn(api.getControlValue(view.input) || '0');
}

/**
 *
 * @param view
 * @param key
 */
initializeViewFn['label'] = function(view, key) {
    // Draw a static label, white on black background
    // view: { type: 'label', text: 'MAIN' },
    renderText(view.text,  Object.assign({x: 3},view)).then((buffer) => {
        view.currentImageBuffer = buffer
        draw(view)
    })
}




/*
 Action function definitions
 */

/**
 *
 * @param action
 * @param key
 */
initializeActionFn['cycle_state'] = function (action, key) {
    // Cycle between a fixed set of possible values
    // action: { type: 'cycle_state', output: 'LANDING_LIGHTS', values: ['0', '1', '2'] }
    streamDeck.on(`up:${action.number}`, () => {
        let currentValue = (api.getControlValue(action.output) || '0').toString()
        let currentValueIndex = action.values.indexOf(currentValue)
        let newValueIndex = (1 + currentValueIndex) % action.values.length
        let newValue = action.values[newValueIndex]
        api.sendMessage(`${action.output} ${newValue}\n`);
    });

}
/**
 *
 * @param action
 * @param key
 */
initializeActionFn['toggle'] = function (action, key) {
    // Toggle a control
    // action: { type: 'toggle', output: 'LANDING_LIGHTS' }
    streamDeck.on(`up:${action.number}`, () => {
        api.sendMessage(`${action.output} TOGGLE\n`);
    });

}

initializeActionFn['push_button'] = function (action, key) {
    // Send 1 when button is pushed, 0 when button is released
    // action: { type: 'push_button', output: 'UFC_MASTER_CAUTION' }
    streamDeck.on(`down:${action.number}`, () => {
        api.sendMessage(`${action.output} 1\n`);
    });
    streamDeck.on(`up:${action.number}`, () => {
        api.sendMessage(`${action.output} 0\n`);
    });

}

initializeActionFn['button'] = function (action, key) {
    // Send the value when presssed
    // action: { type: 'button', output: 'UFC_MASTER_CAUTION', value: '2' }
    streamDeck.on(`down:${action.number}`, () => {
        api.sendMessage(`${action.output} ${action.value}\n`);
    });

}

initializeActionFn['spring_loaded'] = function (action, key) {
    // Send the configured value when button is pushed, send the previous value when released
    // action: { type: 'spring_loaded', output: 'UFC_MASTER_CAUTION', value: '2' }
    streamDeck.on(`down:${action.number}`, () => {
        action._pv = (action.releasedValue || api.getControlValue(action.output) || '0').toString()
        api.sendMessage(`${action.output} ${action.value}\n`);
    });
    streamDeck.on(`up:${action.number}`, () => {
        api.sendMessage(`${action.output} ${action._pv}\n`);
    });

}


initializeActionFn['page'] = function (action, key) {
    // switch page on button release
    streamDeck.on(`up:${action.number}`, () => {
        displayPage(action.page);
    });
}



function initializePages(pages) {
    Object.keys(pages).forEach((pageName) => {
        var page = pages[pageName];

        for (let i = 1; i <= 15; i++) {
            page[i] = page[i] || {};

            var key = page[i];
            key._page = pageName;
            key.number = i;
            initializeView(key);
        }
    });
}

function initializeView(key) {
    if (key.view) {
        key.view.number = key.number
        key.view._page = key._page
        var fn = initializeViewFn[key.view.type]
        if (fn) {
            fn(key.view, key)
        } else {
            console.log("Invalid view type: " + key.view.number, key.view.type)
        }
    } else {
        key.view = {}
        key.view.number = key.number
        key.view._page = key._page
        draw(key.view)
    }
}

function initializeAction(key) {
    if (key.action) {
        key.action.number = key.number
        initializeActionFn[key.action.type](key.action, key)
    }
}

function displayPage(pageName) {
    streamDeck.removeButtonListeners();
    currentPage = pageName;
    var page = pages[pageName];

    Object.keys(page).forEach((keyNumber) => {
        var key = page[keyNumber];
        initializeAction(key);
        draw(key.view);
    });
}

function draw(view) {

    if (currentPage != view._page) { return; }

    if(view.text){
        streamDeck.drawText(view.text, view.textColor, view.buttonColor, view.number);
    }
    if (view.currentImageBuffer) {
        streamDeck.drawImageBuffer(view.currentImageBuffer, view.number);
    }
    else if (view.currentImage) {
        streamDeck.drawImageFile(view.currentImage, view.number);
    }
    else {
        streamDeck.drawColor(0x000000, view.number);
    }
}

// START APP
pages = aircraftPages['FA-18C'];
initializePages(pages);
displayPage('MAIN');
