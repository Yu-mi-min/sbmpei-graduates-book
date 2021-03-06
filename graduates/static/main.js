let book = $('#book');
let ddSpec = $('#dd-spec');
let ddMast = $('#dd-mast');
let ddBach = $('#dd-bach');
let ddLinks = $('.to-page');
let ddSearch = $('#dd-search');
let searchInput = $('#search-input');
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
    deactivate(ddBach);
    deactivate(ddSearch);
}

clearSearchInput = () => searchInput.val('');

modalInfoOpen = () => activate(modalInfo);
modalInfoClose = () => deactivate(modalInfo);

modalSmallScreenOpen = () => activate(modalSmallScreen);
modalSmallScreenClose = () => deactivate(modalSmallScreen);

hideLoader = () => setTimeout(() => deactivate($('#loader')), 555);

search = (query, searchData) => {
    let params = query.toLowerCase()
        .replace(/ё/, 'е')
        .split(/[^А-Яа-яЁё]+/)
        .slice(0, 3);

    let result = searchData;

    let doFilter = (paramNum, arg) => {
        result = result
        .filter(it => RegExp(`^${arg}.*$`).test(
            it[paramNum].toLowerCase().replace(/ё/, 'е')
        ));
    };

    let ln = params.shift();
    if (ln && result) doFilter(0, ln);

    let fn = params.shift();
    if (fn && result) doFilter(1, fn);

    let mn = params.shift();
    if (mn && result) doFilter(2, mn);

    return result.sort().slice(0, 20);
}

book.turn({
    height: 1000,
    shadow: true,
    page: 2,
});

currentView.val(1) // was hidden in html

book.bind('turning', (event, page, view) => {

    // should work, but it doesn't.
    // check was added directly to turn.js lib (turn.js line 939)
    // if (page === 1) { event.preventDefault(); }

    if (view[0] === 0 || view[1] === 0)
        currentView.val(view[0] + view[1]);
    else
        currentView.val(`${view[0]} \u2013 ${view[1]}`);
});

$(document).keydown(e => {
    switch (e.code) {
        case 'ArrowLeft':
            prevPage();
            break
        case 'ArrowRight':
            nextPage();
            break
        case 'Escape':
            hideDDContents();
            clearSearchInput();
            break
    }
})

ddSpec.click(() => toggle(ddSpec))
ddMast.click(() => toggle(ddMast))
ddBach.click(() => toggle(ddBach))

ddLinks.click(e => {
    e.stopPropagation();
    let page = e.target.getAttribute('to-page');
    toPage(page);
    hideDDContents();
    clearSearchInput();
});

modalInfo.children('.modal-background').click(() => modalInfoClose());
modalInfo.children('.modal-close').click(() => modalInfoClose());

if ($(window).width() < 1000) {
    modalSmallScreenOpen();
}

let ddSearchContent = ddSearch
    .children('.dropdown-menu')
    .children('.dropdown-content');



createSearchEntry = (y, n, p) => $(`<a class="dropdown-item to-page" to-page="${p}">${n} (${y})</a>`).appendTo(ddSearchContent);
clearSearchContent = () => ddSearchContent.empty();

updateSearchLinksEvents = () => {
    ddSearch
        .children('.dropdown-menu')
        .children('.dropdown-content')
        .children('.to-page')
        .click(e => {
            e.stopPropagation();
            let page = e.target.getAttribute('to-page');
            toPage(page);
            hideDDContents();
            clearSearchInput();
        });
}

let searchData;

searchInput.on('input', () => {
    hideDDContents();
    let query = searchInput.val();
    clearSearchContent();

    if (query.replace(/[^А-Яа-яЁё]/g, '').length > 2) {
        activate(ddSearch);
        console.log('process query: ' + query);
        let searchResult = search(query, searchData);

        if (searchResult.length > 0) {
            searchResult.forEach(it => createSearchEntry(it[3], `${it[0]} ${it[1]} ${it[2]}`, it[4]));
        } else {
            createSearchEntry('перейти на 1-ую страницу', 'Ничего не найдено', 2);
        }
        updateSearchLinksEvents();
    } else {
        deactivate(ddSearch);
    }
})

searchInput.click(() => searchInput.trigger('input'));
searchInput.keydown(e => { (e.code !== 'Escape') && e.stopPropagation() });

$(document).ready(() => {
    hideLoader();

    // json: [[fn, ln, md, year, page], ... ]
    $.getJSON('names_mapping.json', null, (data) => searchData = data)
        .fail(() => console.log( "names mapping json load fail" ));
})
