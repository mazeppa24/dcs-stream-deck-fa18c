/**
 * DCS STREAM DECK APPLICATION
 * ***************************
 *
 *
 * Supported Aircraft:
 * - FA-18C_Hornet
 *
 *
 * Usage:
 *
 */
const streamDeckApi = require('stream-deck-api');
const DcsBiosApi = require('dcs-bios-api');
const path = require('path');
const robot = require('robotjs');
const Logger = require('logplease');
const logger = Logger.create('dcs-stream-deck-fa18');


const IMAGE_FOLDER = './images/';
const api = new DcsBiosApi({logLevel: 'INFO'});
const streamDeck = streamDeckApi.getStreamDeck();

const UFC_DISP_ENABLED = ":";
const UFC_OS1 = 'UFC_OS1';
const UFC_OS2 = 'UFC_OS2';
const UFC_OS3 = 'UFC_OS3';
const UFC_OS4 = 'UFC_OS4';
const UFC_OS5 = 'UFC_OS5';

const UFC_OPTION_CUEING_1 = 'UFC_OPTION_CUEING_1';
const UFC_OPTION_CUEING_2 = 'UFC_OPTION_CUEING_2';
const UFC_OPTION_CUEING_3 = 'UFC_OPTION_CUEING_3';
const UFC_OPTION_CUEING_4 = 'UFC_OPTION_CUEING_4';
const UFC_OPTION_CUEING_5 = 'UFC_OPTION_CUEING_5';

let currentPage;

api.startListening();
process.on('SIGINT', () => {
    streamDeck.reset();
    api.stopListening();
    process.exit();
});
streamDeck.reset();


/**
 * Page definitions
 */
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
        1:  {type: 'page', page: 'MAIN', image: '/menus/button_back.png'},
        2: {type: 'page', page: 'UFC', image: '/menus/menu_text_UFC.png'},
        3: {type: 'page', page: 'UFC', image: '/menus/menu_text_IFEI.png'},
        4: {type: 'page', page: 'JETT_SELECT', image: '/menus/menu_jett_select.png'},

    },
    JETT_SELECT:{
        1: {type: 'page', page:'FA_18C',image: '/menus/button_back.png'},
        3: {type: 'twoStateButton', state: 0, button: 'SJ_CTR', stateOneImage: '/jett_select/jett_select_ctr_off.png', stateTwoImage: '/jett_select/jett_select_ctr_on.png'},
        7: {type: 'twoStateButton', state: 0, button: 'SJ_LI', stateOneImage: '/jett_select/jett_select_li_off.png', stateTwoImage: '/jett_select/jett_select_li_on.png'},
        8: {type: 'button', button: 'SEL_JETT_BTN', upImage: '/jett_select/jett_select_main_off.png', downImage: '/jett_select/jett_select_main_on.png'},
        9: {type: 'twoStateButton', state: 0, button: 'SJ_RI', stateOneImage: '/jett_select/jett_select_ri_off.png', stateTwoImage: '/jett_select/jett_select_ri_on.png'},
        12:{type: 'twoStateButton', state: 0, button: 'SJ_LO', stateOneImage: '/jett_select/jett_select_lo_off.png', stateTwoImage: '/jett_select/jett_select_lo_on.png'},
        14: {type: 'twoStateButton', state: 0, button: 'SJ_RO', stateOneImage: '/jett_select/jett_select_ro_off.png', stateTwoImage: '/jett_select/jett_select_ro_on.png'},

        /*
                3: {type: 'twoStateButton', state: 0, button: 'SJ_CTR', stateOneImage: '/jett_select/jett_select_ctr_off.png', stateTwoImage: '/jett_select/jett_select_ctr_on.png'},
        7: {type: 'twoStateButton', state: 0, button: 'SJ_LI', stateOneImage: '/jett_select/jett_select_li_off.png', stateTwoImage: '/jett_select/jett_select_li_on.png'},
        8: {type: 'button', button: 'SEL_JETT_BTN', upImage: '/jett_select/jett_select_main_off.png', stateTwoImage: '/jett_select/jett_select_main_on.png'},
        9: {type: 'twoStateButton', state: 0, button: 'SJ_RI', stateOneImage: '/jett_select/jett_select_ri_off.png', stateTwoImage: '/jett_select/jett_select_ri_on.png'},
        12:{type: 'twoStateButton', state: 0, button: 'SJ_LO', stateOneImage: '/jett_select/jett_select_lo_off.png', stateTwoImage: '/jett_select/jett_select_lo_on.png'},
        14: {type: 'twoStateButton', state: 0, button: 'SJ_RO', stateOneImage: '/jett_select/jett_select_ro_off.png', stateTwoImage: '/jett_select/jett_select_ro_on.png'},
         */
    },
    GROUND: {
        1: {type: 'page', page: 'MAIN', image: 'button_back.png'},
        3: {type: 'button', button: 'UFC_AP', upImage: 'ldg_taxi_light_off.png', downImage: 'ldg_taxi_light_on.png'},
    },
    UFC: {
        1:  {type: 'page', page: 'MAIN', image: '/menus/button_back.png'},
        2:  {type: 'image', image: '/menus/menu_text_UFC.png'},
        6:  {type: 'buttonGotoPage', button: 'UFC_AP', upImage: '/ufc/ufc_ap.png', downImage: '/ufc/ufc_ap_down.png', page: 'UFC_AP'},
        7:  {type: 'button', button: 'UFC_IFF', upImage: '/ufc/ufc_iff.png', downImage: '/ufc/ufc_iff_down.png'},

        11:  {type: 'buttonGotoPage', button: 'UFC_TCN', upImage: '/ufc/ufc_tcn.png', downImage: '/ufc/ufc_tcn_down.png', page: 'UFC_TCN'},
        12: {type: 'button', button: 'UFC_ILS', upImage: '/ufc/ufc_ils.png', downImage: '/ufc/ufc_ils_down.png'},
        13: {type: 'button', button: 'UFC_DL', upImage: '/ufc/ufc_dl.png', downImage: '/ufc/ufc_dl_down.png'},
        14: {type: 'button', button: 'UFC_BCN', upImage: '/ufc/ufc_bcn.png', downImage: '/ufc/ufc_bcn_down.png'},
        15: {type: 'button', button: 'UFC_ONOFF', upImage: '/ufc/ufc_on_off.png', downImage: '/ufc/ufc_on_off_down.png'},
    },
    UFC_AP: {
        1:  {type: 'page', page: 'UFC', image: '/menus/button_back.png'},
        2:  {type: 'image', image: '/menus/menu_text_UFC.png'},
        3:  {type: 'image', image: '/menus/menu_text_AP.png'},
        11: {type: 'buttonUFCDisplay', button: 'UFC_OS1' ,upImage: '/ufc/ufc_ap/ufc_ap_atth_on.png', downImage: '/ufc/ufc_ap/ufc_ap_atth_off.png'},
        12: {type: 'buttonUFCDisplayGotoPage',button: 'UFC_OS2', eventKey:'UFC_OPTION_CUEING_2', upImage: '/ufc/ufc_ap/ufc_ap_hsel_on.png', downImage: '/ufc/ufc_ap/ufc_ap_hsel_off.png', page: 'UFC_AP_HSEL'},
        13: {type: 'buttonUFCDisplay', button: 'UFC_OS3', upImage: '/ufc/ufc_ap/ufc_ap_balt_on.png', downImage: '/ufc/ufc_ap/ufc_ap_balt_off.png'},
        14: {type: 'buttonUFCDisplay', button: 'UFC_OS4', upImage: '/ufc/ufc_ap/ufc_ap_ralt_on.png', downImage: '/ufc/ufc_ap/ufc_ap_ralt_off.png'},
        //14: {type: 'twoStateButton', state: 0, button: 'UFC_OS4', upImage: '/ufc/ufc_ap/ufc_ap_ralt_off.png', downImage: '/ufc/ufc_ap/ufc_ap_ralt_on.png'},
    },
    UFC_AP_HSEL: {
        1: {type: 'page', page: 'UFC_AP', image: '/menus/button_back.png'},
        2: {type: 'image', image: '/menus/menu_text_UFC.png'},
        3: {type: 'image', image: '/menus/menu_text_AP.png'},
        4: {type: 'image', image: '/menus/menu_text_HSEL.png'},

        //8: {type: 'buttonGotoPageWithTimeout', button: 'KEYBOARD', upImage: '/ufc/keyboard/keyboard_full.png', downImage: '/ufc/keyboard/keyboard_full.png', page: 'UFC_AP_HSEL_HDG', hidden: true, prevPage: 'UFC_AP_HSEL', timeout: 10000},

        12: {type: 'buttonLeft', button: 'LEFT_DDI_HDG_SW', image: '/menus/menu_left.png'},
        13: {type: 'rocker_switch', button: 'LEFT_DDI_HDG_SW' , stateOneImage: '/ufc/ufc_ap/ufc_ap_hdg_neutral.png', stateTwoImage: '/ufc/ufc_ap/ufc_ap_hdg_left.png', stateThreeImage: '/ufc/ufc_ap/ufc_ap_hdg_right.png'},
        14: {type: 'buttonRight', button: 'LEFT_DDI_HDG_SW', image: '/menus/menu_right.png'},
    },
    UFC_AP_HSEL_KEYB: {
        1: {type: 'page', page: 'UFC_AP', image: '/menus/button_back.png'},
        2: {type: 'image', image: '/menus/menu_text_UFC.png'},
        3: {type: 'image', image: '/menus/menu_text_AP.png'},
        4: {type: 'image', image: '/menus/menu_text_HSEL.png'},

        8: {type: 'buttonGotoPageWithTimeout', button: 'KEYBOARD', upImage: '/ufc/keyboard/keyboard_full.png', downImage: '/ufc/keyboard/keyboard_full.png', page: 'UFC_AP_HSEL_HDG', prevPage: 'UFC_AP_HSEL', timeout: 10000},

        12: {type: 'buttonLeft', button: 'LEFT_DDI_HDG_SW', image: '/menus/menu_left.png'},
        13: {type: 'rocker_switch', button: 'LEFT_DDI_HDG_SW' , stateOneImage: '/ufc/ufc_ap/ufc_ap_hdg_neutral.png', stateTwoImage: '/ufc/ufc_ap/ufc_ap_hdg_left.png', stateThreeImage: '/ufc/ufc_ap/ufc_ap_hdg_right.png'},
        14: {type: 'buttonRight', button: 'LEFT_DDI_HDG_SW', image: '/menus/menu_right.png'},
    },
    UFC_AP_HSEL_HDG: {
        1: {type: 'page', page: 'UFC_AP_HSEL', image: '/menus/button_back.png'},
        2: {type: 'button', button: 'UFC_1', upImage: '/ufc/keyboard/ufc_one.png', downImage: '/ufc/keyboard/ufc_one_down.png'},
        3: {type: 'button', button: 'UFC_2', upImage: '/ufc/keyboard/ufc_two.png', downImage: '/ufc/keyboard/ufc_two_down.png'},
        4: {type: 'button', button: 'UFC_3', upImage: '/ufc/keyboard/ufc_three.png', downImage: '/ufc/keyboard/ufc_three_down.png'},
        5: {type: 'button', button: 'UFC_CLR', upImage: '/ufc/keyboard/ufc_clr.png', downImage: '/ufc/keyboard/ufc_clr_down.png'},

        6: {type: 'image', image: '/menus/menu_text_setHDG.png'},
        7: {type: 'button', button: 'UFC_4', upImage: '/ufc/keyboard/ufc_four.png', downImage: '/ufc/keyboard/ufc_four_down.png'},
        8: {type: 'button', button: 'UFC_5', upImage: '/ufc/keyboard/ufc_five.png', downImage: '/ufc/keyboard/ufc_five_down.png'},
        9: {type: 'button', button: 'UFC_6', upImage: '/ufc/keyboard/ufc_six.png', downImage: '/ufc/keyboard/ufc_six_down.png'},
        10: {type: 'button', button: 'UFC_0', upImage: '/ufc/keyboard/ufc_zero.png', downImage: '/ufc/keyboard/ufc_zero_down.png'},

        11: {type: 'image',image: '/ufc/ufc_ap/ufc_ap_hsel_off.png'},
        //11: {type: 'buttonHSEL', button: 'UFC_OS2', upImage: '/ufc/ufc_ap/ufc_ap_hsel_off.png', downImage: '/ufc/ufc_ap/ufc_ap_hsel_off.png', page: 'UFC_AP_HSEL'},
        12: {type: 'button', button: 'UFC_7', upImage: '/ufc/keyboard/ufc_seven.png', downImage: '/ufc/keyboard/ufc_seven_down.png'},
        13: {type: 'button', button: 'UFC_8', upImage: '/ufc/keyboard/ufc_eight.png', downImage: '/ufc/keyboard/ufc_eight_down.png'},
        14: {type: 'button', button: 'UFC_9', upImage: '/ufc/keyboard/ufc_nine.png', downImage: '/ufc/keyboard/ufc_nine_down.png'},
        15: {type: 'button', button: 'UFC_ENT', upImage: '/ufc/keyboard/ufc_enter.png', downImage: '/ufc/keyboard/ufc_enter_down.png'},
    },
    UFC_TCN: {
        1: {type: 'page', page: 'UFC', image: '/menus/button_back.png'},
        2: {type: 'image', image: '/menus/menu_text_UFC.png'},
        3: {type: 'image', image: '/menus/menu_text_TACAN.png'},
        6: {type: 'button', button: 'UFC_ONOFF', upImage: '/ufc/ufc_on_off.png', downImage: '/ufc/ufc_on_off_down.png'},
        11: {type: 'buttonGoToPageOnUpWithTimeoutUFC',  button: 'UFC_OS1', eventKey:'UFC_OPTION_CUEING_1', upImage: '/ufc/ufc_tcn/ufc_tcn_tr_off.png', downImage: '/ufc/ufc_tcn/ufc_tcn_tr_on.png', page: 'UFC_TCN_TR', prevPage: 'UFC_TCN', timeout:5000},
        12: {type: 'buttonGoToPageOnUpWithTimeoutUFC', button: 'UFC_OS2', eventKey:'UFC_OPTION_CUEING_2',upImage: '/ufc/ufc_tcn/ufc_tcn_rcv_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_rcv_off.png', page: 'UFC_TCN_RCV', prevPage: 'UFC_TCN', timeout:5000},
        13: {type: 'buttonGoToPageOnUpWithTimeoutUFC', button: 'UFC_OS3', eventKey:'UFC_OPTION_CUEING_3',upImage: '/ufc/ufc_tcn/ufc_tcn_aa_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_aa_off.png', page: 'UFC_TCN_AA', prevPage: 'UFC_TCN', timeout:5000},
        14: {type: 'buttonGoToPageOnUpWithTimeoutUFC', button: 'UFC_OS4', eventKey:'UFC_OPTION_CUEING_4',upImage: '/ufc/ufc_tcn/ufc_tcn_x_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_x_off.png', page: 'UFC_TCN_X', prevPage: 'UFC_TCN', timeout:5000},
        15: {type: 'buttonGoToPageOnUpWithTimeoutUFC', button: 'UFC_OS5', eventKey:'UFC_OPTION_CUEING_5',upImage: '/ufc/ufc_tcn/ufc_tcn_y_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_y_off.png', page: 'UFC_TCN_Y', prevPage: 'UFC_TCN', timeout:5000},
    },
    UFC_TCN_TR: {
        1: {type: 'page', page: 'UFC_TCN', image: '/menus/button_back.png'},
        2: {type: 'button', button: 'UFC_1', upImage: '/ufc/keyboard/ufc_one.png', downImage: '/ufc/keyboard/ufc_one_down.png'},
        3: {type: 'button', button: 'UFC_2', upImage: '/ufc/keyboard/ufc_two.png', downImage: '/ufc/keyboard/ufc_two_down.png'},
        4: {type: 'button', button: 'UFC_3', upImage: '/ufc/keyboard/ufc_three.png', downImage: '/ufc/keyboard/ufc_three_down.png'},
        5: {type: 'button', button: 'UFC_CLR', upImage: '/ufc/keyboard/ufc_clr.png', downImage: '/ufc/keyboard/ufc_clr_down.png'},
        11: {type: 'buttonGotoPage',upImage: '/ufc/ufc_tcn/ufc_tcn_tr_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_tr_off.png', page: 'UFC_TCN_TR'},
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
        11: {type: 'buttonGotoPage', upImage: '/ufc/ufc_tcn/ufc_tcn_rcv_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_rcv_off.png', page: 'UFC_TCN_RCV'},
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
        11: {type: 'buttonGotoPage', upImage: '/ufc/ufc_tcn/ufc_tcn_aa_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_aa_off.png', page: 'UFC_TCN_RCV'},
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
        11: {type: 'buttonGotoPage', upImage: '/ufc/ufc_tcn/ufc_tcn_x_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_x_off.png', page: 'UFC_TCN_TR'},
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
        11: {type: 'buttonGotoPage', upImage: '/ufc/ufc_tcn/ufc_tcn_y_on.png', downImage: '/ufc/ufc_tcn/ufc_tcn_y_off.png', page: 'UFC_TCN_TR'},
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
        //2: { type: 'buttonGotoPage', button: 'PVI_WAYPOINTS_BTN', page: 'PVI', upImage: 'btnWPT-off.png', downImage: 'btnWPT-on.png' },
        //7: { type: 'buttonGotoPage', button: 'PVI_AIRFIELDS_BTN', page: 'PVI', upImage: 'btnAIR-off.png', downImage: 'btnAIR-on.png' },
        //11: { type: 'buttonGotoPage', button: 'PVI_FIXPOINTS_BTN', page: 'PVI', upImage: 'btnFIX-off.png', downImage: 'btnFIX-on.png' },
        //12: { type: 'buttonGotoPage', button: 'PVI_TARGETS_BTN', page: 'PVI', upImage: 'btnNAV-off.png', downImage: 'btnNAV-on.png' }
    },
    RADIO: {}
};


initializePages(pages);
displayPage('MAIN');


/**
 * Initialize all pages
 * @param pages
 */
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

/**
 * Initialize a key for given type
 * @param key
 */
function initializeKey(key) {
    switch (key.type) {
        case 'image':
            createStaticImage(key);
            break;
        case 'buttonUFCDisplay':
            createUFCDisplayButton(key);
            break;
        case 'twoStateButton':
            createTwoStateButton(key);
            break;
        case 'rocker_switch':
            createRockerSwitchDisplay(key);
            break;
        case 'toggle_switch':
            //createTwoStateButton(key);
            break;
        case 'limited_rotary':
            //createTwoStateButton(key);
            break;
        case 'toggle_switch2way':
            createToggleSwitch2Way(key);
            break;
        case 'ledButton':
            createToggleLedButton(key);
            break;
        case 'button':
            createButtonSwitchImage(key);
            break;
        case 'buttonLeft':
            createButtonOneImage(key);
            break;
        case 'buttonRight':
            createButtonOneImage(key);
            break;
        case 'page':
            createButtonGotoPage(key);
            break;
        case 'buttonGotoPage':
            createButtonGotoPageOnUp(key);
            break;
        case 'buttonGotoPageWithTimeout':
            createButtonGotoPageWithTimeout(key);
            break;
        case 'buttonUFCDisplayGotoPage':
            createButtonGoToPageOnUpUFC(key);
            break;
        case 'buttonGoToPageOnUpWithTimeoutUFC':
            createButtonGoToPageOnUpWithTimeoutUFC(key);
            break;
        case 'textDisplay':
            createTextDisplay(key);
            break;
        case 'custom':
            key.fn();
            break;
    }
}

/**
 * Add key listeners for given button type
 * @param key
 */
function addKeyListener(key) {
    switch (key.type) {
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
        case 'buttonLeft':
            streamDeck.on(`down:${key.number}`, () => {
                api.sendMessage(`${key.button} 0\n`);
            });
            streamDeck.on(`up:${key.number}`, () => {
                api.sendMessage(`${key.button} 1\n`);
            });
            break;
        case 'buttonRight':
            streamDeck.on(`down:${key.number}`, () => {
                api.sendMessage(`${key.button} 2\n`);
            });
            streamDeck.on(`up:${key.number}`, () => {
                api.sendMessage(`${key.button} 1\n`);
            });
            break;
        case 'buttonGotoPage':
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
        case 'buttonUFCDisplay':
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
        case 'buttonUFCDisplayGotoPage':
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
        case 'buttonGotoPageWithTimeout':
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
                displayPage(key.page, key.prevPage, key.timeout);
            });
            break;
        case 'buttonGoToPageOnUpWithTimeoutUFC':
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
                displayPage(key.page, key.prevPage, key.timeout);
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
                displayPage(key.page, key.prevPage, key.timeout);
                //draw(key);
            });
            break;
        case 'toggle_hdgSelect':
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
            break;
        case 'twoStateButton':
            var stateOneImage = path.resolve(IMAGE_FOLDER + key.stateOneImage);
            var stateTwoImage = path.resolve(IMAGE_FOLDER + key.stateTwoImage);
            key.currentImage = stateOneImage;
            draw(key);
            streamDeck.on(`down:${key.number}`, () => {

                if (key.state == 1) {
                    logger.info('stateButton Trigger state = 1');
                    key.state = 0;
                    api.sendMessage(`${key.button} 1\n`);
                    key.currentImage = stateTwoImage;
                    draw(key);
                } else {
                    logger.info('stateButton Trigger state = 0');
                    key.state = 1;
                    api.sendMessage(`${key.button} 0\n`);
                    key.currentImage = stateOneImagePath;
                    draw(key);
                }
            });
            streamDeck.on(`up:${key.number}`, () => {
                //api.sendMessage(`${key.button} 0\n`);
                key.currentImage = stateOneImage;
                draw(key);
            });
            break;
    }
}

/**
 * Draw a button as image without key-listeners
 * @param key
 */
function createStaticImage(key) {
    var imagePath = path.resolve(IMAGE_FOLDER, key.image);
    key.currentImage = imagePath;
    draw(key);
}
//TODO: Cleanup toggle switch experiments
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

    api.on('SJ_CTR_LT', (value) => {

        if(value == '1' & key.button == 'SJ_CTR'){
            key.currentImage = upImagePath;
        } else if (value == '0' & key.button == 'SJ_CTR'){
            key.currentImage = downImagePath;
        }
        draw(key);
    });
    api.on('SJ_LI_LT', (value) => {

        if(value == '1' & key.button == 'SJ_LI'){
            key.currentImage = upImagePath;
        } else if (value == '0' & key.button == 'SJ_LI'){
            key.currentImage = downImagePath;
        }
        draw(key);
    });

    api.on('SJ_LO_LT', (value) => {

        if(value == '1' & key.button == 'SJ_LO'){
            key.currentImage = upImagePath;
        } else if (value == '0' & key.button == 'SJ_LO'){
            key.currentImage = downImagePath;
        }
        draw(key);
    });

    api.on('SJ_RI_LT', (value) => {

        if(value == '1' & key.button == 'SJ_RI'){
            key.currentImage = upImagePath;
        } else if (value == '0' & key.button == 'SJ_RI'){
            key.currentImage = downImagePath;
        }
        draw(key);
    });

    api.on('SJ_RO_LT', (value) => {

        if(value == '1' & key.button == 'SJ_RO'){
            key.currentImage = upImagePath;
        } else if (value == '0' & key.button == 'SJ_RO'){
            key.currentImage = downImagePath;
        }
        draw(key);
    });


    /*
        api.on('SJ_CTR_LT', (value) => {
            logger.info('loggin SJ_CTR_LT: ' + value);


            if(value == '1'){
                logger.info('value is 1: ' + value);
                key.currentImage = downImagePath;
                draw(key);
            }
            else if(value == '0'){
                logger.info('value is 0: ' + value);
                key.currentImage = upImagePath;
                draw(key);
            }
        });
        */
}



function createJettSelectButtonDisplay(key) {
    var stateOneImagePath = path.resolve(IMAGE_FOLDER + key.stateOneImage); //neutral
    var stateTwoImagePath = path.resolve(IMAGE_FOLDER + key.stateTwoImage); //left

    key.currentImage = stateOneImagePath;
    // Draw the key immediately so that we can see it.
    draw(key);
    addKeyListener(key);

    /*
    value = api.getControlValue('UFC_OPTION_CUEING_1', 'prefix');
    if(value){
        logger.info('GOT CONTROL VALUE -> ', value);
    }
    */
    // create a buttonGotoPage button to display the keyboard when 'HSEL'
    // is displayed on the UFC_OS5 display/button

    api.on('SJ_CTR_LT', (value) => {
        // right click
        if(value == 2){
            key.currentImage = stateTwoImagePath;
            draw(key);
        }
        // center
        if(value == 1){
            key.currentImage = stateOneImagePath;
            draw(key);
        }
        // left
        if(value == 0){
            key.currentImage = stateTwoImagePath;
            draw(key);
        }
    });
}

function createRockerSwitchDisplay(key) {
    var stateOneImagePath = path.resolve(IMAGE_FOLDER + key.stateOneImage); //neutral
    var stateTwoImagePath = path.resolve(IMAGE_FOLDER + key.stateTwoImage); //left
    var stateThreeImagePath = path.resolve(IMAGE_FOLDER + key.stateThreeImage);//right

    key.currentImage = stateOneImagePath;
    // Draw the key immediately so that we can see it.
    draw(key);
    addKeyListener(key);

    /*
    value = api.getControlValue('UFC_OPTION_CUEING_1', 'prefix');
    if(value){
        logger.info('GOT CONTROL VALUE -> ', value);
    }
    */
    // create a buttonGotoPage button to display the keyboard when 'HSEL'
    // is displayed on the UFC_OS5 display/button
    api.on('UFC_OPTION_DISPLAY_5', (value) =>{
        if((value.indexOf('HS') !== -1) & (key._page === 'UFC_AP_HSEL')){

            //alternative
            displayPage('UFC_AP_HSEL_KEYB');

            /*
            pages['UFC_AP_HSEL']['8'].hidden = false;
            createButtonGotoPageWithTimeout(pages['UFC_AP_HSEL']['8']);
            pages['UFC_AP_HSEL']['8'].hidden = true;
            */
            //streamDeck.removeButtonListeners();
        }
    });

    api.on('LEFT_DDI_HDG_SW', (value) => {
        // right click
        if(value == 2){
            key.currentImage = stateThreeImagePath;
            draw(key);
        }
        // center
        if(value == 1){
            key.currentImage = stateOneImagePath;
            draw(key);
        }
        // left
        if(value == 0){
            key.currentImage = stateTwoImagePath;
            draw(key);
        }
    });
}

/**
 * Create a Button with one image
 * @param key
 */
function createButtonOneImage(key) {
    var imagePath = path.resolve(IMAGE_FOLDER + key.image);
    // Draw the key immediately so that we can see it.
    key.currentImage = imagePath;
    draw(key);
    addKeyListener(key);
}

/**
 * Create a button with two images (up/down)
 *
 * @param key
 */
function createButtonTwoImages(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

    // Draw the key immediately so that we can see it.
    key.currentImage = upImagePath;
    draw(key);
    addKeyListener(key);
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
        logger.info('state changed');
        key.currentImage = value ? downImagePath : upImagePath;
        draw(key);
    });
}

/**
 * Create a button that navigates to another page.
 */
function createButtonGotoPage(key) {
    var imagePath = path.join(IMAGE_FOLDER, key.image);
    key.currentImage = imagePath;
    draw(key);
    addKeyListener(key);
}

/**
 * Create a specific UFC Display Button that will listen to its events (enabled/disabled) and set
 * the button picture according to values received from the UFC display.
 *
 * Value: ":" == ON
 * Value: " " == OFF
 * @param key
 */
function createUFCDisplayButton(key){
    var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);
    key.currentImage = upImagePath;
    draw(key);
    addKeyListener(key);

    api.on(UFC_OPTION_CUEING_1, (value) => {

        if(value === UFC_DISP_ENABLED & key.button == UFC_OS1){
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
        }
        draw(key);
    });
    api.on(UFC_OPTION_CUEING_2, (value) => {
        if(value === UFC_DISP_ENABLED & key.button == UFC_OS2){
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
        }
        draw(key);
    });
    api.on(UFC_OPTION_CUEING_3, (value) => {
        if(value === UFC_DISP_ENABLED & key.button == UFC_OS3){
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
        }
        draw(key);
    });
    api.on(UFC_OPTION_CUEING_4, (value) => {
        if(value === UFC_DISP_ENABLED & key.button == UFC_OS4){
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
        }
        draw(key);
    });
    api.on(UFC_OPTION_CUEING_5, (value) => {
        if(value === UFC_DISP_ENABLED & key.button == UFC_OS5){
            key.currentImage = upImagePath;
        } else{
            key.currentImage = downImagePath;
        }
        draw(key);
    });
}

/**
 * Create a momentary button that will switch images when it is pressed and released.
 */
function createButtonSwitchImage(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);
    key.currentImage = upImagePath;
    draw(key);
    addKeyListener(key);
}

/**
 * Create a Button that will display a page after key-up
 *
 * @param key
 */
function createButtonGotoPageOnUp(key) {
    createButtonSwitchImage(key);
    streamDeck.on(`up:${key.button}`, () => {
        displayPage(pages[key.page]);
    });
}

/**
 * Create a Button that will display a page with a set timeout
 * (after which it will revert to the 'target' page)
 * @param key
 */
function createButtonGotoPageWithTimeout(key) {
    createButtonTwoImages(key);
    streamDeck.on(`up:${key.button}`, () => {
        displayPage(pages[key.page], key.prevPage, key.timeout);
    });
}


/**
 * Create a Button that will display a page with a set timeout
 * (after which it will revert to the 'target' page)
 * @param key
 */
function createButtonGoToPageOnUpWithTimeoutUFC(key) {
    createUFCDisplayButton(key);
    streamDeck.on(`up:${key.button}`, () => {
        displayPage(pages[key.page], key.prevPage, key.timeout);
    });
}

function createButtonGoToPageOnUpUFC(key) {
    createUFCDisplayButton(key);
    streamDeck.on(`up:${key.button}`, () => {
        displayPage(pages[key.page]);
    });
}

/**
 * Display a Page with all its
 * @param pageName
 */
function displayPage(pageName, target, timeout) {
    streamDeck.removeButtonListeners();
    currentPage = pageName;
    var page = pages[pageName];

    // set timeout if available on control to redirect to a different page
    if(timeout){
        setTimeout(returnToPreviousPage, timeout);
    }
    function returnToPreviousPage() {
        displayPage(target);
    }
    Object.keys(page).forEach((keyNumber) => {
        var key = page[keyNumber];
        addKeyListener(key);
        draw(key);
    });
}

/**
 * Draw a given key on the stream deck
 * @param key
 */
function draw(key) {
    if (currentPage != key._page) {
        return;
    }
    if(!key.hidden){
        if (key.currentImage) {
            streamDeck.drawImageFile(key.currentImage, key.number);
        } else {
            streamDeck.drawColor(0x000000, key.number);
        }
    }
}

/*

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
 */