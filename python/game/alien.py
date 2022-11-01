from lib2to3 import pygram
import pygame
from pygame.sprite import Sprite

class Alien(Sprite):
  def __init__(self, ai_settings, screen) -> None:
    super(Alien, self).__init__()
    self.screen = screen
    self.ai_settings = ai_settings

    # 加载外星人图像
    self.image = pygame.image.load('/Users/chenxiaoyong/Desktop/warehouse/python/game/images/alien.svg')
    self.rect = self.image.get_rect()
    
    # 每个外星人都在屏幕左上角附近
    self.rect.x = self.rect.width
    self.rect.y = self.rect.height

    # 存储外星人准确位置
    self.x = float(self.rect.x)


  def blitme(self):
    self.screen.blit(self.image, self.rect)