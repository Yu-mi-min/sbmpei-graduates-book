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

let ddSpec = $('#dd-spec')
let ddMast = $('#dd-mast')

clickHandler = (dd) => dd.toggleClass('is-active');
ddSpec.click(() => clickHandler(ddSpec))
ddMast.click(() => clickHandler(ddMast))

$('.to-page').click(e => { // <a> in dropdown
    e.stopPropagation()
    let page = e.target.getAttribute('to-page');
    toPage(page);

    // todo: refactor this dirty hack
    ddSpec.removeClass('is-active');
    ddMast.removeClass('is-active');
});
