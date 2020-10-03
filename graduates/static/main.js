let book = $('#book');
let ddSpec = $('#dd-spec');
let ddMast = $('#dd-mast');
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
    deactivate(ddSearch);
    searchInput.val('');
}

modalInfoOpen = () => activate(modalInfo);
modalInfoClose = () => deactivate(modalInfo);

modalSmallScreenOpen = () => activate(modalSmallScreen);
modalSmallScreenClose = () => deactivate(modalSmallScreen);

hideLoader = () => setTimeout(() => deactivate($('#loader')), 555);

search = (query, searchData) => {
    let params = query.split(/[^А-Яа-я]+/).slice(0, 3);

    let result = searchData;

    let doFilter = (paramNum, arg) => result = result.filter(it => RegExp(`^${arg}.*$`).test(it[paramNum].toLowerCase()));

    let ln = params.shift();
    if (ln && result) doFilter(0, ln.toLowerCase());

    let fn = params.shift();
    if (fn && result) doFilter(1, fn.toLowerCase());

    let mn = params.shift();
    if (mn && result) doFilter(2, mn.toLowerCase());

    return result.sort().slice(0, 20);
}

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
        });
}

let searchData;

searchInput.on('input', () => {
    let query = searchInput.val();
    clearSearchContent();

    if (query.replaceAll(/[^А-Яа-я]/g, '').length > 2) {
        activate(ddSearch);
        console.log('process query: ' + query);
        let searchResult = search(query, searchData);

        if (searchResult.length > 0) {
            searchResult.forEach(it => createSearchEntry(it[3], `${it[0]} ${it[1]} ${it[2]}`, it[4]));
        } else {
            createSearchEntry('перейти на 1-ую страницу', 'Ничего не найдено', 1);
        }
        updateSearchLinksEvents();
    } else {
        deactivate(ddSearch);
    }
})

searchInput.click(() => searchInput.trigger('input'));
searchInput.keydown(e => e.stopPropagation());

$(document).ready(() => {
    hideLoader();

    // json: [[fn, ln, md, year, page], ... ]
    $.getJSON('names_mapping.json', null, (data) => searchData = data)
        .fail(() => console.log( "names mapping json load fail" ));
})
