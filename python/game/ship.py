import pygame
class Ship():
  def __init__(self, ai_setting, screen):
    """初始位置"""
    self.screen = screen

    # 配置
    self.ai_setting = ai_setting
    # 加载飞船并获取外接矩形
    self.image = pygame.image.load('/Users/chenxiaoyong/Desktop/warehouse/python/game/images/ship.svg')
    self.rect = self.image.get_rect()
    self.screen_rect = screen.get_rect()


    # 将新的放到底部中央
    self.rect.centerx = self.screen_rect.centerx
    self.rect.bottom = self.screen_rect.bottom

    # 在飞船的熟悉center存小数
    self.center = float(self.rect.centerx)


    # 设置移动速度
    self.ship_speed_factor = 1.5

    # 设置移动标志
    self.moving_right = False
    self.moving_left = False
  
  def update(self):
    if self.moving_right and (self.rect.right - self.rect.width/2.0) < self.screen_rect.right:
      self.center += self.ship_speed_factor
    if self.moving_left and (self.rect.left + self.rect.width/2.0) > self.screen_rect.left:
      self.center -= self.ship_speed_factor
    self.rect.centerx = self.center
  
  def blitme(self):
    self.screen.blit(self.image, self.rect)

  def center_ship(self):
    self.center = self.screen_rect.centerx