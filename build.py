from graduates.classes import Templates
from graduates.utils import extract_year, extract_entries, split_to_pages

ENTRIES_PER_PAGE = 35
ENTRIES_MIN_BEFORE_END = 2

TITLE = 'Дипломы с отличием получили'
SUBTITLE = 'филиал ФГБОУ ВО «Национальный исследовательский университет «МЭИ» в г.&nbsp;Смоленске'

SPEC_DIR = 'graduates/text/specialists'
MAST_DIR = 'graduates/text/masters'

t = Templates()

content = ''
content += t.first.render(title=TITLE, subtitle=SUBTITLE)

for page in split_to_pages(extract_entries(SPEC_DIR), ENTRIES_PER_PAGE, ENTRIES_MIN_BEFORE_END):
    content += t.page.render(entries=page)

content += t.sep.render(title='МАГИСТРЫ')

for page in split_to_pages(extract_entries(MAST_DIR), ENTRIES_PER_PAGE, ENTRIES_MIN_BEFORE_END):
    content += t.page.render(entries=page)

html = t.index.render(content=content)

print(html)
