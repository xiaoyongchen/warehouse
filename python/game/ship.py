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

  def blitme(self):
    self.screen.blit(self.image, self.rect)