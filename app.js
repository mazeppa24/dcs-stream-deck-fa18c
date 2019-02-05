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

const pages = require('./app/pages');

const streamDeckApi = require('stream-deck-api');
const DcsBiosApi = require('dcs-bios-api');
const path = require('path');
const robot = require('robotjs');
const Logger = require('logplease');
const logger = Logger.create('dcs-stream-deck-fa18');


const IMAGE_FOLDER = './resources/images/';
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
        case 'buttonDisplayUFC':
            createUFCDisplayButton(key);
            break;
        case 'twoStateButtonJettSelect':
            createTwoStateButtonJettSelect(key);
            break;
        case 'rocker_switch':
            createRockerSwitchDisplay(key);
            break;
        case 'toggle_switch':
            //createTwoStateButtonJettSelect(key);
            break;
        case 'limited_rotary':
            //createTwoStateButtonJettSelect(key);
            break;
        case 'toggle_switch2way':
            createToggleSwitch2Way(key);
            break;
        case 'buttonToggleJettSelectKnob':
            createButtonToggleJettSelectKnob(key);
            break;
        case 'buttonDisplayJettSelect':
            createButtonDisplayJettSelect(key);
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
        case 'buttonGotoPageDisplayUFC':
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

        case 'buttonToggleJettSelectKnob':
            var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
            var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

            streamDeck.on(`down:${key.number}`, () => {
                api.sendMessage(`${key.button} 1\n`);
                key.currentImage = downImagePath;
                draw(key);
            });
            streamDeck.on(`up:${key.number}`, () => {
                //api.sendMessage(`${key.button} 0\n`);
                //key.currentImage = upImagePath;
                //draw(key);
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
        case 'buttonDisplayUFC':
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
        case 'buttonGotoPageDisplayUFC':
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
                if (key.state == 0) {
                    logger.info('stateButton Trigger state = 0');
                    key.state = 1;
                    api.sendMessage(`${key.button} 1\n`);
                    key.currentImage = stateTwoImage;
                    draw(key);
                } else {
                    logger.info('stateButton Trigger state = 1');
                    key.state = 0;
                    api.sendMessage(`${key.button} 0\n`);
                    key.currentImage = stateOneImage;
                    draw(key);
                }
            });
            streamDeck.on(`up:${key.number}`, () => {
                //api.sendMessage(`${key.button} 0\n`);
                //key.currentImage = stateOneImage;
                //draw(key);
            });
            break;
        //Jettison Station Buttons next to IFEI
        case 'twoStateButtonJettSelect':
            var stateOneImage = path.resolve(IMAGE_FOLDER + key.stateOneImage);
            var stateTwoImage = path.resolve(IMAGE_FOLDER + key.stateTwoImage);
            key.currentImage = stateTwoImage;
            draw(key);
            streamDeck.on(`down:${key.number}`, () => {
                if (key.state == 0) {
                    logger.info('stateButton Trigger state = 0');
                    key.state = 1;
                    api.sendMessage(`${key.button} 1\n`);
                    key.currentImage = stateTwoImage;
                    draw(key);
                } else {
                    logger.info('stateButton Trigger state = 1');
                    key.state = 0;
                    api.sendMessage(`${key.button} 0\n`);
                    key.currentImage = stateOneImage;
                    draw(key);
                }
            });
            streamDeck.on(`up:${key.number}`, () => {
                //api.sendMessage(`${key.button} 0\n`);
                //key.currentImage = stateOneImage;
                //draw(key);
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

/**
 * The 'Jettison Station Select' button box (5) left of the IFEI
 *
 * @param key
 */
function createTwoStateButtonJettSelect(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.stateOneImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.stateTwoImage);
    // Draw the key immediately so that we can see it.
    draw(key);
    addKeyListener(key);

    api.on('SJ_CTR_LT', (value) => {

        if (value == '1' & key.button == 'SJ_CTR') {
            key.currentImage = upImagePath;
        } else if (value == '0' & key.button == 'SJ_CTR'){ //
            key.currentImage = downImagePath;
        }
        draw(key);
    });
    api.on('SJ_LI_LT', (value) => {

        if (value == '1' & key.button == 'SJ_LI') {
            key.currentImage = upImagePath;
        } else if (value == '0' & key.button == 'SJ_LI'){ //
            key.currentImage = downImagePath;
        }
        draw(key);
    });

    api.on('SJ_LO_LT', (value) => {

        if (value == '1' & key.button == 'SJ_LO') {
            key.currentImage = upImagePath;
        } else if (value == '0' & key.button == 'SJ_LO'){ //
            key.currentImage = downImagePath;
        }
        draw(key);
    });

    api.on('SJ_RI_LT', (value) => {

        if (value == '1' & key.button == 'SJ_RI') {
            key.currentImage = upImagePath;
        } else if (value == '0' & key.button == 'SJ_RI'){ //
            key.currentImage = downImagePath;
        }
        draw(key);
    });

    api.on('SJ_RO_LT', (value) => {

        if (value == '1' & key.button == 'SJ_RO') {
            key.currentImage = upImagePath;
        } else if (value == '0' & key.button == 'SJ_RO'){ //
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
    api.on('UFC_OPTION_DISPLAY_5', (value) => {
        if ((value.indexOf('HS') !== -1) & (key._page === 'UFC_AP_HSEL')) {

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
        if (value == 2) {
            key.currentImage = stateThreeImagePath;
            draw(key);
        }
        // center
        if (value == 1) {
            key.currentImage = stateOneImagePath;
            draw(key);
        }
        // left
        if (value == 0) {
            key.currentImage = stateTwoImagePath;
            draw(key);
        }
    });
}


function createButtonToggleJettSelectKnob(key) {
    createButtonSwitchImageJettSelectState(key);
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
 * Create a display button that switches images (on/off) when the Jettison Select Knob (big red JETT button)
 * is set to a value left/right (SAFE, STORES, RACK etc.)
 * @param key
 */
function createButtonDisplayJettSelect(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

    // Draw the key immediately so that we can see it.
    draw(key);

    addKeyListener(key);


    api.on('SEL_JETT_KNOB', (value)=>{

        if(key.button === 'LFUS' & value == 0){
            key.currentImage = upImagePath;
            draw(key);
        } else if (key.button == 'LFUS' & value != 0) {
            key.currentImage = downImagePath;
            draw(key);
        }
        if(key.button === 'SAFE' & value == 1){
            key.currentImage = upImagePath;
            draw(key);
        } else if (key.button === 'SAFE' & value != 1){
            key.currentImage = downImagePath;
            draw(key);
        }
        if(key.button == 'RFUS' & value == 2){
            key.currentImage = upImagePath;
            draw(key);
        } else if(key.button == 'RFUS' & value != 2){
            key.currentImage = downImagePath;
            draw(key);
        }
        if(key.button == 'RACK' & value == 3){
            key.currentImage = upImagePath;
            draw(key);
        } else if(key.button == 'RACK' & value != 3){
            key.currentImage = downImagePath;
            draw(key);
        }
        if(key.button == 'STORES' & value == 4){
            key.currentImage = upImagePath;
            draw(key);
        } else if(key.button == 'STORES' & value != 4){
            key.currentImage = downImagePath;
            draw(key);
        }


        logger.info('SEL_JETT_KNOB in createButtonDisplayJettSelect: ' + value);
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
function createUFCDisplayButton(key) {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);
    key.currentImage = upImagePath;
    draw(key);
    addKeyListener(key);

    api.on(UFC_OPTION_CUEING_1, (value) => {

        if (value === UFC_DISP_ENABLED & key.button == UFC_OS1) {
            key.currentImage = upImagePath;
        } else {
            key.currentImage = downImagePath;
        }
        draw(key);
    });
    api.on(UFC_OPTION_CUEING_2, (value) => {
        if (value === UFC_DISP_ENABLED & key.button == UFC_OS2) {
            key.currentImage = upImagePath;
        } else {
            key.currentImage = downImagePath;
        }
        draw(key);
    });
    api.on(UFC_OPTION_CUEING_3, (value) => {
        if (value === UFC_DISP_ENABLED & key.button == UFC_OS3) {
            key.currentImage = upImagePath;
        } else {
            key.currentImage = downImagePath;
        }
        draw(key);
    });
    api.on(UFC_OPTION_CUEING_4, (value) => {
        if (value === UFC_DISP_ENABLED & key.button == UFC_OS4) {
            key.currentImage = upImagePath;
        } else {
            key.currentImage = downImagePath;
        }
        draw(key);
    });
    api.on(UFC_OPTION_CUEING_5, (value) => {
        if (value === UFC_DISP_ENABLED & key.button == UFC_OS5) {
            key.currentImage = upImagePath;
        } else {
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

function createButtonSwitchImageJettSelectState(key) {
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
    //if (timeout) {
      //  setTimeout(returnToPreviousPage, pageName, timeout);
    //}

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
    if (!key.hidden) {
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