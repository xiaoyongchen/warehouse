import pygame
class Ship():
  def __init__(self, screen):
    """初始位置"""
    self.screen = screen
    # 加载飞船并获取外接矩形
    self.image = pygame.image.load('/Users/chenxiaoyong/Desktop/warehouse/python/game/images/ship.svg')
    self.rect = self.image.get_rect()
    self.screen_rect = screen.get_rect()

    # 将新的放到底部中央
    self.rect.centerx = self.screen_rect.centerx
    self.rect.bottom = self.screen_rect.bottom

    # 设置移动标志
    self.moving_right = False
    self.moving_left = False
  
  def update(self):
    if self.moving_right:
      self.rect.centerx += 1
    if self.moving_left:
      self.rect.centerx -= 1

  def blitme(self):
    self.screen.blit(self.image, self.rect)