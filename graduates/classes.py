import json
from jinja2 import Environment, PackageLoader


class YearToPage:
    def __init__(self, year, page):
        self.year = year
        self.page = page

    def __repr__(self):
        return '{}y {}p'.format(self.year, self.page)


class Entry:
    def __init__(self, val, num=0, year=None, is_year=False):
        self.is_year = is_year
        self.val = val
        self.num = num
        self.year = year

    def __str__(self):
        return str(self.val)

    def __repr__(self):
        if self.is_year:
            return str(self.val)
        else:
            return '{} {} ({})'.format(self.num, self.val, self.year)


class Templates:
    def __init__(self):
        env = Environment(loader=PackageLoader('graduates', 'templates'))
        self.index = env.get_template('index.html')
        self.first = env.get_template('first_page.html')
        self.page = env.get_template('page.html')
        self.sep = env.get_template('sep_page.html')
