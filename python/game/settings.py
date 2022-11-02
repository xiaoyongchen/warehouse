class Setting():
  """存储《外星人入侵》的所有的设置"""
  def __init__(self) -> None:
    self.screen_width = 375
    self.screen_height = 667
    self.bg_color = (230, 230, 230)
    self.bg_transparent = (0,0,0)

    # 子弹配置
    self.bullet_width = 2
    self.bullet_height = 10
    self.bullet_speed_factor = 3
    self.bullet_color = (60, 60, 60)
    # 子弹限制
    self.bullets_allowed = 10

    # 复活次数
    self.ship_limit = 3

    # 进度
    self.speedup_scale = 1.1
    self.initialize_dynamic_settings()

  # 自动化配置
  def initialize_dynamic_settings(self):
    self.ship_speed_factor = 1.5
    self.bullet_speed_factor = 3
    self.alien_speed_factor = 1
    self.fleet_drop_speed = 5
    # 每次击落外星人得分
    self.alien_points = 50
    # 1:right, -1:left
    self.fleet_direction = 1

  def increase_speed(self):
    self.ship_speed_factor += self.speedup_scale
    self.bullet_speed_factor += self.speedup_scale
    self.alien_speed_factor += self.speedup_scale

    self.alien_points = int(self.alien_points * self.speedup_scale)