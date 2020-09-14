let book = $('#book');
let ddSpec = $('#dd-spec');
let ddMast = $('#dd-mast');
let ddLinks = $('.to-page');
let modalInfo = $('#modal-info');
let modalSmallScreen = $('#modal-small-screen');
let currentView = $('#current-view');

activate = (el) => el.addClass('is-active');
deactivate = (el) => el.removeClass('is-active');
toggle = (el) => el.toggleClass('is-active');

prevPage = () => book.turn('previous');
nextPage = () => book.turn('next');
toPage = (page) => book.turn('page', page)

hideDDContents = () => {
    deactivate(ddSpec);
    deactivate(ddMast);
}

modalInfoOpen = () => activate(modalInfo);
modalInfoClose = () => deactivate(modalInfo);

modalSmallScreenOpen = () => activate(modalSmallScreen);
modalSmallScreenClose = () => deactivate(modalSmallScreen);

hideLoader = () => setTimeout(() => deactivate($('#loader')), 555);

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

ddSpec.click(() => toggle(ddSpec))
ddMast.click(() => toggle(ddMast))

ddLinks.click(e => {
    e.stopPropagation();
    let page = e.target.getAttribute('to-page');
    toPage(page);
    hideDDContents();
});

modalInfo.children('.modal-background').click(() => modalInfoClose());
modalInfo.children('.modal-close').click(() => modalInfoClose());

if ($(window).width() < 1000) {
    modalSmallScreenOpen();
}

hideLoader();
