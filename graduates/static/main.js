let book = $('#book');

book.turn({
    height: 1000,
    shadow: true,
})

book.bind('turning', (event, page, view) => {
    let current = $('#current-view');
    if (view[0] === 0 || view[1] === 0)
        current.val(view[0] + view[1]);
    else
        current.val(`${view[0]} \u2013 ${view[1]}`);
});

prevPage = () => book.turn('previous');
nextPage = () => book.turn('next');
toPage = (page) => book.turn('page', page)

$(document).keydown(e => {
    switch (e.keyCode) {
        case 37:
            prevPage()
            break
        case 39:
            nextPage()
            break
    }
})

/* todo: year's dd's
clickHandler = (trig) => trig.parent().parent().toggleClass('is-active');
focusHandler = (trig) => trig.parent().parent().removeClass('is-active');

let trigDDSpec = $('#trig-dd-spec');
trigDDSpec.click(() => clickHandler(trigDDSpec))
trigDDSpec.focusout(() => focusHandler(trigDDSpec))

let trigDDMast = $('#trig-dd-mast');
trigDDMast.click(() => clickHandler(trigDDMast))
trigDDMast.focusout(() => focusHandler(trigDDMast))
 */
