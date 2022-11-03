import pygal
from die import Die

die = Die(6)
results = []

for roll in range(1000):
  result = die.roll()
  results.append(result)

frequencies = []
for value in range(1, die.num_sides + 1):
  frequencie = results.count(value)
  frequencies.append(frequencie)


hist = pygal.Bar()
hist.title = "1000次随机摇骰子"
hist.x_labels = ['1', '2', '3', '4', '5', '6']
hist.x_title = "结果"
hist.y_title = '重复次数'

hist.add('D6', frequencies)
hist.render_to_file('die_visual.svg')