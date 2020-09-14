let book = $('#book');
let ddSpec = $('#dd-spec');
let ddMast = $('#dd-mast');
let ddLinks = $('.to-page');
let modalInfo = $('#modal-info');
let currentView = $('#current-view');

prevPage = () => book.turn('previous');
nextPage = () => book.turn('next');
toPage = (page) => book.turn('page', page)

hideDDContents = () => {
    ddSpec.removeClass('is-active');
    ddMast.removeClass('is-active');
}
toggleDropdown = (dd) => dd.toggleClass('is-active');

modalInfoOpen = () => modalInfo.addClass('is-active');
modalInfoClose = () => modalInfo.removeClass('is-active');

hideLoader = () => setTimeout(() => $('#loader').removeClass('is-active'), 555);

book.turn({
    height: 1000,
    shadow: true,
});

currentView.val(1)

book.bind('turning', (event, page, view) => {
    if (view[0] === 0 || view[1] === 0)
        currentView.val(view[0] + view[1]);
    else
        currentView.val(`${view[0]} \u2013 ${view[1]}`);
});

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

ddSpec.click(() => toggleDropdown(ddSpec))
ddMast.click(() => toggleDropdown(ddMast))

ddLinks.click(e => {
    e.stopPropagation();
    let page = e.target.getAttribute('to-page');
    toPage(page);
    hideDDContents();
});

modalInfo.children('.modal-background').click(() => modalInfoClose());
modalInfo.children('.modal-close').click(() => modalInfoClose());

hideLoader();
