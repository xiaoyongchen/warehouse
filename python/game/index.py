import imp
import sys
import pygame
from settings import Setting
from ship import Ship
import game_function as gf
from bullet import Bullet
from pygame.sprite import Group
from alien import Alien

def run_game():
  pygame.init()
  ai_settings = Setting()
  screen = pygame.display.set_mode((ai_settings.screen_width, ai_settings.screen_width))
  ship = Ship(ai_settings,screen)
  bullets = Group()

  alien = Alien(ai_settings, screen)


  while True:
    gf.check_events(ai_settings, screen, ship, bullets)
    ship.update()
    # 删除消失的子弹
    gf.update_bullets(bullets)
    gf.update_screen(ai_settings, screen, ship, bullets, alien)
    
run_game()