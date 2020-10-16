import re
import os
import json

from .classes import Entry, YearToPage


def extract_year(file_name):
    return int(re.match('.*(?P<year>[0-9]{4}).txt', str(file_name)).group('year'))


def extract_entries(directory, entries=None):
    if entries is None:
        entries = []

    for file in [open(directory + '/' + f, 'r') for f in sorted(os.listdir(directory))]:
        year = extract_year(file.name)
        entries.append(Entry(year, is_year=True))
        num = 1
        for line in file:
            (text, subtext) = (line.strip().split('\u2013') + [''])[:2]
            entries.append(Entry(year, num, text, subtext))
            num += 1

    return entries


def split_to_pages(entries, entries_per_page, entries_min_before_end, pages=None):
    if pages is None:
        pages = []

    cnt = 0
    page = None
    for entry in entries:
        if entry.is_year and entries_per_page - cnt <= entries_min_before_end:
            cnt = 0

        if cnt == 0:
            page = []
            pages.append(page)
        page.append(entry)

        cnt += 1

        if cnt >= entries_per_page:
            cnt = 0

    return pages


def process_pages(pages, l_append_content, entries_to_page, years_to_page, p_num, t):
    for page in pages:
        l_append_content(t.page.render(entries=page, page_class=get_page_class(p_num)))

        # entries to page
        for entry in [entry for entry in page if not entry.is_year]:
            (last_name, first_name, middle_name) = entry.text.split()[:3]
            entries_to_page.append([
                last_name,
                first_name,
                middle_name,
                entry.year,
                p_num
            ])

        # years to page
        for year in [entry.year for entry in page if entry.is_year]:
            years_to_page.append(YearToPage(year, p_num))

        p_num += 1

    return p_num


def generate_names_mapping(entries_to_page, json_file):
    json.dump(entries_to_page, json_file, ensure_ascii=False)


def get_page_class(p_num):
    return "odd-page" if p_num % 2 != 0 else "even-page"
