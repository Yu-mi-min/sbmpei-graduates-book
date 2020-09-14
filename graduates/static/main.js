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

let ddSpec = $('#dd-spec')
let ddMast = $('#dd-mast')

hideDDContents = () => {
    ddSpec.removeClass('is-active');
    ddMast.removeClass('is-active');
}

$(document).keydown(e => {
    switch (e.code) {
        case 'ArrowLeft':
            prevPage()
            break
        case 'ArrowRight':
            nextPage()
            break
        case 'Escape':
            hideDDContents()
            break
    }
})

clickHandler = (dd) => dd.toggleClass('is-active');
ddSpec.click(() => clickHandler(ddSpec))
ddMast.click(() => clickHandler(ddMast))

$('.to-page').click(e => { // <a> in dropdown
    e.stopPropagation()
    let page = e.target.getAttribute('to-page');
    toPage(page);
    hideDDContents();
});

let modalInfo = $('#modal-info');

modalInfoOpen = () => {
    modalInfo.addClass('is-active');
    $('#dh').focus()

}
modalInfoClose = () => modalInfo.removeClass('is-active')

modalInfo.children('.modal-background').click(() =>modalInfoClose());
modalInfo.children('.modal-close').click(() => modalInfoClose());

setTimeout(() => $('#loader').removeClass('is-active'), 555);
