import os

from graduates.classes import Templates, YearToPage, Content
from graduates.utils import extract_entries, split_to_pages, generate_names_mapping, get_page_class, process_pages

ENTRIES_PER_PAGE = 35
ENTRIES_MIN_BEFORE_END = 2

PAGE_TITLE = 'Дипломы с отличием получили'

TITLE = 'Дипломы с отличием получили'
SUBTITLE = 'филиал ФГБОУ ВО «Национальный исследовательский университет «МЭИ» в г.&nbsp;Смоленске'

SPEC_DIR = 'graduates/text/specialists'
MAST_DIR = 'graduates/text/masters'

t = Templates()

p_num = 1

content = Content()

content.append(t.first.render(page_class=get_page_class(p_num)))
p_num += 1

content.append(t.first.render(page_class=get_page_class(p_num)))
p_num += 1

content.append(t.front.render(title=TITLE, subtitle=SUBTITLE, page_class=get_page_class(p_num)))
p_num += 1

# used for year to page mapping
s_years = []
m_years = []

# used for search
search_data = list()

# parse all entries
s_pages = split_to_pages(extract_entries(SPEC_DIR), ENTRIES_PER_PAGE, ENTRIES_MIN_BEFORE_END)
m_pages = split_to_pages(extract_entries(MAST_DIR), ENTRIES_PER_PAGE, ENTRIES_MIN_BEFORE_END)

p_num = process_pages(s_pages, content.append, search_data, s_years, p_num, t)

content.append(t.sep.render(title='МАГИСТРЫ', page_class=get_page_class(p_num)))
p_num += 1

p_num = process_pages(m_pages, content.append, search_data, m_years, p_num, t)

if p_num % 2 == 1:
    content.append(t.page.render(entries=[], page_class=get_page_class(p_num)))

info = dict()
info['short_sha'] = os.getenv('CI_COMMIT_SHORT_SHA', '')

html = t.index.render(page_title=PAGE_TITLE, content=str(content), s_years=s_years, m_years=m_years, info=info)

with open('index.html', 'w', encoding='utf8') as f:
    f.write(html)

with open('names_mapping.json', 'w', encoding='utf8') as f:
    generate_names_mapping(search_data, f)
