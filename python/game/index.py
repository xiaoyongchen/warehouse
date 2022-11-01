import sys
import pygame
from settings import Setting
from ship import Ship
import game_function as gf

def run_game():
  pygame.init()
  ai_setting = Setting()
  screen = pygame.display.set_mode((ai_setting.screen_width, ai_setting.screen_width))
  ship = Ship(ai_setting,screen)

  while True:
    gf.check_events(ship)
    ship.update()
    gf.update_screen(ai_setting, screen, ship)
    
run_game()