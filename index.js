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
        1: {type: 'image', image: '/background/sdkey1.png'},
        2: {type: 'image', image: '/background/sdkey2.png'},
        3: {type: 'image', image: '/background/sdkey3.png'},
        4: {type: 'image', image: '/background/sdkey4.png'},
        5: {type: 'image', image: '/background/sdkey5.png'},

        6: {type: 'image', image: '/background/sdkey6.png'},
        7: {type: 'image', image: '/background/sdkey7.png'},
        8: {type: 'page', page:'FA_18C',image: '/background/sdkey8.png'},
        9: {type: 'image', image: '/background/sdkey9.png'},
        10: {type: 'image', image: '/background/sdkey10.png'},

        11: {type: 'image', image: '/background/sdkey11.png'},
        12: {type: 'image', image: '/background/sdkey12.png'},
        13: {type: 'image', image: '/background/sdkey13.png'},
        14: {type: 'image', image: '/background/sdkey14.png'},
        15: {type: 'image', image: '/background/sdkey15.png'},

    },
    FA_18C:{
        2: {type: 'page', page: 'GROUND', image: '/menus/menu_text_GND.png'},
        3: {type: 'page', page: 'UFC', image: '/menus/menu_text_UFC.png'},
        4: {type: 'page', page: 'UFC', image: '/menus/menu_text_IFEI.png'},

    },
    GROUND: {
        1: {type: 'page', page: 'MAIN', image: 'button_back.png'},
        3: {type: 'button', button: 'UFC_AP', upImage: 'ldg_taxi_light_off.png', downImage: 'ldg_taxi_light_on.png'},
    },
    UFC: {
        1: {type: 'page', page: 'MAIN', image: '/menus/button_back.png'},
        2: {type: 'button', button: 'TEXT', upImage: '/menus/menu_text_UFC.png', downImage: '/menus/menu_text_UFC.png'},
        6: {type: 'pageWithAction', button: 'UFC_AP', upImage: '/ufc/ufc_ap.png', downImage: '/ufc/ufc_ap_down.png',page: 'UFC_AP'},
        11: {type: 'pageWithAction', button: 'UFC_TCN', upImage: '/ufc/ufc_tcn.png', downImage: '/ufc/ufc_tcn_down.png', page: 'UFC_TCN'},
        7: {type: 'button', button: 'UFC_IFF', upImage: '/ufc/ufc_iff.png', downImage: '/ufc/ufc_iff_down.png'},
        12: {type: 'button', button: 'UFC_ILS', upImage: '/ufc/ufc_ils.png', downImage: '/ufc/ufc_ils_down.png'},
        13: {type: 'button', button: 'UFC_DL', upImage: '/ufc/ufc_dl.png', downImage: '/ufc/ufc_dl_down.png'},
        14: {type: 'button', button: 'UFC_BCN', upImage: '/ufc/ufc_bcn.png', downImage: '/ufc/ufc_bcn_down.png'},
        15: {type: 'button', button: 'UFC_ONOFF', upImage: '/ufc/ufc_on_off.png', downImage: '/ufc/ufc_on_off_down.png'},
    },
    UFC_AP: {
        1: {type: 'page', page: 'UFC', image: '/menus/button_back.png'},
        2: {type: 'button', button: 'TEXT', upImage: '/menus/menu_text_UFC.png', downImage: '/menus/menu_text_UFC.png'},
        3: {type: 'button', button: 'TEXT', upImage: '/menus/menu_text_AP.png', downImage: '/menus/menu_text_AP.png'},
        11: {type: 'ufcDisplayButton', state: 0, button: 'UFC_OS1' ,upImage: '/ufc/ufc_ap/ufc_ap_atth_on.png', downImage: '/ufc/ufc_ap/ufc_ap_atth_off.png'},
        12: {type: 'buttonUFC_OS2', button: 'UFC_OS2', upImage: '/ufc/ufc_ap/ufc_ap_hsel_on.png', downImage: '/ufc/ufc_ap/ufc_ap_hsel_off.png', page: 'UFC_AP_HSEL'},
        13: {type: 'ufcDisplayButton', state: 0, button: 'UFC_OS3', upImage: '/ufc/ufc_ap/ufc_ap_balt_on.png', downImage: '/ufc/ufc_ap/ufc_ap_balt_off.png'},
        14: {type: 'ufcDisplayButton', state: 0, button: 'UFC_OS4', upImage: '/ufc/ufc_ap/ufc_ap_ralt_on.png', downImage: '/ufc/ufc_ap/ufc_ap_ralt_off.png'},
        //14: {type: 'twoStateButton', state: 0, button: 'UFC_OS4', upImage: '/ufc/ufc_ap/ufc_ap_ralt_off.png', downImage: '/ufc/ufc_ap/ufc_ap_ralt_on.png'},
    },
    UFC_AP_HSEL: {
        1: {type: 'page', page: 'UFC_AP', image: '/menus/button_back.png'},
        2: {type: 'button', button: 'TEXT', upImage: '/menus/menu_text_UFC.png', downImage: '/menus/menu_text_UFC.png'},
        3: {type: 'button', button: 'TEXT', upImage: '/menus/menu_text_AP.png', downImage: '/menus/menu_text_AP.png'},
        4: {type: 'button', button: 'TEXT', upImage: '/menus/menu_text_HSEL.png', downImage: '/menus/menu_text_HSEL.png'},
        8: {type: 'toggle_hdgSelect',button: 'LEFT_DDI_HDG_SW' , stateOneImage: '/ufc/ufc_ap/ufc_ap_hdg_neutral.png', stateTwoImage: '/ufc/ufc_ap/ufc_ap_hdg_right.png', page:'UFC_AP_HSEL_HDG'},
        //11: {type: 'pageWithAction',upImage: '/ufc/ufc_ap/ufc_ap_hsel_on.png', downImage: '/ufc/ufc_ap/ufc_ap_hsel_off.png', page: 'UFC_AP_HSEL'},
        //11: {type: 'buttonHSEL', button: 'UFC_OS2', upImage: '/ufc/ufc_ap/ufc_ap_hsel_on.png', downImage: '/ufc/ufc_ap/ufc_ap_hsel_off.png', page: 'UFC_AP_HSEL'},

    },
    UFC_AP_HSEL_HDG: {
        1: {type: 'page', page: 'UFC_AP_HSEL', image: '/menus/button_back.png'},
        2: {type: 'button', button: 'UFC_1', upImage: '/ufc/keyboard/ufc_one.png', downImage: '/ufc/keyboard/ufc_one_down.png'},
        3: {type: 'button', button: 'UFC_2', upImage: '/ufc/keyboard/ufc_two.png', downImage: '/ufc/keyboard/ufc_two_down.png'},
        4: {type: 'button', button: 'UFC_3', upImage: '/ufc/keyboard/ufc_three.png', downImage: '/ufc/keyboard/ufc_three_down.png'},
        5: {type: 'button', button: 'UFC_CLR', upImage: '/ufc/keyboard/ufc_clr.png', downImage: '/ufc/keyboard/ufc_clr_down.png'},

        6: {type: 'button', button: 'TEXT', upImage: '/menus/menu_text_setHDG.png', downImage: '/menus/menu_text_setHDG.png'},
        7: {type: 'button', button: 'UFC_4', upImage: '/ufc/keyboard/ufc_four.png', downImage: '/ufc/keyboard/ufc_four_down.png'},
        8: {type: 'button', button: 'UFC_5', upImage: '/ufc/keyboard/ufc_five.png', downImage: '/ufc/keyboard/ufc_five_down.png'},
        9: {type: 'button', button: 'UFC_6', upImage: '/ufc/keyboard/ufc_six.png', downImage: '/ufc/keyboard/ufc_six_down.png'},
        10: {type: 'button', button: 'UFC_0', upImage: '/ufc/keyboard/ufc_zero.png', downImage: '/ufc/keyboard/ufc_zero_down.png'},

        11: {type: 'button',button:'TEXT', upImage: '/ufc/ufc_ap/ufc_ap_hsel_off.png', downImage: '/ufc/ufc_ap/ufc_ap_hsel_off.png'},
        //11: {type: 'buttonHSEL', button: 'UFC_OS2', upImage: '/ufc/ufc_ap/ufc_ap_hsel_off.png', downImage: '/ufc/ufc_ap/ufc_ap_hsel_off.png', page: 'UFC_AP_HSEL'},
        12: {type: 'button', button: 'UFC_7', upImage: '/ufc/keyboard/ufc_seven.png', downImage: '/ufc/keyboard/ufc_seven_down.png'},
        13: {type: 'button', button: 'UFC_8', upImage: '/ufc/keyboard/ufc_eight.png', downImage: '/ufc/keyboard/ufc_eight_down.png'},
        14: {type: 'button', button: 'UFC_9', upImage: '/ufc/keyboard/ufc_nine.png', downImage: '/ufc/keyboard/ufc_nine_down.png'},
        15: {type: 'button', button: 'UFC_ENT', upImage: '/ufc/keyboard/ufc_enter.png', downImage: '/ufc/keyboard/ufc_enter_down.png'},
    },
    UFC_TCN: {
        1: {type: 'page', page: 'UFC', image: '/menus/button_back.png'},
        2: {type: 'button', button: 'TEXT', upImage: '/menus/menu_text_UFC.png', downImage: '/menus/menu_text_UFC.png'},
        3: {type: 'button', button: 'TEXT', upImage: '/menus/menu_text_TACAN.png', downImage: '/menus/menu_text_TACAN.png'},
        6: {type: 'button', button: 'UFC_ONOFF', upImage: '/ufc/ufc_on_off.png', downImage: '/ufc/ufc_on_off_down.png'},
        11: {type: 'buttonUFC_OS1',  button: 'UFC_OS1', upImage: '/ufc/ufc_tcn/ufc_tcn_tr_off.png', downImage: '/ufc/ufc_tcn/ufc_tcn_tr_on.png', page: 'UFC_TCN_TR'},
        12: {type: 'buttonUFC_OS2', button: 'UFC_OS2', upImage: '/ufc/ufc_tcn/ufc_tcn_rcv_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_rcv_off.png', page: 'UFC_TCN_RCV'},
        13: {type: 'buttonUFC_OS3', button: 'UFC_OS3', upImage: '/ufc/ufc_tcn/ufc_tcn_aa_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_aa_off.png', page: 'UFC_TCN_AA'},
        14: {type: 'buttonUFC_OS4', button: 'UFC_OS4', upImage: '/ufc/ufc_tcn/ufc_tcn_x_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_x_off.png', page: 'UFC_TCN_X'},
        15: {type: 'buttonUFC_OS5', button: 'UFC_OS5', upImage: '/ufc/ufc_tcn/ufc_tcn_y_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_y_off.png', page: 'UFC_TCN_Y'},
    },
    UFC_TCN_TR: {
        1: {type: 'page', page: 'UFC_TCN', image: '/menus/button_back.png'},
        2: {type: 'button', button: 'UFC_1', upImage: '/ufc/keyboard/ufc_one.png', downImage: '/ufc/keyboard/ufc_one_down.png'},
        3: {type: 'button', button: 'UFC_2', upImage: '/ufc/keyboard/ufc_two.png', downImage: '/ufc/keyboard/ufc_two_down.png'},
        4: {type: 'button', button: 'UFC_3', upImage: '/ufc/keyboard/ufc_three.png', downImage: '/ufc/keyboard/ufc_three_down.png'},
        5: {type: 'button', button: 'UFC_CLR', upImage: '/ufc/keyboard/ufc_clr.png', downImage: '/ufc/keyboard/ufc_clr_down.png'},
        11: {type: 'pageWithAction',upImage: '/ufc/ufc_tcn/ufc_tcn_tr_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_tr_off.png', page: 'UFC_TCN_TR'},
        7: {type: 'button', button: 'UFC_4', upImage: '/ufc/keyboard/ufc_four.png', downImage: '/ufc/keyboard/ufc_four_down.png'},
        8: {type: 'button', button: 'UFC_5', upImage: '/ufc/keyboard/ufc_five.png', downImage: '/ufc/keyboard/ufc_five_down.png'},
        9: {type: 'button', button: 'UFC_6', upImage: '/ufc/keyboard/ufc_six.png', downImage: '/ufc/keyboard/ufc_six_down.png'},
        10: {type: 'button', button: 'UFC_0', upImage: '/ufc/keyboard/ufc_zero.png', downImage: '/ufc/keyboard/ufc_zero_down.png'},
        12: {type: 'button', button: 'UFC_7', upImage: '/ufc/keyboard/ufc_seven.png', downImage: '/ufc/keyboard/ufc_seven_down.png'},
        13: {type: 'button', button: 'UFC_8', upImage: '/ufc/keyboard/ufc_eight.png', downImage: '/ufc/keyboard/ufc_eight_down.png'},
        14: {type: 'button', button: 'UFC_9', upImage: '/ufc/keyboard/ufc_nine.png', downImage: '/ufc/keyboard/ufc_nine_down.png'},
        15: {type: 'button', button: 'UFC_ENT', upImage: '/ufc/keyboard/ufc_enter.png', downImage: '/ufc/keyboard/ufc_enter_down.png'},
    },
    UFC_TCN_RCV: {
        1: {type: 'page', page: 'UFC_TCN', image: '/menus/button_back.png'},
        2: {type: 'button', button: 'UFC_1', upImage: '/ufc/keyboard/ufc_one.png', downImage: '/ufc/keyboard/ufc_one_down.png'},
        3: {type: 'button', button: 'UFC_2', upImage: '/ufc/keyboard/ufc_two.png', downImage: '/ufc/keyboard/ufc_two_down.png'},
        4: {type: 'button', button: 'UFC_3', upImage: '/ufc/keyboard/ufc_three.png', downImage: '/ufc/keyboard/ufc_three_down.png'},
        5: {type: 'button', button: 'UFC_CLR', upImage: '/ufc/keyboard/ufc_clr.png', downImage: '/ufc/keyboard/ufc_clr_down.png'},
        11: {type: 'pageWithAction', upImage: '/ufc/ufc_tcn/ufc_tcn_rcv_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_rcv_off.png', page: 'UFC_TCN_RCV'},
        7: {type: 'button', button: 'UFC_4', upImage: '/ufc/keyboard/ufc_four.png', downImage: '/ufc/keyboard/ufc_four_down.png'},
        8: {type: 'button', button: 'UFC_5', upImage: '/ufc/keyboard/ufc_five.png', downImage: '/ufc/keyboard/ufc_five_down.png'},
        9: {type: 'button', button: 'UFC_6', upImage: '/ufc/keyboard/ufc_six.png', downImage: '/ufc/keyboard/ufc_six_down.png'},
        10: {type: 'button', button: 'UFC_0', upImage: '/ufc/keyboard/ufc_zero.png', downImage: '/ufc/keyboard/ufc_zero_down.png'},
        12: {type: 'button', button: 'UFC_7', upImage: '/ufc/keyboard/ufc_seven.png', downImage: '/ufc/keyboard/ufc_seven_down.png'},
        13: {type: 'button', button: 'UFC_8', upImage: '/ufc/keyboard/ufc_eight.png', downImage: '/ufc/keyboard/ufc_eight_down.png'},
        14: {type: 'button', button: 'UFC_9', upImage: '/ufc/keyboard/ufc_nine.png', downImage: '/ufc/keyboard/ufc_nine_down.png'},
        15: {type: 'button', button: 'UFC_ENT', upImage: '/ufc/keyboard/ufc_enter.png', downImage: '/ufc/keyboard/ufc_enter_down.png'},
    },
    UFC_TCN_AA: {
        1: {type: 'page', page: 'UFC_TCN', image: '/menus/button_back.png'},
        2: {type: 'button', button: 'UFC_1', upImage: '/ufc/keyboard/ufc_one.png', downImage: '/ufc/keyboard/ufc_one_down.png'},
        3: {type: 'button', button: 'UFC_2', upImage: '/ufc/keyboard/ufc_two.png', downImage: '/ufc/keyboard/ufc_two_down.png'},
        4: {type: 'button', button: 'UFC_3', upImage: '/ufc/keyboard/ufc_three.png', downImage: '/ufc/keyboard/ufc_three_down.png'},
        5: {type: 'button', button: 'UFC_CLR', upImage: '/ufc/keyboard/ufc_clr.png', downImage: '/ufc/keyboard/ufc_clr_down.png'},
        11: {type: 'pageWithAction', upImage: '/ufc/ufc_tcn/ufc_tcn_aa_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_aa_off.png', page: 'UFC_TCN_RCV'},
        7: {type: 'button', button: 'UFC_4', upImage: '/ufc/keyboard/ufc_four.png', downImage: '/ufc/keyboard/ufc_four_down.png'},
        8: {type: 'button', button: 'UFC_5', upImage: '/ufc/keyboard/ufc_five.png', downImage: '/ufc/keyboard/ufc_five_down.png'},
        9: {type: 'button', button: 'UFC_6', upImage: '/ufc/keyboard/ufc_six.png', downImage: '/ufc/keyboard/ufc_six_down.png'},
        10: {type: 'button', button: 'UFC_0', upImage: '/ufc/keyboard/ufc_zero.png', downImage: '/ufc/keyboard/ufc_zero_down.png'},
        12: {type: 'button', button: 'UFC_7', upImage: '/ufc/keyboard/ufc_seven.png', downImage: '/ufc/keyboard/ufc_seven_down.png'},
        13: {type: 'button', button: 'UFC_8', upImage: '/ufc/keyboard/ufc_eight.png', downImage: '/ufc/keyboard/ufc_eight_down.png'},
        14: {type: 'button', button: 'UFC_9', upImage: '/ufc/keyboard/ufc_nine.png', downImage: '/ufc/keyboard/ufc_nine_down.png'},
        15: {type: 'button', button: 'UFC_ENT', upImage: '/ufc/keyboard/ufc_enter.png', downImage: '/ufc/keyboard/ufc_enter_down.png'},
    },
    UFC_TCN_X: {
        1: {type: 'page', page: 'UFC_TCN', image: '/menus/button_back.png'},
        2: {type: 'button', button: 'UFC_1', upImage: '/ufc/keyboard/ufc_one.png', downImage: '/ufc/keyboard/ufc_one_down.png'},
        3: {type: 'button', button: 'UFC_2', upImage: '/ufc/keyboard/ufc_two.png', downImage: '/ufc/keyboard/ufc_two_down.png'},
        4: {type: 'button', button: 'UFC_3', upImage: '/ufc/keyboard/ufc_three.png', downImage: '/ufc/keyboard/ufc_three_down.png'},
        5: {type: 'button', button: 'UFC_CLR', upImage: '/ufc/keyboard/ufc_clr.png', downImage: '/ufc/keyboard/ufc_clr_down.png'},
        11: {type: 'pageWithAction', upImage: '/ufc/ufc_tcn/ufc_tcn_x_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_x_off.png', page: 'UFC_TCN_TR'},
        7: {type: 'button', button: 'UFC_4', upImage: '/ufc/keyboard/ufc_four.png', downImage: '/ufc/keyboard/ufc_four_down.png'},
        8: {type: 'button', button: 'UFC_5', upImage: '/ufc/keyboard/ufc_five.png', downImage: '/ufc/keyboard/ufc_five_down.png'},
        9: {type: 'button', button: 'UFC_6', upImage: '/ufc/keyboard/ufc_six.png', downImage: '/ufc/keyboard/ufc_six_down.png'},
        10: {type: 'button', button: 'UFC_0', upImage: '/ufc/keyboard/ufc_zero.png', downImage: '/ufc/keyboard/ufc_zero_down.png'},
        12: {type: 'button', button: 'UFC_7', upImage: '/ufc/keyboard/ufc_seven.png', downImage: '/ufc/keyboard/ufc_seven_down.png'},
        13: {type: 'button', button: 'UFC_8', upImage: '/ufc/keyboard/ufc_eight.png', downImage: '/ufc/keyboard/ufc_eight_down.png'},
        14: {type: 'button', button: 'UFC_9', upImage: '/ufc/keyboard/ufc_nine.png', downImage: '/ufc/keyboard/ufc_nine_down.png'},
        15: {type: 'button', button: 'UFC_ENT', upImage: '/ufc/keyboard/ufc_enter.png', downImage: '/ufc/keyboard/ufc_enter_down.png'},
    },
    UFC_TCN_Y: {
        1: {type: 'page', page: 'UFC_TCN', image: '/menus/button_back.png'},

        2: {type: 'button', button: 'UFC_1', upImage: '/ufc/keyboard/ufc_one.png', downImage: '/ufc/keyboard/ufc_one_down.png'},
        3: {type: 'button', button: 'UFC_2', upImage: '/ufc/keyboard/ufc_two.png', downImage: '/ufc/keyboard/ufc_two_down.png'},
        4: {type: 'button', button: 'UFC_3', upImage: '/ufc/keyboard/ufc_three.png', downImage: '/ufc/keyboard/ufc_three_down.png'},
        5: {type: 'button', button: 'UFC_CLR', upImage: '/ufc/keyboard/ufc_clr.png', downImage: '/ufc/keyboard/ufc_clr_down.png'},
        11: {type: 'pageWithAction', upImage: '/ufc/ufc_tcn/ufc_tcn_y_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_y_off.png', page: 'UFC_TCN_TR'},
        7: {type: 'button', button: 'UFC_4', upImage: '/ufc/keyboard/ufc_four.png', downImage: '/ufc/keyboard/ufc_four_down.png'},
        8: {type: 'button', button: 'UFC_5', upImage: '/ufc/keyboard/ufc_five.png', downImage: '/ufc/keyboard/ufc_five_down.png'},
        9: {type: 'button', button: 'UFC_6', upImage: '/ufc/keyboard/ufc_six.png', downImage: '/ufc/keyboard/ufc_six_down.png'},
        10: {type: 'button', button: 'UFC_0', upImage: '/ufc/keyboard/ufc_zero.png', downImage: '/ufc/keyboard/ufc_zero_down.png'},
        12: {type: 'button', button: 'UFC_7', upImage: '/ufc/keyboard/ufc_seven.png', downImage: '/ufc/keyboard/ufc_seven_down.png'},
        13: {type: 'button', button: 'UFC_8', upImage: '/ufc/keyboard/ufc_eight.png', downImage: '/ufc/keyboard/ufc_eight_down.png'},
        14: {type: 'button', button: 'UFC_9', upImage: '/ufc/keyboard/ufc_nine.png', downImage: '/ufc/keyboard/ufc_nine_down.png'},
        15: {type: 'button', button: 'UFC_ENT', upImage: '/ufc/keyboard/ufc_enter.png', downImage: '/ufc/keyboard/ufc_enter_down.png'},
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
            key.state = 0;
            initializeKey(key);
        }
    });
}

function initializeKey(key) {
    switch (key.type) {

        case 'image':
            createStaticImage(key);
            break;
        case 'ufcDisplayButton':
            createUFCDisplayButton(key);
            break;
        case 'twoStateButton':
            createTwoStateButton(key);
            break;
        case 'static':
            createStaticImage(key);
            break;
        case 'toggle_switch3way':
            createToggleSwitch3Way(key);
            break;
        case 'toggle_switch2way':
            createToggleSwitch2Way(key);
            break;
        case 'toggle_hdgSelect':
            createHSELToggle(key);
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
        case 'buttonUFC_OS1':
            createMomentaryPageButtonUFC_OS1(key);
            break;
        case 'buttonUFC_OS2':
            createMomentaryPageButtonUFC_OS2(key);
            break;
        case 'buttonUFC_OS3':
            createMomentaryPageButtonUFC_OS3(key);
            break;
        case 'buttonUFC_OS4':
            createMomentaryPageButtonUFC_OS4(key);
            break;
        case 'buttonUFC_OS5':
            createMomentaryPageButtonUFC_OS5(key);
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



function addKeyListener(key) {
    switch (key.type) {
        case 'ufcDisplayButton':
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
            break;
        case 'ledButton':
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
            break;
        case 'toggle_switch2way':
            var stateOneImagePath = path.resolve(IMAGE_FOLDER + key.stateOneImage);
            var stateTwoImagePath = path.resolve(IMAGE_FOLDER + key.stateTwoImage);
            draw(key);
            streamDeck.on(`down:${key.number}`, () => {
                api.sendMessage(`${key.button} 2\n`);
                key.currentImage = stateTwoImagePath;
                draw(key);
            });

            streamDeck.on(`up:${key.number}`, () => {
                api.sendMessage(`${key.button} 1\n`);
                key.currentImage = stateOneImagePath;
                displayPage(key.page);
                //draw(key);
            });
            break;
        case 'toggle_hdgSelect':
            var stateOneImagePath = path.resolve(IMAGE_FOLDER + key.stateOneImage);
            var stateTwoImagePath = path.resolve(IMAGE_FOLDER + key.stateTwoImage);
            //draw(key);
            streamDeck.on(`down:${key.number}`, () => {
                api.sendMessage(`${key.button} 2\n`);
                key.currentImage = stateTwoImagePath;
                draw(key);
            });

            streamDeck.on(`up:${key.number}`, () => {
                api.sendMessage(`${key.button} 1\n`);
                key.currentImage = stateOneImagePath;
                draw(key);
                displayPage(key.page);
            });
            break;
        case 'toggle_switch3way':
            var stateOneImagePath = path.resolve(IMAGE_FOLDER + key.stateOneImage);
            var stateTwoImagePath = path.resolve(IMAGE_FOLDER + key.stateTwoImage);
            logger.info('in toggle_switch3way');
            streamDeck.on(`down:${key.number}`, () => {
                logger.info('sending 3way DOWN signal');
                api.sendMessage(`${key.button} 1\n`);
                key.currentImage = stateTwoImagePath;
                draw(key);
            });

            streamDeck.on(`up:${key.number}`, () => {
                api.sendMessage(`${key.button} 0\n`);
                logger.info('sending 3way UP  signal');
                key.currentImage = stateOneImagePath;
                draw(key);
            });
            break;
        case 'button':
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
            break;
        case 'pageWithAction':
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
            break;
        case 'buttonUFC_OS1':
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
            break;
        case 'buttonUFC_OS2':
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
            break;
        case 'buttonUFC_OS3':
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
            break;
        case 'buttonUFC_OS4':
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
            break;
        case 'buttonUFC_OS5':
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
            break;
        case 'page':
            streamDeck.on(`down:${key.number}`, () => {
                displayPage(key.page);
            });
            break;
        case 'image':
            var imagePath = path.resolve(IMAGE_FOLDER + key.image);
            key.currentImage = imagePath;
            draw(key);
            // displayPage(key.page);
            break;
        case 'twoStateButton':
            var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
            var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);
            key.currentImage = upImagePath;
            draw(key);
            streamDeck.on(`down:${key.number}`, () => {
                if (key.state == 1) {
                    logger.info('stateButton Trigger state = 1');
                    key.state = 0;
                    api.sendMessage(`${key.button} 0\n`);
                    key.currentImage = upImagePath;
                    draw(key);
                } else {
                    logger.info('stateButton Trigger state = 0');
                    key.state = 1;
                    api.sendMessage(`${key.button} 1\n`);
                    key.currentImage = downImagePath;
                    draw(key);
                }
            });
            streamDeck.on(`up:${key.number}`, () => {
                api.sendMessage(`${key.button} 0\n`);
                logger.info('ASCTION');
            });
            break;
    }
}

function createStaticImage(key) {
    var imagePath = path.resolve(IMAGE_FOLDER, key.image);
    key.currentImage = imagePath;
    draw(key);
    //addKeyListener(key);
}


function createHSELToggle(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.stateOneImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.stateTwoImage);
    key.currentImage = upImagePath;
    // Draw the key immediately so that we can see it.
    draw(key);
    addKeyListener(key);
}

function createToggleSwitch2Way(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.stateOneImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.stateTwoImage);
    key.currentImage = upImagePath;
    // Draw the key immediately so that we can see it.
    draw(key);
    addKeyListener(key);
}

function createTwoStateButton(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.stateOneImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.stateTwoImage);
    // Draw the key immediately so that we can see it.
    draw(key);
    addKeyListener(key);
}

function createToggleSwitch3Way(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.stateOneImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.stateTwoImage);

    // Draw the key immediately so that we can see it.
    draw(key);

    addKeyListener(key);
    logger.info('added 3wayswitch:', key);
    // Draw the new image when the LED state changes.

    api.on('LEFT_DDI_HDG_SW', (value) => {
        // right click
        if(value == 2){
            logger.info('GOT VALUE 2', value);
        }
        if(value == 1){
            logger.info('GOT VALUE 1', value);
        }
        logger.info('LEFT_DDI_HDG_SW', value);
        //drawImageFile(value, 'btnNAV-on.png');
    });
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
        key.currentImage = value ? downImagePath : upImagePath;
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


function createUFCDisplayButton(key){
    var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);
    key.currentImage = upImagePath;
    draw(key);
    addKeyListener(key);

    api.on('UFC_OPTION_CUEING_1', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');

        if(value === ':'& key.button == 'UFC_OS1'){
            logger.info('UFC_OPTION_CUEING_1 for key: ' + key.button + ' with value-> ' + value);
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
            logger.info('UFC_OPTION_CUEING_1 for key ELSE: ' + key.button + ' with value-> '+ value);
        }
        draw(key);
    });
    api.on('UFC_OPTION_CUEING_2', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        if(value === ':' & key.button == 'UFC_OS2'){
            logger.info('UFC_OPTION_CUEING_2 for key: ' + key.button + ' with value-> ' + value);
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
            logger.info('UFC_OPTION_CUEING_2 for key ELSE: ' + key.button + ' with value-> '+ value);
        }
        draw(key);
    });
    api.on('UFC_OPTION_CUEING_3', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        if(value === ':' & key.button == 'UFC_OS3'){
            logger.info('UFC_OPTION_CUEING_3 for key: ' + key.button + ' with value-> ' + value);
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
            logger.info('UFC_OPTION_CUEING_3 for key ELSE: ' + key.button + ' with value-> '+ value);
        }
        draw(key);
    });
    api.on('UFC_OPTION_CUEING_4', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        if(value === ':'& key.button == 'UFC_OS4'){
          logger.info('UFC_OPTION_CUEING_4 for key: ' + key.button + ' with value-> '+ value);
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
        logger.info('UFC_OPTION_CUEING_4 for key ELSE: ' + key.button + ' with value-> '+ value);
        }
        draw(key);
    });
    api.on('UFC_OPTION_CUEING_5', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        if(value === ':'& key.button == 'UFC_OS5'){
           logger.info('UFC_OPTION_CUEING_5 for key: ' + key.button + ' with value-> '+ value);
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
         logger.info('UFC_OPTION_CUEING_5 for key ELSE: ' + key.button + ' with value-> '+ value);
        }
        draw(key);
    });
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

/**
 * Create a momentary button that will switch images when it is pressed and released.
 */
function createMomentaryButtonUFC_OS1(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);
    key.currentImage = upImagePath;
    draw(key);
    addKeyListener(key);

    api.on('UFC_OPTION_CUEING_1', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        if(value === ':' & key.button == 'UFC_OS2'){
            logger.info('UFC_OPTION_CUEING_1 for key: ' + key.button + ' with value-> ' + value);
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
            logger.info('UFC_OPTION_CUEING_1 for key ELSE: ' + key.button + ' with value-> '+ value);
        }
        logger.info('IMAGE ON: ' + key.currentImage);
        draw(key);
    });
}
function createMomentaryButtonUFC_OS2(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);
    key.currentImage = upImagePath;
    draw(key);
    addKeyListener(key);

    api.on('UFC_OPTION_CUEING_2', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        if(value === ':' & key.button == 'UFC_OS2'){
            logger.info('UFC_OPTION_CUEING_2 for key: ' + key.button + ' with value-> ' + value);
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
            logger.info('UFC_OPTION_CUEING_2 for key ELSE: ' + key.button + ' with value-> '+ value);
        }
        logger.info('IMAGE ON: ' + key.currentImage);
        draw(key);
    });
}
function createMomentaryButtonUFC_OS3(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);
    key.currentImage = upImagePath;
    draw(key);
    addKeyListener(key);

    api.on('UFC_OPTION_CUEING_3', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        if(value === ':' & key.button == 'UFC_OS3'){
            logger.info('UFC_OPTION_CUEING_3 for key: ' + key.button + ' with value-> ' + value);
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
            logger.info('UFC_OPTION_CUEING_3 for key ELSE: ' + key.button + ' with value-> '+ value);
        }
        logger.info('IMAGE ON: ' + key.currentImage);
        draw(key);
    });
}
function createMomentaryButtonUFC_OS4(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);
    key.currentImage = upImagePath;
    draw(key);
    addKeyListener(key);

    api.on('UFC_OPTION_CUEING_4', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        if(value === ':' & key.button == 'UFC_OS4'){
            logger.info('UFC_OPTION_CUEING_4 for key: ' + key.button + ' with value-> ' + value);
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
            logger.info('UFC_OPTION_CUEING_2 for key ELSE: ' + key.button + ' with value-> '+ value);
        }
        logger.info('IMAGE ON: ' + key.currentImage);
        draw(key);
    });
}
function createMomentaryButtonUFC_OS5(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);
    key.currentImage = upImagePath;
    draw(key);
    addKeyListener(key);

    api.on('UFC_OPTION_CUEING_5', (value) => {
        //drawImageFile(value, 'btnWPT-on.png');
        if(value === ':' & key.button == 'UFC_OS5'){
            logger.info('UFC_OPTION_CUEING_5 for key: ' + key.button + ' with value-> ' + value);
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
            logger.info('UFC_OPTION_CUEING_5 for key ELSE: ' + key.button + ' with value-> '+ value);
        }
        logger.info('IMAGE ON: ' + key.currentImage);
        draw(key);
    });
}
/**
 *
 * @param key
 */
function createMomentaryPageButton(key) {
    createMomentaryButton(key);
    streamDeck.on(`up:${key.button}`, () => {
        displayPage(pages[key.page]);
    });
}

/**
 *
 * @param key
 */
function createMomentaryPageButtonUFC_OS1(key) {
    createMomentaryButtonUFC_OS1(key);
    streamDeck.on(`up:${key.button}`, () => {
        displayPage(pages[key.page]);
    });
}
function createMomentaryPageButtonUFC_OS2(key) {
    createMomentaryButtonUFC_OS2(key);
    streamDeck.on(`up:${key.button}`, () => {
        displayPage(pages[key.page]);
    });
}
function createMomentaryPageButtonUFC_OS3(key) {
    createMomentaryButtonUFC_OS3(key);
    streamDeck.on(`up:${key.button}`, () => {
        displayPage(pages[key.page]);
    });
}
function createMomentaryPageButtonUFC_OS4(key) {
    createMomentaryButtonUFC_OS4(key);
    streamDeck.on(`up:${key.button}`, () => {
        displayPage(pages[key.page]);
    });
}
function createMomentaryPageButtonUFC_OS5(key) {
    createMomentaryButtonUFC_OS5(key);
    streamDeck.on(`up:${key.button}`, () => {
        displayPage(pages[key.page]);
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

/**
 *
 * @param pageName
 */
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

/**
 *
 * @param key
 */
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