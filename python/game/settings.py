class Setting():
  """存储《外星人入侵》的所有的设置"""
  def __init__(self) -> None:
    self.screen_width = 375
    self.screen_height = 667
    self.bg_color = (230, 230, 230)

    # 子弹配置
    self.bullet_width = 3
    self.bullet_height = 15
    self.bullet_speed_factor = 3
    self.bullet_color = (60, 60, 60)
    self.bullets_allowed = 10

    # 外星人配置
    self.alien_speed_factor = 1
    # 碰撞到边缘向下移动多少距离
    self.fleet_drop_speed = 5
    # 1:right, -1:left
    self.fleet_direction = 1