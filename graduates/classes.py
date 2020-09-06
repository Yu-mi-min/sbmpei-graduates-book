from jinja2 import Environment, PackageLoader


class Entry:
    def __init__(self, val, num=0, is_year=False):
        self.is_year = is_year
        self.val = val
        self.num = num

    def __str__(self):
        return str(self.val)

    def __repr__(self):
        if self.is_year:
            return str(self.val)
        else:
            return '{} {}'.format(self.num, self.val)


class Templates:
    def __init__(self):
        env = Environment(loader=PackageLoader('graduates', 'templates'))
        self.index = env.get_template('index.html')
        self.first = env.get_template('first_page.html')
        self.page = env.get_template('page.html')
        self.sep = env.get_template('sep_page.html')