import os

from graduates.classes import Templates, YearToPage
from graduates.utils import extract_entries, split_to_pages, generate_names_mapping, get_page_class

ENTRIES_PER_PAGE = 35
ENTRIES_MIN_BEFORE_END = 2

PAGE_TITLE = 'Дипломы с отличием получили'

TITLE = 'Дипломы с отличием получили'
SUBTITLE = 'филиал ФГБОУ ВО «Национальный исследовательский университет «МЭИ» в г.&nbsp;Смоленске'

SPEC_DIR = 'graduates/text/specialists'
MAST_DIR = 'graduates/text/masters'

t = Templates()

content = ''
content += t.first.render(title=TITLE, subtitle=SUBTITLE)

# used for year to page mapping
s_years = []
m_years = []

# used for search
search_data = list()

p_num = 2

# todo: DRY#process_pages
for page in split_to_pages(extract_entries(SPEC_DIR), ENTRIES_PER_PAGE, ENTRIES_MIN_BEFORE_END):
    content += t.page.render(entries=page, page_class=get_page_class(p_num))

    # search data
    for entry in [entry for entry in page if not entry.is_year]:
        (last_name, first_name, middle_name) = entry.val.split()[:3]
        search_data.append([
           last_name,
           first_name,
           middle_name,
           entry.year,
           p_num
       ])

    # years to page
    for year in [entry.val for entry in page if entry.is_year]:
        s_years.append(YearToPage(year, p_num))

    p_num += 1

content += t.sep.render(title='МАГИСТРЫ', page_class=get_page_class(p_num))
p_num += 1

# todo: DRY#process_pages
for page in split_to_pages(extract_entries(MAST_DIR), ENTRIES_PER_PAGE, ENTRIES_MIN_BEFORE_END):
    content += t.page.render(entries=page, page_class=get_page_class(p_num))

    # entries to page
    for entry in [entry for entry in page if not entry.is_year]:
        (last_name, first_name, middle_name) = entry.val.split()[:3]
        search_data.append([
           last_name,
           first_name,
           middle_name,
           entry.year,
           p_num
       ])
    # years to page
    for year in [entry.val for entry in page if entry.is_year]:
        m_years.append(YearToPage(year, p_num))

    p_num += 1

info = dict()
info['short_sha'] = os.getenv('CI_COMMIT_SHORT_SHA', '')

html = t.index.render(page_title=PAGE_TITLE, content=content, s_years=s_years, m_years=m_years, info=info)

print(html)  # todo: save html directly in folder

with open('names_mapping.json', 'w', encoding='utf8') as f:
    generate_names_mapping(search_data, f)

