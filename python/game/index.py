import imp
import sys
import pygame
from settings import Setting
from ship import Ship
import game_function as gf
from pygame.sprite import Group

def run_game():
  pygame.init()
  ai_settings = Setting()
  screen = pygame.display.set_mode((ai_settings.screen_width, ai_settings.screen_height))
  ship = Ship(ai_settings,screen)
  bullets = Group()

  aliens = Group()
  gf.create_fleet(ai_settings, screen, ship, aliens)


  while True:
    gf.check_events(ai_settings, screen, ship, bullets)
    ship.update()
    # 删除消失的子弹
    gf.update_bullets(bullets)
    gf.update_screen(ai_settings, screen, ship, bullets, aliens)
    
run_game()