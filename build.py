from graduates.classes import Templates, YearToPage
from graduates.utils import extract_year, extract_entries, split_to_pages

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

p_num = 2
for page in split_to_pages(extract_entries(SPEC_DIR), ENTRIES_PER_PAGE, ENTRIES_MIN_BEFORE_END):
    content += t.page.render(entries=page)
    for year in [entry.val for entry in page if entry.is_year]:
        s_years.append(YearToPage(year, p_num))
    p_num += 1

content += t.sep.render(title='МАГИСТРЫ')
p_num += 1

for page in split_to_pages(extract_entries(MAST_DIR), ENTRIES_PER_PAGE, ENTRIES_MIN_BEFORE_END):
    content += t.page.render(entries=page)
    for year in [entry.val for entry in page if entry.is_year]:
        m_years.append(YearToPage(year, p_num))
    p_num += 1

html = t.index.render(page_title=PAGE_TITLE, content=content, s_years=s_years, m_years=m_years)

print(html)
