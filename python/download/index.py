import csv
# csv 逗号隔开的数据进行提取和使用，json也是一样，提取之后制作图表
filename = '/Users/chenxiaoyong/Desktop/warehouse/python/download/weather.csv'

with open(filename) as f:
  render = csv.reader(f)
  header_row = next(render)
  print(header_row)

# enumerate 组成了索引序列，所以可以叠加
for index, column_header in enumerate(header_row):
  print(index, column_header)