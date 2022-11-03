from random import randint

class Die():
  def __init__(self, num_sides) -> None:
    self.num_sides = num_sides

  # 返回随机数
  def roll(self):
    return randint(1, self.num_sides)