/**
 *
 * @param view
 * @param key
 */
exports.initializeViewFn['page_image'] = function(view, key) {
    // Draw the page  name on white background if the page is selected
    // view: { type: 'page_label', page: 'NMSP', image: 'xxx.png', selImage: 'xxx-sel.png'},
    view.currentImage = Path.resolve(IMAGE_FOLDER + (view._page == view.page ? view.selImage : view.image));
    draw(view);
}

