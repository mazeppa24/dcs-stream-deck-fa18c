const streamDeckApi = require('stream-deck-api');
const DcsBiosApi = require('dcs-bios-api');
const path = require('path');
const robot = require('robotjs');
const Logger = require('logplease');
const logger = Logger.create('dcs-stream-deck-fa18');


const IMAGE_FOLDER = './images/';

var api = new DcsBiosApi({logLevel: 'INFO'});
var streamDeck = streamDeckApi.getStreamDeck();
api.startListening();

process.on('SIGINT', () => {
    streamDeck.reset();
    api.stopListening();
    process.exit();
});

streamDeck.reset();

var pages = {
    MAIN: {
        1: {type: 'page', page: 'GROUND', image: '/menu_text_GND.png'},
        2: {type: 'page', page: 'UFC', image: '/menu_text_UFC.png'},
    },
    GROUND: {
        1: {type: 'page', page: 'MAIN', image: 'button_back.png'},
        2: {
            type: 'toggle_switch2way',
            button: 'LDG_TAXI_SW',
            stateOneImage: 'ldg_taxi_light_off.png',
            stateTwoImage: 'ldg_taxi_light_on.png'
        },
        3: {type: 'button', button: 'UFC_AP', upImage: 'ldg_taxi_light_off.png', downImage: 'ldg_taxi_light_on.png'},
    },
    UFC: {
        1: {type: 'page', page: 'MAIN', image: 'button_back.png'},
        2: {
            type: 'button',
            button: 'UFC_1',
            upImage: 'menu_text_UFC.png',
            downImage: 'menu_text_UFC.png'
        },
        6: {type: 'pageWithAction', button: 'UFC_AP', upImage: '/ufc/ufc_ap.png', downImage: '/ufc/ufc_ap_down.png',page: 'UFC_AP'},
        11: {
            type: 'pageWithAction',
            button: 'UFC_TCN',
            upImage: '/ufc/ufc_tcn.png',
            downImage: '/ufc/ufc_tcn_down.png',
            page: 'UFC_TCN'
        },
        7: {type: 'button', button: 'UFC_IFF', upImage: '/ufc/ufc_iff.png', downImage: '/ufc/ufc_iff_down.png'},
        12: {type: 'button', button: 'UFC_ILS', upImage: '/ufc/ufc_ils.png', downImage: '/ufc/ufc_ils_down.png'},
        13: {type: 'button', button: 'UFC_DL', upImage: '/ufc/ufc_dl.png', downImage: '/ufc/ufc_dl_down.png'},
        14: {type: 'button', button: 'UFC_BCN', upImage: '/ufc/ufc_bcn.png', downImage: '/ufc/ufc_bcn_down.png'},
        15: {
            type: 'button',
            button: 'UFC_ONOFF',
            upImage: '/ufc/ufc_on_off.png',
            downImage: '/ufc/ufc_on_off_down.png'
        },

    },
    UFC_KEYBOARD: {
        1: {type: 'page', page: 'MAIN', image: 'menu_ufc.png'},
        2: {
            type: 'button',
            button: 'UFC_1',
            upImage: '/ufc/keyboard/ufc_one.png',
            downImage: '/ufc/keyboard/ufc_one_down.png'
        },
        3: {
            type: 'button',
            button: 'UFC_2',
            upImage: '/ufc/keyboard/ufc_two.png',
            downImage: '/ufc/keyboard/ufc_two_down.png'
        },
        4: {
            type: 'button',
            button: 'UFC_3',
            upImage: '/ufc/keyboard/ufc_three.png',
            downImage: '/ufc/keyboard/ufc_three_down.png'
        },
        5: {
            type: 'button',
            button: 'UFC_CLR',
            upImage: '/ufc/keyboard/ufc_clr.png',
            downImage: '/ufc/keyboard/ufc_clr_down.png'
        },

        7: {
            type: 'button',
            button: 'UFC_4',
            upImage: '/ufc/keyboard/ufc_four.png',
            downImage: '/ufc/keyboard/ufc_four_down.png'
        },
        8: {
            type: 'button',
            button: 'UFC_5',
            upImage: '/ufc/keyboard/ufc_five.png',
            downImage: '/ufc/keyboard/ufc_five_down.png'
        },
        9: {
            type: 'button',
            button: 'UFC_6',
            upImage: '/ufc/keyboard/ufc_six.png',
            downImage: '/ufc/keyboard/ufc_six_down.png'
        },
        10: {
            type: 'button',
            button: 'UFC_0',
            upImage: '/ufc/keyboard/ufc_zero.png',
            downImage: '/ufc/keyboard/ufc_zero_down.png'
        },


        12: {
            type: 'button',
            button: 'UFC_7',
            upImage: '/ufc/keyboard/ufc_seven.png',
            downImage: '/ufc/keyboard/ufc_seven_down.png'
        },
        13: {
            type: 'button',
            button: 'UFC_8',
            upImage: '/ufc/keyboard/ufc_eight.png',
            downImage: '/ufc/keyboard/ufc_eight_down.png'
        },
        14: {
            type: 'button',
            button: 'UFC_9',
            upImage: '/ufc/keyboard/ufc_nine.png',
            downImage: '/ufc/keyboard/ufc_nine_down.png'
        },
        15: {
            type: 'button',
            button: 'UFC_ENT',
            upImage: '/ufc/keyboard/ufc_enter.png',
            downImage: '/ufc/keyboard/ufc_enter_down.png'
        },

    },
    UFC_AP: {
        1: {type: 'page', page: 'UFC', image: 'button_back.png'},
        2: {
            type: 'button',
            button: 'UFC_1',
            upImage: 'menu_text_UFC.png',
            downImage: '/ufc/menu_text_UFC.png'
        },
        3: {
            type: 'button',
            button: 'UFC_1',
            upImage: 'menu_text_AP.png',
            downImage: '/ufc/menu_text_AP.png'
        },
        11: {
            type: 'pageWithAction',
            button: 'UFC_OS1',
            upImage: '/ap/ufc_ap_atth.png',
            downImage: '/ap/ufc_ap_atth.png',
            page: 'UFC_AP_ATTH'
        },
        12: {
            type: 'pageWithAction',
            button: 'UFC_OS2',
            upImage: '/ap/ufc_ap_hselt.png',
            downImage: '/ap/ufc_ap_hselt.png',
            page: 'UFC_AP_ATTH'
        },
        13: {
            type: 'pageWithAction',
            button: 'UFC_OS3',
            upImage: '/ap/ufc_ap_balt.png',
            downImage: '/ap/ap/ufc_ap_balt.png',
            page: 'UFC_AP_ATTH'
        },
        14: {
            type: 'pageWithAction',
            button: 'UFC_OS4',
            upImage: '/ap/ufc_ap_ralt.png',
            downImage: '/ap/ufc_ap_ralt.png',
            page: 'UFC_AP_ATTH'
        },
    },
    UFC_TCN: {
        1: {type: 'page', page: 'UFC', image: 'button_back.png'},
        2: {
            type: 'button',
            button: 'UFC_1',
            upImage: 'menu_text_UFC.png',
            downImage: '/ufc/menu_text_UFC.png'
        },
        3: {
            type: 'button',
            button: 'UFC_1',
            upImage: 'menu_text_TACAN.png',
            downImage: '/ufc/menu_text_TACAN.png'
        },
        11: {
            type: 'pageWithAction',
            button: 'UFC_OS1',
            upImage: '/ufc/ufc_tcn/ufc_tcn_tr_on.png',
            downImage: '/ufc/ufc_tcn/ufc_tcn_tr_off.png',
            page: 'UFC_TCN_TR'
        },
        12: {
            type: 'pageWithAction',
            button: 'UFC_OS2',
            upImage: '/ufc/ufc_tcn/ufc_tcn_rcv_on.png',
            downImage: '/ufc/ufc_tcn/ufc_tcn_rcv_off.png',
            page: 'UFC_TCN_RCV'
        },
        13: {
            type: 'pageWithAction',
            button: 'UFC_OS3',
            upImage: '/ufc/ufc_tcn/ufc_tcn_aa_on.png',
            downImage: '/ufc/ufc_tcn/ufc_tcn_aa_off.png',
            page: 'UFC_TCN_AA'
        },
        14: {
            type: 'pageWithAction',
            button: 'UFC_OS4',
            upImage: '/ufc/ufc_tcn/ufc_tcn_x_on.png',
            downImage: '/ufc/ufc_tcn/ufc_tcn_x_off.png',
            page: 'UFC_TCN_X'
        },

        15: {
            type: 'pageWithAction',
            button: 'UFC_OS5',
            upImage: '/ufc/ufc_tcn/ufc_tcn_y_on.png',
            downImage: '/ufc/ufc_tcn/ufc_tcn_y_off.png',
            page: 'UFC_TCN_Y'
        },
    },
    UFC_TCN_TR: {
        1: {type: 'page', page: 'UFC_TCN', image: 'button_back.png'},

        2: {
            type: 'button',
            button: 'UFC_1',
            upImage: '/ufc/keyboard/ufc_one.png',
            downImage: '/ufc/keyboard/ufc_one_down.png'
        },
        3: {
            type: 'button',
            button: 'UFC_2',
            upImage: '/ufc/keyboard/ufc_two.png',
            downImage: '/ufc/keyboard/ufc_two_down.png'
        },
        4: {
            type: 'button',
            button: 'UFC_3',
            upImage: '/ufc/keyboard/ufc_three.png',
            downImage: '/ufc/keyboard/ufc_three_down.png'
        },
        5: {
            type: 'button',
            button: 'UFC_CLR',
            upImage: '/ufc/keyboard/ufc_clr.png',
            downImage: '/ufc/keyboard/ufc_clr_down.png'
        },
        11: {
            type: 'pageWithAction',
            button: 'UFC_OS1',
            upImage: '/ufc/ufc_tcn/ufc_tcn_tr_on.png',
            downImage: '/ufc/ufc_tcn/ufc_tcn_tr_off.png',
            page: 'UFC_TCN_TR'
        },
        7: {
            type: 'button',
            button: 'UFC_4',
            upImage: '/ufc/keyboard/ufc_four.png',
            downImage: '/ufc/keyboard/ufc_four_down.png'
        },
        8: {
            type: 'button',
            button: 'UFC_5',
            upImage: '/ufc/keyboard/ufc_five.png',
            downImage: '/ufc/keyboard/ufc_five_down.png'
        },
        9: {
            type: 'button',
            button: 'UFC_6',
            upImage: '/ufc/keyboard/ufc_six.png',
            downImage: '/ufc/keyboard/ufc_six_down.png'
        },
        10: {
            type: 'button',
            button: 'UFC_0',
            upImage: '/ufc/keyboard/ufc_zero.png',
            downImage: '/ufc/keyboard/ufc_zero_down.png'
        },


        12: {
            type: 'button',
            button: 'UFC_7',
            upImage: '/ufc/keyboard/ufc_seven.png',
            downImage: '/ufc/keyboard/ufc_seven_down.png'
        },
        13: {
            type: 'button',
            button: 'UFC_8',
            upImage: '/ufc/keyboard/ufc_eight.png',
            downImage: '/ufc/keyboard/ufc_eight_down.png'
        },
        14: {
            type: 'button',
            button: 'UFC_9',
            upImage: '/ufc/keyboard/ufc_nine.png',
            downImage: '/ufc/keyboard/ufc_nine_down.png'
        },
        15: {
            type: 'button',
            button: 'UFC_ENT',
            upImage: '/ufc/keyboard/ufc_enter.png',
            downImage: '/ufc/keyboard/ufc_enter_down.png'
        },
    },
    UFC_TCN_RCV: {
        1: {type: 'page', page: 'UFC_TCN', image: 'button_back.png'},

        2: {
            type: 'button',
            button: 'UFC_1',
            upImage: '/ufc/keyboard/ufc_one.png',
            downImage: '/ufc/keyboard/ufc_one_down.png'
        },
        3: {
            type: 'button',
            button: 'UFC_2',
            upImage: '/ufc/keyboard/ufc_two.png',
            downImage: '/ufc/keyboard/ufc_two_down.png'
        },
        4: {
            type: 'button',
            button: 'UFC_3',
            upImage: '/ufc/keyboard/ufc_three.png',
            downImage: '/ufc/keyboard/ufc_three_down.png'
        },
        5: {
            type: 'button',
            button: 'UFC_CLR',
            upImage: '/ufc/keyboard/ufc_clr.png',
            downImage: '/ufc/keyboard/ufc_clr_down.png'
        },
        11: {
            type: 'pageWithAction',
            button: 'UFC_OS1',
            upImage: '/ufc/ufc_tcn/ufc_tcn_rcv_on.png',
            downImage: '/ufc/ufc_tcn/ufc_tcn_rcv_off.png',
            page: 'UFC_TCN_TR'
        },
        7: {
            type: 'button',
            button: 'UFC_4',
            upImage: '/ufc/keyboard/ufc_four.png',
            downImage: '/ufc/keyboard/ufc_four_down.png'
        },
        8: {
            type: 'button',
            button: 'UFC_5',
            upImage: '/ufc/keyboard/ufc_five.png',
            downImage: '/ufc/keyboard/ufc_five_down.png'
        },
        9: {
            type: 'button',
            button: 'UFC_6',
            upImage: '/ufc/keyboard/ufc_six.png',
            downImage: '/ufc/keyboard/ufc_six_down.png'
        },
        10: {
            type: 'button',
            button: 'UFC_0',
            upImage: '/ufc/keyboard/ufc_zero.png',
            downImage: '/ufc/keyboard/ufc_zero_down.png'
        },


        12: {
            type: 'button',
            button: 'UFC_7',
            upImage: '/ufc/keyboard/ufc_seven.png',
            downImage: '/ufc/keyboard/ufc_seven_down.png'
        },
        13: {
            type: 'button',
            button: 'UFC_8',
            upImage: '/ufc/keyboard/ufc_eight.png',
            downImage: '/ufc/keyboard/ufc_eight_down.png'
        },
        14: {
            type: 'button',
            button: 'UFC_9',
            upImage: '/ufc/keyboard/ufc_nine.png',
            downImage: '/ufc/keyboard/ufc_nine_down.png'
        },
        15: {
            type: 'button',
            button: 'UFC_ENT',
            upImage: '/ufc/keyboard/ufc_enter.png',
            downImage: '/ufc/keyboard/ufc_enter_down.png'
        },
    },
    UFC_TCN_AA: {
        1: {type: 'page', page: 'UFC_TCN', image: 'button_back.png'},

        2: {
            type: 'button',
            button: 'UFC_1',
            upImage: '/ufc/keyboard/ufc_one.png',
            downImage: '/ufc/keyboard/ufc_one_down.png'
        },
        3: {
            type: 'button',
            button: 'UFC_2',
            upImage: '/ufc/keyboard/ufc_two.png',
            downImage: '/ufc/keyboard/ufc_two_down.png'
        },
        4: {
            type: 'button',
            button: 'UFC_3',
            upImage: '/ufc/keyboard/ufc_three.png',
            downImage: '/ufc/keyboard/ufc_three_down.png'
        },
        5: {
            type: 'button',
            button: 'UFC_CLR',
            upImage: '/ufc/keyboard/ufc_clr.png',
            downImage: '/ufc/keyboard/ufc_clr_down.png'
        },
        11: {
            type: 'pageWithAction',
            button: 'UFC_OS1',
            upImage: '/ufc/ufc_tcn/ufc_tcn_aa_on.png',
            downImage: '/ufc/ufc_tcn/ufc_tcn_aa_off.png',
            page: 'UFC_TCN_TR'
        },
        7: {
            type: 'button',
            button: 'UFC_4',
            upImage: '/ufc/keyboard/ufc_four.png',
            downImage: '/ufc/keyboard/ufc_four_down.png'
        },
        8: {
            type: 'button',
            button: 'UFC_5',
            upImage: '/ufc/keyboard/ufc_five.png',
            downImage: '/ufc/keyboard/ufc_five_down.png'
        },
        9: {
            type: 'button',
            button: 'UFC_6',
            upImage: '/ufc/keyboard/ufc_six.png',
            downImage: '/ufc/keyboard/ufc_six_down.png'
        },
        10: {
            type: 'button',
            button: 'UFC_0',
            upImage: '/ufc/keyboard/ufc_zero.png',
            downImage: '/ufc/keyboard/ufc_zero_down.png'
        },


        12: {
            type: 'button',
            button: 'UFC_7',
            upImage: '/ufc/keyboard/ufc_seven.png',
            downImage: '/ufc/keyboard/ufc_seven_down.png'
        },
        13: {
            type: 'button',
            button: 'UFC_8',
            upImage: '/ufc/keyboard/ufc_eight.png',
            downImage: '/ufc/keyboard/ufc_eight_down.png'
        },
        14: {
            type: 'button',
            button: 'UFC_9',
            upImage: '/ufc/keyboard/ufc_nine.png',
            downImage: '/ufc/keyboard/ufc_nine_down.png'
        },
        15: {
            type: 'button',
            button: 'UFC_ENT',
            upImage: '/ufc/keyboard/ufc_enter.png',
            downImage: '/ufc/keyboard/ufc_enter_down.png'
        },
    },
    UFC_TCN_X: {
        1: {type: 'page', page: 'UFC_TCN', image: 'button_back.png'},

        2: {
            type: 'button',
            button: 'UFC_1',
            upImage: '/ufc/keyboard/ufc_one.png',
            downImage: '/ufc/keyboard/ufc_one_down.png'
        },
        3: {
            type: 'button',
            button: 'UFC_2',
            upImage: '/ufc/keyboard/ufc_two.png',
            downImage: '/ufc/keyboard/ufc_two_down.png'
        },
        4: {
            type: 'button',
            button: 'UFC_3',
            upImage: '/ufc/keyboard/ufc_three.png',
            downImage: '/ufc/keyboard/ufc_three_down.png'
        },
        5: {
            type: 'button',
            button: 'UFC_CLR',
            upImage: '/ufc/keyboard/ufc_clr.png',
            downImage: '/ufc/keyboard/ufc_clr_down.png'
        },
        11: {
            type: 'pageWithAction',
            button: 'UFC_OS1',
            upImage: '/ufc/ufc_tcn/ufc_tcn_x_on.png',
            downImage: '/ufc/ufc_tcn/ufc_tcn_x_off.png',
            page: 'UFC_TCN_TR'
        },
        7: {
            type: 'button',
            button: 'UFC_4',
            upImage: '/ufc/keyboard/ufc_four.png',
            downImage: '/ufc/keyboard/ufc_four_down.png'
        },
        8: {
            type: 'button',
            button: 'UFC_5',
            upImage: '/ufc/keyboard/ufc_five.png',
            downImage: '/ufc/keyboard/ufc_five_down.png'
        },
        9: {
            type: 'button',
            button: 'UFC_6',
            upImage: '/ufc/keyboard/ufc_six.png',
            downImage: '/ufc/keyboard/ufc_six_down.png'
        },
        10: {
            type: 'button',
            button: 'UFC_0',
            upImage: '/ufc/keyboard/ufc_zero.png',
            downImage: '/ufc/keyboard/ufc_zero_down.png'
        },


        12: {
            type: 'button',
            button: 'UFC_7',
            upImage: '/ufc/keyboard/ufc_seven.png',
            downImage: '/ufc/keyboard/ufc_seven_down.png'
        },
        13: {
            type: 'button',
            button: 'UFC_8',
            upImage: '/ufc/keyboard/ufc_eight.png',
            downImage: '/ufc/keyboard/ufc_eight_down.png'
        },
        14: {
            type: 'button',
            button: 'UFC_9',
            upImage: '/ufc/keyboard/ufc_nine.png',
            downImage: '/ufc/keyboard/ufc_nine_down.png'
        },
        15: {
            type: 'button',
            button: 'UFC_ENT',
            upImage: '/ufc/keyboard/ufc_enter.png',
            downImage: '/ufc/keyboard/ufc_enter_down.png'
        },
    },
    UFC_TCN_Y: {
        1: {type: 'page', page: 'UFC_TCN', image: 'button_back.png'},

        2: {
            type: 'button',
            button: 'UFC_1',
            upImage: '/ufc/keyboard/ufc_one.png',
            downImage: '/ufc/keyboard/ufc_one_down.png'
        },
        3: {
            type: 'button',
            button: 'UFC_2',
            upImage: '/ufc/keyboard/ufc_two.png',
            downImage: '/ufc/keyboard/ufc_two_down.png'
        },
        4: {
            type: 'button',
            button: 'UFC_3',
            upImage: '/ufc/keyboard/ufc_three.png',
            downImage: '/ufc/keyboard/ufc_three_down.png'
        },
        5: {
            type: 'button',
            button: 'UFC_CLR',
            upImage: '/ufc/keyboard/ufc_clr.png',
            downImage: '/ufc/keyboard/ufc_clr_down.png'
        },
        11: {
            type: 'pageWithAction',
            button: 'UFC_OS1',
            upImage: '/ufc/ufc_tcn/ufc_tcn_y_on.png',
            downImage: '/ufc/ufc_tcn/ufc_tcn_y_off.png',
            page: 'UFC_TCN_TR'
        },
        7: {
            type: 'button',
            button: 'UFC_4',
            upImage: '/ufc/keyboard/ufc_four.png',
            downImage: '/ufc/keyboard/ufc_four_down.png'
        },
        8: {
            type: 'button',
            button: 'UFC_5',
            upImage: '/ufc/keyboard/ufc_five.png',
            downImage: '/ufc/keyboard/ufc_five_down.png'
        },
        9: {
            type: 'button',
            button: 'UFC_6',
            upImage: '/ufc/keyboard/ufc_six.png',
            downImage: '/ufc/keyboard/ufc_six_down.png'
        },
        10: {
            type: 'button',
            button: 'UFC_0',
            upImage: '/ufc/keyboard/ufc_zero.png',
            downImage: '/ufc/keyboard/ufc_zero_down.png'
        },


        12: {
            type: 'button',
            button: 'UFC_7',
            upImage: '/ufc/keyboard/ufc_seven.png',
            downImage: '/ufc/keyboard/ufc_seven_down.png'
        },
        13: {
            type: 'button',
            button: 'UFC_8',
            upImage: '/ufc/keyboard/ufc_eight.png',
            downImage: '/ufc/keyboard/ufc_eight_down.png'
        },
        14: {
            type: 'button',
            button: 'UFC_9',
            upImage: '/ufc/keyboard/ufc_nine.png',
            downImage: '/ufc/keyboard/ufc_nine_down.png'
        },
        15: {
            type: 'button',
            button: 'UFC_ENT',
            upImage: '/ufc/keyboard/ufc_enter.png',
            downImage: '/ufc/keyboard/ufc_enter_down.png'
        },
    },
    PVI_SELECTION: {
        1: {type: 'page', page: 'PVI', image: 'pvi-800.png'},
        //2: { type: 'pageWithAction', button: 'PVI_WAYPOINTS_BTN', page: 'PVI', upImage: 'btnWPT-off.png', downImage: 'btnWPT-on.png' },
        //7: { type: 'pageWithAction', button: 'PVI_AIRFIELDS_BTN', page: 'PVI', upImage: 'btnAIR-off.png', downImage: 'btnAIR-on.png' },
        //11: { type: 'pageWithAction', button: 'PVI_FIXPOINTS_BTN', page: 'PVI', upImage: 'btnFIX-off.png', downImage: 'btnFIX-on.png' },
        //12: { type: 'pageWithAction', button: 'PVI_TARGETS_BTN', page: 'PVI', upImage: 'btnNAV-off.png', downImage: 'btnNAV-on.png' }
    },

    RADIO: {}
};

initializePages(pages);

function initializePages(pages) {
    Object.keys(pages).forEach((pageName) => {
        var page = pages[pageName];

        for (let i = 1; i <= 15; i++) {
            page[i] = page[i] || {};

            var key = page[i];
            key._page = pageName;
            key.number = i;
            initializeKey(key);
        }
    });
}

function initializeKey(key) {
    switch (key.type) {

        case 'static':
            createStaticImage(key);
            break;
        case 'toggle_switch2way':
            createToggleSwitch2Way(key);
            break;
        case 'ledButton':
            createToggleLedButton(key);
            break;
        case 'button':
            createMomentaryButton(key);
            break;
        case 'page':
            createPageButton(key);
            break;
        case 'pageWithAction':
            createMomentaryPageButton(key);
            break;

        case 'textDisplay':
            createTextDisplay(key);
            break;
        case 'custom':
            key.fn();
            break;
    }
}

var currentPage;
displayPage('MAIN');

function displayPage(pageName) {
    streamDeck.removeButtonListeners();
    currentPage = pageName;
    var page = pages[pageName];

    Object.keys(page).forEach((keyNumber) => {
        var key = page[keyNumber];
        addKeyListener(key);
        draw(key);
    });
}

function draw(key) {
    if (currentPage != key._page) {
        return;
    }

    if (key.currentImage) {
        streamDeck.drawImageFile(key.currentImage, key.number);
    } else {
        streamDeck.drawColor(0x000000, key.number);

    }
}

function addKeyListener(key) {
    if (key.type == 'ledButton') {
        var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
        var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

        streamDeck.on(`down:${key.number}`, () => {
            api.sendMessage(`${key.button} 1\n`);
            key.currentImage = downImagePath;
            draw(key);
        });

        streamDeck.on(`up:${key.number}`, () => {
            api.sendMessage(`${key.button} 0\n`);
            key.currentImage = upImagePath;
            draw(key);
        });
    } else if (key.type == 'toggle_switch2way') {
        var stateOneImagePath = path.resolve(IMAGE_FOLDER + key.stateOneImage);
        var stateTwoImagePath = path.resolve(IMAGE_FOLDER + key.stateTwoImage);

        streamDeck.on(`down:${key.number}`, () => {
            api.sendMessage(`${key.button} 1\n`);
            //key.currentImage = stateTwoImagePath;
            draw(key);
        });

        streamDeck.on(`up:${key.number}`, () => {
            api.sendMessage(`${key.button} 0\n`);
            //key.currentImage = stateOneImagePath;
            draw(key);
        });

    } else if (key.type == 'button') {
        var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
        var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

        streamDeck.on(`down:${key.number}`, () => {
            api.sendMessage(`${key.button} 1\n`);
            key.currentImage = downImagePath;
            draw(key);
        });

        streamDeck.on(`up:${key.number}`, () => {
            api.sendMessage(`${key.button} 0\n`);
            key.currentImage = upImagePath;
            draw(key);
        });
    } else if (key.type == 'pageWithAction') {
        var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
        var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

        streamDeck.on(`down:${key.number}`, () => {
            api.sendMessage(`${key.button} 1\n`);
            key.currentImage = downImagePath;
            draw(key);
        });

        streamDeck.on(`up:${key.number}`, () => {
            api.sendMessage(`${key.button} 0\n`);
            key.currentImage = upImagePath;
            draw(key);
            displayPage(key.page);
        });
    } else if (key.type == 'page') {
        streamDeck.on(`down:${key.number}`, () => {
            displayPage(key.page);
        });
    } else if (key.type == 'static') {
        var imagePath = path.resolve(IMAGE_FOLDER + key.image);
        key.currentImage = imagePath;
        draw(key);
       // displayPage(key.page);
    }

}

function createStaticImage(key) {
    var imagePath = path.resolve(IMAGE_FOLDER, key.image);
    key.currentImage = imagePath;

    draw(key);
    addKeyListener(key);

}
function createUFCTacanSwitch(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.stateOneImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.stateTwoImage);

    // Draw the key immediately so that we can see it.
    draw(key);

    addKeyListener(key);

    // Draw the new image when the LED state changes.
    api.on(key.button, (value) => {
        logger.info('key pressed:', key);
        //      logger.info('value passed:', value);
        var tcn_aa
        var tcn_tr
        var tcn_rcv
        var tcn_x
        var tcn_y
        switch (key.button) {
            case 'UFC_OS1':
                var x = api.getControlValue('Ka-50', 'PVI-800 Control Panel', 'UFC_OPTION_DISPLAY_2 RCV');
                api.on(key.button, (value) => {
                    //      logger.info('key pressed:', key);
                    logger.info('value passed:', value);
                    key.currentImage = value ? downImagePath : upImagePath;
                    logger.info('current image:', key.currentImage);
                    draw(key);
                });
                break;
            case 'UFC_OS2':
                break;
            case 'UFC_OS3':
                break;
            case 'UFC_OS4':
                break;
            case 'UFC_O5':
                break;
        }
        key.currentImage = value ? downImagePath : upImagePath;
        logger.info('current image:', key.currentImage);
        draw(key);
    });
}

function createToggleSwitch2Way(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.stateOneImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.stateTwoImage);

    // Draw the key immediately so that we can see it.
    draw(key);

    addKeyListener(key);

    // Draw the new image when the LED state changes.
    api.on(key.button, (value) => {
        if (key.currentImage == downImagePath) {
            key.currentImage = upImagePath;
        } else {
            key.currentImage = downImagePath;
        }
        //key.currentImage = value ? downImagePath : upImagePath;
        draw(key);
    });


    api.on('UFC_SCRATCHPAD_STRING_1_DISPLAY', (value) => {
        logger.info('UFC_SCRATCHPAD_STRING_1_DISPLAY', value);
        //draw(key)
    });
    api.on('UFC_OPTION_DISPLAY_2 RCV', (value) => {
        logger.info('UFC_SCRATCHPAD_STRING_1_DISPLAY', value);
        //draw(key)
    });


    api.on('UFC_OPTION_DISPLAY_1', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        logger.info('UFC_OPTION_DISPLAY_1', value);
    });
    api.on('UFC_OPTION_DISPLAY_2', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        logger.info('UFC_OPTION_DISPLAY_2', value);
    });
    api.on('UFC_OPTION_DISPLAY_3', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        logger.info('UFC_OPTION_DISPLAY_3', value);
    });
    api.on('UFC_OPTION_DISPLAY_4', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        logger.info('UFC_OPTION_DISPLAY_4', value);
    });
    api.on('UFC_OPTION_DISPLAY_5', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        logger.info('UFC_OPTION_DISPLAY_5', value);
    });
    api.on('UFC_OS1', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        logger.info('UFC_OS1', value);
    });


    logger.info(api.getControlValue('Ka-50', 'PVI-800 Control Panel', 'PVI_WAYPOINTS_LED'));
    // Draw the new image when the LED state changes.
    api.on(key.button, (value) => {
        //      logger.info('key pressed:', key);
        //logger.info('value passed:', value);
        key.currentImage = value ? downImagePath : upImagePath;
        logger.info('current image:', key.currentImage);
        logger.info('\n');
        logger.info('**************----****************');
        draw(key);
    });
}


/**
 * Create a button that has a LED in it.
 */
function createToggleLedButton(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

    // Draw the key immediately so that we can see it.
    draw(key);

    addKeyListener(key);

    // Draw the new image when the LED state changes.
    api.on(key.button, (value) => {
        if (key.currentImage == downImagePath) {
            key.currentImage = upImagePath;
        } else {
            key.currentImage = downImagePath;
        }
        //key.currentImage = value ? downImagePath : upImagePath;
        draw(key);
    });
}

/**
 * Create a button that navigates to another page.
 */
function createPageButton(key) {
    var imagePath = path.join(IMAGE_FOLDER, key.image);
    key.currentImage = imagePath;

    draw(key);
    addKeyListener(key);
}

/*
function drawCanvas(text){
    Image = Canvas.Image,
    canvas = new Canvas(200, 200),
    ctx = canvas.getContext('2d');
    ctx.font = '30px Impact';
    ctx.rotate(0.1);
    ctx.fillText('Awesome!', 50, 100);
    return canvas;
}
*/


/**
 * Create a Text display field
 * @param key
 */
function createTextDisplay(key) {
    if (key.text) {
        //drawCanvas(key.text);
        draw(key);
        addKeyListener(key);
    }
}


/**
 * Create a momentary button that will switch images when it is pressed and released.
 */
function createMomentaryButton(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);
    key.currentImage = upImagePath;
    draw(key);
    addKeyListener(key);
}

function createMomentaryPageButton(key) {
    createMomentaryButton(key);
    logger.info('key.button', key.button);
    streamDeck.on(`up:${key.button}`, () => {
        displayPage(pages[page]);
    });
}

function createPviSelectedWaypointIndicator(buttonNumber) {
    var drawImageFile = (value, imageName) => {
        if (value) {
            streamDeck.drawImageFile(path.resolve(IMAGE_FOLDER + imageName), buttonNumber);
        } else if (!value && currentSelection == imageName) {
            streamDeck.drawColor(0x000000, buttonNumber);
            currentSelection = undefined;
        } else {
            currentSelection = imageName;
        }
    };

    var currentSelection;

    if (api.getControlValue('Ka-50', 'PVI-800 Control Panel', 'PVI_WAYPOINTS_LED')) {
        drawImageFile(buttonNumber, 'btnWPT-on.png');
        currentSelection = 'btnWPT-on.png';
    } else if (api.getControlValue('Ka-50', 'PVI-800 Control Panel', 'PVI_AIRFIELDS_LED')) {
        drawImageFile(buttonNumber, 'btnAIR-on.png');
        currentSelection = 'btnAIR-on.png';
    } else if (api.getControlValue('Ka-50', 'PVI-800 Control Panel', 'PVI_FIXPOINTS_LED')) {
        drawImageFile(buttonNumber, 'btnFIX-on.png');
        currentSelection = 'btnFIX-on.png';
    } else if (api.getControlValue('Ka-50', 'PVI-800 Control Panel', 'PVI_TARGETS_LED')) {
        drawImageFile(buttonNumber, 'btnNAV-on.png');
        currentSelection = 'btnNAV-on.png';
    }

    api.on('PVI_WAYPOINTS_LED', (value) => {
        drawImageFile(value, 'btnWPT-on.png');
    });

    api.on('PVI_AIRFIELDS_LED', (value) => {
        drawImageFile(value, 'btnAIR-on.png');
    });

    api.on('PVI_FIXPOINTS_LED', (value) => {
        drawImageFile(value, 'btnFIX-on.png');
    });

    api.on('PVI_TARGETS_LED', (value) => {
        drawImageFile(value, 'btnNAV-on.png');
    });
}
