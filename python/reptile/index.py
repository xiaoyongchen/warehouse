# coding=utf-8

from __future__ import unicode_literals

import logging
import os
import re
import time
from urllib.parse import urlparse

import pdfkit
import requests
from bs4 import BeautifulSoup

html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body>
{content}
</body>
</html>
"""

class Reptile(object):
  name = None

  def __init__(self, url, fileName, rootPath = os.path.abspath(os.path.dirname(__file__)) + '/'):
    self.fileName = fileName
    self.url = url
    self.domain = '{uri.scheme}://{uri.netloc}'.format(uri=urlparse(self.url))
    if rootPath:
      self.rootPath = rootPath

  @staticmethod
  def request(url, **kwargs):
    response = requests.get(url, **kwargs)
    return response

  # 解析目录链接
  def parse_menu(self, response):
    raise NotImplementedError
  # 解析内容
  def parse_body(self, response):
    raise NotImplementedError

  def run(self):
    start = time.time()
    options = {
      'page-size': 'Letter',
      'margin-top': '0.75in',
      'margin-right': '0.75in',
      'margin-bottom': '0.75in',
      'margin-left': '0.75in',
      'encoding': "UTF-8",
      'custom-header': [
          ('Accept-Encoding', 'gzip')
      ],
      'cookie': [
          ('cookie-name1', 'cookie-value1'),
          ('cookie-name2', 'cookie-value2'),
      ],
      'outline-depth': 10,
      "--replace": "number" "123456789"
    }
    htmls = []

    # 遍历所有的菜单目录
    menus = self.parse_menu(self.request(self.url))
    for index, url in enumerate(menus):
      html = self.parse_body(self.request(url))
      f_name = ".".join([str(index), "html"])
      with open(f_name, 'wb') as f:
        f.write(html)
      htmls.append(f_name)
    pdfkit.from_file(htmls, self.rootPath + self.fileName + ".pdf", options=options)
    for html in htmls:
      os.remove(html)
    total_time = time.time() - start
    print(u"总共耗时：%f 秒" % total_time)

class Liaoxuefen(Reptile):
  def parse_menu(self, response):
    soup = BeautifulSoup(response.content, "html.parser")
    menu_tag = soup.find_all(class_="uk-nav uk-nav-side")[1]
    for div in menu_tag.find_all("div"):
      url = div.a.get("href")
      if not url.startswith("http"):
        url = "".join([self.domain, url])  # 补全为全路径
      yield url

  def parse_body(self, response):
    try:
      # 使用HTML/XML解析器解析
      soup = BeautifulSoup(response.content, 'html.parser')
      body = soup.find_all(class_="x-wiki-content")[0]
      # 加入标题, 居中显示
      title = soup.find('h4').get_text()
      center_tag = soup.new_tag("center")
      title_tag = soup.new_tag('h1')
      title_tag.string = title
      center_tag.insert(1, title_tag)
      body.insert(1, center_tag)

      html = str(body)
      # body中的img标签的src相对路径的改成绝对路径
      pattern = "(<img .*?src=\")(.*?)(\")"

      def func(m):
        if not m.group(2).startswith("http"):
          rtn = "".join([m.group(1), self.domain, m.group(2), m.group(3)])
          return rtn
        else:
          return "".join([m.group(1), m.group(2), m.group(3)])

      html = re.compile(pattern).sub(func, html)
      html = html_template.format(content=html)
      html = html.encode("utf-8")
      return html
    except Exception as e:
      logging.error("解析错误", exc_info=True)

# 当前模块执行
if __name__ == '__main__':
  url = "http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000"
  crawler = Liaoxuefen(url, "廖雪峰Git")
  crawler.run()