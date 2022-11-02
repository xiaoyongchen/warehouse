import pygame
from pygame.sprite import Group 
from ship import Ship
# 计分牌
class Scoreboard():
  def __init__(self, ai_settings, screen, status) -> None:
    self.screen = screen
    self.screen_rect = screen.get_rect()
    self.ai_settings = ai_settings
    self.status = status

    # 显示得分
    self.text_color = (30, 30, 30)
    self.font = pygame.font.SysFont(None, 24)

    self.prep_score()
    self.prep_high_score()
    self.prep_level()
    self.prep_ships()

  def prep_score(self):
    # 格式化 ***, *** 
    rounded_score = int(round(self.status.score, -1))
    score_str =  "{:,}".format(rounded_score)
    self.score_image = self.font.render(score_str, True, self.text_color, self.ai_settings.bg_color)

    # 显示位置
    self.score_rect = self.score_image.get_rect()
    self.score_rect.right = self.screen_rect.right - 20
    self.score_rect.top = 20

  def show_score(self):
    self.screen.blit(self.score_image, self.score_rect)


  def prep_high_score(self):
    high_score = int(round(self.status.high_score, -1))
    high_score_str = "{:,}".format(high_score)
    self.high_score_image = self.font.render(high_score_str, True,
    self.text_color, self.ai_settings.bg_color)

    #将最高得分放在屏幕顶部中央
    self.high_score_rect = self.high_score_image.get_rect()
    self.high_score_rect.centerx = self.screen_rect.centerx
    self.high_score_rect.top = self.score_rect.top 

  def show_score(self):
    """在屏幕上显示当前得分和最高得分"""
    self.screen.blit(self.score_image, self.score_rect)
    self.screen.blit(self.high_score_image, self.high_score_rect)

    # 绘制飞船
    self.ships.draw(self.screen)

  def prep_level(self):
    """将等级转换为渲染的图像"""
    self.level_image = self.font.render(str(self.status.level), True,
    self.text_color, self.ai_settings.bg_color)

    # 将等级放在得分下方
    self.level_rect = self.level_image.get_rect()
    self.level_rect.right = self.score_rect.right
    self.level_rect.top = self.score_rect.bottom + 10 

  def show_score(self):
    """在屏幕上显示飞船和得分"""
    self.screen.blit(self.score_image, self.score_rect)
    self.screen.blit(self.high_score_image, self.high_score_rect)
    self.screen.blit(self.level_image, self.level_rect) 
    
    # 绘制剩余多少命
    self.ships.draw(self.screen)

  def prep_ships(self):
    """显示剩余多少飞船"""
    self.ships = Group()
    for ship_number in range(self.status.ships_left):
      ship = Ship(self.ai_settings, self.screen)
      ship.rect.x = 5 + ship_number * ship.rect.width
      ship.rect.y = 5
      self.ships.add(ship)