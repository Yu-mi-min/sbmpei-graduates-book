import re
import os

from .classes import Entry


def extract_year(file_name):
    return int(re.match('.*(?P<year>[0-9]{4}).txt', str(file_name)).group('year'))


def extract_entries(directory, entries=None):
    if entries is None:
        entries = []

    for file in [open(directory + '/' + f, 'r') for f in sorted(os.listdir(directory))]:
        entries.append(Entry(extract_year(file.name), is_year=True))
        num = 1
        for line in file:
            entries.append(Entry(line.strip(), num=num))
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
